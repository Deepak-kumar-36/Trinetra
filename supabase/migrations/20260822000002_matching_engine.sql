-- Matching & Urgency Engine Postgres Functions

-- 1. Calculate Urgency Score
create or replace function public.calculate_urgency(p_incident_id uuid)
returns numeric
language plpgsql
security definer
as $$
declare
  v_score numeric := 0;
  v_incident record;
  v_vulnerability_count int := 0;
  v_hazard_count int := 0;
  v_is_medical boolean := false;
  v_severity text;
  v_band public.urgency_band;
  v_breakdown jsonb := '[]'::jsonb;
begin
  -- Fetch the incident data
  select * into v_incident
  from public.incidents
  where id = p_incident_id;

  if not found then
    return 0;
  end if;

  -- 1. Base Severity (mapped from raw_transcript or AI tags, but for MVP we use 'status' or assume severity from tags)
  -- The AI extracts 'Critical', 'High', 'Medium', 'Low' but we don't have a specific severity column in the schema.
  -- We'll check if 'Critical' is in hazards or vulnerabilities, or check the category.
  -- Actually, let's just use people_affected as a base multiplier for MVP.
  v_score := v_score + (coalesce(v_incident.people_affected, 1) * 10);
  v_breakdown := v_breakdown || jsonb_build_object('reason', format('%s people affected (+%s)', coalesce(v_incident.people_affected, 1), coalesce(v_incident.people_affected, 1) * 10));

  -- 2. Medical needs
  if 'medical' = any(v_incident.required_capabilities) or 'medical' = any(v_incident.vulnerabilities) then
    v_score := v_score + 20;
    v_breakdown := v_breakdown || '{"reason": "Medical attention required (+20)"}'::jsonb;
  end if;

  -- 3. Vulnerabilities
  if array_length(v_incident.vulnerabilities, 1) > 0 then
    v_vulnerability_count := array_length(v_incident.vulnerabilities, 1);
    v_score := v_score + (v_vulnerability_count * 5);
    v_breakdown := v_breakdown || jsonb_build_object('reason', format('Vulnerabilities present: %s (+%s)', array_to_string(v_incident.vulnerabilities, ', '), v_vulnerability_count * 5));
  end if;

  -- 4. Hazards
  if array_length(v_incident.hazards, 1) > 0 then
    v_hazard_count := array_length(v_incident.hazards, 1);
    v_score := v_score + (v_hazard_count * 10);
    v_breakdown := v_breakdown || jsonb_build_object('reason', format('Hazards present: %s (+%s)', array_to_string(v_incident.hazards, ', '), v_hazard_count * 10));
  end if;

  -- Cap at 100
  if v_score > 100 then
    v_score := 100;
  end if;

  -- Determine Band
  if v_score >= 80 then
    v_band := 'critical';
  elsif v_score >= 50 then
    v_band := 'high';
  elsif v_score >= 20 then
    v_band := 'medium';
  else
    v_band := 'low';
  end if;

  -- Update the incident
  update public.incidents
  set urgency_score = v_score,
      urgency_band = v_band,
      urgency_breakdown = v_breakdown
  where id = p_incident_id;

  return v_score;
end;
$$;


-- 2. Get Recommended Responders (The Dispatch Algorithm)
create type public.recommended_responder as (
  responder_id uuid,
  user_id uuid,
  full_name text,
  distance_meters numeric,
  eta_minutes numeric,
  match_score numeric,
  missing_capabilities text[]
);

create or replace function public.get_recommended_responders(p_incident_id uuid)
returns setof public.recommended_responder
language plpgsql
security definer
as $$
declare
  v_incident record;
begin
  -- Fetch the incident location and required capabilities
  select location, required_capabilities into v_incident
  from public.incidents
  where id = p_incident_id;

  if not found or v_incident.location is null then
    return;
  end if;

  -- Return the ranked list of responders
  return query
  with responder_data as (
    select 
      r.id as responder_id,
      r.user_id,
      u.full_name,
      r.location,
      -- Combine skills, equipment, and vehicle_type into a single text array for hard-constraint checking
      array_cat(
        coalesce(r.skills, '{}'::text[]), 
        array_cat(coalesce(r.equipment, '{}'::text[]), array[r.vehicle_type])
      ) as all_capabilities
    from public.responders r
    join public.users u on u.id = r.user_id
    where r.availability = true 
      and r.current_mission_id is null
      and r.location is not null
  ),
  analyzed_responders as (
    select
      rd.responder_id,
      rd.user_id,
      rd.full_name,
      ST_Distance(rd.location, v_incident.location) as distance_meters,
      
      -- Find any required capabilities the responder is missing
      (
        select array_agg(req)
        from unnest(coalesce(v_incident.required_capabilities, '{}'::text[])) as req
        where req != all(rd.all_capabilities)
      ) as missing_capabilities
    from responder_data rd
  )
  select
    ar.responder_id,
    ar.user_id,
    ar.full_name,
    ar.distance_meters,
    
    -- Mock ETA: 1 minute per 500 meters + 2 minutes base
    round((ar.distance_meters / 500) + 2) as eta_minutes,
    
    -- Match Score calculation
    case 
      when array_length(ar.missing_capabilities, 1) is not null then 0.0 -- Hard constraint failed
      else greatest(100.0 - (ar.distance_meters / 100), 10.0) -- Soft rank by distance (closer is closer to 100)
    end as match_score,
    
    coalesce(ar.missing_capabilities, '{}'::text[]) as missing_capabilities
  from analyzed_responders ar
  order by 
    (case when array_length(ar.missing_capabilities, 1) is null then 0 else 1 end) asc, -- Valid first
    ar.distance_meters asc -- Then by closest
  limit 10;

end;
$$;
