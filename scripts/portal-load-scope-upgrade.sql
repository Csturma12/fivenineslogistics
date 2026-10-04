-- Website database only: pzupanvsfrgudoghpjpq. Apply after the portal routes deploy.
-- A local correction can withdraw a customer bill-to ID without changing the
-- upstream TAI activity timestamp. Once scope changes, equal-time snapshots
-- cannot restore a prior customer link; a strictly newer timestamp can.
begin;
alter table fn_loads
  add column if not exists customer_scope_withdrawn boolean not null default false;
alter table fn_loads
  add column if not exists customer_scope_blocked_ids text[] not null default '{}';

create table if not exists fn_load_sync_state (
  id text primary key check (id <> ''),
  version bigint not null default 0
);
alter table fn_load_sync_state enable row level security;
revoke all on fn_load_sync_state from public,anon,authenticated;
grant select,insert,update,delete on fn_load_sync_state to service_role;

create or replace function public.fn_bump_load_sync_insert()
returns trigger language plpgsql set search_path=public,pg_temp as $$
begin
  insert into fn_load_sync_state(id,version) values ('carrier:*',1)
    on conflict(id) do update set version=fn_load_sync_state.version+1;
  insert into fn_load_sync_state(id,version)
    select 'customer:'||customer_account_id,1
    from new_rows where customer_account_id is not null
    group by customer_account_id order by customer_account_id
      on conflict(id) do update set version=fn_load_sync_state.version+1;
  return null;
end $$;

create or replace function public.fn_bump_load_sync_update()
returns trigger language plpgsql set search_path=public,pg_temp as $$
begin
  insert into fn_load_sync_state(id,version) values ('carrier:*',1)
      on conflict(id) do update set version=fn_load_sync_state.version+1;
  insert into fn_load_sync_state(id,version)
    select 'customer:'||customer_account_id,1
    from (
      select customer_account_id from old_rows
      union
      select customer_account_id from new_rows
    ) accounts
    where customer_account_id is not null
    order by customer_account_id
    on conflict(id) do update set version=fn_load_sync_state.version+1;
  return null;
end $$;
drop trigger if exists fn_load_sync_version on fn_loads;
drop trigger if exists fn_load_sync_insert on fn_loads;
drop trigger if exists fn_load_sync_update on fn_loads;
create trigger fn_load_sync_insert after insert on fn_loads
  referencing new table as new_rows
  for each statement execute function public.fn_bump_load_sync_insert();
create trigger fn_load_sync_update after update on fn_loads
  referencing old table as old_rows new table as new_rows
  for each statement execute function public.fn_bump_load_sync_update();

create or replace function public.fn_ingest_loads(p_rows jsonb)
returns integer language plpgsql security invoker set search_path=public,pg_temp as $$
declare total integer;
begin
  insert into fn_loads(external_id,customer_account_id,status,origin_city,origin_state,dest_city,dest_state,pickup_date,delivery_date,equipment,weight_lbs,dimensions,carrier_offer_usd,auto_book,tracking_location,tracking_at,updated_at)
    select external_id,customer_account_id,status,origin_city,origin_state,dest_city,dest_state,pickup_date,delivery_date,equipment,weight_lbs,dimensions,carrier_offer_usd,auto_book,tracking_location,tracking_at,updated_at
    from jsonb_populate_recordset(null::fn_loads,p_rows)
  on conflict(external_id) do update set customer_account_id=excluded.customer_account_id,status=excluded.status,
    origin_city=excluded.origin_city,origin_state=excluded.origin_state,dest_city=excluded.dest_city,dest_state=excluded.dest_state,
    pickup_date=excluded.pickup_date,delivery_date=excluded.delivery_date,equipment=excluded.equipment,weight_lbs=excluded.weight_lbs,dimensions=excluded.dimensions,
    carrier_offer_usd=excluded.carrier_offer_usd,auto_book=excluded.auto_book,tracking_location=excluded.tracking_location,tracking_at=excluded.tracking_at,updated_at=excluded.updated_at,
    customer_scope_withdrawn=fn_loads.customer_scope_withdrawn
      or (fn_loads.customer_account_id is not null
        and fn_loads.customer_account_id is distinct from excluded.customer_account_id),
    customer_scope_blocked_ids=case
      when excluded.updated_at>fn_loads.updated_at then '{}'::text[]
      when fn_loads.customer_account_id is not null
        and fn_loads.customer_account_id is distinct from excluded.customer_account_id
        and not (fn_loads.customer_account_id=any(fn_loads.customer_scope_blocked_ids))
        then array_append(fn_loads.customer_scope_blocked_ids,fn_loads.customer_account_id)
      else fn_loads.customer_scope_blocked_ids end
  where excluded.updated_at>fn_loads.updated_at
     or (excluded.updated_at=fn_loads.updated_at
       and (excluded.customer_account_id is null
         or not (excluded.customer_account_id=any(fn_loads.customer_scope_blocked_ids))));
  get diagnostics total=row_count;
  return total;
end $$;
commit;
