import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, X, AlertCircle } from 'lucide-react';
import Container from '../../components/layout/Container';
import Button from '../../components/ui/Button';
import Loader from '../../components/ui/Loader';
import Modal from '../../components/ui/Modal';
import { useToast } from '../../components/ui/Toast';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../../services/api/products';
import { supabase } from '../../services/supabaseClient';
import { formatPrice } from '../../utils/helpers';
import { DEMO_PRODUCTS, DEMO_CATEGORIES } from '../../utils/constants';

const EMPTY_FORM = {
  name: '', slug: '', price: '', old_price: '', discount: 0, stock: 100,
  image_url: '', description: '', long_description: '',
  brand: '', material: '', color: '', pattern: '',
  sizes: '["XS", "S", "M", "L", "XL", "XXL"]',
  details: '{"fit": "Regular", "care": "Machine wash"}',
  is_featured: false, in_stock: true, category_id: '',
};

const AdminProducts = () => {
  const toast = useToast();
  const [products, setProducts]   = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [isDemo, setIsDemo]       = useState(false);
  const [modalOpen, setModal]     = useState(false);
  const [editItem, setEditItem]   = useState(null);
  const [form, setForm]           = useState(EMPTY_FORM);
  const [saving, setSaving]       = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const [prods, { data: cats }] = await Promise.all([
        getProducts(),
        supabase.from('categories').select('*').order('name'),
      ]);
      if (prods && prods.length > 0) {
        setProducts(prods);
        setCategories(cats || DEMO_CATEGORIES);
        setIsDemo(false);
      } else {
        setProducts(DEMO_PRODUCTS);
        setCategories(cats || DEMO_CATEGORIES);
        setIsDemo(true);
      }
    } catch {
      setProducts(DEMO_PRODUCTS);
      setCategories(DEMO_CATEGORIES);
      setIsDemo(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditItem(null); setForm(EMPTY_FORM); setModal(true); };
  const openEdit   = (p) => {
    setEditItem(p);
    setForm({
      name: p.name || '', slug: p.slug || '', price: p.price || '',
      old_price: p.old_price || '', discount: p.discount || 0,
      stock: p.stock || 100, image_url: p.image_url || '',
      description: p.description || '', long_description: p.long_description || '',
      brand: p.brand || '', material: p.material || '', color: p.color || '', pattern: p.pattern || '',
      sizes: JSON.stringify(p.sizes || ["XS", "S", "M", "L", "XL", "XXL"]),
      details: JSON.stringify(p.details || {"fit": "Regular", "care": "Machine wash"}),
      is_featured: p.is_featured || false,
      in_stock: p.in_stock !== false, category_id: p.category_id || '',
    });
    setModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        old_price: form.old_price ? Number(form.old_price) : null,
        discount: Number(form.discount) || 0,
        stock: Number(form.stock) || 100,
        sizes: form.sizes ? JSON.parse(form.sizes) : [],
        details: form.details ? JSON.parse(form.details) : {},
      };
      if (editItem) {
        await updateProduct(editItem.id, payload);
        toast?.addToast('Product updated!', 'success');
      } else {
        await createProduct(payload);
        toast?.addToast('Product created!', 'success');
      }
      setModal(false);
      load();
    } catch (err) {
      toast?.addToast(err.message || 'Error saving product.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"?`)) return;
    try {
      await deleteProduct(id);
      toast?.addToast('Product deleted.', 'info');
      setProducts((p) => p.filter((x) => x.id !== id));
    } catch {
      toast?.addToast('Could not delete product.', 'error');
    }
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  if (loading) return <Loader fullPage />;

  return (
    <div style={{ backgroundColor: 'var(--bg-secondary)', minHeight: '100vh', padding: '48px 0' }}>
      <Container>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: isDemo ? '16px' : '32px', flexWrap: 'wrap', gap: '12px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '800' }}>Products ({products.length})</h1>
          <Button onClick={openCreate}><Plus size={16} /> Add Product</Button>
        </div>

        {isDemo && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            backgroundColor: '#fef3c7', color: '#92400e',
            padding: '10px 16px', borderRadius: '10px', fontSize: '13px', fontWeight: '600',
            marginBottom: '24px',
          }}>
            <AlertCircle size={15} />
            Showing demo products — connect Supabase to manage real inventory
          </div>
        )}

        <div style={{ backgroundColor: '#fff', borderRadius: '16px', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--bg-secondary)' }}>
                {['Image', 'Name', 'Price', 'Stock', 'Featured', 'Actions'].map((h) => (
                  <th key={h} style={{ padding: '14px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} style={{ borderTop: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '12px 16px' }}>
                    <img
                      src={p.image_url} alt={p.name}
                      style={{ width: '52px', height: '40px', objectFit: 'cover', borderRadius: '8px', backgroundColor: 'var(--bg-secondary)' }}
                      onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=80&q=60'; }}
                    />
                  </td>
                  <td style={{ padding: '12px 16px', fontWeight: '600', fontSize: '14px' }}>{p.name}</td>
                  <td style={{ padding: '12px 16px', fontSize: '14px' }}>{formatPrice(p.price)}</td>
                  <td style={{ padding: '12px 16px', fontSize: '14px' }}>{p.stock}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{
                      fontSize: '12px', fontWeight: '700', padding: '3px 8px',
                      borderRadius: '100px',
                      backgroundColor: p.is_featured ? '#f0fdf4' : '#f8fafc',
                      color: p.is_featured ? '#059669' : '#94a3b8',
                    }}>
                      {p.is_featured ? '⭐ Yes' : 'No'}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => openEdit(p)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--accent-blue)' }}>
                        <Pencil size={16} />
                      </button>
                      <button onClick={() => handleDelete(p.id, p.name)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Container>

      {/* Product Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModal(false)} title={editItem ? 'Edit Product' : 'Add Product'} maxWidth="700px">
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxHeight: '80vh', overflowY: 'auto', paddingRight: '8px' }}>
          {/* Basic Info */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            {[
              { name: 'name',      label: 'Name',         type: 'text',   required: true },
              { name: 'slug',      label: 'Slug',         type: 'text',   required: true },
              { name: 'price',     label: 'Price (Rs.)',  type: 'number', required: true },
              { name: 'old_price', label: 'Old Price',    type: 'number' },
              { name: 'discount',  label: 'Discount %',   type: 'number' },
              { name: 'stock',     label: 'Stock',        type: 'number' },
            ].map(({ name, label, type, required }) => (
              <div key={name}>
                <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>{label}</label>
                <input
                  name={name} type={type} value={form[name]} onChange={handleFormChange} required={required}
                  style={{ width: '100%', padding: '9px 12px', border: '1px solid var(--border-color)', borderRadius: '8px', fontSize: '14px', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
                />
              </div>
            ))}
          </div>

          {/* Product Details */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            {[
              { name: 'brand',    label: 'Brand',    type: 'text' },
              { name: 'material', label: 'Material', type: 'text' },
              { name: 'color',    label: 'Color',    type: 'text' },
              { name: 'pattern',  label: 'Pattern',  type: 'text' },
            ].map(({ name, label, type }) => (
              <div key={name}>
                <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>{label}</label>
                <input
                  name={name} type={type} value={form[name]} onChange={handleFormChange}
                  style={{ width: '100%', padding: '9px 12px', border: '1px solid var(--border-color)', borderRadius: '8px', fontSize: '14px', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
                />
              </div>
            ))}
          </div>

          {/* Image */}
          <div>
            <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>Image URL</label>
            <input
              name="image_url" value={form.image_url} onChange={handleFormChange}
              placeholder="https://..."
              style={{ width: '100%', padding: '9px 12px', border: '1px solid var(--border-color)', borderRadius: '8px', fontSize: '14px', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
            />
            {form.image_url && (
              <img src={form.image_url} alt="preview" style={{ marginTop: '8px', width: '100px', height: '70px', objectFit: 'cover', borderRadius: '8px', border: '1px solid var(--border-color)' }}
                onError={(e) => e.currentTarget.style.display = 'none'} />
            )}
          </div>

          {/* Category */}
          <div>
            <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>Category</label>
            <select
              name="category_id" value={form.category_id} onChange={handleFormChange}
              style={{ width: '100%', padding: '9px 12px', border: '1px solid var(--border-color)', borderRadius: '8px', fontSize: '14px', outline: 'none', fontFamily: 'inherit' }}
            >
              <option value="">Select category</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          {/* Descriptions */}
          <div>
            <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>Short Description</label>
            <textarea
              name="description" value={form.description} onChange={handleFormChange} rows={2}
              style={{ width: '100%', padding: '9px 12px', border: '1px solid var(--border-color)', borderRadius: '8px', fontSize: '14px', outline: 'none', fontFamily: 'inherit', resize: 'vertical', boxSizing: 'border-box' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>Long Description</label>
            <textarea
              name="long_description" value={form.long_description} onChange={handleFormChange} rows={3}
              style={{ width: '100%', padding: '9px 12px', border: '1px solid var(--border-color)', borderRadius: '8px', fontSize: '14px', outline: 'none', fontFamily: 'inherit', resize: 'vertical', boxSizing: 'border-box' }}
            />
          </div>

          {/* Sizes (JSON) */}
          <div>
            <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>Sizes (JSON Array)</label>
            <textarea
              name="sizes" value={form.sizes} onChange={handleFormChange} rows={2}
              placeholder='["XS", "S", "M", "L", "XL", "XXL"]'
              style={{ width: '100%', padding: '9px 12px', border: '1px solid var(--border-color)', borderRadius: '8px', fontSize: '13px', outline: 'none', fontFamily: 'monospace', resize: 'vertical', boxSizing: 'border-box' }}
            />
          </div>

          {/* Details (JSON) */}
          <div>
            <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>Specifications (JSON)</label>
            <textarea
              name="details" value={form.details} onChange={handleFormChange} rows={3}
              placeholder='{"fit": "Regular", "care": "Machine wash", "occasion": "Casual"}'
              style={{ width: '100%', padding: '9px 12px', border: '1px solid var(--border-color)', borderRadius: '8px', fontSize: '13px', outline: 'none', fontFamily: 'monospace', resize: 'vertical', boxSizing: 'border-box' }}
            />
          </div>

          {/* Checkboxes */}
          <div style={{ display: 'flex', gap: '20px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', cursor: 'pointer' }}>
              <input type="checkbox" name="is_featured" checked={form.is_featured} onChange={handleFormChange} style={{ accentColor: 'var(--accent-blue)', width: '16px', height: '16px' }} />
              Featured
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', cursor: 'pointer' }}>
              <input type="checkbox" name="in_stock" checked={form.in_stock} onChange={handleFormChange} style={{ accentColor: 'var(--accent-blue)', width: '16px', height: '16px' }} />
              In Stock
            </label>
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '4px' }}>
            <Button type="button" variant="outline" onClick={() => setModal(false)}>Cancel</Button>
            <Button type="submit" disabled={saving}>{saving ? 'Saving…' : editItem ? 'Update' : 'Create'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminProducts;
