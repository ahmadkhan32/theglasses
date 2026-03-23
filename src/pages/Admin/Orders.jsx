import React, { useState } from 'react';

const statusColor = { pending: '#f59e0b', processing: '#3b82f6', shipped: '#8b5cf6', delivered: '#22c55e', cancelled: '#ef4444' };
const STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

const MOCK = [
    { id: 'TG-A91B', customer: 'Usman Malik', phone: '0300-1234567', city: 'Karachi', total: 2500, payment: 'COD', status: 'pending' },
    { id: 'TG-B22C', customer: 'Sana Rehman', phone: '0321-7654321', city: 'Lahore', total: 3200, payment: 'Bank', status: 'shipped' },
    { id: 'TG-C44D', customer: 'Ahmed Khan', phone: '0345-9876543', city: 'Islamabad', total: 5600, payment: 'COD', status: 'delivered' },
];

const Orders = () => {
    const [orders, setOrders] = useState(MOCK);

    const updateStatus = (id, status) => setOrders((o) => o.map((ord) => ord.id === id ? { ...ord, status } : ord));

    return (
        <main style={{ padding: '40px', minHeight: '100vh', backgroundColor: 'var(--bg-secondary)' }}>
            <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
                <h1 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '32px' }}>Manage Orders</h1>
                <div style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '24px', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border-color)', overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                                {['Order ID', 'Customer', 'Phone', 'City', 'Total', 'Payment', 'Status'].map((h) => (
                                    <th key={h} style={{ textAlign: 'left', padding: '12px 16px', fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 600 }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((o) => (
                                <tr key={o.id} style={{ borderBottom: '1px solid var(--bg-secondary)' }}>
                                    <td style={{ padding: '14px 16px', fontWeight: 700, fontSize: '14px' }}>{o.id}</td>
                                    <td style={{ padding: '14px 16px', fontSize: '14px' }}>{o.customer}</td>
                                    <td style={{ padding: '14px 16px', fontSize: '14px', color: 'var(--text-secondary)' }}>{o.phone}</td>
                                    <td style={{ padding: '14px 16px', fontSize: '14px' }}>{o.city}</td>
                                    <td style={{ padding: '14px 16px', fontWeight: 700, color: 'var(--accent-blue)' }}>Rs. {o.total.toLocaleString()}</td>
                                    <td style={{ padding: '14px 16px', fontSize: '14px' }}>{o.payment}</td>
                                    <td style={{ padding: '14px 16px' }}>
                                        <select
                                            value={o.status}
                                            onChange={(e) => updateStatus(o.id, e.target.value)}
                                            style={{ padding: '6px 10px', borderRadius: '8px', border: '1.5px solid', borderColor: statusColor[o.status], color: statusColor[o.status], fontWeight: 600, cursor: 'pointer', fontSize: '13px', backgroundColor: `${statusColor[o.status]}15`, fontFamily: 'inherit' }}
                                        >
                                            {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                                        </select>
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

export default Orders;
