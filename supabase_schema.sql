-- Please COPY AND PASTE this entirely into the Supabase SQL Editor and run it

DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS testimonials CASCADE;
DROP TABLE IF EXISTS gallery CASCADE;
DROP TABLE IF EXISTS inquiries CASCADE;
DROP TABLE IF EXISTS packages CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- Profiles Table
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  name text,
  email text,
  role text default 'user',
  join_date timestamp with time zone default now()
);

-- Packages Table
create table packages (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  location text,
  duration text,
  price numeric,
  "originalPrice" numeric,
  image text,
  category text,
  rating numeric,
  reviews integer,
  description text,
  itinerary jsonb,
  inclusions text[],
  exclusions text[],
  gallery text[],
  video text,
  created_at timestamp with time zone default now()
);

-- Bookings Table
create table bookings (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade,
  user_name text,
  user_email text,
  package_id text,
  package_title text,
  date text,
  travelers integer,
  total_amount numeric,
  status text default 'pending',
  is_fake_name boolean default false,
  created_at timestamp with time zone default now()
);

-- Inquiries Table
create table inquiries (
  id uuid default gen_random_uuid() primary key,
  name text,
  email text,
  phone text,
  subject text,
  message text,
  date timestamp with time zone default now()
);

-- Gallery Table
create table gallery (
  id uuid default gen_random_uuid() primary key,
  type text,
  url text,
  title text,
  created_at timestamp with time zone default now()
);

-- Testimonials Table
create table testimonials (
  id uuid default gen_random_uuid() primary key,
  name text,
  role text,
  content text,
  avatar text,
  created_at timestamp with time zone default now()
);

-- RLS POLICIES --

-- Enable RLS
alter table profiles enable row level security;
alter table packages enable row level security;
alter table bookings enable row level security;
alter table inquiries enable row level security;
alter table gallery enable row level security;
alter table testimonials enable row level security;

-- Profiles Policies
create policy "Public profiles are viewable by everyone" on profiles for select using (true);
create policy "Users can insert own profile" on profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);

-- Packages Policies
create policy "Packages are viewable by everyone" on packages for select using (true);
create policy "Only admins can modify packages" on packages for all using (
  exists (
    select 1 from profiles
    where profiles.id = auth.uid() and profiles.role = 'admin'
  )
);

-- Bookings Policies
create policy "Users can view own bookings" on bookings for select using (
  auth.uid() = user_id or 
  exists (
    select 1 from profiles
    where profiles.id = auth.uid() and profiles.role = 'admin'
  )
);
create policy "Users can insert own bookings" on bookings for insert with check (auth.uid() = user_id);
create policy "Users can update own bookings to cancel" on bookings for update using (
  auth.uid() = user_id or
  exists (
    select 1 from profiles
    where profiles.id = auth.uid() and profiles.role = 'admin'
  )
);

-- Inquiries Policies
create policy "Anyone can insert inquiries" on inquiries for insert with check (true);
create policy "Only admins can view/delete inquiries" on inquiries for all using (
  exists (
    select 1 from profiles
    where profiles.id = auth.uid() and profiles.role = 'admin'
  )
);

-- Gallery Policies
create policy "Gallery viewable by everyone" on gallery for select using (true);
create policy "Only admins can modify gallery" on gallery for all using (
  exists (
    select 1 from profiles
    where profiles.id = auth.uid() and profiles.role = 'admin'
  )
);

-- Testimonials Policies
create policy "Testimonials viewable by everyone" on testimonials for select using (true);
create policy "Only admins can modify testimonials" on testimonials for all using (
  exists (
    select 1 from profiles
    where profiles.id = auth.uid() and profiles.role = 'admin'
  )
);
