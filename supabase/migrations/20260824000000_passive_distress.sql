-- Passive Distress Detection Schema Updates

-- Add trigger_source enum
create type trigger_source as enum ('manual', 'voice_keyword_auto');

-- Add trigger_source and trigger_confirmed to incidents
alter table public.incidents 
add column trigger_source trigger_source default 'manual',
add column trigger_confirmed boolean;

-- Add distress_detection_enabled to users
alter table public.users 
add column distress_detection_enabled boolean default false;
