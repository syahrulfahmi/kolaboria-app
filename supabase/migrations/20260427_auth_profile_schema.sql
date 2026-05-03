-- Create a trigger function to handle new user signups
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  base_username text;
  new_username text;
  counter integer := 1;
  username_exists boolean;
begin
  -- Generate base username from email or full name
  base_username := lower(split_part(new.email, '@', 1));
  
  -- Remove non-alphanumeric characters
  base_username := regexp_replace(base_username, '[^a-z0-9]', '', 'g');
  
  -- Ensure username is not empty
  if length(base_username) = 0 then
    base_username := 'user';
  end if;

  new_username := base_username;

  -- Check if username exists and loop until a unique one is found
  loop
    select exists(select 1 from public.profiles where username = new_username) into username_exists;
    if not username_exists then
      exit;
    end if;
    
    new_username := base_username || counter;
    counter := counter + 1;
  end loop;

  -- Insert into profiles table
  insert into public.profiles (
    id,
    username,
    full_name,
    avatar,
    is_verified,
    completion_score,
    created_at,
    updated_at
  )
  values (
    new.id,
    new_username,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url',
    false,
    0,
    now(),
    now()
  );
  
  return new;
end;
$$;

-- Create profiles table
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  username text unique not null,
  full_name text,
  account_type text check (account_type in ('talent', 'mentor', 'company')),
  system_role text check (system_role in ('user', 'admin')),
  avatar text,
  headline text,
  bio text,
  location text,
  availability_status text check (availability_status in ('available', 'busy', 'unavailable')),
  external_links jsonb default '{}'::jsonb,
  rating numeric(3,2) default 0,
  review_count integer default 0,
  completion_score integer default 0,
  is_verified boolean default false,
  last_active_at timestamp with time zone default now(),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create talent_profiles table
create table public.talent_profiles (
  user_id uuid references public.profiles(id) on delete cascade primary key,
  primary_skill text,
  experience_level text check (experience_level in ('Beginner', 'Intermediate', 'Advanced', 'Expert')),
  tools jsonb default '[]'::jsonb,
  goal text,
  project_count integer default 0,
  completed_projects integer default 0,
  contribution_score integer default 0
);

-- Create mentor_profiles table
create table public.mentor_profiles (
  user_id uuid references public.profiles(id) on delete cascade primary key,
  primary_expertise text,
  years_experience integer,
  specialization jsonb default '[]'::jsonb,
  goal text,
  mentee_count integer default 0,
  success_stories_count integer default 0,
  rating numeric(3,2) default 0,
  review_count integer default 0
);

-- Enable Row Level Security
alter table public.profiles enable row level security;
alter table public.talent_profiles enable row level security;
alter table public.mentor_profiles enable row level security;

-- Create policies for profiles
create policy "Public profiles are viewable by everyone."
  on public.profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on public.profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on public.profiles for update
  using ( auth.uid() = id );

-- Create policies for talent_profiles
create policy "Public talent profiles are viewable by everyone."
  on public.talent_profiles for select
  using ( true );

create policy "Users can insert their own talent profile."
  on public.talent_profiles for insert
  with check ( auth.uid() = user_id );

create policy "Users can update own talent profile."
  on public.talent_profiles for update
  using ( auth.uid() = user_id );

-- Create policies for mentor_profiles
create policy "Public mentor profiles are viewable by everyone."
  on public.mentor_profiles for select
  using ( true );

create policy "Users can insert their own mentor profile."
  on public.mentor_profiles for insert
  with check ( auth.uid() = user_id );

create policy "Users can update own mentor profile."
  on public.mentor_profiles for update
  using ( auth.uid() = user_id );

-- Create trigger for new auth user
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Trigger for updated_at on profiles
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger on_profiles_updated
  before update on public.profiles
  for each row execute procedure public.handle_updated_at();
