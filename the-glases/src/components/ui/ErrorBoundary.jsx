import React from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';
import Button from './Button';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("ErrorBoundary caught an error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    minHeight: '100vh', display: 'flex', flexDirection: 'column', 
                    alignItems: 'center', justifyContent: 'center', 
                    padding: '40px', backgroundColor: '#f8fafc', textAlign: 'center'
                }}>
                    <AlertTriangle size={64} color="#ef4444" style={{ marginBottom: '24px' }} />
                    <h1 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '12px' }}>Oops, something went wrong.</h1>
                    <p style={{ color: '#64748b', marginBottom: '24px', maxWidth: '400px' }}>
                        {this.state.error?.message || "An unexpected error occurred in this part of the app."}
                    </p>
                    <p style={{ color: '#94a3b8', fontSize: '13px', marginBottom: '32px' }}>
                        (If you're noticing network idle timeouts, your firewall or internet provider might be blocking connection to the database. Trying refreshing or turning off VPNs).
                    </p>
                    <Button variant="primary" onClick={() => window.location.reload()}>
                        <RefreshCcw size={16} /> Reload Page
                    </Button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
