import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, User, MapPin, Phone, Edit2, Check } from 'lucide-react';
import Container from '../components/layout/Container';
import Button from '../components/ui/Button';
import Loader from '../components/ui/Loader';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/ui/Toast';
import { getUserProfile, updateUserProfile } from '../services/api/users';
import { getUserOrders } from '../services/api/orders';
import { formatPrice } from '../utils/helpers';
import { ORDER_STATUSES } from '../utils/constants';

const statusColors = {
  pending:    { bg: '#fef3c7', color: '#92400e' },
  processing: { bg: '#dbeafe', color: '#1e40af' },
  shipped:    { bg: '#ede9fe', color: '#5b21b6' },
  delivered:  { bg: '#d1fae5', color: '#065f46' },
  cancelled:  { bg: '#fee2e2', color: '#991b1b' },
};

const Profile = () => {
  const { user, signOut } = useAuth();
  const toast = useToast();

  const [profile, setProfile]   = useState(null);
  const [orders,  setOrders]    = useState([]);
  const [loading, setLoading]   = useState(true);
  const [editing, setEditing]   = useState(false);
  const [form,    setForm]      = useState({ name: '', phone: '', address: '' });
  const [saving,  setSaving]    = useState(false);
  const [activeTab, setTab]     = useState('orders');

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      setLoading(true);
      try {
        const [p, o] = await Promise.all([getUserProfile(user.id), getUserOrders()]);
        setProfile(p);
        setForm({ name: p.name || '', phone: p.phone || '', address: p.address || '' });
        setOrders(o || []);
      } catch {
        // Profile may not exist yet (first login)
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const updated = await updateUserProfile(user.id, form);
      setProfile(updated);
      setEditing(false);
      toast?.addToast('Profile updated!', 'success');
    } catch {
      toast?.addToast('Could not save profile.', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader fullPage />;

  return (
    <div style={{ backgroundColor: 'var(--bg-secondary)', minHeight: '100vh', padding: '48px 0' }}>
      <Container>
        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '32px', alignItems: 'start' }} className="profile-grid">

          {/* Left sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Avatar card */}
            <div style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '24px', border: '1px solid var(--border-color)', textAlign: 'center' }}>
              <div style={{
                width: '72px', height: '72px', borderRadius: '50%',
                backgroundColor: 'var(--accent-blue-light)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 12px', fontSize: '28px', fontWeight: '800', color: 'var(--accent-blue)',
              }}>
                {(profile?.name || user?.email || 'G')[0].toUpperCase()}
              </div>
              <div style={{ fontWeight: '700', fontSize: '16px', marginBottom: '4px' }}>{profile?.name || 'My Account'}</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>{user?.email}</div>
            </div>

            {/* Nav */}
            <div style={{ backgroundColor: '#fff', borderRadius: '16px', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
              {[
                { id: 'orders',  icon: <Package size={16} />,  label: 'My Orders' },
                { id: 'profile', icon: <User size={16} />,     label: 'Profile Info' },
              ].map(({ id, icon, label }) => (
                <button
                  key={id}
                  onClick={() => setTab(id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    width: '100%', padding: '14px 20px', border: 'none',
                    background: activeTab === id ? 'var(--accent-blue-light)' : '#fff',
                    color: activeTab === id ? 'var(--accent-blue)' : 'var(--text-secondary)',
                    fontWeight: activeTab === id ? '700' : '500',
                    fontSize: '14px', cursor: 'pointer', fontFamily: 'inherit',
                    borderBottom: '1px solid var(--border-color)',
                  }}
                >
                  {icon} {label}
                </button>
              ))}
            </div>

            <Button variant="outline" onClick={signOut} style={{ color: '#ef4444', borderColor: '#ef4444' }}>
              Sign Out
            </Button>
          </div>

          {/* Right content */}
          <div>
            {activeTab === 'orders' && (
              <div>
                <h2 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '20px' }}>My Orders</h2>
                {orders.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '60px', backgroundColor: '#fff', borderRadius: '16px', border: '1px solid var(--border-color)', color: 'var(--text-light)' }}>
                    <Package size={48} strokeWidth={1} style={{ marginBottom: '16px' }} />
                    <p>No orders yet. <a href="/shop" style={{ color: 'var(--accent-blue)' }}>Start shopping!</a></p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {orders.map((order) => {
                      const sc = statusColors[order.status] || statusColors.pending;
                      return (
                        <motion.div
                          key={order.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '20px', border: '1px solid var(--border-color)' }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                            <div>
                              <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '2px' }}>
                                {new Date(order.created_at).toLocaleDateString('en-PK', { year: 'numeric', month: 'short', day: 'numeric' })}
                              </div>
                              <div style={{ fontWeight: '700', fontSize: '15px' }}>#{order.id.slice(0, 8).toUpperCase()}</div>
                            </div>
                            <span style={{
                              fontSize: '12px', fontWeight: '700',
                              padding: '4px 10px', borderRadius: '100px',
                              backgroundColor: sc.bg, color: sc.color,
                              textTransform: 'capitalize',
                            }}>
                              {order.status}
                            </span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                            <span style={{ color: 'var(--text-secondary)' }}>{order.order_items?.length || 0} items · {order.payment_method}</span>
                            <span style={{ fontWeight: '800', color: 'var(--accent-blue)' }}>{formatPrice(order.total)}</span>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'profile' && (
              <div style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '28px', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <h2 style={{ fontSize: '22px', fontWeight: '800' }}>Profile Information</h2>
                  {!editing ? (
                    <Button variant="outline" onClick={() => setEditing(true)} size="sm">
                      <Edit2 size={14} /> Edit
                    </Button>
                  ) : (
                    <Button onClick={handleSave} disabled={saving} size="sm">
                      <Check size={14} /> {saving ? 'Saving…' : 'Save'}
                    </Button>
                  )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {[
                    { icon: <User size={16} />,    label: 'Full Name',   key: 'name',    placeholder: 'Enter your name'    },
                    { icon: <Phone size={16} />,   label: 'Phone',       key: 'phone',   placeholder: 'Enter phone number' },
                    { icon: <MapPin size={16} />,  label: 'Address',     key: 'address', placeholder: 'Enter your address' },
                  ].map(({ icon, label, key, placeholder }) => (
                    <div key={key}>
                      <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {icon} {label}
                      </label>
                      {editing ? (
                        <input
                          value={form[key]}
                          onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                          placeholder={placeholder}
                          style={{
                            width: '100%', padding: '10px 14px',
                            border: '1px solid var(--border-color)', borderRadius: '10px',
                            fontSize: '14px', outline: 'none', fontFamily: 'inherit',
                            boxSizing: 'border-box',
                          }}
                        />
                      ) : (
                        <div style={{ fontSize: '15px', color: form[key] ? 'var(--text-primary)' : 'var(--text-light)' }}>
                          {form[key] || placeholder}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Profile;
