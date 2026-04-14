import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Package, Clock, Truck, CheckCircle, ChevronRight, ShoppingBag, Box, MapPin } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../services/supabaseClient';
import { formatPrice } from '../utils/pricing';
import Loader from '../components/ui/Loader';
import Button from '../components/ui/Button';
import { Link } from 'react-router-dom';

const Orders = () => {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) fetchOrders();
    }, [user]);

    const fetchOrders = async () => {
        try {
            const { data, error } = await supabase
                .from('orders')
                .select(`
                    *,
                    order_items (
                        *,
                        glasses (*)
                    )
                `)
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setOrders(data || []);
        } catch (err) {
            console.error('Error fetching orders:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <Loader fullScreen />;

    return (
        <main className="min-h-screen bg-bg-soft py-20 pb-40 relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-0 left-0 w-[40%] h-[40%] bg-primary/5 blur-[100px] rounded-full -translate-x-1/4 -translate-y-1/4" />

            <div className="container relative z-10">
                <header className="mb-12">
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                        <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tight text-dark font-heading">
                            My <span className="text-gradient">Orders</span>
                        </h1>
                        <p className="text-light font-bold text-xs uppercase tracking-[3px]">
                            Track your premium eyewear shipments
                        </p>
                    </motion.div>
                </header>

                {orders.length === 0 ? (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass p-16 rounded-3xl text-center flex flex-col items-center gap-6 border-dashed border-2 border-border"
                    >
                        <div className="w-20 h-20 bg-soft rounded-full flex-center text-light">
                            <ShoppingBag size={40} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-dark mb-2">No orders yet</h2>
                            <p className="text-light max-w-[300px] mx-auto">Your style journey starts here. Explore our latest collections today.</p>
                        </div>
                        <Link to="/shop">
                            <Button variant="primary" size="lg" className="rounded-xl px-10">Start Shopping</Button>
                        </Link>
                    </motion.div>
                ) : (
                    <div className="grid gap-8">
                        {orders.map((order, idx) => (
                            <OrderCard key={order.id} order={order} index={idx} />
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
};

const OrderCard = ({ order, index }) => {
    const statusSteps = [
        { id: 'pending', label: 'Pending', icon: <Clock size={16} />, color: 'bg-gray-400' },
        { id: 'processing', label: 'Processing', icon: <Box size={16} />, color: 'bg-blue-500' },
        { id: 'shipped', label: 'Shipped', icon: <Truck size={16} />, color: 'bg-purple-500' },
        { id: 'delivered', label: 'Delivered', icon: <CheckCircle size={16} />, color: 'bg-emerald-500' }
    ];

    const currentStepIndex = statusSteps.findIndex(s => s.id === order.status);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass rounded-2xl overflow-hidden border-border/40 shadow-xl group hover:border-primary/30 transition-all duration-500"
        >
            {/* Order Header */}
            <div className="bg-white/50 p-6 md:p-8 flex flex-wrap justify-between items-center gap-6 border-b border-border/40">
                <div className="flex gap-6 items-center">
                    <div className="w-14 h-14 bg-primary text-white rounded-2xl flex-center shadow-lg shadow-blue-500/20">
                        <Package size={24} />
                    </div>
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <h3 className="text-lg font-black text-dark tracking-tight">Order #{order.id.slice(0, 8).toUpperCase()}</h3>
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-white ${statusSteps[currentStepIndex]?.color || 'bg-gray-400'}`}>
                                {order.status}
                            </span>
                        </div>
                        <p className="text-xs text-light font-bold uppercase tracking-wider">
                            Placed on {new Date(order.created_at).toLocaleDateString('en-PK', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </p>
                    </div>
                </div>
                <div className="flex flex-col items-end">
                    <span className="text-2xl font-black text-dark font-heading">{formatPrice(order.total_amount)}</span>
                    <span className="text-[10px] text-light font-bold uppercase tracking-widest">Total with Shipping</span>
                </div>
            </div>

            {/* Tracking Timeline */}
            <div className="p-8 md:p-12 bg-white/20">
                <div className="relative flex justify-between items-start max-w-[800px] mx-auto">
                    {/* Connection Line */}
                    <div className="absolute top-5 left-0 w-full h-[2px] bg-border z-0" />
                    <div 
                        className="absolute top-5 left-0 h-[2px] bg-primary z-0 transition-all duration-1000 ease-out" 
                        style={{ width: `${(currentStepIndex / (statusSteps.length - 1)) * 100}%` }}
                    />

                    {statusSteps.map((step, idx) => {
                        const isCompleted = idx <= currentStepIndex;
                        const isCurrent = idx === currentStepIndex;

                        return (
                            <div key={step.id} className="relative z-10 flex flex-col items-center gap-4">
                                <div className={`
                                    w-10 h-10 rounded-full flex-center transition-all duration-500
                                    ${isCompleted ? 'bg-primary text-white shadow-lg shadow-blue-500/20' : 'bg-white border-2 border-border text-light'}
                                    ${isCurrent ? 'ring-4 ring-primary/20 scale-125' : ''}
                                `}>
                                    {isCompleted ? <CheckCircle size={18} /> : step.icon}
                                </div>
                                <div className="text-center">
                                    <p className={`text-[11px] font-black uppercase tracking-widest ${isCompleted ? 'text-dark' : 'text-light'}`}>
                                        {step.label}
                                    </p>
                                    {isCurrent && (
                                        <motion.span 
                                            animate={{ opacity: [0, 1, 0] }}
                                            transition={{ repeat: Infinity, duration: 2 }}
                                            className="text-[9px] text-primary font-bold uppercase"
                                        >
                                            In Progress
                                        </motion.span>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Items & Shipping Info */}
                <div className="mt-16 grid md:grid-cols-2 gap-12 pt-12 border-t border-border/40">
                    <div>
                        <h4 className="text-xs font-black text-dark/40 uppercase tracking-[2px] mb-6 flex items-center gap-2">
                            <Box size={14} /> Order Items
                        </h4>
                        <div className="space-y-4">
                            {order.order_items?.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-4 bg-white/40 p-3 rounded-xl border border-border/20 group-hover:bg-white/60 transition-colors">
                                    <div className="w-12 h-12 bg-soft rounded-lg flex-center overflow-hidden">
                                        <img src={item.glasses?.image_url} alt="" className="w-10 h-10 object-contain" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-dark truncate">{item.glasses?.name || 'Frame'}</p>
                                        <p className="text-[11px] text-light font-medium uppercase tracking-wider">{item.quantity} Unit · {formatPrice(item.price)} each</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div>
                        <h4 className="text-xs font-black text-dark/40 uppercase tracking-[2px] mb-6 flex items-center gap-2">
                            <MapPin size={14} /> Delivery Address
                        </h4>
                        <div className="bg-white/50 p-6 rounded-2xl border border-border/20">
                            <p className="text-sm font-bold text-dark mb-1">{order.full_name}</p>
                            <p className="text-sm text-light leading-relaxed mb-4">{order.shipping_address}<br />{order.city}</p>
                            <div className="flex items-center gap-2 text-primary text-xs font-bold">
                                <Truck size={14} /> Expected Delivery within 3-5 Working Days
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default Orders;
