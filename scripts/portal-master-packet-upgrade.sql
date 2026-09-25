-- Five Nines WEBSITE database only: pzupanvsfrgudoghpjpq.
-- This repository uses reviewed flat upgrade scripts, not a Supabase CLI project.
-- CLI generation/advisors are unavailable locally; verify this script with the
-- isolated PGlite tests and run production advisors after an authorized apply.
-- Preserve existing uploads, paths, grants and private bucket configuration.
begin;

alter table public.fn_documents
  add column if not exists included_kinds text[] not null default '{}',
  add column if not exists reviewed_by uuid references auth.users(id),
  add column if not exists reviewed_at timestamptz;

alter table public.fn_documents drop constraint if exists fn_documents_kind_check;
alter table public.fn_documents add constraint fn_documents_kind_check
  check (kind in ('packet','combined','coi','w9','noa','bol','po','packing_list','other'));

-- Keep Storage aligned with the direct-upload client and API. This is the
-- existing private bucket; do not recreate it or disturb its objects/policies.
do $$ begin
  if not exists (select 1 from storage.buckets where id='fn-private-documents') then
    raise exception 'Private portal document bucket is missing';
  end if;
end $$;
update storage.buckets set file_size_limit=15728640
where id='fn-private-documents';

alter table public.fn_documents drop constraint if exists fn_documents_included_kinds_check;
alter table public.fn_documents add constraint fn_documents_included_kinds_check
  check (included_kinds <@ array['packet','coi','w9','noa']::text[]
    and array_position(included_kinds,null) is null
    and cardinality(included_kinds)<=4);

alter table public.fn_documents drop constraint if exists fn_documents_review_check;
alter table public.fn_documents add constraint fn_documents_review_check
  check (
    (cardinality(included_kinds)=0 and reviewed_by is null and reviewed_at is null)
    or (kind='combined' and reviewed_by is not null and reviewed_at is not null)
  );

-- Same signature and service-only privileges as before. A combined file has no
-- document coverage until staff explicitly verifies its contents. Never infer
-- insurance validity, Highway completion or carrier approval from the upload.
create or replace function public.fn_carrier_ready(p_user uuid)
returns boolean language plpgsql stable security invoker set search_path=public,pg_temp as $$
declare p fn_profiles; expiry date;
begin
  select * into p from fn_profiles where user_id=p_user;
  if not found or p.role<>'carrier' or p.status<>'approved' or p.highway_status<>'verified'
    or nullif(btrim(p.company),'') is null
    or exists(select 1 from unnest(array['contact','phone','dot','equipment','lanes']) required(field)
      where nullif(btrim(p.details->>required.field),'') is null)
    or (p.details->>'contract_ack') is distinct from 'yes'
    or coalesce(p.details->>'factoring','') not in ('yes','no')
    or coalesce(p.details->>'insurance_expiry','') !~ '^\d{4}-\d{2}-\d{2}$'
    then return false; end if;
  begin
    expiry:=(p.details->>'insurance_expiry')::date;
  exception when datetime_field_overflow or invalid_datetime_format then
    return false;
  end;
  if expiry<(now() at time zone 'America/Chicago')::date then return false; end if;
  -- A newly uploaded master packet requires a fresh staff content review even
  -- when older individual files or an earlier reviewed packet cover every kind.
  if exists(select 1 from fn_documents d where d.user_id=p_user and d.kind='combined'
    and (d.reviewed_by is null or d.reviewed_at is null)) then return false; end if;
  return not exists(
    select 1 from unnest(array['packet','coi','w9'] ||
      case when p.details->>'factoring'='yes' then array['noa'] else array[]::text[] end) required(kind)
    where not exists(
      select 1 from fn_documents d where d.user_id=p_user and
        (d.kind=required.kind or (d.kind='combined' and d.reviewed_by is not null
          and d.reviewed_at is not null and required.kind=any(d.included_kinds)))
    )
  );
end $$;

-- This RPC is called only by the website's authenticated staff route, using its
-- service-role client. Never pass p_staff or p_actor through from a browser.
-- The route verifies p_actor with Auth; this invoker function must not SELECT
-- auth.users because service_role is not guaranteed that table privilege.
-- Profile first, then owned documents: the same order as fn_add_document.
-- Approval and the reviewed-document checklist commit or roll back together.
create or replace function public.fn_review_profile(
  p_actor uuid,p_staff boolean,p_user uuid,p_version integer,p_status text,
  p_highway text,p_account text,p_note text,p_document_reviews jsonb default '[]'::jsonb
)
returns void language plpgsql security invoker set search_path=public,pg_temp as $$
declare
  p fn_profiles; d fn_documents; item jsonb; doc_id uuid;
  seen uuid[]:='{}'; coverage text[]; account_id text;
begin
  if p_staff is distinct from true or p_actor is null
    then raise exception 'Staff required'; end if;
  if p_status is null or p_status not in ('approved','changes_requested','suspended')
    then raise exception 'Choose a review outcome'; end if;
  if p_highway is null or p_highway not in ('awaiting_invitation','invited','verified')
    then raise exception 'Invalid Highway status'; end if;
  if p_note is null or length(p_note)>1000
    then raise exception 'Invalid review note'; end if;
  if p_account is not null and length(p_account)>120
    then raise exception 'Invalid customer account'; end if;
  account_id:=nullif(btrim(coalesce(p_account,'')),'');
  if jsonb_typeof(p_document_reviews) is distinct from 'array'
    then raise exception 'Invalid document review checklist'; end if;
  if jsonb_array_length(p_document_reviews)>100
    then raise exception 'Too many document reviews'; end if;

  select * into p from fn_profiles where user_id=p_user for update;
  if not found then raise exception 'Profile not found'; end if;
  if p.version is distinct from p_version
    then raise exception 'Profile changed. Refresh before reviewing'; end if;
  if p.role<>'carrier' and jsonb_array_length(p_document_reviews)>0
    then raise exception 'Only carrier packets can be reviewed'; end if;

  for item in select value from jsonb_array_elements(p_document_reviews) loop
    if jsonb_typeof(item) is distinct from 'object'
      or jsonb_typeof(item->'id') is distinct from 'string'
      or jsonb_typeof(item->'confirmed') is distinct from 'boolean'
      or jsonb_typeof(item->'included_kinds') is distinct from 'array'
      then raise exception 'Invalid document review'; end if;
    doc_id:=(item->>'id')::uuid;
    if doc_id=any(seen) then raise exception 'Duplicate document review'; end if;
    seen:=array_append(seen,doc_id);
    if jsonb_array_length(item->'included_kinds')>4 or exists(
      select 1 from jsonb_array_elements(item->'included_kinds') entry(value)
      where jsonb_typeof(entry.value)<>'string'
        or (entry.value#>>'{}') not in ('packet','coi','w9','noa')
    ) then raise exception 'Invalid included document kind'; end if;
    -- Match DOCUMENT_KINDS in the portal contract, independent of input order.
    select coalesce(array_agg(value order by
      array_position(array['packet','coi','w9','noa']::text[],value)),'{}'::text[])
      into coverage from jsonb_array_elements_text(item->'included_kinds') entry(value);
    if cardinality(coverage)<>(select count(distinct value) from unnest(coverage) entry(value))
      then raise exception 'Duplicate included document kind'; end if;
    select * into d from fn_documents where id=doc_id and user_id=p_user for update;
    if not found or d.kind not in ('packet','combined')
      then raise exception 'Packet not found for this carrier'; end if;
    if (item->>'confirmed')::boolean is false then
      if cardinality(coverage)<>0
        then raise exception 'An unconfirmed packet cannot include document kinds'; end if;
      -- Revocation is part of this transaction. A legacy standalone packet has
      -- no staff coverage to revoke and retains its original kind.
      if d.kind='combined' then
        update fn_documents set included_kinds='{}',reviewed_by=null,reviewed_at=null
          where id=d.id;
      end if;
      continue;
    end if;
    -- Legacy packet files can be classified without reuploading. Staff inspects
    -- the actual private file; a filename is not proof of its contents or MIME.
    -- Compare coverage as a set so older alphabetical arrays keep their audit
    -- timestamp when staff submits the same confirmed contents again.
    if d.kind='packet' or d.reviewed_by is null
      or cardinality(d.included_kinds)<>cardinality(coverage)
      or not (d.included_kinds @> coverage and d.included_kinds <@ coverage) then
      update fn_documents set kind='combined',included_kinds=coverage,
        reviewed_by=p_actor,reviewed_at=now() where id=d.id;
    end if;
  end loop;

  if p_status='approved' and (
    nullif(btrim(p.company),'') is null
    or nullif(btrim(p.details->>'contact'),'') is null
    or nullif(btrim(p.details->>'phone'),'') is null
    or (p.role='customer' and account_id is null)
  ) then raise exception 'Complete required company details before approval'; end if;
  update fn_profiles set status=p_status,highway_status=p_highway,
    customer_account_id=case when p.role='customer' then account_id else null end,
    review_note=p_note,version=version+1,updated_at=now() where user_id=p_user;
  if p_status='approved' and p.role='carrier' and not fn_carrier_ready(p_user)
    then raise exception 'Approval needs complete documents, current insurance and Highway verification'; end if;
end $$;

-- CREATE OR REPLACE retains fn_carrier_ready privileges; explicitly maintain
-- service-only execution for both entry points, including after a reapplication.
revoke all on function public.fn_carrier_ready(uuid) from public,anon,authenticated;
grant execute on function public.fn_carrier_ready(uuid) to service_role;
revoke all on function public.fn_review_profile(uuid,boolean,uuid,integer,text,text,text,text,jsonb)
  from public,anon,authenticated;
grant execute on function public.fn_review_profile(uuid,boolean,uuid,integer,text,text,text,text,jsonb)
  to service_role;

commit;
