-- Five Nines Logistics — Control Tower Portal schema + Row-Level Security.
--
-- Run in the Supabase SQL Editor (or `supabase db push`).
--
-- Guarantees:
--   * Shippers (profiles.role = 'shipper') only read loads where shipper_id = auth.uid().
--   * Carriers (profiles.role = 'carrier') read every load with status in ('quoted', 'committed')
--     plus any load where assigned_carrier_id = auth.uid().
--   * The public Request Capacity drawer may insert rows only with status = 'quoted'.
--   * Carriers may insert bids only under their own carrier_id.
--
-- Policies are created idempotently so the file can be re-run safely.

-- 1. PROFILES
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text unique not null,
  company_name text not null,
  role text not null check (role in ('shipper', 'carrier', 'admin')),
  mc_number text,
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;

drop policy if exists "Users can read own profile" on public.profiles;
create policy "Users can read own profile"
  on public.profiles for select
  using ( auth.uid() = id );

-- 2. LOADS
create table if not exists public.loads (
  id uuid default gen_random_uuid() primary key,
  reference_number text unique not null,
  po_number text,
  shipper_id uuid references public.profiles(id),
  assigned_carrier_id uuid references public.profiles(id),
  origin_city text not null,
  origin_state text not null,
  origin_zip text,
  dest_city text not null,
  dest_state text not null,
  dest_zip text,
  pickup_window text not null,
  delivery_window text not null,
  constraint_type text default 'Hard Crane / Install Slot',
  equipment_type text not null,
  weight_lbs integer not null,
  dimensions text,
  commodity text not null,
  site_requirements text[] default '{}',
  status text not null default 'quoted' check (status in ('quoted', 'committed', 'dispatched', 'in_transit', 'delivered')),
  shipper_rate_usd numeric(10,2),
  carrier_offer_usd numeric(10,2),
  current_location text,
  eta_status text default 'On Schedule',
  securement_photo_url text,
  bol_pod_url text,
  contact_name text,
  contact_email text,
  contact_phone text,
  created_at timestamptz default now()
);

alter table public.loads enable row level security;

-- SHIPPERS ONLY SEE THEIR OWN FREIGHT
drop policy if exists "Shippers view only their own freight" on public.loads;
create policy "Shippers view only their own freight"
  on public.loads for select
  to authenticated
  using (
    shipper_id = auth.uid()
    and exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'shipper'
    )
  );

-- CARRIERS SEE ALL 'QUOTED' AND 'COMMITTED' LOADS + ASSIGNED LOADS
drop policy if exists "Carriers view available quoted/committed loads and assigned loads" on public.loads;
create policy "Carriers view available quoted/committed loads and assigned loads"
  on public.loads for select
  to authenticated
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'carrier'
    )
    and (
      status in ('quoted', 'committed')
      or assigned_carrier_id = auth.uid()
    )
  );

-- ALLOW QUOTE DRAWER SUBMISSIONS TO INSERT AS 'QUOTED'
drop policy if exists "Allow public quote submissions into loads" on public.loads;
create policy "Allow public quote submissions into loads"
  on public.loads for insert
  to anon, authenticated
  with check ( status = 'quoted' );

create index if not exists loads_status_created_idx on public.loads (status, created_at desc);
create index if not exists loads_assigned_carrier_idx on public.loads (assigned_carrier_id);
create index if not exists loads_shipper_idx on public.loads (shipper_id);

-- 3. CARRIER BIDS
create table if not exists public.load_bids (
  id uuid default gen_random_uuid() primary key,
  load_id uuid references public.loads(id) on delete cascade not null,
  carrier_id uuid references public.profiles(id) not null,
  bid_amount_usd numeric(10,2) not null,
  truck_location text not null,
  notes text,
  created_at timestamptz default now()
);

alter table public.load_bids enable row level security;

drop policy if exists "Carriers can insert their own bids" on public.load_bids;
create policy "Carriers can insert their own bids"
  on public.load_bids for insert
  to authenticated
  with check ( carrier_id = auth.uid() );

create index if not exists load_bids_load_idx on public.load_bids (load_id);
