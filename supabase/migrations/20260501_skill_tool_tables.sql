create extension if not exists "uuid-ossp";

-- Reset tables to prevent "already exists" errors during development
drop table if exists public.user_skills cascade;
drop table if exists public.user_tools cascade;
drop table if exists public.skills cascade;
drop table if exists public.tools cascade;

-- Create skills table
create table public.skills (
  id uuid primary key default uuid_generate_v4(),
  name text unique not null,
  slug text unique not null,
  category text,
  created_at timestamp default now()
);

-- Create tools table
create table public.tools (
  id uuid primary key default uuid_generate_v4(),
  name text unique not null,
  slug text unique not null,
  category text
);

-- Create user_skills table
create table public.user_skills (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade,
  skill_id uuid references public.skills(id) on delete cascade,
  is_primary boolean default false,
  created_at timestamp default now(),
  unique (user_id, skill_id)
);

-- Create constraint for one primary skill per user
create unique index one_primary_skill_per_user
on public.user_skills(user_id)
where is_primary = true;

-- Indexing for user_skills
create index idx_user_skills_user on public.user_skills(user_id);
create index idx_user_skills_skill on public.user_skills(skill_id);

-- Create user_tools table
create table public.user_tools (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade,
  tool_id uuid references public.tools(id) on delete cascade,
  created_at timestamp default now(),
  unique (user_id, tool_id)
);

-- Alter talent_profiles
alter table public.talent_profiles drop column if exists primary_skill;
alter table public.talent_profiles drop column if exists tools;

-- Enable Row Level Security
alter table public.skills enable row level security;
alter table public.tools enable row level security;
alter table public.user_skills enable row level security;
alter table public.user_tools enable row level security;

-- Policies for skills
create policy "Public skills are viewable by everyone."
  on public.skills for select
  using ( true );

-- Policies for tools
create policy "Public tools are viewable by everyone."
  on public.tools for select
  using ( true );

-- Policies for user_skills
create policy "Public user_skills are viewable by everyone."
  on public.user_skills for select
  using ( true );

create policy "Users can insert their own user_skills."
  on public.user_skills for insert
  with check ( auth.uid() = user_id );

create policy "Users can update own user_skills."
  on public.user_skills for update
  using ( auth.uid() = user_id );
  
create policy "Users can delete own user_skills."
  on public.user_skills for delete
  using ( auth.uid() = user_id );

-- Policies for user_tools
create policy "Public user_tools are viewable by everyone."
  on public.user_tools for select
  using ( true );

create policy "Users can insert their own user_tools."
  on public.user_tools for insert
  with check ( auth.uid() = user_id );

create policy "Users can update own user_tools."
  on public.user_tools for update
  using ( auth.uid() = user_id );

create policy "Users can delete own user_tools."
  on public.user_tools for delete
  using ( auth.uid() = user_id );

-- Seeders
insert into public.skills (id, name, slug, category) values
(uuid_generate_v4(), 'Frontend Developer', 'frontend-developer', 'Engineering'),
(uuid_generate_v4(), 'Backend Developer', 'backend-developer', 'Engineering'),
(uuid_generate_v4(), 'Fullstack Developer', 'fullstack-developer', 'Engineering'),
(uuid_generate_v4(), 'Mobile Developer', 'mobile-developer', 'Engineering'),
(uuid_generate_v4(), 'DevOps Engineer', 'devops-engineer', 'Engineering'),
(uuid_generate_v4(), 'Cybersecurity Specialist', 'cybersecurity-specialist', 'Engineering'),
(uuid_generate_v4(), 'Game Developer', 'game-developer', 'Engineering'),
(uuid_generate_v4(), 'AI Engineer', 'ai-engineer', 'AI & Data'),
(uuid_generate_v4(), 'Machine Learning Engineer', 'machine-learning-engineer', 'AI & Data'),
(uuid_generate_v4(), 'Data Scientist', 'data-scientist', 'AI & Data'),
(uuid_generate_v4(), 'Data Analyst', 'data-analyst', 'AI & Data'),
(uuid_generate_v4(), 'Data Engineer', 'data-engineer', 'AI & Data'),
(uuid_generate_v4(), 'UI/UX Designer', 'ui-ux-designer', 'Design'),
(uuid_generate_v4(), 'Product Designer', 'product-designer', 'Design'),
(uuid_generate_v4(), 'Motion Designer', 'motion-designer', 'Design'),
(uuid_generate_v4(), 'Brand Designer', 'brand-designer', 'Design'),
(uuid_generate_v4(), '3D Artist', '3d-artist', 'Design'),
(uuid_generate_v4(), 'Product Manager', 'product-manager', 'Product & Management'),
(uuid_generate_v4(), 'Project Manager', 'project-manager', 'Product & Management'),
(uuid_generate_v4(), 'Business Analyst', 'business-analyst', 'Product & Management'),
(uuid_generate_v4(), 'Scrum Master', 'scrum-master', 'Product & Management'),
(uuid_generate_v4(), 'Digital Marketer', 'digital-marketer', 'Marketing & Content'),
(uuid_generate_v4(), 'Content Creator', 'content-creator', 'Marketing & Content'),
(uuid_generate_v4(), 'Copywriter', 'copywriter', 'Marketing & Content'),
(uuid_generate_v4(), 'SEO Specialist', 'seo-specialist', 'Marketing & Content'),
(uuid_generate_v4(), 'Social Media Manager', 'social-media-manager', 'Marketing & Content'),
(uuid_generate_v4(), 'Technical Writer', 'technical-writer', 'Operations'),
(uuid_generate_v4(), 'QA Engineer', 'qa-engineer', 'Operations'),
(uuid_generate_v4(), 'Community Manager', 'community-manager', 'Operations')
on conflict (slug) do update set category = EXCLUDED.category;

insert into public.tools (id, name, slug, category) values
(uuid_generate_v4(), 'Vue', 'vue', 'Frontend'),
(uuid_generate_v4(), 'React', 'react', 'Frontend'),
(uuid_generate_v4(), 'Angular', 'angular', 'Frontend'),
(uuid_generate_v4(), 'Svelte', 'svelte', 'Frontend'),
(uuid_generate_v4(), 'Nuxt', 'nuxt', 'Frontend'),
(uuid_generate_v4(), 'Next.js', 'next-js', 'Frontend'),
(uuid_generate_v4(), 'Astro', 'astro', 'Frontend'),
(uuid_generate_v4(), 'Node.js', 'node-js', 'Backend'),
(uuid_generate_v4(), 'Express', 'express', 'Backend'),
(uuid_generate_v4(), 'NestJS', 'nestjs', 'Backend'),
(uuid_generate_v4(), 'Django', 'django', 'Backend'),
(uuid_generate_v4(), 'FastAPI', 'fastapi', 'Backend'),
(uuid_generate_v4(), 'Laravel', 'laravel', 'Backend'),
(uuid_generate_v4(), 'Spring Boot', 'spring-boot', 'Backend'),
(uuid_generate_v4(), 'Flutter', 'flutter', 'Mobile'),
(uuid_generate_v4(), 'React Native', 'react-native', 'Mobile'),
(uuid_generate_v4(), 'Swift', 'swift', 'Mobile'),
(uuid_generate_v4(), 'Kotlin', 'kotlin', 'Mobile'),
(uuid_generate_v4(), 'Docker', 'docker', 'DevOps'),
(uuid_generate_v4(), 'Kubernetes', 'kubernetes', 'DevOps'),
(uuid_generate_v4(), 'AWS', 'aws', 'DevOps'),
(uuid_generate_v4(), 'GCP', 'gcp', 'DevOps'),
(uuid_generate_v4(), 'Azure', 'azure', 'DevOps'),
(uuid_generate_v4(), 'Terraform', 'terraform', 'DevOps'),
(uuid_generate_v4(), 'GitHub Actions', 'github-actions', 'DevOps'),
(uuid_generate_v4(), 'PostgreSQL', 'postgresql', 'Database'),
(uuid_generate_v4(), 'MySQL', 'mysql', 'Database'),
(uuid_generate_v4(), 'MongoDB', 'mongodb', 'Database'),
(uuid_generate_v4(), 'Redis', 'redis', 'Database'),
(uuid_generate_v4(), 'Supabase', 'supabase', 'Database'),
(uuid_generate_v4(), 'Firebase', 'firebase', 'Database'),
(uuid_generate_v4(), 'Figma', 'figma', 'Design'),
(uuid_generate_v4(), 'Adobe XD', 'adobe-xd', 'Design'),
(uuid_generate_v4(), 'Framer', 'framer', 'Design'),
(uuid_generate_v4(), 'Webflow', 'webflow', 'Design'),
(uuid_generate_v4(), 'Canva', 'canva', 'Design'),
(uuid_generate_v4(), 'Illustrator', 'illustrator', 'Design'),
(uuid_generate_v4(), 'After Effects', 'after-effects', 'Design'),
(uuid_generate_v4(), 'Python', 'python', 'Data/AI'),
(uuid_generate_v4(), 'TensorFlow', 'tensorflow', 'Data/AI'),
(uuid_generate_v4(), 'PyTorch', 'pytorch', 'Data/AI'),
(uuid_generate_v4(), 'Tableau', 'tableau', 'Data/AI'),
(uuid_generate_v4(), 'Power BI', 'power-bi', 'Data/AI'),
(uuid_generate_v4(), 'Jupyter', 'jupyter', 'Data/AI'),
(uuid_generate_v4(), 'TypeScript', 'typescript', 'Languages'),
(uuid_generate_v4(), 'Go', 'go', 'Languages'),
(uuid_generate_v4(), 'Rust', 'rust', 'Languages'),
(uuid_generate_v4(), 'Java', 'java', 'Languages'),
(uuid_generate_v4(), 'PHP', 'php', 'Languages'),
(uuid_generate_v4(), 'C++', 'c++', 'Languages'),
(uuid_generate_v4(), 'Notion', 'notion', 'Productivity'),
(uuid_generate_v4(), 'Jira', 'jira', 'Productivity'),
(uuid_generate_v4(), 'Linear', 'linear', 'Productivity'),
(uuid_generate_v4(), 'Trello', 'trello', 'Productivity'),
(uuid_generate_v4(), 'Slack', 'slack', 'Productivity'),
(uuid_generate_v4(), 'Google Analytics', 'google-analytics', 'Marketing'),
(uuid_generate_v4(), 'HubSpot', 'hubspot', 'Marketing'),
(uuid_generate_v4(), 'Mailchimp', 'mailchimp', 'Marketing'),
(uuid_generate_v4(), 'Semrush', 'semrush', 'Marketing')
on conflict (slug) do update set category = EXCLUDED.category;

