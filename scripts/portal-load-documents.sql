-- Carrier-uploaded POD and invoice files, tied to a TAI shipment number.
-- Accessed only through the service role from API routes; RLS stays closed.
create table if not exists public.fn_load_documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.fn_profiles(user_id),
  load_number text not null check (length(load_number) between 1 and 40),
  kind text not null check (kind in ('pod', 'invoice')),
  path text not null unique,
  name text not null,
  created_at timestamptz not null default now()
);
create index if not exists fn_load_documents_load on public.fn_load_documents(load_number, kind);
create index if not exists fn_load_documents_owner on public.fn_load_documents(user_id, created_at desc);
alter table public.fn_load_documents enable row level security;
revoke all on public.fn_load_documents from anon, authenticated;
