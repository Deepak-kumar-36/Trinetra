-- Open up notifications table for the hackathon
create policy "Allow all read on notifications" on public.notifications for select using (true);
create policy "Allow all insert on notifications" on public.notifications for insert with check (true);
create policy "Allow all update on notifications" on public.notifications for update using (true);

-- Enable realtime for notifications
alter publication supabase_realtime add table public.notifications;
