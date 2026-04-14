import { supabase } from '../supabaseClient';

export const createOrder = async (orderData) => {
    const res = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to create order');
    return data;
};

// Admin: Update Shipping Status
export const updateOrderStatus = async (orderId, status) => {
    const res = await fetch(`http://localhost:5000/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update status');
    return data;
};

export const createOrderItems = async (items) => {
    // Note: Backend now handles atomic insertion of items during createOrder.
    // This function is kept for backward compatibility but is no longer needed in the new flow.
    return { message: 'Items are handled by the backend atomically.' };
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

// Admin: View All Orders
export const getAllOrders = async () => {
    const { data, error } = await supabase
        .from('orders')
        .select('*, order_items(*, products(name, image_url))')
        .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
};
