-- TriNetra Seed Data Script for Hackathon Demo (§36)
-- Run this AFTER schema.sql

-- 1. Create a demo coordinator user
insert into auth.users (id, email) values ('00000000-0000-0000-0000-000000000001', 'coordinator@trinetra.demo');
insert into public.users (id, role, full_name) values ('00000000-0000-0000-0000-000000000001', 'coordinator', 'Demo Coordinator');

-- 2. Responders (§36)
-- We need 5 users for the 5 responders
insert into auth.users (id, email) values 
  ('11111111-0000-0000-0000-000000000001', 'ravi@demo'),
  ('11111111-0000-0000-0000-000000000002', 'river@demo'),
  ('11111111-0000-0000-0000-000000000003', 'delivery@demo'),
  ('11111111-0000-0000-0000-000000000004', 'backup@demo'),
  ('11111111-0000-0000-0000-000000000005', 'medic@demo');

insert into public.users (id, role, full_name) values 
  ('11111111-0000-0000-0000-000000000001', 'volunteer', 'Ravi'),
  ('11111111-0000-0000-0000-000000000002', 'volunteer', 'River Rescue Team'),
  ('11111111-0000-0000-0000-000000000003', 'volunteer', 'Delivery Crew'),
  ('11111111-0000-0000-0000-000000000004', 'volunteer', 'Backup Rescue Team'),
  ('11111111-0000-0000-0000-000000000005', 'volunteer', 'Medic Team');

insert into public.responders (user_id, skills, vehicle_type, equipment, cargo_capacity, availability, location) values
  -- Responder A: Ravi (5 min away but no boat)
  ('11111111-0000-0000-0000-000000000001', array['first_aid'], 'motorcycle', array['first_aid_kit'], 2, true, ST_SetSRID(ST_MakePoint(77.2090, 28.6139), 4326)),
  -- Responder B: River Rescue Team (12 min away, has boat, the recommended one)
  ('11111111-0000-0000-0000-000000000002', array['water_rescue', 'first_aid'], 'boat', array['rescue_boat', 'life_jackets', 'first_aid_kit'], 6, true, ST_SetSRID(ST_MakePoint(77.2100, 28.6150), 4326)),
  -- Responder C: Delivery Crew
  ('11111111-0000-0000-0000-000000000003', array['food_delivery', 'driving'], 'van', array[], 20, true, ST_SetSRID(ST_MakePoint(77.2150, 28.6100), 4326)),
  -- Responder D: Backup Rescue Team (Alternate for reassignment demo)
  ('11111111-0000-0000-0000-000000000004', array['water_rescue'], 'boat', array['life_jackets'], 4, true, ST_SetSRID(ST_MakePoint(77.2200, 28.6200), 4326)),
  -- Responder E: Medic Team (Seeded as UNAVAILABLE)
  ('11111111-0000-0000-0000-000000000005', array['medical', 'first_aid'], 'ambulance', array['medical_kit', 'oxygen'], 2, false, ST_SetSRID(ST_MakePoint(77.2000, 28.6000), 4326));

-- 3. Shelters & Resources (§36)
insert into public.shelters (name, total_capacity, available_capacity, special_capabilities, location) values
  ('Community Hall Shelter', 40, 15, '{"medical_support": true}', ST_SetSRID(ST_MakePoint(77.2250, 28.6250), 4326)),
  ('School Ground Shelter', 60, 60, '{"pet_friendly": true}', ST_SetSRID(ST_MakePoint(77.2300, 28.6300), 4326));

-- Supply Hubs (Mocked as resources without shelter_id for now)
insert into public.resources (type, name, unit_count_total, unit_count_available, location) values
  ('food', 'District Supply Hub - Food Packets', 500, 500, ST_SetSRID(ST_MakePoint(77.2400, 28.6400), 4326)),
  ('blanket', 'Riverside Supply Hub - Blankets', 200, 200, ST_SetSRID(ST_MakePoint(77.2500, 28.6500), 4326)),
  ('water', 'Riverside Supply Hub - Water', 300, 300, ST_SetSRID(ST_MakePoint(77.2500, 28.6500), 4326));

-- 4. Seed Incidents
-- R-102: Medium/Low
insert into public.incidents (id, raw_transcript, category, required_capabilities, urgency_score, urgency_band, status, location) values
  ('22222222-0000-0000-0000-000000000102', 'Shelter needs 30 food packets.', 'resource_delivery', array['van'], 35, 'medium', 'prioritized', ST_SetSRID(ST_MakePoint(77.2100, 28.6100), 4326));

-- R-103: Low
insert into public.incidents (id, raw_transcript, category, required_capabilities, urgency_score, urgency_band, status, location) values
  ('22222222-0000-0000-0000-000000000103', 'Family needs drinking water but is currently safe indoors.', 'supply_need', array[], 15, 'low', 'prioritized', ST_SetSRID(ST_MakePoint(77.2150, 28.6150), 4326));

-- Note: R-101 will be created LIVE during the demo!
