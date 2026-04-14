import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Lock, Mail, User, Phone, ArrowRight } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const { signIn, signUp } = useAuth();
    const navigate = useNavigate();
    const [mode, setMode] = useState('login'); // login or signup
    const [showPass, setShowPass] = useState(false);
    const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            if (mode === 'login') {
                await signIn({ email: form.email, password: form.password });
            } else {
                await signUp({ email: form.email, password: form.password, name: form.name, phone: form.phone });
            }
            navigate('/');
        } catch (err) {
            setError(err.message || 'Authentication failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen flex items-center justify-center p-6 bg-soft overflow-hidden relative">
            {/* Background Decorative Blobs */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-400/20 blur-[120px] rounded-full" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-400/20 blur-[120px] rounded-full" />

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass w-full max-w-[460px] p-10 md:p-14 rounded-xl shadow-2xl relative z-10"
            >
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-extrabold tracking-tighter mb-2 text-dark font-heading">
                        THE <span className="text-primary">GLASES</span>
                    </h1>
                    <p className="text-light text-sm font-medium uppercase tracking-[3px]">
                        {mode === 'login' ? 'Welcome Back' : 'Create Luxury Account'}
                    </p>
                </div>

                {error && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-red-50 text-red-600 p-4 rounded-xl mb-8 flex items-center gap-3 border border-red-100 text-sm font-semibold"
                    >
                        {error}
                    </motion.div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    <AnimatePresence mode="wait">
                        {mode === 'signup' && (
                            <motion.div 
                                key="signup-fields"
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="flex flex-col gap-6 overflow-hidden"
                            >
                                <div className="group space-y-2">
                                    <label className="text-xs font-bold text-dark/60 uppercase ml-1">Full Name</label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-light" size={18} />
                                        <input name="name" value={form.name} onChange={handleChange} placeholder="Asad Khan" required
                                            className="w-full pl-12 pr-4 py-4 rounded-xl border border-border bg-white/50 outline-none focus:border-primary focus:bg-white transition-all text-dark font-medium" />
                                    </div>
                                </div>
                                <div className="group space-y-2">
                                    <label className="text-xs font-bold text-dark/60 uppercase ml-1">Phone / WhatsApp</label>
                                    <div className="relative">
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-light" size={18} />
                                        <input name="phone" value={form.phone} onChange={handleChange} placeholder="+92 3XX XXXXXXX"
                                            className="w-full pl-12 pr-4 py-4 rounded-xl border border-border bg-white/50 outline-none focus:border-primary focus:bg-white transition-all text-dark font-medium" />
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="group space-y-2">
                        <label className="text-xs font-bold text-dark/60 uppercase ml-1">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-light" size={18} />
                            <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="name@email.com" required
                                className="w-full pl-12 pr-4 py-4 rounded-xl border border-border bg-white/50 outline-none focus:border-primary focus:bg-white transition-all text-dark font-medium" />
                        </div>
                    </div>

                    <div className="group space-y-2">
                        <div className="flex justify-between items-center ml-1">
                            <label className="text-xs font-bold text-dark/60 uppercase">Password</label>
                            {mode === 'login' && <Link to="#" className="text-[11px] font-bold text-primary uppercase">Forgot?</Link>}
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-light" size={18} />
                            <input name="password" type={showPass ? 'text' : 'password'} value={form.password} onChange={handleChange} placeholder="••••••••" required minLength={6}
                                className="w-full pl-12 pr-12 py-4 rounded-xl border border-border bg-white/50 outline-none focus:border-primary focus:bg-white transition-all text-dark font-medium" />
                            <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-light p-1 hover:text-primary transition-colors">
                                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <Button type="submit" variant="primary" fullWidth size="lg" loading={loading} className="mt-4 shadow-xl shadow-blue-500/20 group">
                        <span className="flex items-center justify-center gap-2">
                            {mode === 'login' ? 'Sign In Now' : 'Create Luxury Account'}
                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </span>
                    </Button>
                </form>

                <div className="mt-10 text-center">
                    <p className="text-light text-sm font-medium">
                        {mode === 'login' ? "New to The Glases? " : 'Already a client? '}
                        <button onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(null); }} className="text-primary font-bold hover:underline">
                            {mode === 'login' ? 'Create Account' : 'Sign In instead'}
                        </button>
                    </p>
                </div>
            </motion.div>
        </main>
    );
};

export default Login;
