import { useState, useEffect } from 'react';
import { getProducts } from '../services/api/products';
import { MOCK_PRODUCTS } from '../utils/constants';

export const useProducts = (options = {}) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetch = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await getProducts(options);
                setProducts(data || MOCK_PRODUCTS);
            } catch (err) {
                // Fall back to mock data if Supabase is not configured
                setProducts(MOCK_PRODUCTS);
                setError(null);
            } finally {
                setLoading(false);
            }
        };
        fetch();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [options.category, options.search, options.featured]);

    return { products, loading, error };
};
