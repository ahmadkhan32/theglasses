import React, { useEffect, useState } from 'react';
import { AlertCircle, Pencil, Trash2 } from 'lucide-react';
import Container from '../../components/layout/Container';
import Button from '../../components/ui/Button';
import Loader from '../../components/ui/Loader';
import Modal from '../../components/ui/Modal';
import { useToast } from '../../components/ui/Toast';
import { supabase } from '../../services/supabaseClient';

const DEMO_USERS = [
  { id: 'demo-user-1', name: 'Ayesha Khan', phone: '+92 300 1234567', address: 'Lahore, Pakistan', is_admin: true, created_at: '2026-01-10T10:00:00Z' },
  { id: 'demo-user-2', name: 'Sara Ahmed', phone: '+92 301 7654321', address: 'Karachi, Pakistan', is_admin: false, created_at: '2026-02-14T08:20:00Z' },
  { id: 'demo-user-3', name: 'Fatima Noor', phone: '+92 333 1122334', address: 'Islamabad, Pakistan', is_admin: false, created_at: '2026-03-01T15:45:00Z' },
];

const EMPTY_FORM = {
  name: '',
  phone: '',
  address: '',
  avatar_url: '',
  is_admin: false,
};

const AdminUsers = () => {
  const toast = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;

      if (data && data.length > 0) {
        setUsers(data);
        setIsDemo(false);
      } else {
        setUsers(DEMO_USERS);
        setIsDemo(true);
      }
    } catch {
      setUsers(DEMO_USERS);
      setIsDemo(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const openEdit = (user) => {
    setEditItem(user);
    setForm({
      name: user.name || '',
      phone: user.phone || '',
      address: user.address || '',
      avatar_url: user.avatar_url || '',
      is_admin: Boolean(user.is_admin),
    });
    setModalOpen(true);
  };

  const handleSave = async (event) => {
    event.preventDefault();
    if (!editItem) return;
    setSaving(true);

    try {
      const { error } = await supabase
        .from('users')
        .update(form)
        .eq('id', editItem.id);
      if (error) throw error;

      toast?.addToast('User updated successfully.', 'success');
      setModalOpen(false);
      setUsers((prev) => prev.map((item) => (item.id === editItem.id ? { ...item, ...form } : item)));
    } catch (error) {
      toast?.addToast(error.message || 'Could not update user.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete user ${name || id}?`)) return;
    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', id);
      if (error) throw error;

      setUsers((prev) => prev.filter((user) => user.id !== id));
      toast?.addToast('User deleted.', 'info');
    } catch {
      toast?.addToast('Could not delete user.', 'error');
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
          <h1 style={{ fontSize: '28px', fontWeight: '800' }}>Users ({users.length})</h1>
        </div>

        {isDemo && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            backgroundColor: '#fef3c7', color: '#92400e',
            padding: '10px 16px', borderRadius: '10px', fontSize: '13px', fontWeight: '600',
            marginBottom: '24px',
          }}>
            <AlertCircle size={15} />
            Showing demo users. Use authenticated admin session with proper RLS policies for live updates.
          </div>
        )}

        <div style={{ backgroundColor: '#fff', borderRadius: '16px', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--bg-secondary)' }}>
                {['User', 'Phone', 'Address', 'Role', 'Joined', 'Actions'].map((heading) => (
                  <th key={heading} style={{ padding: '14px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} style={{ borderTop: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '12px 16px', fontWeight: '600' }}>{user.name || user.id.slice(0, 8)}</td>
                  <td style={{ padding: '12px 16px' }}>{user.phone || '-'}</td>
                  <td style={{ padding: '12px 16px', maxWidth: '260px' }}>{user.address || '-'}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{
                      fontSize: '12px', fontWeight: '700', padding: '3px 8px', borderRadius: '100px',
                      backgroundColor: user.is_admin ? '#eff6ff' : '#f8fafc',
                      color: user.is_admin ? '#1d4ed8' : '#64748b',
                    }}>
                      {user.is_admin ? 'Admin' : 'Customer'}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    {user.created_at ? new Date(user.created_at).toLocaleDateString('en-PK') : '-'}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => openEdit(user)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--accent-blue)' }}>
                        <Pencil size={16} />
                      </button>
                      <button onClick={() => handleDelete(user.id, user.name)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ padding: '18px 16px', color: 'var(--text-secondary)', textAlign: 'center' }}>
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Container>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Edit User" maxWidth="520px">
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>Name</label>
            <input
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              style={{ width: '100%', padding: '9px 12px', border: '1px solid var(--border-color)', borderRadius: '8px', fontSize: '14px', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>Phone</label>
            <input
              name="phone"
              type="text"
              value={form.phone}
              onChange={handleChange}
              style={{ width: '100%', padding: '9px 12px', border: '1px solid var(--border-color)', borderRadius: '8px', fontSize: '14px', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>Address</label>
            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              rows={3}
              style={{ width: '100%', padding: '9px 12px', border: '1px solid var(--border-color)', borderRadius: '8px', fontSize: '14px', outline: 'none', fontFamily: 'inherit', resize: 'vertical', boxSizing: 'border-box' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>Avatar URL</label>
            <input
              name="avatar_url"
              type="text"
              value={form.avatar_url}
              onChange={handleChange}
              style={{ width: '100%', padding: '9px 12px', border: '1px solid var(--border-color)', borderRadius: '8px', fontSize: '14px', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
            />
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', cursor: 'pointer' }}>
            <input type="checkbox" name="is_admin" checked={form.is_admin} onChange={handleChange} style={{ accentColor: 'var(--accent-blue)', width: '16px', height: '16px' }} />
            Admin User
          </label>

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '4px' }}>
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Update'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminUsers;
