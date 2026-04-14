import React from 'react';

const Footer = () => {
    return (
        <footer style={{ backgroundColor: '#f8fafc', padding: '64px 0 32px 0', borderTop: '1px solid var(--border-color)' }}>
            <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '40px', marginBottom: '40px' }}>

                <div>
                    <h2 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--accent-blue)', marginBottom: '16px' }}>The Glases</h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.8' }}>
                        Elevate your vision with our premium, modern eyewear. High quality styles for every face, delivered securely across Pakistan.
                    </p>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '12px', fontWeight: '600' }}>
                        📧 glasesthe@gmail.com
                    </p>
                </div>

                <div>
                    <h4 style={{ fontWeight: '700', marginBottom: '16px' }}>Shop</h4>
                    <ul style={{ display: 'flex', flexDirection: 'column', gap: '8px', color: 'var(--text-secondary)' }}>
                        <li><a href="/shop">Blue Light Glasses</a></li>
                        <li><a href="/shop">Sunglasses</a></li>
                        <li><a href="/shop">Aviators</a></li>
                        <li><a href="/shop">Fashion Eyewear</a></li>
                    </ul>
                </div>

                <div>
                    <h4 style={{ fontWeight: '700', marginBottom: '16px' }}>Helpful Links</h4>
                    <ul style={{ display: 'flex', flexDirection: 'column', gap: '8px', color: 'var(--text-secondary)' }}>
                        <li><a href="#">FAQ</a></li>
                        <li><a href="#">Return Policy</a></li>
                        <li><a href="#">Track Order</a></li>
                        <li><a href="#">Contact Us</a></li>
                    </ul>
                </div>

            </div>

            <div className="container" style={{ textAlign: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '32px', color: 'var(--text-light)', fontSize: '14px' }}>
                &copy; {new Date().getFullYear()} The Glases. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;
