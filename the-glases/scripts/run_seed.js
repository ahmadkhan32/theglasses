import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: resolve(__dirname, '../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

const productsData = [
  { name: 'Classic Aviator Gold', slug: 'classic-aviator-gold', price: 3500, category: 'Aviator', image_url: '/glasses/aviator.png', is_featured: true },
  { name: 'Midnight Black Aviator', slug: 'midnight-black-aviator', price: 3200, category: 'Aviator', image_url: '/glasses/aviator.png', is_featured: false },
  { name: 'Silver Rimless Rectangular', slug: 'silver-rimless-rectangular', price: 4100, category: 'Rectangular', image_url: '/glasses/aviator.png', is_featured: true },
  { name: 'Vintage Round Tortoise', slug: 'vintage-round-tortoise', price: 2800, category: 'Round', image_url: '/glasses/aviator.png', is_featured: true },
  { name: 'Matte Black Wayfarer', slug: 'matte-black-wayfarer', price: 2500, category: 'Wayfarer', image_url: '/glasses/aviator.png', is_featured: false },
  { name: 'Blue Tinted Hexagon', slug: 'blue-tinted-hexagon', price: 3900, category: 'Geometric', image_url: '/glasses/aviator.png', is_featured: false },
  { name: 'Rose Gold Cat Eye', slug: 'rose-gold-cat-eye', price: 4500, category: 'Cat Eye', image_url: '/glasses/aviator.png', is_featured: true },
  { name: 'Transparent Clear Frame', slug: 'transparent-clear-frame', price: 2900, category: 'Square', image_url: '/glasses/aviator.png', is_featured: false },
  { name: 'Polarized Sports Wraparound', slug: 'polarized-sports', price: 5200, category: 'Sports', image_url: '/glasses/aviator.png', is_featured: true },
  { name: 'Minimalist Titanium Rim', slug: 'minimalist-titanium', price: 8500, category: 'Round', image_url: '/glasses/aviator.png', is_featured: false },
  { name: 'Oversized Square Gradient', slug: 'oversize-square', price: 3600, category: 'Square', image_url: '/glasses/aviator.png', is_featured: false },
  { name: 'Retro Browline Clubmaster', slug: 'retro-clubmaster', price: 4200, category: 'Browline', image_url: '/glasses/aviator.png', is_featured: true },
  { name: 'Gunmetal Double Bridge', slug: 'gunmetal-bridge', price: 3800, category: 'Aviator', image_url: '/glasses/aviator.png', is_featured: false },
  { name: 'Amber Tinted Vintage', slug: 'amber-vintage', price: 3300, category: 'Round', image_url: '/glasses/aviator.png', is_featured: false },
  { name: 'Neon Green Festival', slug: 'neon-festival', price: 1500, category: 'Novelty', image_url: '/glasses/aviator.png', is_featured: false },
  { name: 'Chunky White Oval', slug: 'chunky-white', price: 2700, category: 'Oval', image_url: '/glasses/aviator.png', is_featured: false },
  { name: 'Wood-grain Eco Wayfarer', slug: 'wood-grain', price: 4800, category: 'Wayfarer', image_url: '/glasses/aviator.png', is_featured: true },
  { name: 'Emerald Mirrored Aviator', slug: 'emerald-mirrored', price: 3700, category: 'Aviator', image_url: '/glasses/aviator.png', is_featured: false },
  { name: 'Rose Gradient Octagon', slug: 'rose-octagon', price: 4400, category: 'Geometric', image_url: '/glasses/aviator.png', is_featured: false },
  { name: 'Slim Wire Frame Reading', slug: 'slim-wire', price: 1800, category: 'Rectangular', image_url: '/glasses/aviator.png', is_featured: false }
];

async function seed() {
  console.log('Fetching existing categories...');
  
  // 1. Get unique categories from the products list
  const uniqueCategoryNames = [...new Set(productsData.map(p => p.category))];
  
  // 2. Insert categories if they do not exist
  for (const name of uniqueCategoryNames) {
    const slug = name.toLowerCase().replace(/\s+/g, '-');
    const { data: existing, error: existError } = await supabase.from('categories').select('id').eq('slug', slug).single();
    if (!existing) {
      await supabase.from('categories').insert({ name, slug, image: '/glasses/aviator.png' });
    }
  }

  // 3. Fetch all categories to map IDs
  const { data: categories, error: catError } = await supabase.from('categories').select('id, name');
  if (catError) {
    console.error('Error fetching categories:', catError);
    return;
  }

  const categoryMap = {};
  categories.forEach(c => { categoryMap[c.name] = c.id; });

  console.log('Clearing existing products...');
  await supabase.from('products').delete().neq('id', '00000000-0000-0000-0000-000000000000');

  console.log('Inserting products with category relations...');
  const productsToInsert = productsData.map(p => ({
    ...p,
    category_id: categoryMap[p.category] || null
  }));

  const { error } = await supabase.from('products').upsert(productsToInsert, { onConflict: 'slug' });
  
  if (error) {
    console.error('Error seeding products:', error);
  } else {
    console.log('Successfully seeded 20 products with properly linked Category IDs!');
  }
}

seed();
