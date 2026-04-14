import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { formatPrice, calcDiscountedPrice } from '../utils/pricing';
import GlassesAnimation from './GlassesAnimation';
import { ShoppingCart, Plus, Sparkles } from 'lucide-react';

const ProductCard = ({ product }) => {
    const { addToCart } = useCart();
    const finalPrice = calcDiscountedPrice(product.price, product.discount);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -10 }}
            className="group relative flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-border/50"
        >
            {/* Tag / Badge */}
            {product.discount > 0 && (
                <div className="absolute top-4 left-4 z-20 flex items-center gap-1 bg-accent/90 text-white px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest shadow-lg shadow-emerald-500/20">
                    <Sparkles size={10} />
                    Save {product.discount}%
                </div>
            )}

            {/* Image Section */}
            <Link to={`/products/${product.slug || product.id}`} className="block relative overflow-hidden bg-soft aspect-square flex items-center justify-center p-8 transition-colors group-hover:bg-primary/5">
                <motion.div 
                    whileHover={{ scale: 1.1, rotate: -5 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                    className="relative z-10 w-full h-full"
                >
                    <GlassesAnimation
                        image={product.image_url || product.image}
                        altText={product.name}
                    />
                </motion.div>
                
                {/* Decorative Elements */}
                <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>

            {/* Content Section */}
            <div className="p-6 flex flex-col gap-1 flex-1 relative bg-white">
                <div className="flex justify-between items-start gap-2">
                    <p className="text-[11px] text-light font-bold uppercase tracking-widest leading-none">
                        {product.category}
                    </p>
                    <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map(i => <div key={i} className="w-1 h-1 rounded-full bg-primary/20" />)}
                    </div>
                </div>

                <h3 className="text-lg text-dark font-extrabold font-heading tracking-tight mb-2 group-hover:text-primary transition-colors">
                    {product.name}
                </h3>

                <div className="flex justify-between items-end mt-auto pt-4 border-t border-border/40">
                    <div className="flex flex-col">
                        {product.discount > 0 && (
                            <span className="text-[12px] text-light line-through font-medium mb-1">
                                {formatPrice(product.price)}
                            </span>
                        )}
                        <span className="text-xl font-black text-dark font-heading">
                            {formatPrice(finalPrice)}
                        </span>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => addToCart(product)}
                        className="bg-primary text-white p-3 rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all flex items-center justify-center group/btn"
                    >
                        <Plus size={20} className="group-hover/btn:rotate-90 transition-transform" />
                    </motion.button>
                </div>
            </div>

            {/* Quick-add Overlay (Mobile hidden) */}
            <div className="absolute inset-x-4 top-1/2 opacity-0 group-hover:opacity-100 transition-all duration-500 -translate-y-4 group-hover:-translate-y-12 pointer-events-none hidden md:block">
                <div className="glass px-4 py-2 rounded-full text-center text-[11px] font-bold text-dark/60 uppercase tracking-widest shadow-xl">
                    Premium Quality
                </div>
            </div>
        </motion.div>
    );
};

export default ProductCard;
