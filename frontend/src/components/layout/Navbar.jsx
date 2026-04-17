import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, LogOut, User, Menu, X, LayoutDashboard, Glasses } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import Container from './Container';

const NAV_LINKS = [
  { label: 'Home',      to: '/'       },
  { label: 'Shop',      to: '/shop'   },
  { label: 'Try On',    to: '/try-on' },
];

const Navbar = () => {
  const { user, signOut } = useAuth();
  const { totalItems, setIsCartOpen } = useCart();
  const { pathname } = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (to) => to === '/' ? pathname === '/' : pathname.startsWith(to);

  return (
    <>
      <nav style={{
        position: 'sticky', top: 0, zIndex: 'var(--z-sticky)',
        backgroundColor: 'rgba(255,255,255,0.94)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border-color)',
        height: 'var(--navbar-height)',
        display: 'flex', alignItems: 'center',
      }}>
        <Container>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '24px' }}>

            {/* ── Brand + Nav group (left side) ── */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>

              {/* Logo */}
              <Link
                to="/"
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  fontWeight: '900', fontSize: '20px', letterSpacing: '-0.5px',
                  color: 'var(--text-primary)', flexShrink: 0,
                  paddingRight: '18px',
                  borderRight: '1px solid var(--border-color)',
                  marginRight: '6px',
                }}
              >
                <Glasses size={22} color="var(--accent-blue)" strokeWidth={2.5} />
                <span>
                  The{' '}
                  <span style={{ color: 'var(--accent-blue)' }}>Glases</span>
                </span>
              </Link>

              {/* Desktop navigation links — grouped right next to the logo */}
              <div style={{ display: 'flex', gap: '2px', alignItems: 'center' }} className="desktop-nav">
                {NAV_LINKS.map(({ label, to }) => {
                  const active = isActive(to);
                  return (
                    <Link
                      key={to}
                      to={to}
                      style={{
                        fontWeight: '600',
                        fontSize: '14px',
                        padding: '7px 14px',
                        borderRadius: '8px',
                        color: active ? 'var(--accent-blue)' : 'var(--text-secondary)',
                        backgroundColor: active ? 'var(--accent-blue-light)' : 'transparent',
                        transition: 'all var(--transition-base)',
                        whiteSpace: 'nowrap',
                      }}
                      onMouseEnter={(e) => {
                        if (!active) {
                          e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)';
                          e.currentTarget.style.color = 'var(--text-primary)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!active) {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.color = 'var(--text-secondary)';
                        }
                      }}
                    >
                      {label}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* ── Right side icons ── */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>

              {/* Cart */}
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsCartOpen(true)}
                aria-label="Open cart"
                style={{
                  position: 'relative', background: 'none', border: 'none',
                  cursor: 'pointer', display: 'flex', alignItems: 'center',
                  padding: '8px', borderRadius: '8px',
                  transition: 'background var(--transition-base)',
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <ShoppingCart size={20} color="var(--text-primary)" />
                <AnimatePresence>
                  {totalItems > 0 && (
                    <motion.span
                      key="badge"
                      initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                      style={{
                        position: 'absolute', top: '3px', right: '3px',
                        backgroundColor: 'var(--accent-blue)', color: '#fff',
                        fontSize: '9px', fontWeight: '800', borderRadius: '50%',
                        minWidth: '16px', height: '16px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        border: '2px solid #fff',
                      }}
                    >
                      {totalItems > 9 ? '9+' : totalItems}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>

              {/* Auth buttons — desktop */}
              <div className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '4px', marginLeft: '4px' }}>
                {user ? (
                  <>
                    <Link
                      to="/profile"
                      title="My Profile"
                      style={{
                        display: 'flex', alignItems: 'center', gap: '6px',
                        padding: '7px 12px', borderRadius: '8px',
                        fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)',
                        transition: 'all var(--transition-base)',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
                    >
                      <User size={16} /> Profile
                    </Link>
                    <Link
                      to="/admin"
                      title="Admin Panel"
                      style={{
                        display: 'flex', alignItems: 'center', gap: '6px',
                        padding: '7px 12px', borderRadius: '8px',
                        fontSize: '13px', fontWeight: '600', color: 'var(--accent-blue)',
                        backgroundColor: 'var(--accent-blue-light)',
                        transition: 'all var(--transition-base)',
                      }}
                    >
                      <LayoutDashboard size={15} /> Admin
                    </Link>
                    <button
                      onClick={() => signOut()}
                      title="Sign out"
                      style={{
                        display: 'flex', alignItems: 'center', padding: '8px',
                        background: 'none', border: 'none', cursor: 'pointer',
                        borderRadius: '8px', transition: 'background var(--transition-base)',
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <LogOut size={18} color="var(--text-muted)" />
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      style={{
                        padding: '7px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: '600',
                        color: 'var(--text-secondary)', transition: 'all var(--transition-base)',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/login"
                      state={{ tab: 'signup' }}
                      style={{
                        padding: '7px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: '700',
                        backgroundColor: 'var(--accent-blue)', color: '#fff',
                        transition: 'background var(--transition-base)',
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--primary-hover)'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--accent-blue)'}
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </div>

              {/* Mobile hamburger */}
              <button
                className="mobile-nav-btn"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Toggle menu"
                style={{
                  display: 'none', background: 'none', border: 'none',
                  cursor: 'pointer', padding: '8px', borderRadius: '8px',
                  transition: 'background var(--transition-base)',
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                {mobileOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </Container>
      </nav>

      {/* ── Mobile menu drawer ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            style={{
              position: 'fixed', top: 'var(--navbar-height)', left: 0, right: 0,
              overflow: 'hidden', backgroundColor: '#fff',
              borderBottom: '1px solid var(--border-color)',
              zIndex: 'calc(var(--z-sticky) - 1)',
              boxShadow: 'var(--shadow-lg)',
            }}
          >
            <Container>
              <div style={{ padding: '16px 0', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {NAV_LINKS.map(({ label, to }) => (
                  <Link
                    key={to}
                    to={to}
                    onClick={() => setMobileOpen(false)}
                    style={{
                      padding: '12px 14px', borderRadius: '10px',
                      fontWeight: '600', fontSize: '15px',
                      color: isActive(to) ? 'var(--accent-blue)' : 'var(--text-primary)',
                      backgroundColor: isActive(to) ? 'var(--accent-blue-light)' : 'transparent',
                    }}
                  >
                    {label}
                  </Link>
                ))}
                <div style={{ height: '1px', backgroundColor: 'var(--border-color)', margin: '8px 0' }} />
                {user ? (
                  <>
                    <Link to="/profile" onClick={() => setMobileOpen(false)} style={{ padding: '12px 14px', borderRadius: '10px', fontWeight: '600', color: 'var(--text-primary)' }}>
                      Profile
                    </Link>
                    <Link to="/admin" onClick={() => setMobileOpen(false)} style={{ padding: '12px 14px', borderRadius: '10px', fontWeight: '600', color: 'var(--accent-blue)' }}>
                      Admin Panel
                    </Link>
                    <button
                      onClick={() => { signOut(); setMobileOpen(false); }}
                      style={{
                        padding: '12px 14px', borderRadius: '10px', textAlign: 'left',
                        background: 'none', border: 'none', fontWeight: '600', fontSize: '15px',
                        color: 'var(--danger)', cursor: 'pointer', fontFamily: 'inherit',
                        display: 'flex', alignItems: 'center', gap: '8px',
                      }}
                    >
                      <LogOut size={16} /> Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setMobileOpen(false)} style={{ padding: '12px 14px', borderRadius: '10px', fontWeight: '600', color: 'var(--text-primary)' }}>
                      Sign In
                    </Link>
                    <Link to="/login" state={{ tab: 'signup' }} onClick={() => setMobileOpen(false)} style={{ padding: '12px 14px', borderRadius: '10px', fontWeight: '700', color: '#fff', backgroundColor: 'var(--accent-blue)', textAlign: 'center', marginTop: '4px' }}>
                      Create Account
                    </Link>
                  </>
                )}
              </div>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
