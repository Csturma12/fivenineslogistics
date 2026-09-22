-- Website database only: pzupanvsfrgudoghpjpq. Deploy the email renderer first.
-- Replace the existing function in place; no data deletion or grant expansion.
begin;
create or replace function public.fn_bid_action(p_actor uuid,p_staff boolean,p_action text,p_load uuid,p_amount numeric default null,p_note text default '',p_bid uuid default null,p_version integer default null)
returns uuid language plpgsql security invoker set search_path=public,pg_temp as $$
declare l fn_loads; b fn_bids; p fn_profiles; winner uuid; price numeric; result uuid; origin text; snapshot jsonb;
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
  -- Snapshot only operational fields; never serialize entire load/profile records.
  snapshot:=jsonb_build_object('template','fn_carrier_summary_v1','submitted_at',now(),
    'load_reference',l.external_id,'origin',l.origin_city||', '||l.origin_state,
    'destination',l.dest_city||', '||l.dest_state,'pickup_date',l.pickup_date,
    'delivery_date',l.delivery_date,'equipment',l.equipment,'weight_lbs',l.weight_lbs,'dimensions',l.dimensions);
  -- For staff acceptance the carrier is the bid owner, not the signed-in staff member.
  if p_action='accept' then
    select profile.* into p from fn_profiles profile join fn_bids bid on bid.user_id=profile.user_id
      where bid.id=p_bid and bid.load_id=p_load for update of profile;
  end if;
  snapshot:=snapshot||jsonb_build_object('company',p.company,'email',p.email,
    'contact',p.details->>'contact','phone',p.details->>'phone','address',p.details->>'address',
    'mc',p.details->>'mc','dot',p.details->>'dot','profile_status',p.status,'highway_status',p.highway_status,
    'insurance_company',p.details->>'insurance_company','insurance_expiry',p.details->>'insurance_expiry',
    'factoring',p.details->>'factoring','factor_name',p.details->>'factor_name');
  if p_action='submit' then
    if p_amount is null or p_amount<=0 or p_amount>1000000 then raise exception 'Invalid bid amount'; end if;
    insert into fn_bids(load_id,user_id,amount,note) values(p_load,p_actor,p_amount,p_note)
    on conflict(load_id,user_id) do update set amount=excluded.amount,note=excluded.note,status='submitted',counter_amount=null,version=fn_bids.version+1,updated_at=now()
    returning id into result;
    insert into fn_notifications(recipient,subject,detail) values('sturma@blbxcritical.com','New carrier bid',
      (snapshot||jsonb_build_object('reference',result,'amount',p_amount,'source','bid','state','bid_submitted','note',p_note))::text);
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
  insert into fn_notifications(recipient,subject,detail) values('sturma@blbxcritical.com','Carrier reservation - dispatch action required',
    (snapshot||jsonb_build_object('reference',result,'amount',price,'source',origin,'state','awaiting_dispatch','note',case when origin='auto_book' then p_note else b.note end))::text);
  insert into fn_notifications(recipient,subject,detail) values(p.email,'Load reserved - awaiting dispatch','Your load reservation was received. Dispatch will confirm assignment and send the rate confirmation.');
  return result;
end $$;
commit;
