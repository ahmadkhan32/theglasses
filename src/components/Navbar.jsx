import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, User, Search, Menu } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import '../styles/global.css';

const Navbar = () => {
    const { itemCount, setIsOpen } = useCart();
    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
            style={{
                position: 'sticky',
                top: 0,
                zIndex: 50,
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                borderBottom: '1px solid var(--border-color)',
                padding: '16px 0'
            }}
        >
            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                    <Menu className="mobile-menu" size={24} style={{ cursor: 'pointer', display: 'none' }} />
                    <Link to="/" style={{ fontSize: '24px', fontWeight: '800', letterSpacing: '-1px', color: 'var(--accent-blue)' }}>
                        The Glases
                    </Link>
                    <div className="nav-links" style={{ display: 'flex', gap: '20px', marginLeft: '32px', alignItems: 'center' }}>
                        <Link to="/shop" style={{ fontWeight: '500', color: 'var(--text-secondary)' }}>Shop</Link>
                        <Link to="/about" style={{ fontWeight: '500', color: 'var(--text-secondary)' }}>About</Link>
                        <Link to="/contact" style={{ fontWeight: '500', color: 'var(--text-secondary)' }}>Contact</Link>
                        <Link to="/try-on" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '700', color: '#fff', backgroundColor: 'var(--accent-blue)', padding: '6px 14px', borderRadius: '100px', fontSize: '13px', textDecoration: 'none', whiteSpace: 'nowrap' }}>
                            🕶️ Try On
                        </Link>
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <button aria-label="Search">
                        <Search size={20} color="var(--text-primary)" />
                    </button>
                    <Link to="/login" aria-label="User Account">
                        <User size={20} color="var(--text-primary)" />
                    </Link>
                    <button
                        aria-label="Cart"
                        onClick={() => setIsOpen(true)}
                        style={{ position: 'relative', background: 'none', border: 'none', cursor: 'pointer' }}
                    >
                        <ShoppingCart size={20} color="var(--text-primary)" />
                        {itemCount > 0 && (
                            <span style={{
                                position: 'absolute',
                                top: '-8px',
                                right: '-8px',
                                backgroundColor: 'var(--accent-blue)',
                                color: 'white',
                                fontSize: '10px',
                                fontWeight: 'bold',
                                borderRadius: '50%',
                                width: '16px',
                                height: '16px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>{itemCount}</span>
                        )}
                    </button>
                </div>
            </div>
        </motion.nav>
    );
};

export default Navbar;
