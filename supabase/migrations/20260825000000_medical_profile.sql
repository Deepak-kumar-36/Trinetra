create table public.medical_profiles (
  user_id uuid references public.users(id) on delete cascade primary key,
  blood_type text,
  allergies text,
  medical_conditions text,
  emergency_contact text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.medical_profiles enable row level security;

create policy "Users can view own medical profile" on public.medical_profiles
  for select using (auth.uid() = user_id);

create policy "Users can insert own medical profile" on public.medical_profiles
  for insert with check (auth.uid() = user_id);

create policy "Users can update own medical profile" on public.medical_profiles
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
