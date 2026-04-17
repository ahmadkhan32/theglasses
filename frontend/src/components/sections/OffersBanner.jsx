import React from 'react';
import { motion } from 'framer-motion';
import Container from '../layout/Container';
import { Truck, CreditCard, Shield, Tag } from 'lucide-react';

const OFFERS = [
  { icon: <Truck size={28} color="#0066ff" />, title: 'Free Shipping', desc: 'On orders above Rs. 2,000' },
  { icon: <CreditCard size={28} color="#7c3aed" />, title: '10% Bank Discount', desc: 'On all bank transfer payments' },
  { icon: <Shield size={28} color="#059669" />, title: '30-Day Returns', desc: 'Hassle-free return policy' },
  { icon: <Tag size={28} color="#dc2626" />, title: 'Exclusive Deals', desc: 'Use code WELCOME10 for 10% off' },
];

const OffersBanner = () => (
  <section style={{
    background: 'linear-gradient(135deg, #0a0f1e 0%, #1e1b4b 100%)',
    padding: '60px 0',
  }}>
    <Container>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '32px',
      }}>
        {OFFERS.map((offer, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            style={{
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', textAlign: 'center', gap: '12px',
            }}
          >
            <div style={{
              width: '60px', height: '60px', borderRadius: '16px',
              backgroundColor: 'rgba(255,255,255,0.08)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {offer.icon}
            </div>
            <div>
              <div style={{ color: '#fff', fontWeight: '700', fontSize: '15px', marginBottom: '4px' }}>
                {offer.title}
              </div>
              <div style={{ color: '#94a3b8', fontSize: '13px' }}>
                {offer.desc}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </Container>
  </section>
);

export default OffersBanner;
