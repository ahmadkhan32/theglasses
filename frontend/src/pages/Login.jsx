import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/ui/Toast';
import Button from '../components/ui/Button';

const inputStyle = {
  width: '100%', padding: '11px 14px 11px 40px',
  border: '1px solid var(--border-color)', borderRadius: '10px',
  fontSize: '14px', outline: 'none', fontFamily: 'inherit',
  boxSizing: 'border-box', transition: 'border-color 0.2s',
};

const Login = () => {
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const [tab,        setTab]     = useState('login');
  const [email,      setEmail]   = useState('');
  const [password,   setPass]    = useState('');
  const [showPass,   setShowPass]= useState(false);
  const [loading,    setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (tab === 'login') {
        const { error } = await signIn(email, password);
        if (error) throw error;
        toast?.addToast('Welcome back!', 'success');
        navigate('/');
      } else {
        const { error } = await signUp(email, password);
        if (error) throw error;
        toast?.addToast('Account created! Check your email to confirm.', 'info');
      }
    } catch (err) {
      toast?.addToast(err.message || 'Authentication failed.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      backgroundColor: 'var(--bg-secondary)', padding: '24px',
    }}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          width: '100%', maxWidth: '420px',
          backgroundColor: '#fff', borderRadius: '20px',
          padding: '40px', boxShadow: 'var(--shadow-lg)',
          border: '1px solid var(--border-color)',
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <Link to="/" style={{ fontSize: '26px', fontWeight: '800', color: 'var(--accent-blue)' }}>
            👓 The Glases
          </Link>
        </div>

        {/* Tab toggle */}
        <div style={{
          display: 'flex', backgroundColor: 'var(--bg-secondary)',
          borderRadius: '12px', padding: '4px', marginBottom: '28px',
        }}>
          {['login', 'signup'].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                flex: 1, padding: '8px', border: 'none', borderRadius: '8px', cursor: 'pointer',
                fontFamily: 'inherit', fontWeight: '600', fontSize: '14px',
                backgroundColor: tab === t ? '#fff' : 'transparent',
                color: tab === t ? 'var(--text-primary)' : 'var(--text-secondary)',
                boxShadow: tab === t ? 'var(--shadow-sm)' : 'none',
                transition: 'all 0.2s',
              }}
            >
              {t === 'login' ? 'Sign In' : 'Sign Up'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Email */}
          <div>
            <label style={{ fontSize: '13px', fontWeight: '600', marginBottom: '6px', display: 'block' }}>Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
              <input
                type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com" required style={inputStyle}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label style={{ fontSize: '13px', fontWeight: '600', marginBottom: '6px', display: 'block' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
              <input
                type={showPass ? 'text' : 'password'}
                value={password} onChange={(e) => setPass(e.target.value)}
                placeholder="••••••••" required minLength={6}
                style={{ ...inputStyle, paddingRight: '40px' }}
              />
              <button
                type="button" onClick={() => setShowPass(!showPass)}
                style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}
              >
                {showPass ? <EyeOff size={16} color="var(--text-light)" /> : <Eye size={16} color="var(--text-light)" />}
              </button>
            </div>
          </div>

          <Button type="submit" fullWidth size="lg" disabled={loading} style={{ marginTop: '4px' }}>
            {loading ? 'Please wait…' : tab === 'login' ? 'Sign In' : 'Create Account'}
          </Button>
        </form>

        {tab === 'login' && (
          <p style={{ textAlign: 'center', fontSize: '13px', color: 'var(--text-secondary)', marginTop: '20px' }}>
            Don't have an account?{' '}
            <button onClick={() => setTab('signup')} style={{ background: 'none', border: 'none', color: 'var(--accent-blue)', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit', fontSize: '13px' }}>
              Sign Up
            </button>
          </p>
        )}
      </motion.div>
    </div>
  );
};

export default Login;
