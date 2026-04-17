// App-wide constants

export const APP_NAME = 'The Glasses';

export const FREE_SHIPPING_THRESHOLD = 2000;
export const BANK_TRANSFER_DISCOUNT = 10;

export const ORDER_STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

export const PAYMENT_METHODS = [
  { id: 'easypaisa', label: 'Easypaisa' },
  { id: 'jazzcash',  label: 'JazzCash'  },
  { id: 'bank',      label: 'Bank Transfer (+10% discount)' },
  { id: 'cod',       label: 'Cash on Delivery' },
];

export const CATEGORY_SLUGS = {
  AVIATORS: 'aviators',
  BLUE_LIGHT: 'blue-light',
  SUNGLASSES: 'sunglasses',
  ROUND: 'round',
  WAYFARER: 'wayfarer',
  CAT_EYE: 'cat-eye',
};

export const NAV_LINKS = [
  { label: 'Shop',    path: '/shop'   },
  { label: 'Try On',  path: '/try-on' },
];

export const HERO_IMAGE = 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=1400&q=80';

export const GLASSES_OVERLAY = 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=400&q=80';

// ─── Demo / fallback categories ───────────────────────────────────────────────
export const DEMO_CATEGORIES = [
  {
    id: 'cat-1', name: 'Aviators', slug: 'aviators',
    description: 'Classic pilot silhouettes with lightweight metal frames.',
    image: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=400&q=80',
  },
  {
    id: 'cat-2', name: 'Blue Light', slug: 'blue-light',
    description: 'Screen-friendly lenses designed for work, gaming, and study.',
    image: 'https://images.unsplash.com/photo-1508296695146-257a814070b4?w=400&q=80',
  },
  {
    id: 'cat-3', name: 'Sunglasses', slug: 'sunglasses',
    description: 'Outdoor-ready styles with UV protection and strong silhouettes.',
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&q=80',
  },
  {
    id: 'cat-4', name: 'Round Frames', slug: 'round',
    description: 'Vintage-inspired circular frames with a refined everyday look.',
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400&q=80',
  },
  {
    id: 'cat-5', name: 'Wayfarer', slug: 'wayfarer',
    description: 'Bold acetate frames made for modern everyday wear.',
    image: 'https://images.unsplash.com/photo-1577803645773-f96470509666?w=400&q=80',
  },
  {
    id: 'cat-6', name: 'Cat-Eye', slug: 'cat-eye',
    description: 'Fashion-forward lifted frames with elegant contours.',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&q=80',
  },
];

// ─── Demo / fallback products (used when Supabase is not yet configured) ───────
export const DEMO_PRODUCTS = [
  {
    id: 'demo-1',
    name: 'Classic Gold Aviator',
    slug: 'classic-gold-aviator',
    price: 2499,
    old_price: 3499,
    discount: 28,
    stock: 45,
    brand: 'AeroLux',
    material: 'Lightweight Metal Alloy',
    color: 'Gold',
    pattern: 'Classic Double Bridge',
    image_url: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=600&q=80',
      'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=900&q=80',
    ],
    description: 'Timeless gold aviator sunglasses with UV400 protection and a balanced lightweight fit.',
    long_description: 'A classic aviator frame designed for versatile daily wear. The double-bridge front adds structure, while the slim temples keep the pair light and comfortable for long use. The lens width is tuned for strong coverage without feeling oversized.',
    sizes: ['48-18-140', '52-18-145', '56-18-145'],
    details: { lens_type: 'UV400 Tinted', frame_shape: 'Aviator', fit: 'Medium', nose_pads: 'Adjustable', gender: 'Unisex' },
    is_featured: true,
    in_stock: true,
    categories: { name: 'Aviators', slug: 'aviators' },
  },
  {
    id: 'demo-2',
    name: 'Blue Light Defender',
    slug: 'blue-light-defender',
    price: 1999,
    old_price: 2999,
    discount: 33,
    stock: 60,
    brand: 'ScreenGuard',
    material: 'TR90',
    color: 'Matte Black',
    pattern: 'Minimal Rectangle',
    image_url: 'https://images.unsplash.com/photo-1508296695146-257a814070b4?w=600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1508296695146-257a814070b4?w=600&q=80',
    ],
    description: 'Blue light glasses engineered to reduce screen glare during long working sessions.',
    long_description: 'Built for laptop-heavy days, this frame uses lightweight TR90 construction and clear blue-cut lenses to reduce harsh reflections and help with eye comfort. The shape works well on most face types and keeps a clean professional look.',
    sizes: ['50-18-140', '53-18-145'],
    details: { lens_type: 'Blue Cut', frame_shape: 'Rectangle', fit: 'Medium', weight: '17g', gender: 'Unisex' },
    is_featured: true,
    in_stock: true,
    categories: { name: 'Blue Light', slug: 'blue-light' },
  },
  {
    id: 'demo-3',
    name: 'Retro Round Silver',
    slug: 'retro-round-silver',
    price: 1899,
    old_price: 2499,
    discount: 24,
    stock: 55,
    brand: 'Vintage Optics',
    material: 'Stainless Steel',
    color: 'Silver',
    pattern: 'Round Wire Rim',
    image_url: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&q=80',
    ],
    description: 'Round-frame glasses with a clean silver finish and vintage-inspired silhouette.',
    long_description: 'A refined round frame that balances retro styling with modern comfort. Ideal for fashion-forward daily wear, it pairs thin temples with a centered bridge for a light, balanced feel.',
    sizes: ['47-20-140', '49-20-145'],
    details: { lens_type: 'Clear Demo Lens', frame_shape: 'Round', fit: 'Narrow to Medium', nose_pads: 'Adjustable', gender: 'Unisex' },
    is_featured: true,
    in_stock: true,
    categories: { name: 'Round Frames', slug: 'round' },
  },
  {
    id: 'demo-4',
    name: 'Wayfarer Matte Black',
    slug: 'wayfarer-matte-black',
    price: 899,
    old_price: 1299,
    discount: 30,
    stock: 100,
    brand: 'North Frame',
    material: 'Acetate',
    color: 'Matte Black',
    pattern: 'Bold Wayfarer',
    image_url: 'https://images.unsplash.com/photo-1577803645773-f96470509666?w=600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1577803645773-f96470509666?w=600&q=80',
    ],
    description: 'Iconic wayfarer frame with a strong brow line and all-day everyday styling.',
    long_description: 'This acetate wayfarer is tuned for customers who want a confident silhouette without excess weight. It works equally well as a fashion frame or prescription-ready pair.',
    sizes: ['51-18-145', '54-18-145'],
    details: { lens_type: 'Prescription Ready', frame_shape: 'Wayfarer', fit: 'Medium', hinge: 'Spring Hinge', gender: 'Unisex' },
    is_featured: true,
    in_stock: true,
    categories: { name: 'Wayfarer', slug: 'wayfarer' },
  },
  {
    id: 'demo-5',
    name: 'Cat-Eye Rose Gold',
    slug: 'cat-eye-rose-gold',
    price: 5999,
    old_price: 7999,
    discount: 25,
    stock: 25,
    brand: 'Belle Vue',
    material: 'Metal + Acetate Tips',
    color: 'Rose Gold',
    pattern: 'Cat-Eye Lift',
    image_url: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&q=80',
    ],
    description: 'Elegant cat-eye glasses with a lifted profile and polished rose gold finish.',
    long_description: 'Designed for customers who want a sharper fashion statement, this cat-eye model offers a feminine lifted outer edge and a premium metallic finish. It looks polished in both office and evening styling.',
    sizes: ['52-17-140'],
    details: { lens_type: 'Clear Demo Lens', frame_shape: 'Cat-Eye', fit: 'Medium', weight: '19g', gender: 'Women' },
    is_featured: true,
    in_stock: true,
    categories: { name: 'Cat-Eye', slug: 'cat-eye' },
  },
  {
    id: 'demo-6',
    name: 'Midnight Outdoor Shield',
    slug: 'midnight-outdoor-shield',
    price: 399,
    old_price: 599,
    discount: 33,
    stock: 80,
    brand: 'SunGuard',
    material: 'Injected Nylon',
    color: 'Black',
    pattern: 'Sport Shield',
    image_url: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&q=80',
    ],
    description: 'Dark shield sunglasses built for strong sun coverage and active outdoor use.',
    long_description: 'A sport-oriented sunglasses style with wrap coverage and polarized comfort. The frame is light enough for extended wear and stable enough for everyday movement.',
    sizes: ['64-16-135'],
    details: { lens_type: 'Polarized UV400', frame_shape: 'Shield', fit: 'Wide', use_case: 'Driving and outdoor', gender: 'Unisex' },
    is_featured: false,
    in_stock: true,
    categories: { name: 'Sunglasses', slug: 'sunglasses' },
  },
];
