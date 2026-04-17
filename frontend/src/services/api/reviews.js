import { supabase } from '../supabaseClient';

/**
 * Fetch reviews for a product
 */
export const getProductReviews = async (productId) => {
  const { data, error } = await supabase
    .from('reviews')
    .select('*, users(name, avatar_url)')
    .eq('product_id', productId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
};

/**
 * Add a review for a product
 */
export const addReview = async ({ productId, userId, rating, comment }) => {
  const { data, error } = await supabase
    .from('reviews')
    .insert([{ product_id: productId, user_id: userId, rating, comment }])
    .select()
    .single();
  if (error) throw error;
  return data;
};

/**
 * Get average rating for a product
 */
export const getAverageRating = async (productId) => {
  const { data, error } = await supabase
    .from('reviews')
    .select('rating')
    .eq('product_id', productId);
  if (error || !data?.length) return { average: 0, count: 0 };
  const avg = data.reduce((s, r) => s + r.rating, 0) / data.length;
  return { average: Math.round(avg * 10) / 10, count: data.length };
};
