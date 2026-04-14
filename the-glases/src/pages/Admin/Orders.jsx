import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../services/supabaseClient';
import { formatPrice } from '../../utils/pricing';
import Loader from '../../components/ui/Loader';
import { CheckCircle, Clock, Truck, Package, XCircle, Search, Filter, ShieldCheck, Box } from 'lucide-react';

const statusConfig = { 
    pending: { color: 'bg-gray-400', icon: <Clock size={14} />, label: 'Pending' },
    processing: { color: 'bg-blue-500', icon: <Box size={14} />, label: 'Processing' },
    shipped: { color: 'bg-indigo-500', icon: <Truck size={14} />, label: 'Shipped' },
    delivered: { color: 'bg-emerald-500', icon: <CheckCircle size={14} />, label: 'Delivered' },
    cancelled: { color: 'bg-red-500', icon: <XCircle size={14} />, label: 'Cancelled' }
};

const STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('orders')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (error) console.error('Error:', error);
        else setOrders(data || []);
        setLoading(false);
    };

    const updateStatus = async (id, status) => {
        const { error } = await supabase
            .from('orders')
            .update({ status })
            .eq('id', id);

        if (error) {
            alert('Failed to update status: ' + error.message);
        } else {
            setOrders(o => o.map(ord => ord.id === id ? { ...ord, status } : ord));
        }
    };

    const filteredOrders = orders.filter(o => 
        o.id.toLowerCase().includes(search.toLowerCase()) || 
        o.full_name?.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) return <Loader fullScreen />;

    return (
        <main className="min-h-screen bg-bg-soft py-20 relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-primary/5 blur-[100px] rounded-full -translate-y-1/4 translate-x-1/4" />

            <div className="container relative z-10">
                <header className="mb-12 flex flex-wrap justify-between items-end gap-6">
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                        <div className="flex items-center gap-3 text-primary mb-3">
                            <div className="p-2 bg-primary/10 rounded-xl"><ShieldCheck size={24} /></div>
                            <span className="text-xs font-black uppercase tracking-[4px]">Management</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black tracking-tight text-dark font-heading">
                            Order <span className="text-gradient">Control Center</span>
                        </h1>
                    </motion.div>

                    <div className="flex-1 max-w-sm relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-light group-focus-within:text-primary transition-colors" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search Order ID or Customer..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 rounded-2xl glass border border-border outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all text-sm font-bold"
                        />
                    </div>
                </header>

                <div className="glass rounded-[32px] overflow-hidden border-white/40 shadow-2xl relative">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-white/40">
                                    {['Ref ID', 'Customer', 'Region', 'Total', 'Placement Date', 'Shipping Flow'].map(h => (
                                        <th key={h} className="px-8 py-6 text-[10px] font-black uppercase tracking-[3px] text-light border-b border-border/40">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                <AnimatePresence>
                                    {filteredOrders.map((order, idx) => (
                                        <motion.tr 
                                            key={order.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: idx * 0.05 }}
                                            className="group hover:bg-white/60 transition-colors border-b border-border/20 last:border-0"
                                        >
                                            <td className="px-8 py-6 font-black text-dark text-xs font-mono">#{order.id.slice(0, 8).toUpperCase()}</td>
                                            <td className="px-8 py-6">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-dark">{order.full_name}</span>
                                                    <span className="text-[11px] text-light font-medium">{order.phone}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-sm font-bold text-dark">{order.city}</td>
                                            <td className="px-8 py-6">
                                                <span className="text-sm font-black text-primary bg-primary/5 px-3 py-1.5 rounded-lg border border-primary/10">
                                                    {formatPrice(order.total_amount)}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6 text-[11px] text-light font-bold uppercase tracking-wider">
                                                {new Date(order.created_at).toLocaleDateString('en-PK', { day: 'numeric', month: 'short' })}
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-3">
                                                    <div className={`p-2 rounded-xl text-white ${statusConfig[order.status]?.color}`}>
                                                        {statusConfig[order.status]?.icon}
                                                    </div>
                                                    <select 
                                                        value={order.status}
                                                        onChange={(e) => updateStatus(order.id, e.target.value)}
                                                        className="bg-transparent text-xs font-black uppercase tracking-widest outline-none cursor-pointer hover:text-primary transition-colors pr-2"
                                                    >
                                                        {STATUSES.map(s => <option key={s} value={s} className="bg-white text-dark">{s}</option>)}
                                                    </select>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </AnimatePresence>
                            </tbody>
                        </table>
                    </div>
                    {filteredOrders.length === 0 && (
                        <div className="p-20 text-center flex flex-col items-center gap-4">
                            <div className="w-16 h-16 bg-soft rounded-full flex-center text-light"><Filter size={32} /></div>
                            <p className="text-light font-bold uppercase tracking-wider">No matching active orders found</p>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
};

export default AdminOrders;
