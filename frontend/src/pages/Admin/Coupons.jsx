import React, { useEffect, useState } from 'react';
import { AlertCircle, Pencil, Plus, Trash2 } from 'lucide-react';
import Container from '../../components/layout/Container';
import Button from '../../components/ui/Button';
import Loader from '../../components/ui/Loader';
import Modal from '../../components/ui/Modal';
import { useToast } from '../../components/ui/Toast';
import { createCoupon, deleteCoupon, getCoupons, updateCoupon } from '../../services/api/coupons';

const DEMO_COUPONS = [
  { id: 'demo-coupon-1', code: 'WELCOME10', discount: 10, min_order: 0, active: true, expires_at: null },
  { id: 'demo-coupon-2', code: 'SAVE20', discount: 20, min_order: 2000, active: true, expires_at: null },
  { id: 'demo-coupon-3', code: 'EID15', discount: 15, min_order: 1500, active: false, expires_at: '2026-12-31T00:00:00.000Z' },
];

const EMPTY_FORM = {
  code: '',
  discount: 10,
  min_order: 0,
  active: true,
  expires_at: '',
};

const AdminCoupons = () => {
  const toast = useToast();
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const loadCoupons = async () => {
    setLoading(true);
    try {
      const data = await getCoupons();
      if (data.length > 0) {
        setCoupons(data);
        setIsDemo(false);
      } else {
        setCoupons(DEMO_COUPONS);
        setIsDemo(true);
      }
    } catch {
      setCoupons(DEMO_COUPONS);
      setIsDemo(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCoupons();
  }, []);

  const openCreate = () => {
    setEditItem(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  };

  const openEdit = (coupon) => {
    setEditItem(coupon);
    setForm({
      code: coupon.code || '',
      discount: coupon.discount ?? 10,
      min_order: coupon.min_order ?? 0,
      active: Boolean(coupon.active),
      expires_at: coupon.expires_at ? String(coupon.expires_at).slice(0, 10) : '',
    });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      code: String(form.code || '').trim().toUpperCase(),
      discount: Number(form.discount),
      min_order: Number(form.min_order) || 0,
      active: Boolean(form.active),
      expires_at: form.expires_at ? new Date(form.expires_at).toISOString() : null,
    };

    try {
      if (editItem) {
        await updateCoupon(editItem.id, payload);
        toast?.addToast('Coupon updated successfully.', 'success');
      } else {
        await createCoupon(payload);
        toast?.addToast('Coupon created successfully.', 'success');
      }
      setModalOpen(false);
      loadCoupons();
    } catch (error) {
      toast?.addToast(error.message || 'Could not save coupon.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, code) => {
    if (!window.confirm(`Delete coupon ${code}?`)) return;
    try {
      await deleteCoupon(id);
      setCoupons((prev) => prev.filter((item) => item.id !== id));
      toast?.addToast('Coupon deleted.', 'info');
    } catch {
      toast?.addToast('Could not delete coupon.', 'error');
    }
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  if (loading) return <Loader fullPage />;

  return (
    <div style={{ backgroundColor: 'var(--bg-secondary)', minHeight: '100vh', padding: '48px 0' }}>
      <Container>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: isDemo ? '16px' : '32px', flexWrap: 'wrap', gap: '12px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '800' }}>Coupons ({coupons.length})</h1>
          <Button onClick={openCreate}><Plus size={16} /> Add Coupon</Button>
        </div>

        {isDemo && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            backgroundColor: '#fef3c7', color: '#92400e',
            padding: '10px 16px', borderRadius: '10px', fontSize: '13px', fontWeight: '600',
            marginBottom: '24px',
          }}>
            <AlertCircle size={15} />
            Showing demo coupons. Connect Supabase admin policies to manage real coupons.
          </div>
        )}

        <div style={{ backgroundColor: '#fff', borderRadius: '16px', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--bg-secondary)' }}>
                {['Code', 'Discount', 'Min Order', 'Status', 'Expires', 'Actions'].map((heading) => (
                  <th key={heading} style={{ padding: '14px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {coupons.map((coupon) => (
                <tr key={coupon.id} style={{ borderTop: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '12px 16px', fontWeight: '700' }}>{coupon.code}</td>
                  <td style={{ padding: '12px 16px' }}>{Number(coupon.discount)}%</td>
                  <td style={{ padding: '12px 16px' }}>Rs. {Number(coupon.min_order || 0)}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{
                      fontSize: '12px', fontWeight: '700', padding: '3px 8px', borderRadius: '100px',
                      backgroundColor: coupon.active ? '#f0fdf4' : '#f8fafc',
                      color: coupon.active ? '#059669' : '#94a3b8',
                    }}>
                      {coupon.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    {coupon.expires_at ? new Date(coupon.expires_at).toLocaleDateString('en-PK') : 'No expiry'}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => openEdit(coupon)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--accent-blue)' }}>
                        <Pencil size={16} />
                      </button>
                      <button onClick={() => handleDelete(coupon.id, coupon.code)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {coupons.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ padding: '18px 16px', color: 'var(--text-secondary)', textAlign: 'center' }}>
                    No coupons found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Container>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editItem ? 'Edit Coupon' : 'Add Coupon'} maxWidth="520px">
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>Code</label>
              <input
                name="code"
                type="text"
                value={form.code}
                onChange={handleChange}
                required
                style={{ width: '100%', padding: '9px 12px', border: '1px solid var(--border-color)', borderRadius: '8px', fontSize: '14px', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box', textTransform: 'uppercase' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>Discount (%)</label>
              <input
                name="discount"
                type="number"
                min={1}
                max={100}
                value={form.discount}
                onChange={handleChange}
                required
                style={{ width: '100%', padding: '9px 12px', border: '1px solid var(--border-color)', borderRadius: '8px', fontSize: '14px', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>Min Order (Rs.)</label>
              <input
                name="min_order"
                type="number"
                min={0}
                value={form.min_order}
                onChange={handleChange}
                style={{ width: '100%', padding: '9px 12px', border: '1px solid var(--border-color)', borderRadius: '8px', fontSize: '14px', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>Expiry Date</label>
              <input
                name="expires_at"
                type="date"
                value={form.expires_at}
                onChange={handleChange}
                style={{ width: '100%', padding: '9px 12px', border: '1px solid var(--border-color)', borderRadius: '8px', fontSize: '14px', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
              />
            </div>
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', cursor: 'pointer' }}>
            <input type="checkbox" name="active" checked={form.active} onChange={handleChange} style={{ accentColor: 'var(--accent-blue)', width: '16px', height: '16px' }} />
            Active
          </label>

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '4px' }}>
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={saving}>{saving ? 'Saving...' : editItem ? 'Update' : 'Create'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminCoupons;
