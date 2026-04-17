import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail } from 'lucide-react';
import Container from '../layout/Container';
import Button from '../ui/Button';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    setDone(true);
    setEmail('');
  };

  return (
    <section style={{
      padding: '80px 0',
      background: 'linear-gradient(135deg, #eff6ff, #f0fdf4)',
    }}>
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{
            maxWidth: '560px',
            margin: '0 auto',
            textAlign: 'center',
          }}
        >
          <div style={{
            width: '60px', height: '60px', borderRadius: '50%',
            backgroundColor: 'var(--accent-blue-light)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 20px',
          }}>
            <Mail size={26} color="var(--accent-blue)" />
          </div>

          <h2 style={{ fontSize: '30px', fontWeight: '800', letterSpacing: '-0.5px', marginBottom: '12px' }}>
            Get Exclusive Deals
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '15px', marginBottom: '32px' }}>
            Subscribe to our newsletter and receive 10% off your first order, plus early access to new arrivals.
          </p>

          {done ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{
                backgroundColor: '#f0fdf4',
                border: '1px solid #bbf7d0',
                borderRadius: '12px',
                padding: '16px 24px',
                color: '#059669',
                fontWeight: '600',
                fontSize: '15px',
              }}
            >
              ✓ You're subscribed! Check your inbox for your discount code.
            </motion.div>
          ) : (
            <form
              onSubmit={handleSubmit}
              style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                style={{
                  flex: '1', minWidth: '220px',
                  padding: '12px 16px',
                  border: '1px solid var(--border-color)',
                  borderRadius: '10px',
                  fontSize: '14px',
                  outline: 'none',
                  fontFamily: 'inherit',
                }}
              />
              <Button type="submit" size="md">
                Subscribe
              </Button>
            </form>
          )}

          <p style={{ color: 'var(--text-light)', fontSize: '12px', marginTop: '16px' }}>
            No spam, ever. Unsubscribe any time.
          </p>
        </motion.div>
      </Container>
    </section>
  );
};

export default Newsletter;
