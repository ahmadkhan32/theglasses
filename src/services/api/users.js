import { supabase } from '../supabaseClient';

export const getUserProfile = async (userId) => {
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();
    if (error) throw error;
    return data;
};

export const upsertUserProfile = async (profile) => {
    const { data, error } = await supabase
        .from('users')
        .upsert(profile)
        .select()
        .single();
    if (error) throw error;
    return data;
};

export const updateUserProfile = async (userId, updates) => {
    const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();
    if (error) throw error;
    return data;
};

// Admin
export const getAllUsers = async () => {
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
};
