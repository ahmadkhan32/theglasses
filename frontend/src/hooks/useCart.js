import { useContext } from 'react';
import { CartContext } from '../context/CartContext';

/**
 * Convenience hook for cart context
 */
export const useCart = () => useContext(CartContext);
