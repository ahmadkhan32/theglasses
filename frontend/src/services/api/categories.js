import { supabase } from '../supabaseClient';

/**
 * Fetch all categories
 */
export const getCategories = async () => {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name', { ascending: true });
  if (error) throw error;
  return data;
};

/**
 * Fetch a single category by slug
 */
export const getCategoryBySlug = async (slug) => {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .single();
  if (error) throw error;
  return data;
};

/**
 * Admin: create a new category
 */
export const createCategory = async (category) => {
  const { data, error } = await supabase
    .from('categories')
    .insert([category])
    .select()
    .single();
  if (error) throw error;
  return data;
};

/**
 * Admin: update a category
 */
export const updateCategory = async (id, updates) => {
  const { data, error } = await supabase
    .from('categories')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
};

/**
 * Admin: delete a category
 */
export const deleteCategory = async (id) => {
  const { error } = await supabase.from('categories').delete().eq('id', id);
  if (error) throw error;
};
