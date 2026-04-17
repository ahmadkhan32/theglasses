import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Globe, Share2, Heart, Mail, Phone, MapPin } from 'lucide-react';
import Container from './Container';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletter = (e) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setEmail('');
  };

  return (
    <footer style={{ backgroundColor: '#0a0f1e', color: '#94a3b8', paddingTop: '60px' }}>
      <Container>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '48px',
          paddingBottom: '48px',
          borderBottom: '1px solid #1e293b',
        }}>
          {/* Brand */}
          <div>
            <div style={{ fontSize: '24px', fontWeight: '800', color: '#fff', marginBottom: '12px' }}>
              The Glases
            </div>
            <p style={{ fontSize: '14px', lineHeight: '1.7', marginBottom: '20px' }}>
              Premium eyewear for every lifestyle. Style, protection, and comfort.
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              {[
                { Icon: Globe,  label: 'Website' },
                { Icon: Share2, label: 'Share'   },
                { Icon: Heart,  label: 'Wishlist' },
              ].map(({ Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  style={{
                    width: '36px', height: '36px', borderRadius: '50%',
                    backgroundColor: '#1e293b', display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                    transition: 'background-color 0.2s',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#3b82f6'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#1e293b'; }}
                >
                  <Icon size={16} color="#fff" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ color: '#fff', fontWeight: '700', marginBottom: '16px', fontSize: '15px' }}>Quick Links</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { label: 'Shop', to: '/shop' },
                { label: 'Try On', to: '/try-on' },
                { label: 'My Orders', to: '/profile' },
                { label: 'Cart', to: '/cart' },
              ].map(({ label, to }) => (
                <Link
                  key={to}
                  to={to}
                  style={{ color: '#94a3b8', fontSize: '14px', transition: 'color 0.2s' }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#fff'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = '#94a3b8'; }}
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ color: '#fff', fontWeight: '700', marginBottom: '16px', fontSize: '15px' }}>Contact</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Phone size={14} /> <span>+92 300 1234567</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Mail size={14} /> <span>hello@theglases.pk</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MapPin size={14} /> <span>Lahore, Pakistan</span>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h4 style={{ color: '#fff', fontWeight: '700', marginBottom: '16px', fontSize: '15px' }}>Newsletter</h4>
            {subscribed ? (
              <p style={{ color: '#22c55e', fontSize: '14px' }}>Thanks for subscribing!</p>
            ) : (
              <form onSubmit={handleNewsletter} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  required
                  style={{
                    padding: '10px 14px', borderRadius: '8px',
                    border: '1px solid #1e293b', backgroundColor: '#1e293b',
                    color: '#fff', fontSize: '14px', outline: 'none',
                    fontFamily: 'inherit',
                  }}
                />
                <button
                  type="submit"
                  style={{
                    padding: '10px 14px', borderRadius: '8px', border: 'none',
                    backgroundColor: '#3b82f6', color: '#fff',
                    fontWeight: '600', fontSize: '14px', cursor: 'pointer',
                    fontFamily: 'inherit',
                  }}
                >
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </div>

        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '20px 0', fontSize: '13px', flexWrap: 'wrap', gap: '8px',
        }}>
          <span> {new Date().getFullYear()} The Glases. All rights reserved.</span>
          <span style={{ color: '#475569' }}>Free Shipping above Rs. 2000  10% off Bank Transfer</span>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
