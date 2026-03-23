-- The Glases — Full Supabase Schema
-- Run this in your Supabase SQL editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Users (extends Supabase Auth)
create table public.users (
  id uuid primary key references auth.users on delete cascade,
  name text,
  phone text,
  address text,
  avatar_url text,
  role text default 'customer',
  created_at timestamp with time zone default now()
);

-- Categories
create table public.categories (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text unique not null,
  image text,
  created_at timestamp with time zone default now()
);

-- Products
create table public.products (
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
create table public.orders (
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
create table public.order_items (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid references public.orders(id) on delete cascade,
  product_id uuid references public.products(id),
  quantity int not null,
  price numeric not null
);

-- Reviews
create table public.reviews (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid references public.products(id) on delete cascade,
  user_id uuid references public.users(id),
  rating int check (rating between 1 and 5),
  comment text,
  created_at timestamp with time zone default now()
);

-- Coupons
create table public.coupons (
  id uuid primary key default uuid_generate_v4(),
  code text unique not null,
  discount int not null,
  active boolean default true,
  expires_at timestamp with time zone,
  created_at timestamp with time zone default now()
);

-- Row Level Security
alter table public.users enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.reviews enable row level security;
alter table public.categories enable row level security;
alter table public.coupons enable row level security;

-- Public read access for products and categories
create policy "Public can read products" on public.products for select using (true);
create policy "Public can read categories" on public.categories for select using (true);
create policy "Public can read reviews" on public.reviews for select using (true);

-- Authenticated user policies
create policy "Users can view own profile" on public.users for select using (auth.uid() = id);
create policy "Users can update own profile" on public.users for update using (auth.uid() = id);
create policy "Users can view own orders" on public.orders for select using (auth.uid() = user_id);
create policy "Users can create orders" on public.orders for insert with check (auth.uid() = user_id);
create policy "Users can view own order items" on public.order_items for select using (
  exists (select 1 from public.orders where orders.id = order_items.order_id and orders.user_id = auth.uid())
);
create policy "Users can create reviews" on public.reviews for insert with check (auth.uid() = user_id);
