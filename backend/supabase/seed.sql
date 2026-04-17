-- ============================================================
-- SEED DATA for The Glasses - Eyewear Collection
-- ============================================================

INSERT INTO categories (name, slug, image) VALUES
('Aviators', 'aviators', 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=400&q=80'),
('Blue Light', 'blue-light', 'https://images.unsplash.com/photo-1508296695146-257a814070b4?w=400&q=80'),
('Sunglasses', 'sunglasses', 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&q=80'),
('Round Frames', 'round', 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400&q=80'),
('Wayfarer', 'wayfarer', 'https://images.unsplash.com/photo-1577803645773-f96470509666?w=400&q=80'),
('Cat-Eye', 'cat-eye', 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&q=80')
ON CONFLICT DO NOTHING;

INSERT INTO products (
    name, slug, category_id, price, old_price, discount, brand, material, color, pattern,
    description, long_description, sizes, details, stock, image_url, is_featured, is_active
)
VALUES
(
    'Classic Gold Aviator',
    'classic-gold-aviator',
    (SELECT id FROM categories WHERE slug = 'aviators'),
    2499, 3499, 28,
    'AeroLux',
    'Lightweight Metal Alloy',
    'Gold',
    'Classic Double Bridge',
    'Timeless gold aviator sunglasses with UV400 protection and a balanced lightweight fit.',
    'A classic aviator frame designed for versatile daily wear. The double-bridge front adds structure, while the slim temples keep the pair light and comfortable for long use. The lens width is tuned for strong coverage without feeling oversized.',
    '["48-18-140", "52-18-145", "56-18-145"]'::jsonb,
    '{"lens_type": "UV400 Tinted", "frame_shape": "Aviator", "fit": "Medium", "nose_pads": "Adjustable", "gender": "Unisex"}'::jsonb,
    45,
    'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=600&q=80',
    true,
    true
),
(
    'Blue Light Defender',
    'blue-light-defender',
    (SELECT id FROM categories WHERE slug = 'blue-light'),
    1999, 2999, 33,
    'ScreenGuard',
    'TR90',
    'Matte Black',
    'Minimal Rectangle',
    'Blue light glasses engineered to reduce screen glare during long working sessions.',
    'Built for laptop-heavy days, this frame uses lightweight TR90 construction and clear blue-cut lenses to reduce harsh reflections and help with eye comfort. The shape works well on most face types and keeps a clean professional look.',
    '["50-18-140", "53-18-145"]'::jsonb,
    '{"lens_type": "Blue Cut", "frame_shape": "Rectangle", "fit": "Medium", "weight": "17g", "gender": "Unisex"}'::jsonb,
    60,
    'https://images.unsplash.com/photo-1508296695146-257a814070b4?w=600&q=80',
    true,
    true
),
(
    'Retro Round Silver',
    'retro-round-silver',
    (SELECT id FROM categories WHERE slug = 'round'),
    1899, 2499, 24,
    'Vintage Optics',
    'Stainless Steel',
    'Silver',
    'Round Wire Rim',
    'Round-frame glasses with a clean silver finish and vintage-inspired silhouette.',
    'A refined round frame that balances retro styling with modern comfort. Ideal for fashion-forward daily wear, it pairs thin temples with a centered bridge for a light, balanced feel.',
    '["47-20-140", "49-20-145"]'::jsonb,
    '{"lens_type": "Clear Demo Lens", "frame_shape": "Round", "fit": "Narrow to Medium", "nose_pads": "Adjustable", "gender": "Unisex"}'::jsonb,
    55,
    'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&q=80',
    true,
    true
),
(
    'Wayfarer Matte Black',
    'wayfarer-matte-black',
    (SELECT id FROM categories WHERE slug = 'wayfarer'),
    899, 1299, 30,
    'North Frame',
    'Acetate',
    'Matte Black',
    'Bold Wayfarer',
    'Iconic wayfarer frame with a strong brow line and all-day everyday styling.',
    'This acetate wayfarer is tuned for customers who want a confident silhouette without excess weight. It works equally well as a fashion frame or prescription-ready pair.',
    '["51-18-145", "54-18-145"]'::jsonb,
    '{"lens_type": "Prescription Ready", "frame_shape": "Wayfarer", "fit": "Medium", "hinge": "Spring Hinge", "gender": "Unisex"}'::jsonb,
    100,
    'https://images.unsplash.com/photo-1577803645773-f96470509666?w=600&q=80',
    true,
    true
),
(
    'Cat-Eye Rose Gold',
    'cat-eye-rose-gold',
    (SELECT id FROM categories WHERE slug = 'cat-eye'),
    5999, 7999, 25,
    'Belle Vue',
    'Metal + Acetate Tips',
    'Rose Gold',
    'Cat-Eye Lift',
    'Elegant cat-eye glasses with a lifted profile and polished rose gold finish.',
    'Designed for customers who want a sharper fashion statement, this cat-eye model offers a feminine lifted outer edge and a premium metallic finish. It looks polished in both office and evening styling.',
    '["52-17-140"]'::jsonb,
    '{"lens_type": "Clear Demo Lens", "frame_shape": "Cat-Eye", "fit": "Medium", "weight": "19g", "gender": "Women"}'::jsonb,
    25,
    'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&q=80',
    true,
    true
),
(
    'Midnight Outdoor Shield',
    'midnight-outdoor-shield',
    (SELECT id FROM categories WHERE slug = 'sunglasses'),
    1399, 1999, 30,
    'SunGuard',
    'Injected Nylon',
    'Black',
    'Sport Shield',
    'Dark shield sunglasses built for strong sun coverage and active outdoor use.',
    'A sport-oriented sunglasses style with wrap coverage and polarized comfort. The frame is light enough for extended wear and stable enough for everyday movement.',
    '["64-16-135"]'::jsonb,
    '{"lens_type": "Polarized UV400", "frame_shape": "Shield", "fit": "Wide", "use_case": "Driving and outdoor", "gender": "Unisex"}'::jsonb,
    80,
    'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&q=80',
    false,
    true
)
ON CONFLICT DO NOTHING;

-- Coupons
INSERT INTO coupons (code, discount, active, min_order) VALUES
('WELCOME10', 10, true, 0),
('SAVE20', 20, true, 2000),
('BANK10', 10, true, 0),
('FREESHIP', 15, true, 1500)
ON CONFLICT DO NOTHING;
