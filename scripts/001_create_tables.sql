-- Users table
create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  name text not null,
  user_type text not null check (user_type in ('user', 'organization', 'contributor')),
  organization_name text,
  verified boolean default false,
  verification_image text,
  latitude decimal(10, 8),
  longitude decimal(11, 8),
  created_at timestamp with time zone default now()
);

-- Devices table
create table if not exists devices (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type text not null,
  condition text not null check (condition in ('excellent', 'good', 'fair')),
  description text not null,
  image_url text,
  contributor_id uuid not null references users(id) on delete cascade,
  latitude decimal(10, 8),
  longitude decimal(11, 8),
  available boolean default true,
  created_at timestamp with time zone default now()
);

-- Device requests table
create table if not exists device_requests (
  id uuid primary key default gen_random_uuid(),
  device_id uuid not null references devices(id) on delete cascade,
  user_id uuid not null references users(id) on delete cascade,
  request_description text not null,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  user_verified boolean default false,
  created_at timestamp with time zone default now()
);

-- Reports table
create table if not exists reports (
  id uuid primary key default gen_random_uuid(),
  device_id uuid not null references devices(id) on delete cascade,
  reporter_id uuid not null references users(id) on delete cascade,
  reason text not null,
  description text,
  report_type text not null check (report_type in ('inappropriate', 'damaged', 'fraud', 'other')),
  status text default 'open' check (status in ('open', 'reviewing', 'resolved')),
  created_at timestamp with time zone default now()
);

-- Enable RLS
alter table users enable row level security;
alter table devices enable row level security;
alter table device_requests enable row level security;
alter table reports enable row level security;

-- Users policies
create policy "users_select_own" on users for select using (true);
create policy "users_insert_own" on users for insert with check (true);
create policy "users_update_own" on users for update using (true);

-- Devices policies
create policy "devices_select" on devices for select using (true);
create policy "devices_insert_contributor" on devices for insert with check (true);
create policy "devices_update_own" on devices for update using (true);
create policy "devices_delete_own" on devices for delete using (true);

-- Device requests policies
create policy "requests_select_user" on device_requests for select using (true);
create policy "requests_insert" on device_requests for insert with check (true);
create policy "requests_update" on device_requests for update using (true);

-- Reports policies
create policy "reports_select" on reports for select using (true);
create policy "reports_insert" on reports for insert with check (true);
create policy "reports_update" on reports for update using (true);
