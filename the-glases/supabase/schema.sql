-- The Glases — Full Supabase Schema (100% IDEMPOTENT/RE-RUNNABLE)
-- Run this in your Supabase SQL editor without fear of "already exists" errors!

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Users (extends Supabase Auth)
create table if not exists public.users (
  id uuid primary key references auth.users on delete cascade,
  email text,
  name text,
  phone text,
  address text,
  avatar_url text,
  role text default 'customer',
  created_at timestamp with time zone default now()
);

-- Categories
create table if not exists public.categories (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text unique not null,
  image text,
  created_at timestamp with time zone default now()
);

-- Products
create table if not exists public.products (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text unique not null,
  category_id uuid references public.categories(id),
  category text,
  price numeric not null,
  discount numeric default 0,
  stock int default 0,
  image_url text,
  gallery jsonb default '[]',
  description text,
  is_featured boolean default false,
  created_at timestamp with time zone default now()
);

-- Orders
create table if not exists public.orders (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.users(id),
  total numeric not null,
  status text default 'pending',
  payment_method text default 'cod',
  shipping_address text,
  coupon_code text,
  discount_applied numeric default 0,
  created_at timestamp with time zone default now()
);

-- Order Items
create table if not exists public.order_items (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid references public.orders(id) on delete cascade,
  product_id uuid references public.products(id),
  quantity int not null,
  price numeric not null
);

-- Reviews
create table if not exists public.reviews (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid references public.products(id) on delete cascade,
  user_id uuid references public.users(id),
  rating int check (rating between 1 and 5),
  comment text,
  created_at timestamp with time zone default now()
);

-- Coupons
create table if not exists public.coupons (
  id uuid primary key default uuid_generate_v4(),
  code text unique not null,
  discount int not null,
  active boolean default true,
  expires_at timestamp with time zone,
  created_at timestamp with time zone default now()
);

-- ============================================
-- TRY-ON FRAMES (The missing 'glasses' table to fix 404s)
-- ============================================
create table if not exists public.glasses (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  category text,
  image_url text not null,
  created_at timestamp with time zone default now()
);

-- ============================================
-- Try-On Sessions
-- ============================================
create table if not exists public.tryon_sessions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete set null,
  glasses_id text not null,
  glasses_label text,
  glasses_size int default 180,
  glasses_rotation int default 0,
  glasses_opacity numeric default 1,
  preview_url text,
  created_at timestamp with time zone default now()
);

-- Row Level Security Toggles (safe to run multiple times)
alter table public.users enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.reviews enable row level security;
alter table public.categories enable row level security;
alter table public.coupons enable row level security;
alter table public.tryon_sessions enable row level security;

-- DROP EXISTING POLICIES TO PREVENT COLLISION ERRORS
drop policy if exists "Public can read products" on public.products;
drop policy if exists "Public can read categories" on public.categories;
drop policy if exists "Public can read reviews" on public.reviews;
drop policy if exists "Users can view own profile" on public.users;
drop policy if exists "Users can update own profile" on public.users;
drop policy if exists "Allow insert for authenticated users" on public.users;
drop policy if exists "Users can view own orders" on public.orders;
drop policy if exists "Users can create orders" on public.orders;
drop policy if exists "Users can view own order items" on public.order_items;
drop policy if exists "Users can create reviews" on public.reviews;
drop policy if exists "Anyone can insert tryon session" on public.tryon_sessions;
drop policy if exists "Users can read own tryon sessions" on public.tryon_sessions;
drop policy if exists "Users can delete own tryon sessions" on public.tryon_sessions;
drop policy if exists "Allow all inserts" on public.products;
drop policy if exists "Allow all deletes" on public.products;
drop policy if exists "Allow all updates" on public.products;
drop policy if exists "Allow all inserts orders" on public.orders;
drop policy if exists "Allow all inserts order_items" on public.order_items;
drop policy if exists "Allow all updates orders" on public.orders;

-- ============================================
-- RE-CREATE CLEAN POLICIES
-- ============================================

-- Public read access for products and categories
create policy "Public can read products" on public.products for select using (true);
create policy "Public can read categories" on public.categories for select using (true);
create policy "Public can read reviews" on public.reviews for select using (true);

-- Authenticated user policies
create policy "Users can view own profile" on public.users for select using (auth.uid() = id);
create policy "Users can update own profile" on public.users for update using (auth.uid() = id);
create policy "Allow insert for all" on public.users for insert with check (auth.uid() = id);

create policy "Users can view own orders" on public.orders for select using (auth.uid() = user_id);
create policy "Users can create orders" on public.orders for insert with check (auth.uid() = user_id);
create policy "Users can view own order items" on public.order_items for select using (
  exists (select 1 from public.orders where orders.id = order_items.order_id and orders.user_id = auth.uid())
);
create policy "Users can create reviews" on public.reviews for insert with check (auth.uid() = user_id);

-- TryOn Session policies
create policy "Anyone can insert tryon session" on public.tryon_sessions for insert with check (true);
create policy "Users can read own tryon sessions" on public.tryon_sessions for select using (auth.uid() = user_id);
create policy "Users can delete own tryon sessions" on public.tryon_sessions for delete using (auth.uid() = user_id);

-- DROP EXISTING POLICIES TO PREVENT COLLISION ERRORS
drop policy if exists "Allow all inserts" on public.products;
drop policy if exists "Allow all deletes" on public.products;
drop policy if exists "Allow all updates" on public.products;
drop policy if exists "Allow all inserts orders" on public.orders;
drop policy if exists "Allow all inserts order_items" on public.order_items;
drop policy if exists "Allow all updates orders" on public.orders;

-- RE-CREATE CLEAN POLICIES
create policy "Allow all inserts" on public.products for insert with check (true);
create policy "Allow all deletes" on public.products for delete using (true);
create policy "Allow all updates" on public.products for update using (true);
create policy "Allow all inserts orders" on public.orders for insert with check (true);
create policy "Allow all inserts order_items" on public.order_items for insert with check (true);
create policy "Allow all updates orders" on public.orders for update using (true);

-- ============================================
-- Storage Automation: Create 'IImages' Bucket
-- ============================================
-- Instantly creates the 'IImages' bucket if it does not exist
insert into storage.buckets (id, name, public) 
values ('IImages', 'IImages', true) 
on conflict (id) do nothing;

-- Drop and recreate exact 3 security policies demanded by your connection code:
drop policy if exists "Public Access IImages" on storage.objects;
drop policy if exists "Allow Uploads IImages" on storage.objects;
drop policy if exists "Allow Deletions IImages" on storage.objects;

create policy "Public Access IImages" on storage.objects for select using ( bucket_id = 'IImages' );
create policy "Allow Uploads IImages" on storage.objects for insert with check ( bucket_id = 'IImages' );
create policy "Allow Deletions IImages" on storage.objects for delete using ( bucket_id = 'IImages' );

-- ============================================
-- TryOn Previews Bucket
-- ============================================
insert into storage.buckets (id, name, public) 
values ('tryon-previews', 'tryon-previews', true) 
on conflict (id) do nothing;

create policy "Public Access TryOn" on storage.objects for select using ( bucket_id = 'tryon-previews' );
create policy "Allow Uploads TryOn" on storage.objects for insert with check ( bucket_id = 'tryon-previews' );
create policy "Allow Deletions TryOn" on storage.objects for delete using ( bucket_id = 'tryon-previews' );
