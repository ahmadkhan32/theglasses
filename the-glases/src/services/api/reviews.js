import { supabase } from '../supabaseClient';

export const getProductReviews = async (productId) => {
    const { data, error } = await supabase
        .from('reviews')
        .select('*, users(name, avatar_url)')
        .eq('product_id', productId)
        .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
};

export const createReview = async (review) => {
    const { data, error } = await supabase
        .from('reviews')
        .insert([review])
        .select()
        .single();
    if (error) throw error;
    return data;
};

export const getAverageRating = async (productId) => {
    const { data, error } = await supabase
        .from('reviews')
        .select('rating')
        .eq('product_id', productId);
    if (error) throw error;
    if (!data?.length) return 0;
    return data.reduce((sum, r) => sum + r.rating, 0) / data.length;
};
