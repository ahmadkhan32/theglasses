import { supabase } from '../supabaseClient';

/**
 * Create a new order with its items
 */
export const createOrder = async ({ order, items }) => {
  const { data: newOrder, error: orderError } = await supabase
    .from('orders')
    .insert([order])
    .select()
    .single();
  if (orderError) {
    console.error('ORDER INSERT ERROR:', orderError);
    throw orderError;
  }

  const orderItems = items.map((item) => ({
    order_id: newOrder.id,
    product_id: item.id,
    quantity: item.quantity,
    price: item.price,
  }));

  const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
  if (itemsError) {
    console.error('ORDER ITEMS INSERT ERROR:', itemsError);
    throw itemsError;
  }

  return newOrder;
};

/**
 * Fetch orders for the current user
 */
export const getUserOrders = async () => {
  const { data, error } = await supabase
    .from('orders')
    .select('*, order_items(*, products(name, image_url))')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
};

/**
 * Admin: fetch all orders
 */
export const getAllOrders = async () => {
  const { data, error } = await supabase
    .from('orders')
    .select('*, order_items(*, products(name, image_url)), users(name)')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
};

/**
 * Admin: update order status
 */
export const updateOrderStatus = async (id, status) => {
  const { data, error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
};
