import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

const icons = {
    success: <CheckCircle size={20} color="#22c55e" />,
    error: <XCircle size={20} color="#ef4444" />,
    info: <Info size={20} color="var(--accent-blue)" />,
};

const Toast = ({ message, type = 'info', onClose, duration = 3000 }) => {
    useEffect(() => {
        if (duration) {
            const t = setTimeout(onClose, duration);
            return () => clearTimeout(t);
        }
    }, [duration, onClose]);

    return (
        <motion.div
            initial={{ opacity: 0, x: 80 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 80 }}
            style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                backgroundColor: '#fff', borderRadius: '12px', padding: '14px 18px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.15)', minWidth: '260px', maxWidth: '360px',
                borderLeft: `4px solid ${type === 'success' ? '#22c55e' : type === 'error' ? '#ef4444' : 'var(--accent-blue)'}`,
            }}
        >
            {icons[type]}
            <span style={{ flex: 1, fontSize: '14px', color: 'var(--text-primary)' }}>{message}</span>
            <button onClick={onClose}><X size={16} color="var(--text-light)" /></button>
        </motion.div>
    );
};

export const ToastContainer = ({ toasts, removeToast }) => (
    <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 200, display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <AnimatePresence>
            {toasts.map((t) => (
                <Toast key={t.id} {...t} onClose={() => removeToast(t.id)} />
            ))}
        </AnimatePresence>
    </div>
);

export default Toast;
