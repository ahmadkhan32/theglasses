import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import Button from '../components/ui/Button';

const Login = () => {
    const [mode, setMode] = useState('login');
    const [showPass, setShowPass] = useState(false);
    const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        // TODO: connect to AuthContext signIn / signUp
        await new Promise((r) => setTimeout(r, 1000));
        setLoading(false);
        window.location.href = '/';
    };

    const inputStyle = {
        width: '100%', padding: '14px 16px', borderRadius: '10px',
        border: '1.5px solid var(--border-color)', fontSize: '15px',
        fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box', marginBottom: '16px'
    };

    return (
        <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #f8faff, #eef2ff)', padding: '40px 24px' }}>
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ backgroundColor: '#fff', borderRadius: '24px', padding: '48px 40px', width: '100%', maxWidth: '440px', boxShadow: 'var(--shadow-xl)' }}
            >
                <h1 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '8px', color: 'var(--accent-blue)', textAlign: 'center' }}>The Glases</h1>
                <h2 style={{ fontSize: '20px', textAlign: 'center', marginBottom: '32px' }}>{mode === 'login' ? 'Sign In' : 'Create Account'}</h2>

                <form onSubmit={handleSubmit}>
                    {mode === 'signup' && (
                        <>
                            <input name="name" value={form.name} onChange={handleChange} placeholder="Full Name *" required style={inputStyle} />
                            <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone / WhatsApp" style={inputStyle} />
                        </>
                    )}
                    <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Email Address *" required style={inputStyle} />
                    <div style={{ position: 'relative' }}>
                        <input name="password" type={showPass ? 'text' : 'password'} value={form.password} onChange={handleChange} placeholder="Password *" required minLength={6} style={{ ...inputStyle, paddingRight: '48px' }} />
                        <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: '14px', top: '14px', background: 'none', border: 'none', cursor: 'pointer' }}>
                            {showPass ? <EyeOff size={20} color="var(--text-secondary)" /> : <Eye size={20} color="var(--text-secondary)" />}
                        </button>
                    </div>
                    <Button type="submit" variant="primary" fullWidth size="lg" loading={loading}>
                        {mode === 'login' ? 'Sign In' : 'Sign Up'}
                    </Button>
                </form>

                <p style={{ textAlign: 'center', marginTop: '24px', color: 'var(--text-secondary)', fontSize: '14px' }}>
                    {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
                    <span onClick={() => setMode(mode === 'login' ? 'signup' : 'login')} style={{ color: 'var(--accent-blue)', cursor: 'pointer', fontWeight: 700 }}>
                        {mode === 'login' ? 'Sign Up' : 'Sign In'}
                    </span>
                </p>
            </motion.div>
        </main>
    );
};

export default Login;
