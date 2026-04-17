import { supabase } from '../supabaseClient';

/**
 * Fetch all products, optional filters
 */
export const getProducts = async ({ search = '', categorySlug = '', featured = false } = {}) => {
  let query = supabase
    .from('products')
    .select('*, categories(name, slug)')
    .eq('in_stock', true)
    .order('created_at', { ascending: false });

  if (search) query = query.ilike('name', `%${search}%`);
  if (categorySlug) query = query.eq('categories.slug', categorySlug);
  if (featured) query = query.eq('is_featured', true);

  const { data, error } = await query;
  if (error) throw error;
  return data;
};

/**
 * Fetch a single product by slug
 */
export const getProductBySlug = async (slug) => {
  const { data, error } = await supabase
    .from('products')
    .select('*, categories(name, slug)')
    .eq('slug', slug)
    .single();
  if (error) throw error;
  return data;
};

/**
 * Fetch featured products (limit)
 */
export const getFeaturedProducts = async (limit = 8) => {
  const { data, error } = await supabase
    .from('products')
    .select('*, categories(name, slug)')
    .eq('is_featured', true)
    .eq('in_stock', true)
    .limit(limit);
  if (error) throw error;
  return data;
};

/**
 * Admin: create a new product
 */
export const createProduct = async (product) => {
  const { data, error } = await supabase.from('products').insert([product]).select().single();
  if (error) throw error;
  return data;
};

/**
 * Admin: update a product
 */
export const updateProduct = async (id, updates) => {
  const { data, error } = await supabase.from('products').update(updates).eq('id', id).select().single();
  if (error) throw error;
  return data;
};

/**
 * Admin: delete a product
 */
export const deleteProduct = async (id) => {
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) throw error;
};
