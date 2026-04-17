import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Container from '../../components/layout/Container';
import Loader from '../../components/ui/Loader';
import { useToast } from '../../components/ui/Toast';
import { getAllOrders, updateOrderStatus } from '../../services/api/orders';
import { formatPrice } from '../../utils/helpers';
import { ORDER_STATUSES } from '../../utils/constants';

const STATUS_COLORS = {
  pending:    { bg: '#fef3c7', color: '#92400e' },
  processing: { bg: '#dbeafe', color: '#1e40af' },
  shipped:    { bg: '#ede9fe', color: '#5b21b6' },
  delivered:  { bg: '#d1fae5', color: '#065f46' },
  cancelled:  { bg: '#fee2e2', color: '#991b1b' },
};

const AdminOrders = () => {
  const toast = useToast();
  const [orders,  setOrders]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter,  setFilter]  = useState('all');

  useEffect(() => {
    getAllOrders()
      .then((data) => setOrders(data || []))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);

  const handleStatus = async (id, status) => {
    try {
      await updateOrderStatus(id, status);
      setOrders((prev) => prev.map((o) => o.id === id ? { ...o, status } : o));
      toast?.addToast(`Order status updated to "${status}".`, 'success');
    } catch {
      toast?.addToast('Could not update status.', 'error');
    }
  };

  const filtered = filter === 'all' ? orders : orders.filter((o) => o.status === filter);

  if (loading) return <Loader fullPage />;

  return (
    <div style={{ backgroundColor: 'var(--bg-secondary)', minHeight: '100vh', padding: '48px 0' }}>
      <Container>
        <h1 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '24px' }}>Orders ({orders.length})</h1>

        {/* Status filter */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px' }}>
          {['all', ...ORDER_STATUSES].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              style={{
                padding: '6px 14px', borderRadius: '100px', border: 'none', cursor: 'pointer',
                fontSize: '13px', fontWeight: '600', fontFamily: 'inherit',
                backgroundColor: filter === s ? 'var(--accent-blue)' : '#fff',
                color: filter === s ? '#fff' : 'var(--text-secondary)',
                border: `1px solid ${filter === s ? 'var(--accent-blue)' : 'var(--border-color)'}`,
                textTransform: 'capitalize',
              }}
            >
              {s}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px', backgroundColor: '#fff', borderRadius: '16px', color: 'var(--text-light)' }}>
              No orders found.
            </div>
          )}
          {filtered.map((order) => {
            const sc = STATUS_COLORS[order.status] || STATUS_COLORS.pending;
            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ backgroundColor: '#fff', borderRadius: '14px', padding: '20px', border: '1px solid var(--border-color)' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <div style={{ fontWeight: '800', fontSize: '15px', marginBottom: '4px' }}>
                      #{order.id.slice(0, 8).toUpperCase()}
                    </div>
                    <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                      {new Date(order.created_at).toLocaleDateString('en-PK', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                      {order.shipping_address}
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: '800', fontSize: '17px', color: 'var(--accent-blue)', marginBottom: '8px' }}>
                      {formatPrice(order.total)}
                    </div>
                    <select
                      value={order.status}
                      onChange={(e) => handleStatus(order.id, e.target.value)}
                      style={{
                        padding: '5px 10px', borderRadius: '8px', border: `1px solid ${sc.color}30`,
                        backgroundColor: sc.bg, color: sc.color,
                        fontWeight: '700', fontSize: '13px', cursor: 'pointer',
                        fontFamily: 'inherit', textTransform: 'capitalize',
                      }}
                    >
                      {ORDER_STATUSES.map((s) => (
                        <option key={s} value={s} style={{ textTransform: 'capitalize' }}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Order items */}
                {order.order_items?.length > 0 && (
                  <div style={{ marginTop: '14px', paddingTop: '14px', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {order.order_items.map((item) => (
                      <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'var(--bg-secondary)', borderRadius: '8px', padding: '6px 10px', fontSize: '12px' }}>
                        {item.products?.image_url && (
                          <img src={item.products.image_url} alt="" style={{ width: '28px', height: '28px', borderRadius: '6px', objectFit: 'cover' }}
                            onError={(e) => e.currentTarget.style.display = 'none'} />
                        )}
                        <span style={{ fontWeight: '600' }}>{item.products?.name || 'Product'}</span>
                        <span style={{ color: 'var(--text-secondary)' }}>×{item.quantity}</span>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </Container>
    </div>
  );
};

export default AdminOrders;
