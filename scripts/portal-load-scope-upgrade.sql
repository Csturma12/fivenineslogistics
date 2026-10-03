-- Website database only: pzupanvsfrgudoghpjpq. Apply after the portal routes deploy.
-- A local correction can withdraw a customer bill-to ID without changing the
-- upstream TAI activity timestamp. Equal-time bridge snapshots must therefore
-- update customer scope; genuinely older snapshots still cannot roll it back.
begin;
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
    carrier_offer_usd=excluded.carrier_offer_usd,auto_book=excluded.auto_book,tracking_location=excluded.tracking_location,tracking_at=excluded.tracking_at,updated_at=excluded.updated_at
  where excluded.updated_at>=fn_loads.updated_at;
  get diagnostics total=row_count;
  return total;
end $$;
commit;
