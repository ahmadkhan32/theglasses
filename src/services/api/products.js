import { supabase } from '../supabaseClient';

export const getProducts = async ({ featured, category, search, limit } = {}) => {
    let query = supabase.from('products').select('*');

    if (featured) query = query.eq('is_featured', true);
    if (category) query = query.eq('category', category);
    if (search) query = query.ilike('name', `%${search}%`);
    if (limit) query = query.limit(limit);

    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw error;
    return data;
};

export const getProductBySlug = async (slug) => {
    const { data, error } = await supabase
        .from('products')
        .select('*, reviews(*)')
        .eq('slug', slug)
        .single();
    if (error) throw error;
    return data;
};

export const getFeaturedProducts = async () => {
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_featured', true)
        .limit(8);
    if (error) throw error;
    return data;
};

export const getProductById = async (id) => {
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();
    if (error) throw error;
    return data;
};

// Admin only
export const createProduct = async (product) => {
    const { data, error } = await supabase.from('products').insert([product]).select().single();
    if (error) throw error;
    return data;
};

export const updateProduct = async (id, updates) => {
    const { data, error } = await supabase.from('products').update(updates).eq('id', id).select().single();
    if (error) throw error;
    return data;
};

export const deleteProduct = async (id) => {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) throw error;
};
