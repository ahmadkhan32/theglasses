import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, Package, Users, TrendingUp, AlertCircle } from 'lucide-react';
import Container from '../../components/layout/Container';
import Loader from '../../components/ui/Loader';
import { supabase } from '../../services/supabaseClient';
import { formatPrice } from '../../utils/helpers';
import { DEMO_PRODUCTS } from '../../utils/constants';

const DEMO_STATS = {
  orderCount:   24,
  productCount: DEMO_PRODUCTS.length,
  revenue:      148500,
  userCount:    31,
  isDemo:       true,
};

const Dashboard = () => {
  const [stats, setStats]    = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [
          { count: orderCount, error: e1 },
          { count: productCount },
          { data: revenueData },
          { count: userCount },
        ] = await Promise.all([
          supabase.from('orders').select('*', { count: 'exact', head: true }),
          supabase.from('products').select('*', { count: 'exact', head: true }),
          supabase.from('orders').select('total').neq('status', 'cancelled'),
          supabase.from('users').select('*', { count: 'exact', head: true }),
        ]);
        if (e1) throw e1;
        const revenue = revenueData?.reduce((s, o) => s + Number(o.total), 0) || 0;
        setStats({ orderCount: orderCount || 0, productCount: productCount || 0, revenue, userCount: userCount || 0 });
      } catch {
        // Supabase not configured — show demo stats
        setStats(DEMO_STATS);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <Loader fullPage />;

  const cards = [
    { label: 'Total Revenue', value: formatPrice(stats.revenue), icon: <TrendingUp size={22} />, color: '#0066ff', bg: '#eff6ff' },
    { label: 'Total Orders',  value: stats.orderCount,           icon: <ShoppingBag size={22} />, color: '#7c3aed', bg: '#f5f3ff' },
    { label: 'Products',      value: stats.productCount,         icon: <Package size={22} />,     color: '#059669', bg: '#f0fdf4' },
    { label: 'Customers',     value: stats.userCount,            icon: <Users size={22} />,       color: '#dc2626', bg: '#fef2f2' },
  ];

  return (
    <div style={{ backgroundColor: 'var(--bg-secondary)', minHeight: '100vh', padding: '48px 0' }}>
      <Container>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px', flexWrap: 'wrap', gap: '12px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '800' }}>Admin Dashboard</h1>
          {stats.isDemo && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              backgroundColor: '#fef3c7', color: '#92400e',
              padding: '8px 14px', borderRadius: '100px', fontSize: '13px', fontWeight: '600',
            }}>
              <AlertCircle size={15} />
              Demo data — connect Supabase to see live stats
            </div>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '40px' }}>
          {cards.map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              style={{
                backgroundColor: '#fff', borderRadius: '16px', padding: '24px',
                border: '1px solid var(--border-color)',
              }}
            >
              <div style={{
                width: '48px', height: '48px', borderRadius: '12px',
                backgroundColor: card.bg, color: card.color,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: '16px',
              }}>
                {card.icon}
              </div>
              <div style={{ fontSize: '24px', fontWeight: '800', marginBottom: '4px' }}>{card.value}</div>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{card.label}</div>
            </motion.div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
          <Link to="/admin/products" style={{
            display: 'block', backgroundColor: '#fff', borderRadius: '16px', padding: '24px',
            border: '1px solid var(--border-color)', textDecoration: 'none', fontWeight: '700', color: 'var(--text-primary)', fontSize: '16px',
          }}>
            📦 Manage Products →
          </Link>
          <Link to="/admin/categories" style={{
            display: 'block', backgroundColor: '#fff', borderRadius: '16px', padding: '24px',
            border: '1px solid var(--border-color)', textDecoration: 'none', fontWeight: '700', color: 'var(--text-primary)', fontSize: '16px',
          }}>
            🏷️ Manage Categories →
          </Link>
          <Link to="/admin/orders" style={{
            display: 'block', backgroundColor: '#fff', borderRadius: '16px', padding: '24px',
            border: '1px solid var(--border-color)', textDecoration: 'none', fontWeight: '700', color: 'var(--text-primary)', fontSize: '16px',
          }}>
            📋 Manage Orders →
          </Link>
          <Link to="/admin/users" style={{
            display: 'block', backgroundColor: '#fff', borderRadius: '16px', padding: '24px',
            border: '1px solid var(--border-color)', textDecoration: 'none', fontWeight: '700', color: 'var(--text-primary)', fontSize: '16px',
          }}>
            👥 Manage Users →
          </Link>
          <Link to="/admin/coupons" style={{
            display: 'block', backgroundColor: '#fff', borderRadius: '16px', padding: '24px',
            border: '1px solid var(--border-color)', textDecoration: 'none', fontWeight: '700', color: 'var(--text-primary)', fontSize: '16px',
          }}>
            🎟️ Manage Coupons →
          </Link>
        </div>
      </Container>
    </div>
  );
};

export default Dashboard;

