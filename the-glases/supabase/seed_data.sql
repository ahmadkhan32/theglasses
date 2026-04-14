-- Directly seed Pre-requisite Categories
INSERT INTO public.categories (name, slug, image)
VALUES 
  ('Aviator', 'aviator', '/glasses/aviator.png'),
  ('Rectangular', 'rectangular', '/glasses/aviator.png'),
  ('Round', 'round', '/glasses/aviator.png'),
  ('Wayfarer', 'wayfarer', '/glasses/aviator.png'),
  ('Geometric', 'geometric', '/glasses/aviator.png'),
  ('Cat Eye', 'cat-eye', '/glasses/aviator.png'),
  ('Square', 'square', '/glasses/aviator.png'),
  ('Sports', 'sports', '/glasses/aviator.png'),
  ('Browline', 'browline', '/glasses/aviator.png'),
  ('Novelty', 'novelty', '/glasses/aviator.png'),
  ('Oval', 'oval', '/glasses/aviator.png')
ON CONFLICT (slug) DO NOTHING;

-- Directly seed 20 Premium Glasses into your Database (Bypassing external RLS)
-- NOTE: Uses a subquery to map the category_id correctly from the categories table
INSERT INTO public.products (name, slug, price, category, category_id, image_url, is_featured) 
SELECT 
  p.name, p.slug, p.price, p.category, c.id, p.image_url, p.is_featured
FROM (
  VALUES 
    ('Classic Aviator Gold', 'classic-aviator-gold', 3500, 'Aviator', '/glasses/aviator.png', true),
    ('Midnight Black Aviator', 'midnight-black-aviator', 3200, 'Aviator', '/glasses/aviator.png', false),
    ('Silver Rimless Rectangular', 'silver-rimless-rectangular', 4100, 'Rectangular', '/glasses/aviator.png', true),
    ('Vintage Round Tortoise', 'vintage-round-tortoise', 2800, 'Round', '/glasses/aviator.png', true),
    ('Matte Black Wayfarer', 'matte-black-wayfarer', 2500, 'Wayfarer', '/glasses/aviator.png', false),
    ('Blue Tinted Hexagon', 'blue-tinted-hexagon', 3900, 'Geometric', '/glasses/aviator.png', false),
    ('Rose Gold Cat Eye', 'rose-gold-cat-eye', 4500, 'Cat Eye', '/glasses/aviator.png', true),
    ('Transparent Clear Frame', 'transparent-clear-frame', 2900, 'Square', '/glasses/aviator.png', false),
    ('Polarized Sports Wraparound', 'polarized-sports', 5200, 'Sports', '/glasses/aviator.png', true),
    ('Minimalist Titanium Rim', 'minimalist-titanium', 8500, 'Round', '/glasses/aviator.png', false),
    ('Oversized Square Gradient', 'oversize-square', 3600, 'Square', '/glasses/aviator.png', false),
    ('Retro Browline Clubmaster', 'retro-clubmaster', 4200, 'Browline', '/glasses/aviator.png', true),
    ('Gunmetal Double Bridge', 'gunmetal-bridge', 3800, 'Aviator', '/glasses/aviator.png', false),
    ('Amber Tinted Vintage', 'amber-vintage', 3300, 'Round', '/glasses/aviator.png', false),
    ('Neon Green Festival', 'neon-festival', 1500, 'Novelty', '/glasses/aviator.png', false),
    ('Chunky White Oval', 'chunky-white', 2700, 'Oval', '/glasses/aviator.png', false),
    ('Wood-grain Eco Wayfarer', 'wood-grain', 4800, 'Wayfarer', '/glasses/aviator.png', true),
    ('Emerald Mirrored Aviator', 'emerald-mirrored', 3700, 'Aviator', '/glasses/aviator.png', false),
    ('Rose Gradient Octagon', 'rose-octagon', 4400, 'Geometric', '/glasses/aviator.png', false),
    ('Slim Wire Frame Reading', 'slim-wire', 1800, 'Rectangular', '/glasses/aviator.png', false)
) AS p(name, slug, price, category, image_url, is_featured)
LEFT JOIN public.categories c ON c.name = p.category
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  price = EXCLUDED.price,
  category = EXCLUDED.category,
  category_id = EXCLUDED.category_id,
  image_url = EXCLUDED.image_url,
  is_featured = EXCLUDED.is_featured;

