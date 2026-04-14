-- Seed Data for The Glases (Deduplicated - Clean Data)

-- Categories (Unique by slug)
insert into public.categories (name, slug, image) values
  ('Blue Light', 'blue-light', 'https://images.unsplash.com/photo-1509695507497-903c140c43b0?auto=format&fit=crop&q=80&w=400'),
  ('Sunglasses', 'sunglasses', 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=400'),
  ('Aviators', 'aviators', 'https://images.unsplash.com/photo-1473496169904-658ba7574b0d?auto=format&fit=crop&q=80&w=400'),
  ('Fashion', 'fashion', 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&q=80&w=400'),
  ('UV Protection', 'uv-protection', 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80&w=400')
on conflict (slug) do nothing;

-- Products (Unique by slug - NO DUPLICATES)
insert into public.products (name, slug, category, price, discount, stock, image_url, description, is_featured) values
  ('Clear Blue Pro', 'clear-blue-pro', 'Blue Light', 2500, 0, 50, '/images/bluelight.png', 'Premium blue light blocking glasses for extended screen use.', true),
  ('Midnight Aviator', 'midnight-aviator', 'Sunglasses', 3200, 10, 30, '/images/hero_glasses.png', 'Classic aviator frames with UV400 protection.', true),
  ('Classic Round', 'classic-round', 'Fashion', 1800, 0, 60, '/images/round.png', 'Timeless round frames for a retro-chic look.', true),
  ('Urban Edge', 'urban-edge', 'UV Protection', 2800, 5, 40, '/images/sunglasses.png', 'Modern angular frames with full UV protection.', true),
  ('Gold Aviator', 'gold-aviator', 'Aviators', 3500, 0, 20, '/images/hero_glasses.png', 'Gold-tinted premium aviator style glasses.', true),
  ('Cat Eye Rose', 'cat-eye-rose', 'Fashion', 2200, 0, 35, '/images/fashion.png', 'Elegant cat-eye rose gold frames for a bold look.', false)
on conflict (slug) do nothing;

-- Coupons (Unique by code - NO DUPLICATES)
insert into public.coupons (code, discount, active) values
  ('WELCOME10', 10, true),
  ('SUMMER20', 20, true),
  ('BANK10', 10, true)
on conflict (code) do nothing;
