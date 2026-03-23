import { supabase } from '../supabaseClient';

export const createOrder = async (order) => {
    const { data, error } = await supabase
        .from('orders')
        .insert([order])
        .select()
        .single();
    if (error) throw error;
    return data;
};

export const createOrderItems = async (items) => {
    const { data, error } = await supabase
        .from('order_items')
        .insert(items)
        .select();
    if (error) throw error;
    return data;
};

export const getUserOrders = async (userId) => {
    const { data, error } = await supabase
        .from('orders')
        .select('*, order_items(*, products(*))')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
};

export const getOrderById = async (orderId) => {
    const { data, error } = await supabase
        .from('orders')
        .select('*, order_items(*, products(*))')
        .eq('id', orderId)
        .single();
    if (error) throw error;
    return data;
};

// Admin
export const getAllOrders = async () => {
    const { data, error } = await supabase
        .from('orders')
        .select('*, users(name, phone), order_items(*, products(name))')
        .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
};

export const updateOrderStatus = async (orderId, status) => {
    const { data, error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId)
        .select()
        .single();
    if (error) throw error;
    return data;
};
