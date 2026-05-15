-- Migration: 20260515_sync_verification_status.sql
-- Function to synchronize email_confirmed_at from auth.users to profiles.is_verified

create or replace function public.sync_user_verification()
returns trigger as $$
begin
  update public.profiles
  set
    is_verified = (new.email_confirmed_at is not null),
    updated_at = now()
  where id = new.id;

  return new;
end;
$$ language plpgsql security definer set search_path = public;

-- Drop trigger if exists to allow re-running
drop trigger if exists on_auth_user_verified on auth.users;

-- Create trigger on auth.users
create trigger on_auth_user_verified
after update on auth.users
for each row
execute function public.sync_user_verification();

-- Initial sync for existing users (optional, but good practice)
update public.profiles p
set 
  is_verified = (u.email_confirmed_at is not null),
  updated_at = now()
from auth.users u
where p.id = u.id and p.is_verified is distinct from (u.email_confirmed_at is not null);
