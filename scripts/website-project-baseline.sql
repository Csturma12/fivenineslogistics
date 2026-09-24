-- Website-only copy from gkerqkqrivrnlkoysupu to pzupanvsfrgudoghpjpq.
-- Schema only; contains no accounts, passwords, or credentials.
begin;
create table if not exists public.shipments (
  id uuid primary key default gen_random_uuid(),
  shipment_id text not null unique,
  ref_number text,
  bol_number text,
  pro_number text,
  status text not null default 'new',
  origin_city text,
  origin_state text,
  origin_zip text,
  dest_city text,
  dest_state text,
  dest_zip text,
  pickup_date timestamptz,
  delivery_date timestamptz,
  customer_name text,
  carrier_name text,
  carrier_mc text,
  equipment text,
  weight numeric,
  rate_sell numeric,
  rate_cost numeric,
  current_location text,
  eta timestamptz,
  last_status_note text,
  raw jsonb,
  received_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index if not exists shipments_status_idx on public.shipments (status);
create index if not exists shipments_pickup_date_idx on public.shipments (pickup_date desc);
create index if not exists shipments_updated_at_idx on public.shipments (updated_at desc);

create table if not exists public.shipment_events (
  id uuid primary key default gen_random_uuid(),
  shipment_id text not null references public.shipments(shipment_id) on delete cascade,
  event_type text not null default 'status',
  status text,
  location text,
  note text,
  occurred_at timestamptz not null default now(),
  raw jsonb,
  created_at timestamptz not null default now()
);

create index if not exists shipment_events_shipment_idx on public.shipment_events (shipment_id, occurred_at desc);

alter table public.shipments enable row level security;
alter table public.shipment_events enable row level security;
create table if not exists public.portal_access_requests (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  full_name text,
  company text,
  role text not null default 'customer',
  status text not null default 'pending',
  note text,
  created_at timestamptz not null default now(),
  authorized_at timestamptz,
  constraint portal_access_requests_role_check check (role in ('customer','carrier')),
  constraint portal_access_requests_status_check check (status in ('pending','authorized','denied'))
);

create unique index if not exists portal_access_requests_email_key
  on public.portal_access_requests (lower(email));

alter table public.portal_access_requests enable row level security;

comment on table public.portal_access_requests is 'Portal access requests. All reads/writes go through the service-role admin client; RLS is on with no public policies so anon/authenticated cannot touch it.';
-- Five Nines WEBSITE database only. Never apply this to the freight dashboard.
-- All access passes through verified server routes; no direct browser grants.

create table if not exists public.fn_profiles (
  user_id uuid primary key references auth.users(id),
  email text not null,
  role text not null check (role in ('carrier','customer')),
  company text not null default '',
  details jsonb not null default '{}',
  status text not null default 'draft' check (status in ('draft','submitted','approved','changes_requested','suspended')),
  highway_status text not null default 'awaiting_invitation' check (highway_status in ('awaiting_invitation','invited','verified')),
  customer_account_id text,
  review_note text not null default '',
  version integer not null default 1,
  updated_at timestamptz not null default now()
);
create table if not exists public.fn_documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.fn_profiles(user_id),
  kind text not null check (kind in ('packet','coi','w9','noa','bol','po','packing_list','other')),
  path text not null unique,
  name text not null,
  created_at timestamptz not null default now()
);
create index if not exists fn_documents_owner on public.fn_documents(user_id,created_at desc);
create table if not exists public.fn_company_documents (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  path text not null unique,
  created_at timestamptz not null default now()
);
create table if not exists public.fn_loads (
  id uuid primary key default gen_random_uuid(),
  external_id text not null unique,
  customer_account_id text,
  status text not null check (status in ('available','booked','in_transit','delivered','cancelled')),
  origin_city text not null,
  origin_state text not null,
  dest_city text not null,
  dest_state text not null,
  pickup_date date,
  delivery_date date,
  equipment text,
  weight_lbs numeric check (weight_lbs > 0),
  dimensions text,
  carrier_offer_usd numeric(12,2) check (carrier_offer_usd > 0),
  auto_book boolean not null default false,
  reserved_by uuid references public.fn_profiles(user_id),
  tracking_location text,
  tracking_at timestamptz,
  updated_at timestamptz not null default now(),
  check (not auto_book or carrier_offer_usd is not null)
);
create index if not exists fn_loads_customer on public.fn_loads(customer_account_id,pickup_date desc);
create index if not exists fn_loads_open on public.fn_loads(pickup_date,id) where status='available' and reserved_by is null;
create table if not exists public.fn_bids (
  id uuid primary key default gen_random_uuid(),
  load_id uuid not null references public.fn_loads(id),
  user_id uuid not null references public.fn_profiles(user_id),
  amount numeric(12,2) not null check (amount > 0 and amount <= 1000000),
  note text not null default '' check (length(note)<=1000),
  status text not null default 'submitted' check (status in ('submitted','countered','accepted','declined')),
  counter_amount numeric(12,2) check (counter_amount > 0 and counter_amount <= 1000000),
  version integer not null default 1,
  updated_at timestamptz not null default now(),
  unique(load_id,user_id)
);
create index if not exists fn_bids_owner on public.fn_bids(user_id,updated_at desc);
create table if not exists public.fn_bookings (
  id uuid primary key default gen_random_uuid(),
  load_id uuid not null unique references public.fn_loads(id),
  user_id uuid not null references public.fn_profiles(user_id),
  amount numeric(12,2) not null check (amount > 0),
  status text not null default 'awaiting_dispatch' check (status in ('awaiting_dispatch','confirmed','cancelled')),
  source text not null check (source in ('auto_book','bid','counter')),
  created_at timestamptz not null default now()
);
create index if not exists fn_bookings_owner on public.fn_bookings(user_id,created_at desc);
create table if not exists public.fn_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.fn_profiles(user_id),
  kind text not null check (kind in ('load','pod','invoice')),
  load_id uuid references public.fn_loads(id),
  details jsonb not null default '{}',
  status text not null default 'new' check(status in ('new','reviewing','completed')),
  created_at timestamptz not null default now()
);
create index if not exists fn_requests_owner on public.fn_requests(user_id,created_at desc);
create table if not exists public.fn_notifications (
  id uuid primary key default gen_random_uuid(),
  recipient text not null,
  subject text not null,
  detail text not null,
  created_at timestamptz not null default now(),
  sent_at timestamptz,
  last_error text
);
create index if not exists fn_notifications_pending on public.fn_notifications(created_at) where sent_at is null;

-- Atomic profile/document changes invalidate approval. No self-approval fields.
create or replace function public.fn_save_profile(p_user uuid,p_company text,p_details jsonb,p_submit boolean)
returns void language plpgsql security invoker set search_path=public,pg_temp as $$
begin
  update fn_profiles set company=p_company,details=p_details,
    status=case when status='suspended' then status when p_submit then 'submitted' else 'draft' end,
    version=version+1,updated_at=now() where user_id=p_user;
  if not found then raise exception 'Profile not found'; end if;
  if p_submit then insert into fn_notifications(recipient,subject,detail)
    values('sturma@blbxcritical.com','Portal setup submitted',p_company||' submitted setup for review in /agent-desk.'); end if;
end $$;
create or replace function public.fn_add_document(p_user uuid,p_kind text,p_path text,p_name text)
returns void language plpgsql security invoker set search_path=public,pg_temp as $$
begin
  perform 1 from fn_profiles where user_id=p_user for update;
  insert into fn_documents(user_id,kind,path,name) values(p_user,p_kind,p_path,p_name);
  update fn_profiles set status=case when status='suspended' then status else 'draft' end,
    version=version+1,updated_at=now() where user_id=p_user;
end $$;

-- Submission, counters and reservations share a load lock to prevent two winners.
create or replace function public.fn_carrier_ready(p_user uuid)
returns boolean language sql stable security invoker set search_path=public,pg_temp as $$
  select exists(select 1 from fn_profiles p where p.user_id=p_user and p.role='carrier'
    and p.status='approved' and p.highway_status='verified'
    and coalesce(p.details->>'insurance_expiry','') >= to_char(now() at time zone 'America/Chicago','YYYY-MM-DD')
    and p.details->>'contract_ack'='yes' and p.details->>'factoring' in ('yes','no')
    and not exists(select 1 from unnest(array['packet','coi','w9'] || case when p.details->>'factoring'='yes' then array['noa'] else array[]::text[] end) required(kind)
      where not exists(select 1 from fn_documents d where d.user_id=p_user and d.kind=required.kind)))
$$;
create or replace function public.fn_bid_action(p_actor uuid,p_staff boolean,p_action text,p_load uuid,p_amount numeric default null,p_note text default '',p_bid uuid default null,p_version integer default null)
returns uuid language plpgsql security invoker set search_path=public,pg_temp as $$
declare l fn_loads; b fn_bids; p fn_profiles; winner uuid; price numeric; result uuid; origin text;
begin
  select * into l from fn_loads where id=p_load for update;
  if not found then raise exception 'Load not found'; end if;
  if l.status <> 'available' or l.reserved_by is not null or l.updated_at < now()-interval '24 hours'
    or l.pickup_date < (now() at time zone 'America/Chicago')::date then raise exception 'Load is no longer available. Refresh the board.'; end if;
  if p_action in ('accept','deny','counter') and not p_staff then raise exception 'Staff required'; end if;
  if p_action in ('submit','auto_book','accept_counter') then
    select * into p from fn_profiles where user_id=p_actor for update;
    if not fn_carrier_ready(p_actor)
      then raise exception 'Approved carrier setup required'; end if;
  end if;
  if p_action='submit' then
    if p_amount is null or p_amount<=0 or p_amount>1000000 then raise exception 'Invalid bid amount'; end if;
    insert into fn_bids(load_id,user_id,amount,note) values(p_load,p_actor,p_amount,p_note)
    on conflict(load_id,user_id) do update set amount=excluded.amount,note=excluded.note,status='submitted',counter_amount=null,version=fn_bids.version+1,updated_at=now()
    returning id into result;
    insert into fn_notifications(recipient,subject,detail) values('sturma@blbxcritical.com','New carrier bid',p.company||' bid $'||p_amount||' on load '||l.external_id||'. Review in /agent-desk.');
    return result;
  end if;
  if p_action='auto_book' then
    if not l.auto_book or l.carrier_offer_usd is null or p_amount is distinct from l.carrier_offer_usd then raise exception 'Offer changed. Refresh before booking.'; end if;
    winner:=p_actor; price:=l.carrier_offer_usd; origin:='auto_book';
  else
    select * into b from fn_bids where id=p_bid and load_id=p_load for update;
    if not found or b.version is distinct from p_version or b.status not in ('submitted','countered') then raise exception 'Bid changed. Refresh before responding.'; end if;
    if p_action='accept_counter' and (b.user_id<>p_actor or b.status<>'countered') then raise exception 'Counteroffer not available'; end if;
    if p_action in ('deny','counter') then
      if p_action='counter' and (p_amount is null or p_amount<=0 or p_amount>1000000) then raise exception 'Enter a positive counteroffer'; end if;
      update fn_bids set status=case when p_action='deny' then 'declined' else 'countered' end,
        counter_amount=case when p_action='counter' then p_amount else null end,version=version+1,updated_at=now() where id=b.id;
      insert into fn_notifications(recipient,subject,detail) select email,'Your load bid has an update','Sign in to your Five Nines portal to review your bid.' from fn_profiles where user_id=b.user_id;
      return b.id;
    end if;
    if p_action not in ('accept','accept_counter') then raise exception 'Unknown action'; end if;
    -- Staff cannot silently accept their own counter: carrier must consent to it.
    if p_action='accept' and b.status<>'submitted' then raise exception 'Awaiting carrier response to counteroffer'; end if;
    winner:=b.user_id; price:=case when p_action='accept_counter' then b.counter_amount else b.amount end;
    origin:=case when p_action='accept_counter' then 'counter' else 'bid' end;
    select * into p from fn_profiles where user_id=winner for update;
    if not fn_carrier_ready(winner) then raise exception 'Carrier setup is not approved'; end if;
    update fn_bids set status='accepted',version=version+1,updated_at=now() where id=b.id;
  end if;
  update fn_loads set reserved_by=winner where id=p_load;
  insert into fn_notifications(recipient,subject,detail)
    select other_profile.email,'Load no longer available','Another carrier has reserved a load you bid on. Check your portal for other opportunities.'
    from fn_bids other join fn_profiles other_profile on other_profile.user_id=other.user_id
    where other.load_id=p_load and other.user_id<>winner and other.status in ('submitted','countered');
  update fn_bids set status='declined',version=version+1,updated_at=now()
    where load_id=p_load and user_id<>winner and status in ('submitted','countered');
  update fn_bids set status='accepted',version=version+1,updated_at=now()
    where load_id=p_load and user_id=winner and status in ('submitted','countered');
  insert into fn_bookings(load_id,user_id,amount,source) values(p_load,winner,price,origin) returning id into result;
  insert into fn_notifications(recipient,subject,detail) values('sturma@blbxcritical.com','Carrier reservation - dispatch action required',p.company||' reserved load '||l.external_id||' for $'||price||'. Review in /agent-desk and complete TAI assignment.');
  insert into fn_notifications(recipient,subject,detail) values(p.email,'Load reserved - awaiting dispatch','Your load reservation was received. Dispatch will confirm assignment and send the rate confirmation.');
  return result;
end $$;

-- Upstream snapshots cannot overwrite reservations or roll back newer feed data.
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
  where excluded.updated_at>fn_loads.updated_at;
  get diagnostics total=row_count;
  return total;
end $$;

create or replace function public.fn_customer_request(p_user uuid,p_kind text,p_load uuid,p_details jsonb)
returns uuid language plpgsql security invoker set search_path=public,pg_temp as $$
declare p fn_profiles; result uuid;
begin
  select * into p from fn_profiles where user_id=p_user;
  if p.role is distinct from 'customer' or p.status='suspended' then raise exception 'Customer access required'; end if;
  if p_kind in ('pod','invoice') and not exists(select 1 from fn_loads where id=p_load and customer_account_id=p.customer_account_id and p.status='approved') then raise exception 'Shipment not found'; end if;
  if p_kind='load' and p_load is not null then raise exception 'Invalid load request'; end if;
  insert into fn_requests(user_id,kind,load_id,details) values(p_user,p_kind,p_load,p_details) returning id into result;
  insert into fn_notifications(recipient,subject,detail) values('sturma@blbxcritical.com','Customer '||p_kind||' request',p.company||' submitted a request. Review it in /agent-desk. Request '||result);
  return result;
end $$;

-- Service-only tables and procedures: application routes re-verify identity and role.
do $$ declare t text; f record; begin
  foreach t in array array['fn_profiles','fn_documents','fn_company_documents','fn_loads','fn_bids','fn_bookings','fn_requests','fn_notifications'] loop
    execute format('alter table public.%I enable row level security',t);
    execute format('revoke all on public.%I from public,anon,authenticated',t);
    execute format('grant select,insert,update,delete on public.%I to service_role',t);
  end loop;
  for f in select oid::regprocedure as sig from pg_proc where pronamespace='public'::regnamespace and proname in ('fn_save_profile','fn_add_document','fn_bid_action','fn_customer_request','fn_carrier_ready','fn_ingest_loads') loop
    execute format('revoke all on function %s from public,anon,authenticated',f.sig);
    execute format('grant execute on function %s to service_role',f.sig);
  end loop;
end $$;
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values('fn-private-documents','fn-private-documents',false,3145728,array['application/pdf','image/jpeg','image/png'])
on conflict(id) do update set public=false,file_size_limit=excluded.file_size_limit,allowed_mime_types=excluded.allowed_mime_types;

CREATE TABLE public."loads" (
"id" uuid DEFAULT gen_random_uuid() NOT NULL,
"external_id" text,
"reference" text,
"status" text DEFAULT 'available'::text NOT NULL,
"origin_city" text,
"origin_state" text,
"dest_city" text,
"dest_state" text,
"pickup_date" date,
"delivery_date" date,
"equipment" text,
"mode" text,
"weight_lbs" integer,
"commodity" text,
"distance_mi" integer,
"rate_usd" numeric,
"stops" integer DEFAULT 2,
"notes" text,
"booked_by_email" text,
"booked_by_company" text,
"booked_at" timestamp with time zone,
"posted_at" timestamp with time zone DEFAULT now() NOT NULL,
"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
CONSTRAINT "loads_external_id_key" UNIQUE (external_id),
CONSTRAINT "loads_pkey" PRIMARY KEY (id),
CONSTRAINT "loads_status_check" CHECK ((status = ANY (ARRAY['available'::text, 'booked'::text, 'in_transit'::text, 'delivered'::text, 'cancelled'::text])))
);
ALTER TABLE public."loads" ENABLE ROW LEVEL SECURITY;
CREATE TABLE public."ops_snapshots" (
"id" bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
"metrics" jsonb NOT NULL,
"details" jsonb,
"source" text DEFAULT 'sync'::text NOT NULL,
"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
"created_at" timestamp with time zone DEFAULT now() NOT NULL,
CONSTRAINT "ops_snapshots_pkey" PRIMARY KEY (id)
);
ALTER TABLE public."ops_snapshots" ENABLE ROW LEVEL SECURITY;
CREATE OR REPLACE FUNCTION public.set_loads_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
begin
  new.updated_at = now();
  return new;
end;
$function$
;
CREATE TRIGGER loads_set_updated_at BEFORE UPDATE ON public.loads FOR EACH ROW EXECUTE FUNCTION set_loads_updated_at();
ALTER FUNCTION public.set_loads_updated_at() SET search_path=public,pg_temp;
CREATE INDEX loads_status_idx ON public.loads(status);
CREATE INDEX loads_pickup_date_idx ON public.loads(pickup_date);
CREATE INDEX loads_lane_idx ON public.loads(origin_state,dest_state);
CREATE INDEX ops_snapshots_updated_at_idx ON public.ops_snapshots(updated_at DESC);
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM PUBLIC,anon,authenticated;
GRANT SELECT,INSERT,UPDATE,DELETE ON ALL TABLES IN SCHEMA public TO service_role;
GRANT USAGE,SELECT ON ALL SEQUENCES IN SCHEMA public TO service_role;
commit;

