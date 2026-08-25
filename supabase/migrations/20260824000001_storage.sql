-- 20260824000001_storage.sql
-- Create the incident_audio bucket and policies

insert into storage.buckets (id, name, public) 
values ('incident_audio', 'incident_audio', true)
on conflict (id) do nothing;

create policy "Public Access"
  on storage.objects for select
  using ( bucket_id = 'incident_audio' );

create policy "Authenticated users can upload"
  on storage.objects for insert
  with check (
    bucket_id = 'incident_audio' 
    and auth.role() = 'authenticated'
  );
