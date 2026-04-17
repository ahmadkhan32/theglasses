import { useState, useEffect, useCallback } from 'react';
import { getProducts, getFeaturedProducts } from '../services/api/products';
import { supabase } from '../services/supabaseClient';
import { DEMO_PRODUCTS, DEMO_CATEGORIES } from '../utils/constants';

/**
 * Filter demo products with the same logic as the Supabase query
 */
const filterDemo = (items, { search, categorySlug, featured }) => {
  let result = [...items];
  if (featured) result = result.filter((p) => p.is_featured);
  if (search)   result = result.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));
  if (categorySlug) result = result.filter((p) => p.categories?.slug === categorySlug);
  return result;
};

/**
 * Hook to fetch and filter products, falls back to demo data when Supabase
 * is not configured or returns an empty result set.
 */
export const useProducts = ({ search = '', categorySlug = '', featured = false } = {}) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = featured
        ? await getFeaturedProducts(8)
        : await getProducts({ search, categorySlug });
      // If Supabase returned data, use it; otherwise fall back to demo products
      if (data && data.length > 0) {
        setProducts(data);
      } else {
        setProducts(filterDemo(DEMO_PRODUCTS, { search, categorySlug, featured }));
      }
    } catch {
      // Supabase not configured or network error → use demo data
      setProducts(filterDemo(DEMO_PRODUCTS, { search, categorySlug, featured }));
    } finally {
      setLoading(false);
    }
  }, [search, categorySlug, featured]);

  const fetchCategories = useCallback(async () => {
    try {
      const { data } = await supabase.from('categories').select('*').order('name');
      setCategories(data && data.length > 0 ? data : DEMO_CATEGORIES);
    } catch {
      setCategories(DEMO_CATEGORIES);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return { products, categories, loading, error, refetch: fetchProducts };
};
