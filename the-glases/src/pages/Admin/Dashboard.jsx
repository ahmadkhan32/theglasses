import React, { useState, useEffect } from 'react';
import { Package, ShoppingBag, Users, TrendingUp } from 'lucide-react';

const STATS = [
    { label: 'Total Products', value: 24, icon: <Package size={24} />, color: '#dbeafe' },
    { label: 'Orders Today', value: 8, icon: <ShoppingBag size={24} />, color: '#dcfce7' },
    { label: 'Total Customers', value: 312, icon: <Users size={24} />, color: '#fce7f3' },
    { label: 'Revenue (Month)', value: 'Rs. 84,000', icon: <TrendingUp size={24} />, color: '#fef9c3' },
];

const RECENT_ORDERS = [
    { id: 'TG-A91B', customer: 'Usman Malik', product: 'Clear Blue Pro', amount: 2500, status: 'pending' },
    { id: 'TG-B22C', customer: 'Sana Rehman', product: 'Midnight Aviator', amount: 3200, status: 'shipped' },
    { id: 'TG-C44D', customer: 'Ahmed Khan', product: 'Urban Edge', amount: 2800, status: 'delivered' },
];

const statusColor = { pending: '#f59e0b', processing: '#3b82f6', shipped: '#8b5cf6', delivered: '#22c55e', cancelled: '#ef4444' };

const Dashboard = () => {
    return (
        <main style={{ padding: '40px', minHeight: '100vh', backgroundColor: 'var(--bg-secondary)' }}>
            <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
                <h1 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '32px' }}>Admin Dashboard</h1>

                {/* Stats Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '40px' }}>
                    {STATS.map((s) => (
                        <div key={s.label} style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '24px', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border-color)' }}>
                            <div style={{ backgroundColor: s.color, borderRadius: '12px', width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                                {s.icon}
                            </div>
                            <div style={{ fontSize: '24px', fontWeight: 800, marginBottom: '4px' }}>{s.value}</div>
                            <div style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>{s.label}</div>
                        </div>
                    ))}
                </div>

                {/* Recent Orders */}
                <div style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '24px', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border-color)' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '20px' }}>Recent Orders</h3>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                                    {['Order ID', 'Customer', 'Product', 'Amount', 'Status'].map((h) => (
                                        <th key={h} style={{ textAlign: 'left', padding: '12px 16px', fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 600 }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {RECENT_ORDERS.map((order) => (
                                    <tr key={order.id} style={{ borderBottom: '1px solid var(--bg-secondary)' }}>
                                        <td style={{ padding: '14px 16px', fontWeight: 700, fontSize: '14px' }}>{order.id}</td>
                                        <td style={{ padding: '14px 16px', fontSize: '14px' }}>{order.customer}</td>
                                        <td style={{ padding: '14px 16px', fontSize: '14px' }}>{order.product}</td>
                                        <td style={{ padding: '14px 16px', fontSize: '14px' }}>Rs. {order.amount.toLocaleString()}</td>
                                        <td style={{ padding: '14px 16px' }}>
                                            <span style={{ padding: '4px 12px', borderRadius: '100px', fontSize: '12px', fontWeight: 600, backgroundColor: statusColor[order.status] + '20', color: statusColor[order.status] }}>
                                                {order.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default Dashboard;
