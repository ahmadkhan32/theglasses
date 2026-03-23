import React, { useState } from 'react';
import { MOCK_PRODUCTS } from '../../utils/constants';
import Button from '../../components/ui/Button';
import { Pencil, Trash2, PlusCircle } from 'lucide-react';
import { formatPrice } from '../../utils/pricing';

const Products = () => {
    const [products, setProducts] = useState(MOCK_PRODUCTS);

    const handleDelete = (id) => setProducts((p) => p.filter((item) => item.id !== id));

    return (
        <main style={{ padding: '40px', minHeight: '100vh', backgroundColor: 'var(--bg-secondary)' }}>
            <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                    <h1 style={{ fontSize: '28px', fontWeight: 800 }}>Manage Products</h1>
                    <Button variant="primary"><PlusCircle size={16} style={{ marginRight: 6 }} />Add Product</Button>
                </div>

                <div style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '24px', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border-color)', overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                                {['Image', 'Name', 'Category', 'Price', 'Actions'].map((h) => (
                                    <th key={h} style={{ textAlign: 'left', padding: '12px 16px', fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 600 }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((p) => (
                                <tr key={p.id} style={{ borderBottom: '1px solid var(--bg-secondary)' }}>
                                    <td style={{ padding: '12px 16px' }}>
                                        <img loading="lazy" src={p.image_url} alt={p.name} style={{ width: 56, height: 56, objectFit: 'contain', borderRadius: 8, backgroundColor: 'var(--bg-secondary)' }} />
                                    </td>
                                    <td style={{ padding: '12px 16px', fontWeight: 600, fontSize: '14px' }}>{p.name}</td>
                                    <td style={{ padding: '12px 16px', fontSize: '14px', color: 'var(--text-secondary)' }}>{p.category}</td>
                                    <td style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--accent-blue)' }}>{formatPrice(p.price)}</td>
                                    <td style={{ padding: '12px 16px' }}>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <button style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}><Pencil size={14} /> Edit</button>
                                            <button onClick={() => handleDelete(p.id)} style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid #fecaca', color: '#ef4444', cursor: 'pointer', backgroundColor: '#fef2f2', display: 'flex', alignItems: 'center', gap: 4 }}><Trash2 size={14} /> Delete</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </main>
    );
};

export default Products;
