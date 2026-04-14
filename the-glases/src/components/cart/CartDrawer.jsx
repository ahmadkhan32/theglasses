import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Plus, Minus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import Button from '../ui/Button';
import { formatPrice } from '../../utils/pricing';

const CartDrawer = () => {
    const navigate = useNavigate();
    const { items, isOpen, setIsOpen, removeFromCart, updateQuantity, subtotal, shipping, total, itemCount } = useCart();

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsOpen(false)}
                        className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        className="fixed top-0 right-0 bottom-0 w-full max-w-[420px] bg-white z-50 flex flex-col shadow-[-10px_0_40px_rgba(0,0,0,0.15)]"
                    >
                        {/* Header */}
                        <div className="flex justify-between items-center px-6 py-5 border-b border-gray-200">
                            <h3 className="text-xl font-bold">Cart ({itemCount})</h3>
                            <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-gray-900 transition-colors"><X size={22} /></button>
                        </div>

                        {/* Items */}
                        <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-4">
                            {items.length === 0 ? (
                                <div className="text-center py-16 text-gray-500">
                                    <p className="text-4xl mb-3">🕶️</p>
                                    <p className="font-medium">Your cart is empty</p>
                                </div>
                            ) : (
                                items.map((item) => (
                                    <div key={item.id} className="flex gap-3 items-center p-3 rounded-xl border border-gray-200 shadow-sm">
                                        <img loading="lazy" src={item.image_url || item.image} alt={item.name} className="w-18 h-18 object-contain rounded-lg bg-gray-50 p-1" />
                                        <div className="flex-1">
                                            <p className="font-semibold text-[15px]">{item.name}</p>
                                            <p className="text-primary font-bold">{formatPrice(item.price)}</p>
                                            <div className="flex items-center gap-2 mt-2">
                                                <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-7 h-7 rounded-md border border-gray-200 flex items-center justify-center hover:bg-gray-50"><Minus size={14} /></button>
                                                <span className="font-semibold min-w-[20px] text-center">{item.quantity}</span>
                                                <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-7 h-7 rounded-md border border-gray-200 flex items-center justify-center hover:bg-gray-50"><Plus size={14} /></button>
                                            </div>
                                        </div>
                                        <button onClick={() => removeFromCart(item.id)} className="p-2 hover:bg-red-50 rounded-full transition-colors"><Trash2 size={18} className="text-red-500" /></button>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        {items.length > 0 && (
                            <div className="p-6 border-t border-gray-200 bg-gray-50">
                                <div className="flex justify-between mb-2 text-sm text-gray-600">
                                    <span>Subtotal</span><span className="font-medium">{formatPrice(subtotal)}</span>
                                </div>
                                <div className="flex justify-between mb-4 text-sm text-gray-600">
                                    <span>Shipping</span><span className="font-medium text-green-600">{shipping === 0 ? 'Free 🎉' : formatPrice(shipping)}</span>
                                </div>
                                <div className="flex justify-between font-bold text-lg mb-5">
                                    <span>Total</span><span className="text-primary">{formatPrice(total)}</span>
                                </div>
                                                <Button variant="primary" fullWidth onClick={() => { setIsOpen(false); navigate('/checkout'); }}>
                                    Checkout
                                </Button>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default CartDrawer;
