import React, { createContext, useContext, useState, useCallback } from 'react';
import { calcCartTotal, calcShipping, formatPrice } from '../utils/pricing';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
    const [items, setItems] = useState([]);
    const [isOpen, setIsOpen] = useState(false);

    const addToCart = useCallback((product, quantity = 1) => {
        setItems((prev) => {
            const exists = prev.find((i) => i.id === product.id);
            if (exists) {
                return prev.map((i) => i.id === product.id ? { ...i, quantity: i.quantity + quantity } : i);
            }
            return [...prev, { ...product, quantity }];
        });
        setIsOpen(true);
    }, []);

    const removeFromCart = useCallback((productId) => {
        setItems((prev) => prev.filter((i) => i.id !== productId));
    }, []);

    const updateQuantity = useCallback((productId, quantity) => {
        if (quantity <= 0) {
            removeFromCart(productId);
            return;
        }
        setItems((prev) => prev.map((i) => i.id === productId ? { ...i, quantity } : i));
    }, [removeFromCart]);

    const clearCart = useCallback(() => setItems([]), []);

    const subtotal = calcCartTotal(items);
    const shipping = calcShipping(subtotal);
    const total = subtotal + shipping;
    const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

    return (
        <CartContext.Provider value={{
            items, isOpen, setIsOpen,
            addToCart, removeFromCart, updateQuantity, clearCart,
            subtotal, shipping, total, itemCount, formatPrice
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error('useCart must be used within CartProvider');
    return ctx;
};
