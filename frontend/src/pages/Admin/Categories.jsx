import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2, AlertCircle } from 'lucide-react';
import Container from '../../components/layout/Container';
import Button from '../../components/ui/Button';
import Loader from '../../components/ui/Loader';
import Modal from '../../components/ui/Modal';
import { useToast } from '../../components/ui/Toast';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../../services/categoryService';
import { DEMO_CATEGORIES } from '../../utils/constants';

const slugify = (value = '') =>
  String(value)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

const EMPTY_FORM = {
  name: '',
  slug: '',
  description: '',
  image: '',
};

const AdminCategories = () => {
  const toast = useToast();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [slugTouched, setSlugTouched] = useState(false);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const data = await getCategories();
      if (data && data.length > 0) {
        setCategories(data);
        setIsDemo(false);
      } else {
        setCategories(DEMO_CATEGORIES);
        setIsDemo(true);
      }
    } catch {
      setCategories(DEMO_CATEGORIES);
      setIsDemo(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const openCreate = () => {
    setEditItem(null);
    setForm(EMPTY_FORM);
    setSlugTouched(false);
    setModalOpen(true);
  };

  const openEdit = (category) => {
    setEditItem(category);
    setForm({
      name: category.name || '',
      slug: category.slug || '',
      description: category.description || '',
      image: category.image || '',
    });
    setSlugTouched(true);
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        slug: form.slug ? slugify(form.slug) : slugify(form.name),
      };

      if (editItem) {
        await updateCategory(editItem.id, payload);
        toast?.addToast('Category updated successfully!', 'success');
      } else {
        await createCategory(payload);
        toast?.addToast('Category created successfully!', 'success');
      }
      setModalOpen(false);
      loadCategories();
    } catch (err) {
      toast?.addToast(err.message || 'Error saving category.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete category "${name}"?`)) return;
    try {
      await deleteCategory(id);
      toast?.addToast('Category deleted.', 'info');
      setCategories((prev) => prev.filter((category) => category.id !== id));
    } catch {
      toast?.addToast('Could not delete category.', 'error');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'name') {
      setForm((prev) => ({
        ...prev,
        name: value,
        slug: slugTouched ? prev.slug : slugify(value),
      }));
      return;
    }

    if (name === 'slug') {
      setSlugTouched(true);
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  if (loading) return <Loader fullPage />;

  return (
    <div style={{ backgroundColor: 'var(--bg-secondary)', minHeight: '100vh', padding: '48px 0' }}>
      <Container>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: isDemo ? '16px' : '32px', flexWrap: 'wrap', gap: '12px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '800' }}>Categories ({categories.length})</h1>
          <Button onClick={openCreate}><Plus size={16} /> Add Category</Button>
        </div>

        {isDemo && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            backgroundColor: '#fef3c7', color: '#92400e',
            padding: '10px 16px', borderRadius: '10px', fontSize: '13px', fontWeight: '600',
            marginBottom: '24px',
          }}>
            <AlertCircle size={15} />
            Showing demo categories — connect Supabase to manage real categories
          </div>
        )}

        <div style={{ backgroundColor: '#fff', borderRadius: '16px', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--bg-secondary)' }}>
                {['Image', 'Name', 'Slug', 'Description', 'Actions'].map((heading) => (
                  <th key={heading} style={{ padding: '14px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.id} style={{ borderTop: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '12px 16px' }}>
                    <img
                      src={category.image || category.image_url || 'https://via.placeholder.com/80?text=Cat'}
                      alt={category.name}
                      style={{ width: '52px', height: '40px', objectFit: 'cover', borderRadius: '8px', backgroundColor: 'var(--bg-secondary)' }}
                      onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/80?text=Cat'; }}
                    />
                  </td>
                  <td style={{ padding: '12px 16px', fontWeight: '600', fontSize: '14px' }}>{category.name}</td>
                  <td style={{ padding: '12px 16px', fontSize: '14px', color: 'var(--text-secondary)' }}>{category.slug}</td>
                  <td style={{ padding: '12px 16px', fontSize: '14px', color: 'var(--text-secondary)', maxWidth: '300px' }}>
                    {category.description || 'No description'}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => openEdit(category)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--accent-blue)' }}>
                        <Pencil size={16} />
                      </button>
                      <button onClick={() => handleDelete(category.id, category.name)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {categories.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ padding: '18px 16px', color: 'var(--text-secondary)', textAlign: 'center' }}>
                    No categories found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Container>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editItem ? 'Edit Category' : 'Add Category'} maxWidth="500px">
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>Name</label>
            <input
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '9px 12px', border: '1px solid var(--border-color)', borderRadius: '8px', fontSize: '14px', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>Slug</label>
            <input
              name="slug"
              type="text"
              value={form.slug}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '9px 12px', border: '1px solid var(--border-color)', borderRadius: '8px', fontSize: '14px', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              style={{ width: '100%', padding: '9px 12px', border: '1px solid var(--border-color)', borderRadius: '8px', fontSize: '14px', outline: 'none', fontFamily: 'inherit', resize: 'vertical', boxSizing: 'border-box' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>Image URL</label>
            <input
              name="image"
              type="text"
              value={form.image}
              onChange={handleChange}
              placeholder="https://..."
              style={{ width: '100%', padding: '9px 12px', border: '1px solid var(--border-color)', borderRadius: '8px', fontSize: '14px', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '4px' }}>
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={saving}>{saving ? 'Saving…' : editItem ? 'Update' : 'Create'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminCategories;
