import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, User, Search, Menu, X, Package, ShieldCheck } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { itemCount, setIsOpen } = useCart();
    const { user, isAdmin } = useAuth();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Shop', path: '/shop' },
        { name: 'About', path: '/about' },
        { name: 'Contact', path: '/contact' },
    ];

    return (
        <>
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                className={`sticky top-0 z-50 transition-all duration-300 ${
                    scrolled ? 'glass py-3 shadow-lg' : 'bg-transparent py-5'
                }`}
            >
                <div className="container flex justify-between items-center">
                    <div className="flex items-center gap-8">
                        {/* Mobile Menu Toggle */}
                        <button 
                            className="lg:hidden p-2 text-dark hover:text-primary transition-colors"
                            onClick={() => setMobileMenuOpen(true)}
                        >
                            <Menu size={24} />
                        </button>

                        <Link to="/" className="text-2xl font-black italic tracking-tighter text-dark font-heading">
                            THE <span className="text-primary NOT-italic">GLASES</span>
                        </Link>
                        
                        {/* Desktop Links */}
                        <div className="hidden lg:flex gap-8 items-center">
                            {navLinks.map((link) => (
                                <Link 
                                    key={link.path}
                                    to={link.path} 
                                    className={`text-sm font-bold uppercase tracking-widest transition-all ${
                                        location.pathname === link.path ? 'text-primary' : 'text-dark/60 hover:text-primary'
                                    }`}
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <Link to="/try-on" className="flex items-center gap-2 font-black text-white bg-primary hover:bg-primary-dark px-6 py-2.5 rounded-full text-xs uppercase tracking-widest transition-all shadow-lg shadow-blue-500/20 active:scale-95">
                                <Sparkles size={14} /> Try On
                            </Link>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 md:gap-5">
                        {/* Action Icons */}
                        <div className="flex items-center gap-1">
                            {user && (
                                <>
                                    <Link to="/orders" aria-label="My Orders" className="p-2 text-dark/70 hover:text-primary transition-colors relative group">
                                        <Package size={20} />
                                        <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 glass px-2 py-1 text-[10px] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">My Orders</span>
                                    </Link>
                                    {isAdmin && (
                                        <Link to="/admin" aria-label="Admin Panel" className="p-2 text-dark/70 hover:text-primary transition-colors">
                                            <ShieldCheck size={20} />
                                        </Link>
                                    )}
                                </>
                            )}
                            <Link to="/login" aria-label="User Account" className="p-2 text-dark/70 hover:text-primary transition-colors">
                                <User size={20} />
                            </Link>
                        </div>

                        <button
                            onClick={() => setIsOpen(true)}
                            className="relative p-2.5 bg-dark text-white rounded-full hover:bg-primary transition-all shadow-md active:scale-90"
                        >
                            <ShoppingCart size={18} />
                            {itemCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-accent text-white text-[9px] font-black rounded-full w-[18px] h-[18px] flex flex-center shadow-lg animate-bounce-subtle">
                                    {itemCount}
                                </span>
                            )}
                        </button>
                    </div>
                </div>
            </motion.nav>

            {/* Mobile Sidebar */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setMobileMenuOpen(false)}
                            className="fixed inset-0 bg-dark/60 z-[998] backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            className="fixed top-0 left-0 bottom-0 w-[300px] glass z-[999] p-8 flex flex-col items-start gap-10"
                        >
                            <div className="flex justify-between items-center w-full">
                                <span className="text-primary font-black uppercase tracking-widest text-sm">Navigation</span>
                                <button onClick={() => setMobileMenuOpen(false)} className="p-2 bg-soft rounded-full text-dark"><X size={20} /></button>
                            </div>
                            
                            <div className="flex flex-col gap-6 w-full">
                                <Link to="/" onClick={() => setMobileMenuOpen(false)} className="text-3xl font-black text-dark hover:text-primary transition-all">Home</Link>
                                <Link to="/shop" onClick={() => setMobileMenuOpen(false)} className="text-3xl font-black text-dark hover:text-primary transition-all">Shop</Link>
                                <Link to="/try-on" onClick={() => setMobileMenuOpen(false)} className="text-3xl font-black text-primary flex items-center gap-3">Try-On <Sparkles /></Link>
                                <Link to="/orders" onClick={() => setMobileMenuOpen(false)} className="text-xl font-bold text-dark/60 mt-4 border-t border-border pt-4">My Orders</Link>
                                <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="text-xl font-bold text-dark/60">About</Link>
                                <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="text-xl font-bold text-dark/60">Contact</Link>
                            </div>

                            <div className="mt-auto w-full pt-8 border-t border-border flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-primary/10 flex-center text-primary font-black uppercase text-xl">
                                    {user?.email?.[0] || 'G'}
                                </div>
                                <div>
                                    <p className="text-dark font-black truncate max-w-[160px] text-sm">{user?.email || 'Guest Explorer'}</p>
                                    <p className="text-[10px] text-light font-bold uppercase tracking-widest leading-none mt-1">Status: {user ? 'Verified Client' : 'Visitor'}</p>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};

const Sparkles = ({ size = 18, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
    <path d="M5 3v4"/><path d="M3 5h4"/><path d="M21 17v4"/><path d="M19 19h4"/>
  </svg>
);

export default Navbar;
