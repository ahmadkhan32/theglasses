import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../../services/supabaseClient';
import Button from '../../components/ui/Button';
import { Pencil, Trash2, PlusCircle, AlertCircle, UploadCloud, Glasses, Package } from 'lucide-react';
import { formatPrice } from '../../utils/pricing';
import { getGlasses, uploadGlass, deleteGlass } from '../../services/api/glasses';

// ─── Tab ──────────────────────────────────────────────────────────────────────
const Tab = ({ active, onClick, icon, label }) => (
    <button
        onClick={onClick}
        style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '10px 20px', borderRadius: '10px',
            fontWeight: 700, fontSize: '14px', fontFamily: 'inherit',
            cursor: 'pointer', transition: 'all 0.2s',
            backgroundColor: active ? '#0066ff' : 'transparent',
            color: active ? '#fff' : '#64748b',
            border: active ? '2px solid #0066ff' : '2px solid #e2e8f0',
        }}
    >
        {icon}
        {label}
    </button>
);

// ─── PRODUCTS TAB ─────────────────────────────────────────────────────────────
const ProductsTab = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [formLoading, setFormLoading] = useState(false);
    const [newProduct, setNewProduct] = useState({ name: '', price: '', category: '' });
    const fileInputRef = useRef(null);

    const API_URL = 'http://localhost:5000/api/products';

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const res = await fetch(API_URL);
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to fetch');
            setProducts(data || []);
            setError(null);
        } catch (err) {
            setError(err.message || "Network Error fetching products.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchProducts(); }, []);

    const uploadImageAndSubmit = async (e) => {
        e.preventDefault();
        setFormLoading(true); setError(null);
        try {
            let imageUrl = '';
            const file = fileInputRef.current?.files[0];
            
            if (file) {
                const fileExt = file.name.split('.').pop();
                const fileName = `product-${Date.now()}.${fileExt}`;
                const { error: upErr } = await supabase.storage.from('IImages').upload(`products/${fileName}`, file);
                if (upErr) throw new Error(`Upload failed: ${upErr.message}`);
                const { data: urlData } = supabase.storage.from('IImages').getPublicUrl(`products/${fileName}`);
                imageUrl = urlData.publicUrl;
            }

            const body = {
                name: newProduct.name,
                price: parseFloat(newProduct.price),
                category: newProduct.category,
                image_url: imageUrl || undefined,
                slug: `product-${Date.now()}`
            };

            const res = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);

            setProducts([data, ...products]);
            setShowForm(false);
            setNewProduct({ name: '', price: '', category: '' });
            if (fileInputRef.current) fileInputRef.current.value = '';
        } catch (err) { setError(err.message); }
        finally { setFormLoading(false); }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setFormLoading(true);
        try {
            const res = await fetch(`${API_URL}/${editingProduct.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editingProduct)
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);

            setProducts(products.map(p => p.id === data.id ? data : p));
            setEditingProduct(null);
        } catch (err) { setError(err.message); }
        finally { setFormLoading(false); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this product permanently?')) return;
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Delete failed');
            setProducts((p) => p.filter((item) => item.id !== id));
        } catch (err) { setError(err.message); }
        setLoading(false);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-extrabold text-gray-900">Products</h2>
                <div className="flex gap-2">
                    <Button variant="primary" onClick={() => setShowForm(!showForm)} disabled={loading}>
                        <PlusCircle size={16} />
                        {showForm ? 'Cancel' : 'Add Product'}
                    </Button>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 flex items-center gap-3 border border-red-100">
                    <AlertCircle size={20} /><p>{error}</p>
                </div>
            )}

            {/* Edit Modal */}
            {editingProduct && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
                        <h3 className="text-xl font-bold mb-4">Edit Product</h3>
                        <form onSubmit={handleUpdate} className="grid gap-4">
                            <input value={editingProduct.name} onChange={e => setEditingProduct({...editingProduct, name: e.target.value})} className="p-3 border rounded-xl" placeholder="Name" />
                            <input type="number" value={editingProduct.price} onChange={e => setEditingProduct({...editingProduct, price: e.target.value})} className="p-3 border rounded-xl" placeholder="Price" />
                            <select value={editingProduct.category} onChange={e => setEditingProduct({...editingProduct, category: e.target.value})} className="p-3 border rounded-xl">
                                {['Aviator', 'Wayfarer', 'Round', 'Rectangular', 'Cat Eye', 'Blue Light', 'Sunglasses', 'UV Protection'].map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                            <div className="flex gap-2">
                                <Button type="submit" variant="primary" fullWidth disabled={formLoading}>Save</Button>
                                <Button type="button" variant="secondary" fullWidth onClick={() => setEditingProduct(null)}>Cancel</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showForm && (
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 mb-8">
                    <h3 className="text-xl font-bold mb-4">Upload New Product</h3>
                    <form onSubmit={uploadImageAndSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold mb-1">Product Name</label>
                            <input required value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:border-blue-400" placeholder="e.g. Classic Aviator Gold" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-1">Price (Rs.)</label>
                            <input required type="number" value={newProduct.price} onChange={e => setNewProduct({ ...newProduct, price: e.target.value })} className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:border-blue-400" placeholder="e.g. 3500" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-1">Category</label>
                            <select required value={newProduct.category} onChange={e => setNewProduct({ ...newProduct, category: e.target.value })} className="w-full p-3 rounded-xl border border-gray-200 text-gray-700 bg-white outline-none focus:border-blue-400">
                                <option value="">Select category</option>
                                {['Aviator', 'Wayfarer', 'Round', 'Rectangular', 'Cat Eye', 'Blue Light', 'Sunglasses', 'UV Protection'].map(c => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-1">Product Image</label>
                            <input type="file" ref={fileInputRef} accept="image/*" required
                                className="w-full p-2 border border-gray-200 rounded-xl bg-gray-50 text-sm text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100" />
                        </div>
                        <div className="md:col-span-2">
                            <Button type="submit" variant="primary" fullWidth disabled={formLoading}>
                                <UploadCloud size={16} />
                                {formLoading ? 'Uploading…' : 'Upload & Publish Product'}
                            </Button>
                        </div>
                    </form>
                </div>
            )}

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-x-auto">
                {loading && products.length === 0 ? (
                    <p className="text-gray-500 text-center py-12">Loading products…</p>
                ) : (
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="border-b border-gray-100">
                                {['Image', 'Name', 'Category', 'Price', 'Actions'].map(h => (
                                    <th key={h} className="text-left py-3 px-4 text-[13px] text-gray-500 font-semibold">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {products.map(p => (
                                <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                    <td className="py-3 px-4"><img loading="lazy" src={p.image_url || p.image} alt={p.name} className="w-14 h-14 object-contain rounded-lg bg-gray-100" /></td>
                                    <td className="py-3 px-4 font-semibold text-sm text-gray-900">{p.name}</td>
                                    <td className="py-3 px-4 text-sm text-gray-500">{p.category}</td>
                                    <td className="py-3 px-4 font-bold text-blue-600">{formatPrice(p.price)}</td>
                                    <td className="py-3 px-4">
                                        <div className="flex gap-2">
                                            <button onClick={() => setEditingProduct(p)} className="px-3 py-1.5 rounded-lg border border-blue-200 text-blue-500 bg-blue-50 hover:bg-blue-100 flex items-center gap-1 transition-colors text-sm font-semibold">
                                                <Pencil size={14} /> Edit
                                            </button>
                                            <button onClick={() => handleDelete(p.id)} className="px-3 py-1.5 rounded-lg border border-red-200 text-red-500 bg-red-50 hover:bg-red-100 flex items-center gap-1 transition-colors text-sm font-semibold">
                                                <Trash2 size={14} /> Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {products.length === 0 && !loading && (
                                <tr><td colSpan="5" className="text-center py-12 text-gray-500">No products found. Add one above!</td></tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

// ─── GLASSES FRAMES TAB ───────────────────────────────────────────────────────
const GlassesTab = () => {
    const [glasses, setGlasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formLoading, setFormLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ name: '', category: 'General' });
    const fileRef = useRef(null);

    const fetchGlasses = async () => {
        setLoading(true);
        try {
            const data = await getGlasses();
            setGlasses(data);
        } catch (err) {
            setError('Could not load glasses. Make sure the "glasses" table exists in Supabase.');
        }
        setLoading(false);
    };

    useEffect(() => { fetchGlasses(); }, []);

    const handleUpload = async (e) => {
        e.preventDefault();
        setFormLoading(true); setError(null); setSuccess(null);
        try {
            const file = fileRef.current?.files[0];
            if (!file) throw new Error('Please select a glasses image (PNG recommended).');
            if (!form.name) throw new Error('Please enter a name for this frame.');

            const newGlass = await uploadGlass({ file, name: form.name, category: form.category });
            setGlasses([newGlass, ...glasses]);
            setShowForm(false);
            setForm({ name: '', category: 'General' });
            if (fileRef.current) fileRef.current.value = '';
            setSuccess('Glasses frame uploaded! It will now appear in the Try-On selector. 🎉');
            setTimeout(() => setSuccess(null), 4000);
        } catch (err) {
            setError(err.message);
        }
        setFormLoading(false);
    };

    const handleDelete = async (id, imageUrl) => {
        if (!window.confirm('Delete this glasses frame?')) return;
        try {
            await deleteGlass(id, imageUrl);
            setGlasses(g => g.filter(x => x.id !== id));
        } catch (err) {
            setError(err.message);
        }
    };

    const CATEGORIES = ['General', 'Aviator', 'Round', 'Wayfarer', 'Cat Eye', 'Rectangular', 'Sunglasses', 'Blue Light'];

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-extrabold text-gray-900">Glasses Frames</h2>
                    <p className="text-sm text-gray-500 mt-1">Upload PNG frames here — they'll appear live in the Try-On selector</p>
                </div>
                <Button variant="primary" onClick={() => setShowForm(!showForm)}>
                    <PlusCircle size={16} />
                    {showForm ? 'Cancel' : 'Upload Frame'}
                </Button>
            </div>

            {/* Setup hint */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                <p className="text-[13px] text-blue-800 font-medium">
                    <strong>⚙️ Setup required (one-time):</strong> Create a <code className="bg-blue-100 px-1 rounded">glasses</code> table and a public <code className="bg-blue-100 px-1 rounded">glasses</code> storage bucket in your Supabase project.
                    {' '}
                    <a href="https://supabase.com/dashboard" target="_blank" rel="noreferrer" className="underline font-bold">Open Supabase →</a>
                </p>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 flex items-center gap-3 border border-red-100">
                    <AlertCircle size={18} /><p className="text-sm">{error}</p>
                </div>
            )}
            {success && (
                <div className="bg-green-50 text-green-700 p-4 rounded-xl mb-6 border border-green-100 font-semibold text-sm">
                    ✅ {success}
                </div>
            )}

            {/* Upload form */}
            {showForm && (
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 mb-8">
                    <h3 className="text-xl font-bold mb-4">Upload New Glasses Frame</h3>
                    <form onSubmit={handleUpload} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold mb-1">Frame Name</label>
                            <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                                className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:border-blue-400"
                                placeholder="e.g. Classic Black Wayfarer" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-1">Category</label>
                            <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                                className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:border-blue-400 bg-white text-gray-700">
                                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold mb-1">
                                Glasses Image <span className="text-gray-400 font-normal">(PNG with transparent background recommended)</span>
                            </label>
                            <input type="file" ref={fileRef} accept="image/*" required
                                className="w-full p-2 border border-gray-200 rounded-xl bg-gray-50 text-sm text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:font-semibold file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100" />
                            <p className="text-[11px] text-gray-400 mt-1">
                                💡 Tip: Use a PNG with transparent background for best overlay results. White backgrounds will be auto-removed.
                            </p>
                        </div>
                        <div className="md:col-span-2">
                            <Button type="submit" variant="primary" fullWidth disabled={formLoading}>
                                <UploadCloud size={16} />
                                {formLoading ? 'Uploading to Supabase…' : 'Upload Frame to Storage + DB'}
                            </Button>
                        </div>
                    </form>
                </div>
            )}

            {/* Glasses grid */}
            {loading ? (
                <p className="text-gray-500 text-center py-12">Loading frames from Supabase…</p>
            ) : glasses.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 border-dashed">
                    <div className="text-5xl mb-4">🕶️</div>
                    <p className="text-gray-500 font-medium mb-2">No custom frames yet</p>
                    <p className="text-gray-400 text-sm mb-6">Upload your first glasses PNG to get started</p>
                    <Button variant="primary" onClick={() => setShowForm(true)}>
                        <UploadCloud size={16} /> Upload First Frame
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {glasses.map(g => (
                        <div key={g.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
                            <div className="h-32 bg-gray-50 flex items-center justify-center p-4">
                                <img src={g.image_url} alt={g.name} className="max-h-full max-w-full object-contain" />
                            </div>
                            <div className="p-3">
                                <p className="font-bold text-[13px] text-gray-900 truncate">{g.name}</p>
                                <p className="text-[11px] text-gray-400 mt-0.5">{g.category}</p>
                                <button
                                    onClick={() => handleDelete(g.id, g.image_url)}
                                    className="mt-3 w-full py-1.5 rounded-lg border border-red-200 text-red-500 bg-red-50 hover:bg-red-100 text-[12px] font-semibold flex items-center justify-center gap-1 transition-colors"
                                >
                                    <Trash2 size={12} /> Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

// ─── MAIN Admin Products Page ─────────────────────────────────────────────────
const Products = () => {
    const [activeTab, setActiveTab] = useState('products');

    return (
        <main className="p-6 md:p-10 min-h-screen bg-gray-50">
            <div className="max-w-[1100px] mx-auto">
                <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Admin Panel</h1>

                {/* Tabs */}
                <div className="flex gap-3 mb-8 flex-wrap">
                    <Tab active={activeTab === 'products'} onClick={() => setActiveTab('products')} icon={<Package size={16} />} label="Products" />
                    <Tab active={activeTab === 'glasses'} onClick={() => setActiveTab('glasses')} icon={<Glasses size={16} />} label="Glasses Frames" />
                </div>

                {/* Tab Content */}
                {activeTab === 'products' ? <ProductsTab /> : <GlassesTab />}
            </div>
        </main>
    );
};

export default Products;
