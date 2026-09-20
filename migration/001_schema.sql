--
-- PostgreSQL database dump
--

\restrict 956oiD4RXbwoVegXoRcpXwHrblX8TXDquCerY6FOhd4TDL0FVFdgtRXZsybTRsg

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.10

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA public;


--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON SCHEMA public IS 'standard public schema';


--
-- Name: fn_add_document(uuid, text, text, text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.fn_add_document(p_user uuid, p_kind text, p_path text, p_name text) RETURNS void
    LANGUAGE plpgsql
    SET search_path TO 'public', 'pg_temp'
    AS $$
begin
  perform 1 from fn_profiles where user_id=p_user for update;
  insert into fn_documents(user_id,kind,path,name) values(p_user,p_kind,p_path,p_name);
  update fn_profiles set status=case when status='suspended' then status else 'draft' end,
    version=version+1,updated_at=now() where user_id=p_user;
end $$;


--
-- Name: fn_bid_action(uuid, boolean, text, uuid, numeric, text, uuid, integer); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.fn_bid_action(p_actor uuid, p_staff boolean, p_action text, p_load uuid, p_amount numeric DEFAULT NULL::numeric, p_note text DEFAULT ''::text, p_bid uuid DEFAULT NULL::uuid, p_version integer DEFAULT NULL::integer) RETURNS uuid
    LANGUAGE plpgsql
    SET search_path TO 'public', 'pg_temp'
    AS $_$
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
end $_$;


--
-- Name: fn_carrier_ready(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.fn_carrier_ready(p_user uuid) RETURNS boolean
    LANGUAGE sql STABLE
    SET search_path TO 'public', 'pg_temp'
    AS $$
  select exists(select 1 from fn_profiles p where p.user_id=p_user and p.role='carrier'
    and p.status='approved' and p.highway_status='verified'
    and coalesce(p.details->>'insurance_expiry','') >= to_char(now() at time zone 'America/Chicago','YYYY-MM-DD')
    and p.details->>'contract_ack'='yes' and p.details->>'factoring' in ('yes','no')
    and not exists(select 1 from unnest(array['packet','coi','w9'] || case when p.details->>'factoring'='yes' then array['noa'] else array[]::text[] end) required(kind)
      where not exists(select 1 from fn_documents d where d.user_id=p_user and d.kind=required.kind)))
$$;


--
-- Name: fn_customer_request(uuid, text, uuid, jsonb); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.fn_customer_request(p_user uuid, p_kind text, p_load uuid, p_details jsonb) RETURNS uuid
    LANGUAGE plpgsql
    SET search_path TO 'public', 'pg_temp'
    AS $$
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


--
-- Name: fn_ingest_loads(jsonb); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.fn_ingest_loads(p_rows jsonb) RETURNS integer
    LANGUAGE plpgsql
    SET search_path TO 'public', 'pg_temp'
    AS $$
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


--
-- Name: fn_save_profile(uuid, text, jsonb, boolean); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.fn_save_profile(p_user uuid, p_company text, p_details jsonb, p_submit boolean) RETURNS void
    LANGUAGE plpgsql
    SET search_path TO 'public', 'pg_temp'
    AS $$
begin
  update fn_profiles set company=p_company,details=p_details,
    status=case when status='suspended' then status when p_submit then 'submitted' else 'draft' end,
    version=version+1,updated_at=now() where user_id=p_user;
  if not found then raise exception 'Profile not found'; end if;
  if p_submit then insert into fn_notifications(recipient,subject,detail)
    values('sturma@blbxcritical.com','Portal setup submitted',p_company||' submitted setup for review in /agent-desk.'); end if;
end $$;


--
-- Name: set_loads_updated_at(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.set_loads_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
begin
  new.updated_at = now();
  return new;
end;
$$;


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: fn_bids; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.fn_bids (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    load_id uuid NOT NULL,
    user_id uuid NOT NULL,
    amount numeric(12,2) NOT NULL,
    note text DEFAULT ''::text NOT NULL,
    status text DEFAULT 'submitted'::text NOT NULL,
    counter_amount numeric(12,2),
    version integer DEFAULT 1 NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT fn_bids_amount_check CHECK (((amount > (0)::numeric) AND (amount <= (1000000)::numeric))),
    CONSTRAINT fn_bids_counter_amount_check CHECK (((counter_amount > (0)::numeric) AND (counter_amount <= (1000000)::numeric))),
    CONSTRAINT fn_bids_note_check CHECK ((length(note) <= 1000)),
    CONSTRAINT fn_bids_status_check CHECK ((status = ANY (ARRAY['submitted'::text, 'countered'::text, 'accepted'::text, 'declined'::text])))
);


--
-- Name: fn_bookings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.fn_bookings (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    load_id uuid NOT NULL,
    user_id uuid NOT NULL,
    amount numeric(12,2) NOT NULL,
    status text DEFAULT 'awaiting_dispatch'::text NOT NULL,
    source text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT fn_bookings_amount_check CHECK ((amount > (0)::numeric)),
    CONSTRAINT fn_bookings_source_check CHECK ((source = ANY (ARRAY['auto_book'::text, 'bid'::text, 'counter'::text]))),
    CONSTRAINT fn_bookings_status_check CHECK ((status = ANY (ARRAY['awaiting_dispatch'::text, 'confirmed'::text, 'cancelled'::text])))
);


--
-- Name: fn_company_documents; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.fn_company_documents (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    title text NOT NULL,
    path text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: fn_documents; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.fn_documents (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    kind text NOT NULL,
    path text NOT NULL,
    name text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT fn_documents_kind_check CHECK ((kind = ANY (ARRAY['packet'::text, 'coi'::text, 'w9'::text, 'noa'::text])))
);


--
-- Name: fn_loads; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.fn_loads (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    external_id text NOT NULL,
    customer_account_id text,
    status text NOT NULL,
    origin_city text NOT NULL,
    origin_state text NOT NULL,
    dest_city text NOT NULL,
    dest_state text NOT NULL,
    pickup_date date,
    delivery_date date,
    equipment text,
    weight_lbs numeric,
    dimensions text,
    carrier_offer_usd numeric(12,2),
    auto_book boolean DEFAULT false NOT NULL,
    reserved_by uuid,
    tracking_location text,
    tracking_at timestamp with time zone,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT fn_loads_carrier_offer_usd_check CHECK ((carrier_offer_usd > (0)::numeric)),
    CONSTRAINT fn_loads_check CHECK (((NOT auto_book) OR (carrier_offer_usd IS NOT NULL))),
    CONSTRAINT fn_loads_status_check CHECK ((status = ANY (ARRAY['available'::text, 'booked'::text, 'in_transit'::text, 'delivered'::text, 'cancelled'::text]))),
    CONSTRAINT fn_loads_weight_lbs_check CHECK ((weight_lbs > (0)::numeric))
);


--
-- Name: fn_notifications; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.fn_notifications (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    recipient text NOT NULL,
    subject text NOT NULL,
    detail text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    sent_at timestamp with time zone,
    last_error text
);


--
-- Name: fn_profiles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.fn_profiles (
    user_id uuid NOT NULL,
    email text NOT NULL,
    role text NOT NULL,
    company text DEFAULT ''::text NOT NULL,
    details jsonb DEFAULT '{}'::jsonb NOT NULL,
    status text DEFAULT 'draft'::text NOT NULL,
    highway_status text DEFAULT 'awaiting_invitation'::text NOT NULL,
    customer_account_id text,
    review_note text DEFAULT ''::text NOT NULL,
    version integer DEFAULT 1 NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT fn_profiles_highway_status_check CHECK ((highway_status = ANY (ARRAY['awaiting_invitation'::text, 'invited'::text, 'verified'::text]))),
    CONSTRAINT fn_profiles_role_check CHECK ((role = ANY (ARRAY['carrier'::text, 'customer'::text]))),
    CONSTRAINT fn_profiles_status_check CHECK ((status = ANY (ARRAY['draft'::text, 'submitted'::text, 'approved'::text, 'changes_requested'::text, 'suspended'::text])))
);


--
-- Name: fn_requests; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.fn_requests (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    kind text NOT NULL,
    load_id uuid,
    details jsonb DEFAULT '{}'::jsonb NOT NULL,
    status text DEFAULT 'new'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT fn_requests_kind_check CHECK ((kind = ANY (ARRAY['load'::text, 'pod'::text, 'invoice'::text]))),
    CONSTRAINT fn_requests_status_check CHECK ((status = ANY (ARRAY['new'::text, 'reviewing'::text, 'completed'::text])))
);


--
-- Name: loads; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.loads (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    external_id text,
    reference text,
    status text DEFAULT 'available'::text NOT NULL,
    origin_city text,
    origin_state text,
    dest_city text,
    dest_state text,
    pickup_date date,
    delivery_date date,
    equipment text,
    mode text,
    weight_lbs integer,
    commodity text,
    distance_mi integer,
    rate_usd numeric,
    stops integer DEFAULT 2,
    notes text,
    booked_by_email text,
    booked_by_company text,
    booked_at timestamp with time zone,
    posted_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT loads_status_check CHECK ((status = ANY (ARRAY['available'::text, 'booked'::text, 'in_transit'::text, 'delivered'::text, 'cancelled'::text])))
);


--
-- Name: ops_snapshots; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.ops_snapshots (
    id bigint NOT NULL,
    metrics jsonb NOT NULL,
    details jsonb,
    source text DEFAULT 'sync'::text NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: ops_snapshots_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.ops_snapshots ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.ops_snapshots_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: portal_access_requests; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.portal_access_requests (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    email text NOT NULL,
    full_name text,
    company text,
    role text DEFAULT 'customer'::text NOT NULL,
    status text DEFAULT 'pending'::text NOT NULL,
    note text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    authorized_at timestamp with time zone,
    CONSTRAINT portal_access_requests_role_check CHECK ((role = ANY (ARRAY['customer'::text, 'carrier'::text]))),
    CONSTRAINT portal_access_requests_status_check CHECK ((status = ANY (ARRAY['pending'::text, 'authorized'::text, 'denied'::text])))
);


--
-- Name: TABLE portal_access_requests; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.portal_access_requests IS 'Portal access requests. All reads/writes go through the service-role admin client; RLS is on with no public policies so anon/authenticated cannot touch it.';


--
-- Name: shipment_events; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.shipment_events (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    shipment_id text NOT NULL,
    event_type text DEFAULT 'status'::text NOT NULL,
    status text,
    location text,
    note text,
    occurred_at timestamp with time zone DEFAULT now() NOT NULL,
    raw jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: shipments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.shipments (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    shipment_id text NOT NULL,
    ref_number text,
    bol_number text,
    pro_number text,
    status text DEFAULT 'new'::text NOT NULL,
    origin_city text,
    origin_state text,
    origin_zip text,
    dest_city text,
    dest_state text,
    dest_zip text,
    pickup_date timestamp with time zone,
    delivery_date timestamp with time zone,
    customer_name text,
    carrier_name text,
    carrier_mc text,
    equipment text,
    weight numeric,
    rate_sell numeric,
    rate_cost numeric,
    current_location text,
    eta timestamp with time zone,
    last_status_note text,
    raw jsonb,
    received_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: fn_bids fn_bids_load_id_user_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fn_bids
    ADD CONSTRAINT fn_bids_load_id_user_id_key UNIQUE (load_id, user_id);


--
-- Name: fn_bids fn_bids_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fn_bids
    ADD CONSTRAINT fn_bids_pkey PRIMARY KEY (id);


--
-- Name: fn_bookings fn_bookings_load_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fn_bookings
    ADD CONSTRAINT fn_bookings_load_id_key UNIQUE (load_id);


--
-- Name: fn_bookings fn_bookings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fn_bookings
    ADD CONSTRAINT fn_bookings_pkey PRIMARY KEY (id);


--
-- Name: fn_company_documents fn_company_documents_path_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fn_company_documents
    ADD CONSTRAINT fn_company_documents_path_key UNIQUE (path);


--
-- Name: fn_company_documents fn_company_documents_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fn_company_documents
    ADD CONSTRAINT fn_company_documents_pkey PRIMARY KEY (id);


--
-- Name: fn_documents fn_documents_path_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fn_documents
    ADD CONSTRAINT fn_documents_path_key UNIQUE (path);


--
-- Name: fn_documents fn_documents_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fn_documents
    ADD CONSTRAINT fn_documents_pkey PRIMARY KEY (id);


--
-- Name: fn_loads fn_loads_external_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fn_loads
    ADD CONSTRAINT fn_loads_external_id_key UNIQUE (external_id);


--
-- Name: fn_loads fn_loads_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fn_loads
    ADD CONSTRAINT fn_loads_pkey PRIMARY KEY (id);


--
-- Name: fn_notifications fn_notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fn_notifications
    ADD CONSTRAINT fn_notifications_pkey PRIMARY KEY (id);


--
-- Name: fn_profiles fn_profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fn_profiles
    ADD CONSTRAINT fn_profiles_pkey PRIMARY KEY (user_id);


--
-- Name: fn_requests fn_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fn_requests
    ADD CONSTRAINT fn_requests_pkey PRIMARY KEY (id);


--
-- Name: loads loads_external_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.loads
    ADD CONSTRAINT loads_external_id_key UNIQUE (external_id);


--
-- Name: loads loads_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.loads
    ADD CONSTRAINT loads_pkey PRIMARY KEY (id);


--
-- Name: ops_snapshots ops_snapshots_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ops_snapshots
    ADD CONSTRAINT ops_snapshots_pkey PRIMARY KEY (id);


--
-- Name: portal_access_requests portal_access_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.portal_access_requests
    ADD CONSTRAINT portal_access_requests_pkey PRIMARY KEY (id);


--
-- Name: shipment_events shipment_events_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.shipment_events
    ADD CONSTRAINT shipment_events_pkey PRIMARY KEY (id);


--
-- Name: shipments shipments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.shipments
    ADD CONSTRAINT shipments_pkey PRIMARY KEY (id);


--
-- Name: shipments shipments_shipment_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.shipments
    ADD CONSTRAINT shipments_shipment_id_key UNIQUE (shipment_id);


--
-- Name: fn_bids_owner; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX fn_bids_owner ON public.fn_bids USING btree (user_id, updated_at DESC);


--
-- Name: fn_bookings_owner; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX fn_bookings_owner ON public.fn_bookings USING btree (user_id, created_at DESC);


--
-- Name: fn_documents_owner; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX fn_documents_owner ON public.fn_documents USING btree (user_id, created_at DESC);


--
-- Name: fn_loads_customer; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX fn_loads_customer ON public.fn_loads USING btree (customer_account_id, pickup_date DESC);


--
-- Name: fn_loads_open; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX fn_loads_open ON public.fn_loads USING btree (pickup_date, id) WHERE ((status = 'available'::text) AND (reserved_by IS NULL));


--
-- Name: fn_notifications_pending; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX fn_notifications_pending ON public.fn_notifications USING btree (created_at) WHERE (sent_at IS NULL);


--
-- Name: fn_requests_owner; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX fn_requests_owner ON public.fn_requests USING btree (user_id, created_at DESC);


--
-- Name: loads_lane_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX loads_lane_idx ON public.loads USING btree (origin_state, dest_state);


--
-- Name: loads_pickup_date_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX loads_pickup_date_idx ON public.loads USING btree (pickup_date);


--
-- Name: loads_status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX loads_status_idx ON public.loads USING btree (status);


--
-- Name: ops_snapshots_updated_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ops_snapshots_updated_at_idx ON public.ops_snapshots USING btree (updated_at DESC);


--
-- Name: portal_access_requests_email_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX portal_access_requests_email_key ON public.portal_access_requests USING btree (lower(email));


--
-- Name: shipment_events_shipment_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX shipment_events_shipment_idx ON public.shipment_events USING btree (shipment_id, occurred_at DESC);


--
-- Name: shipments_pickup_date_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX shipments_pickup_date_idx ON public.shipments USING btree (pickup_date DESC);


--
-- Name: shipments_status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX shipments_status_idx ON public.shipments USING btree (status);


--
-- Name: shipments_updated_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX shipments_updated_at_idx ON public.shipments USING btree (updated_at DESC);


--
-- Name: loads loads_set_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER loads_set_updated_at BEFORE UPDATE ON public.loads FOR EACH ROW EXECUTE FUNCTION public.set_loads_updated_at();


--
-- Name: fn_bids fn_bids_load_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fn_bids
    ADD CONSTRAINT fn_bids_load_id_fkey FOREIGN KEY (load_id) REFERENCES public.fn_loads(id);


--
-- Name: fn_bids fn_bids_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fn_bids
    ADD CONSTRAINT fn_bids_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.fn_profiles(user_id);


--
-- Name: fn_bookings fn_bookings_load_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fn_bookings
    ADD CONSTRAINT fn_bookings_load_id_fkey FOREIGN KEY (load_id) REFERENCES public.fn_loads(id);


--
-- Name: fn_bookings fn_bookings_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fn_bookings
    ADD CONSTRAINT fn_bookings_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.fn_profiles(user_id);


--
-- Name: fn_documents fn_documents_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fn_documents
    ADD CONSTRAINT fn_documents_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.fn_profiles(user_id);


--
-- Name: fn_loads fn_loads_reserved_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fn_loads
    ADD CONSTRAINT fn_loads_reserved_by_fkey FOREIGN KEY (reserved_by) REFERENCES public.fn_profiles(user_id);


--
-- Name: fn_profiles fn_profiles_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fn_profiles
    ADD CONSTRAINT fn_profiles_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id);


--
-- Name: fn_requests fn_requests_load_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fn_requests
    ADD CONSTRAINT fn_requests_load_id_fkey FOREIGN KEY (load_id) REFERENCES public.fn_loads(id);


--
-- Name: fn_requests fn_requests_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fn_requests
    ADD CONSTRAINT fn_requests_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.fn_profiles(user_id);


--
-- Name: shipment_events shipment_events_shipment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.shipment_events
    ADD CONSTRAINT shipment_events_shipment_id_fkey FOREIGN KEY (shipment_id) REFERENCES public.shipments(shipment_id) ON DELETE CASCADE;


--
-- Name: fn_bids; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.fn_bids ENABLE ROW LEVEL SECURITY;

--
-- Name: fn_bookings; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.fn_bookings ENABLE ROW LEVEL SECURITY;

--
-- Name: fn_company_documents; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.fn_company_documents ENABLE ROW LEVEL SECURITY;

--
-- Name: fn_documents; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.fn_documents ENABLE ROW LEVEL SECURITY;

--
-- Name: fn_loads; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.fn_loads ENABLE ROW LEVEL SECURITY;

--
-- Name: fn_notifications; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.fn_notifications ENABLE ROW LEVEL SECURITY;

--
-- Name: fn_profiles; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.fn_profiles ENABLE ROW LEVEL SECURITY;

--
-- Name: fn_requests; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.fn_requests ENABLE ROW LEVEL SECURITY;

--
-- Name: loads; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.loads ENABLE ROW LEVEL SECURITY;

--
-- Name: ops_snapshots; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.ops_snapshots ENABLE ROW LEVEL SECURITY;

--
-- Name: portal_access_requests; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.portal_access_requests ENABLE ROW LEVEL SECURITY;

--
-- Name: shipment_events; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.shipment_events ENABLE ROW LEVEL SECURITY;

--
-- Name: shipments; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.shipments ENABLE ROW LEVEL SECURITY;

--
-- PostgreSQL database dump complete
--

\unrestrict 956oiD4RXbwoVegXoRcpXwHrblX8TXDquCerY6FOhd4TDL0FVFdgtRXZsybTRsg

