import { supabase } from '../supabaseClient';

export const getCoupons = async () => {
  const { data, error } = await supabase
    .from('coupons')
    .select('*')
    .order('expires_at', { ascending: true, nullsFirst: false });
  if (error) throw error;
  return data || [];
};

export const createCoupon = async (payload) => {
  const { data, error } = await supabase
    .from('coupons')
    .insert([payload])
    .select('*')
    .single();
  if (error) throw error;
  return data;
};

export const updateCoupon = async (id, payload) => {
  const { data, error } = await supabase
    .from('coupons')
    .update(payload)
    .eq('id', id)
    .select('*')
    .single();
  if (error) throw error;
  return data;
};

export const deleteCoupon = async (id) => {
  const { error } = await supabase
    .from('coupons')
    .delete()
    .eq('id', id);
  if (error) throw error;
};
