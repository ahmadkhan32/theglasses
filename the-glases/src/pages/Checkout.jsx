import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import Button from '../components/ui/Button';
import { formatPrice } from '../utils/pricing';
import { createOrder } from '../services/api/orders';
import { useAuth } from '../context/AuthContext';
import { ShoppingBag, CreditCard, Truck, MapPin, Phone, User, CheckCircle, Smartphone, Landmark, AlertCircle } from 'lucide-react';

const Checkout = () => {
    const { items, subtotal, shipping, total, clearCart } = useCart();
    const { user, loading } = useAuth();
    
    const [paymentMethod, setPaymentMethod] = useState('cod');
    const [form, setForm] = useState({ name: '', phone: '', address: '', city: '' });
    const [status, setStatus] = useState('idle'); // idle, processing, pwp_processing, placed, error
    const [error, setError] = useState(null);

    // Security: Redirect unauthenticated users
    React.useEffect(() => {
        if (!user && !loading) {
            // Give the user a moment to see the page or redirect instantly
            // window.location.href = '/login?redirect=checkout'; 
        }
    }, [user, loading]);

    const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (!user) {
            setError("Please login to complete your purchase.");
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        if (items.length === 0) {
            setError("Your cart is empty.");
            return;
        }

        if (paymentMethod === 'easypaisa' || paymentMethod === 'jazzcash') {
            setStatus('pwp_processing');
            // Simulation of gateway redirect
            await new Promise(resolve => setTimeout(resolve, 2000));
        }

        setStatus('processing');

        try {
            const finalTotal = paymentMethod === 'bank' ? total * 0.9 : total;
            
            // 1. Create Order with Items (Atomic Backend Operation)
            await createOrder({
                user_id: user.id, 
                full_name: form.name,
                phone: form.phone,
                status: 'pending',
                total_amount: finalTotal, // Using backend expected field name
                total: finalTotal,        // Backward compatibility
                shipping_address: form.address,
                city: form.city,
                payment_method: paymentMethod,
                items: items.map(item => ({
                    product_id: item.id,
                    quantity: item.quantity,
                    price: item.price
                }))
            });

            clearCart();
            setStatus('placed');

        } catch (err) {
            console.error('Checkout error:', err);
            setError(err.message || 'Order placement failed. Please try again.');
            setStatus('error');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    if (status === 'pwp_processing') {
        return (
            <div className="min-h-screen bg-bg-soft flex flex-col items-center justify-center text-center p-10">
                <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="glass p-12 rounded-[40px] flex flex-col items-center max-w-md border-white/40"
                >
                    <div className="w-20 h-20 border-4 border-primary border-t-transparent rounded-full animate-spin mb-8 shadow-lg shadow-blue-500/20"></div>
                    <h2 className="text-3xl font-black text-dark mb-4">Connecting to {paymentMethod === 'jazzcash' ? 'JazzCash' : 'EasyPaisa'}...</h2>
                    <p className="text-light font-bold uppercase tracking-widest text-xs">Secure Gateway Encryption in Progress</p>
                </motion.div>
            </div>
        );
    }

    if (status === 'placed') {
        return (
            <div className="min-h-screen bg-bg-soft flex flex-col items-center justify-center p-10">
                <motion.div 
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="glass p-16 rounded-[48px] text-center max-w-lg border-white/60 shadow-2xl"
                >
                    <div className="w-24 h-24 bg-primary text-white rounded-3xl flex-center mx-auto mb-8 shadow-xl shadow-blue-500/30">
                        <CheckCircle size={48} />
                    </div>
                    <h2 className="text-4xl font-black text-dark mb-4 font-heading tracking-tight">Order Received!</h2>
                    <p className="text-light font-medium text-lg mb-10">Your journey to perfect vision has begun. We'll WhatsApp you the tracking details shortly.</p>
                    <Button variant="primary" size="lg" className="rounded-2xl px-12" onClick={() => window.location.href = '/orders'}>Track My Order</Button>
                </motion.div>
            </div>
        );
    }

    return (
        <main className="py-24 min-h-screen bg-bg-soft relative overflow-hidden">
            {/* Background Glows */}
            <div className="absolute top-0 left-0 w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-[30%] h-[30%] bg-accent/5 blur-[100px] rounded-full translate-x-1/4 translate-y-1/4" />

            <div className="container relative z-10 max-w-6xl">
                <header className="mb-14">
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-dark font-heading">
                        Finalize <span className="text-gradient">Purchase</span>
                    </h1>
                    <p className="text-light font-bold text-xs uppercase tracking-[4px] mt-4 flex items-center gap-2">
                        <ShoppingBag size={14} /> Secure Checkout Protocol
                    </p>
                </header>
                
                {error && (
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }} 
                        animate={{ opacity: 1, x: 0 }}
                        className="glass bg-red-500/10 border-red-500/20 text-red-600 p-6 rounded-3xl mb-12 flex items-center gap-4 font-bold"
                    >
                        <AlertCircle size={24} />
                        {error}
                    </motion.div>
                )}

                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                    
                    {/* Left Section: Information & Payment */}
                    <div className="lg:col-span-7 flex flex-col gap-10">
                        
                        <div className="glass p-10 rounded-[32px] border-white/40 shadow-xl">
                            <h3 className="text-xl font-black mb-8 text-dark flex items-center gap-3">
                                <Truck className="text-primary" size={24} /> Shipping Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2 relative group">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-light group-focus-within:text-primary transition-colors" size={18} />
                                    <input name="name" value={form.name} onChange={handleChange} placeholder="Full Name *" required className="w-full pl-12 pr-4 py-4 rounded-2xl glass border border-border outline-none focus:border-primary transition-all font-bold text-sm" />
                                </div>
                                <div className="md:col-span-2 relative group">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-light group-focus-within:text-primary transition-colors" size={18} />
                                    <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone / WhatsApp *" required className="w-full pl-12 pr-4 py-4 rounded-2xl glass border border-border outline-none focus:border-primary transition-all font-bold text-sm" />
                                </div>
                                <div className="md:col-span-2 relative group">
                                    <MapPin className="absolute left-4 top-4 text-light group-focus-within:text-primary transition-colors" size={18} />
                                    <textarea name="address" value={form.address} onChange={handleChange} placeholder="Full Delivery Address *" required className="w-full pl-12 pr-4 py-4 rounded-2xl glass border border-border outline-none focus:border-primary transition-all font-bold text-sm min-h-[100px] resize-none" />
                                </div>
                                <div className="md:col-span-2 relative group">
                                    <Landmark className="absolute left-4 top-1/2 -translate-y-1/2 text-light group-focus-within:text-primary transition-colors" size={18} />
                                    <input name="city" value={form.city} onChange={handleChange} placeholder="City *" required className="w-full pl-12 pr-4 py-4 rounded-2xl glass border border-border outline-none focus:border-primary transition-all font-bold text-sm" />
                                </div>
                            </div>
                        </div>

                        <div className="glass p-10 rounded-[32px] border-white/40 shadow-xl">
                            <h3 className="text-xl font-black mb-8 text-dark flex items-center gap-3">
                                <CreditCard className="text-primary" size={24} /> Payment Methodology
                            </h3>
                            <div className="flex flex-col gap-4">
                                {[
                                    { id: 'cod', label: 'Cash on Delivery', icon: <Truck size={18} />, color: 'emerald' },
                                    { id: 'easypaisa', label: 'EasyPaisa Gateway', icon: <Smartphone size={18} />, color: 'blue' },
                                    { id: 'jazzcash', label: 'JazzCash Gateway', icon: <Smartphone size={18} />, color: 'indigo' },
                                    { id: 'bank', label: 'Bank Transfer (-10% Off)', icon: <Landmark size={18} />, color: 'amber' }
                                ].map((pm) => (
                                    <label key={pm.id} className={`flex items-center gap-5 p-5 rounded-2xl glass border-2 cursor-pointer transition-all ${
                                        paymentMethod === pm.id ? 'border-primary ring-4 ring-primary/5 bg-white/40' : 'border-border hover:border-primary/20'
                                    }`}>
                                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${paymentMethod === pm.id ? 'border-primary' : 'border-light'}`}>
                                            {paymentMethod === pm.id && <div className="w-3 h-3 bg-primary rounded-full shadow-lg shadow-blue-500/40" />}
                                        </div>
                                        <input type="radio" name="payment" value={pm.id} checked={paymentMethod === pm.id} onChange={() => setPaymentMethod(pm.id)} className="hidden" />
                                        <div className="flex flex-col">
                                            <span className="font-black text-dark tracking-tight flex items-center gap-2">
                                                {pm.icon} {pm.label}
                                            </span>
                                            {pm.id === 'bank' && <span className="text-[10px] text-primary font-bold uppercase tracking-widest mt-1">Direct Settlement Discount</span>}
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Section: Order Summary */}
                    <div className="lg:col-span-5 flex flex-col gap-8 sticky top-28">
                        <div className="glass p-10 rounded-[40px] border-white/60 shadow-2xl backdrop-blur-2xl">
                            <h3 className="text-xl font-black mb-8 text-dark tracking-tight">Order Inventory</h3>
                            
                            <div className="flex flex-col gap-6 mb-10 max-h-[300px] overflow-y-auto pr-4 scrollbar-thin">
                                {items.map((item) => (
                                    <div key={item.id} className="flex gap-5 items-center bg-white/30 p-3 rounded-2xl border border-border/20">
                                        <div className="w-16 h-16 bg-soft rounded-xl flex-center flex-shrink-0 relative">
                                            <img src={item.image_url || item.image} alt="" className="w-12 h-12 object-contain" />
                                            <span className="absolute -top-2 -right-2 bg-dark text-white text-[10px] font-black w-6 h-6 rounded-full flex-center shadow-lg border-2 border-white">{item.quantity}</span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold text-sm text-dark truncate leading-tight uppercase tracking-tight">{item.name}</p>
                                            <p className="text-[10px] text-light font-black uppercase tracking-[2px] mt-1">{formatPrice(item.price)}</p>
                                        </div>
                                        <span className="font-black text-dark text-sm">{formatPrice(item.price * item.quantity)}</span>
                                    </div>
                                ))}
                            </div>
                            
                            <div className="border-t border-border/40 pt-8 flex flex-col gap-4">
                                <div className="flex justify-between text-xs font-bold text-light uppercase tracking-widest">
                                    <span>Subtotal</span><span className="text-dark">{formatPrice(subtotal)}</span>
                                </div>
                                <div className="flex justify-between text-xs font-bold text-light uppercase tracking-widest">
                                    <span>Shipping</span><span className="text-primary font-black">FREE</span>
                                </div>
                                {paymentMethod === 'bank' && (
                                    <div className="flex justify-between text-xs font-bold text-primary uppercase tracking-widest italic translate-y-[-2px]">
                                        <span>Bank Discount (-10%)</span><span>-{formatPrice(total * 0.1)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between items-center mt-6 pt-6 border-t border-border/60">
                                    <span className="text-sm font-black uppercase tracking-[3px] text-light">Total Amount</span>
                                    <span className="text-4xl font-black text-dark font-heading">
                                        {formatPrice(paymentMethod === 'bank' ? total * 0.9 : total)}
                                    </span>
                                </div>
                            </div>

                            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="mt-12">
                                <Button 
                                    type="submit" 
                                    variant="primary" 
                                    fullWidth 
                                    size="lg" 
                                    className="rounded-2xl py-6 shadow-xl shadow-blue-500/20"
                                    disabled={status === 'processing' || items.length === 0}
                                >
                                    {status === 'processing' ? 'Processing Transaction...' : 'Establish Secure Order'}
                                </Button>
                            </motion.div>
                            
                            <p className="text-[10px] text-light text-center mt-6 font-bold uppercase tracking-widest px-4">
                                By clicking the button above you agree to our <span className="text-primary underline">Purchase Terms</span> & Conditions
                            </p>
                        </div>
                    </div>
                </form>
            </div>
        </main>
    );
};

export default Checkout;
