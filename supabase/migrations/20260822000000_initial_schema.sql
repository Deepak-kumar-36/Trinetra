-- TriNetra Database Schema

-- Enable necessary extensions
create extension if not exists "uuid-ossp";
create extension if not exists "postgis";

-- 1. ENUMS
create type incident_status as enum ('reported', 'prioritized', 'assigned', 'resolved', 'invalid');
create type mission_status as enum ('assigned', 'accepted', 'declined', 'en_route', 'blocked', 'arrived', 'completed', 'cancelled', 'reassigned', 'needs_backup');
create type user_role as enum ('citizen', 'volunteer', 'coordinator', 'admin');
create type urgency_band as enum ('critical', 'high', 'medium', 'low', 'unscored');

-- 2. USERS & PROFILES
create table public.users (
    id uuid references auth.users on delete cascade primary key,
    phone_number text unique,
    role user_role not null default 'citizen',
    full_name text,
    org_id uuid, -- Reference to organizations table (if created)
    created_at timestamptz default now()
);

-- 3. INCIDENTS
create table public.incidents (
    id uuid default gen_random_uuid() primary key,
    reporter_id uuid references public.users(id),
    status incident_status default 'reported',
    
    -- Extracted AI Data
    category text,
    people_affected integer default 1,
    vulnerabilities text[], -- e.g. ['child', 'elderly', 'medical']
    hazards text[], -- e.g. ['rising_water', 'fire']
    required_capabilities text[], -- e.g. ['boat', 'medical', 'heavy_lifting']
    raw_transcript text,
    confidence_flags jsonb, -- Field-level confidence scores
    
    -- Core Incident Info
    urgency_score numeric default 0,
    urgency_band urgency_band default 'unscored',
    urgency_breakdown jsonb, -- Itemized scoring factors
    location geography(point),
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- 4. RESPONDERS
create table public.responders (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references public.users(id) on delete cascade unique,
    
    -- Capabilities
    skills text[],
    vehicle_type text,
    equipment text[],
    cargo_capacity integer,
    languages text[],
    
    -- Status
    location geography(point),
    availability boolean default false,
    availability_until timestamptz,
    current_mission_id uuid, -- Foreign key added after missions table
    reliability_score numeric default 100,
    
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- 5. MISSIONS
create table public.missions (
    id uuid default gen_random_uuid() primary key,
    incident_id uuid references public.incidents(id) not null,
    responder_id uuid references public.responders(id) not null,
    assigned_by uuid references public.users(id), -- Coordinator who dispatched
    
    status mission_status default 'assigned',
    match_score numeric,
    match_reasoning jsonb,
    eta_minutes numeric,
    route jsonb,
    blocker_reason text,
    outcome jsonb,
    
    created_at timestamptz default now(),
    completed_at timestamptz
);

-- Add circular FK for responders' current mission
alter table public.responders 
add constraint fk_current_mission 
foreign key (current_mission_id) 
references public.missions(id) on delete set null;

-- 6. SHELTERS & RESOURCES
create table public.shelters (
    id uuid default gen_random_uuid() primary key,
    name text not null,
    location geography(point),
    total_capacity integer not null,
    available_capacity integer not null,
    reserved_capacity integer default 0,
    special_capabilities jsonb,
    org_id uuid,
    status text default 'open',
    created_at timestamptz default now()
);

create table public.resources (
    id uuid default gen_random_uuid() primary key,
    org_id uuid,
    type text not null, -- e.g. 'vehicle', 'medical_kit', 'food', 'water', 'blanket'
    name text not null,
    unit_count_total integer not null,
    unit_count_available integer not null,
    unit_count_reserved integer default 0,
    unit_count_deployed integer default 0,
    location geography(point),
    shelter_id uuid references public.shelters(id),
    created_at timestamptz default now()
);

-- 7. NOTIFICATIONS, TIMELINES, AUDIT LOGS
create table public.notifications (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references public.users(id) not null,
    type text not null,
    priority text default 'normal',
    related_incident_id uuid references public.incidents(id),
    related_mission_id uuid references public.missions(id),
    message text not null,
    requires_ack boolean default false,
    acknowledged_at timestamptz,
    created_at timestamptz default now()
);

create table public.incident_timeline (
    id uuid default gen_random_uuid() primary key,
    incident_id uuid references public.incidents(id) on delete cascade not null,
    event_type text not null,
    actor_id uuid references public.users(id),
    description text not null,
    metadata jsonb,
    created_at timestamptz default now()
);

create table public.audit_logs (
    id uuid default gen_random_uuid() primary key,
    actor_id uuid references public.users(id),
    org_id uuid,
    action text not null,
    target_type text not null, -- e.g. 'incident', 'mission'
    target_id uuid not null,
    before_value jsonb,
    after_value jsonb,
    reason text,
    created_at timestamptz default now()
);

-- 8. INDEXES
create index idx_incidents_priority on public.incidents(status, urgency_score desc);
create index idx_incidents_location on public.incidents using gist(location);
create index idx_responders_available on public.responders(availability, location) where availability = true;
create index idx_missions_status on public.missions(status, incident_id);
create index idx_notifications_unacked on public.notifications(user_id, acknowledged_at) where requires_ack = true;

-- 9. ROW LEVEL SECURITY (RLS) POLICIES
alter table public.incidents enable row level security;
alter table public.responders enable row level security;
alter table public.missions enable row level security;
alter table public.notifications enable row level security;

-- Citizens can read their own incidents
create policy "Citizens can read own incidents" on public.incidents
    for select using (auth.uid() = reporter_id);

-- Citizens can insert their own incidents
create policy "Citizens can insert own incidents" on public.incidents
    for insert with check (auth.uid() = reporter_id);

-- Volunteers can read missions assigned to them
create policy "Volunteers can read own missions" on public.missions
    for select using (
        responder_id in (select id from public.responders where user_id = auth.uid())
    );

-- Coordinators can read/write everything (simplified for MVP, org_id scope can be added later)
create policy "Coordinators have full access to incidents" on public.incidents
    for all using (
        exists (select 1 from public.users where id = auth.uid() and role = 'coordinator')
    );

create policy "Coordinators have full access to missions" on public.missions
    for all using (
        exists (select 1 from public.users where id = auth.uid() and role = 'coordinator')
    );

-- Audit logs are append-only
alter table public.audit_logs enable row level security;
create policy "Audit logs are append-only" on public.audit_logs
    for insert with check (true);
create policy "Audit logs are readable by coordinators" on public.audit_logs
    for select using (
        exists (select 1 from public.users where id = auth.uid() and role = 'coordinator')
    );
