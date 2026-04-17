import React, { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import ToastProvider from './components/ui/Toast';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import CartDrawer from './components/cart/CartDrawer';
import Loader from './components/ui/Loader';

// Scroll to top on every route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, [pathname]);
  return null;
}

// 404 page
function NotFound() {
  return (
    <div className="page-404">
      <div className="page-404-code">404</div>
      <h2 style={{ fontSize: '24px', fontWeight: '700' }}>Page not found</h2>
      <p style={{ color: 'var(--text-muted)', maxWidth: '360px' }}>
        The page you're looking for doesn't exist or has been moved.
      </p>
      <a
        href="/"
        style={{
          padding: '12px 28px', backgroundColor: 'var(--primary)', color: '#fff',
          borderRadius: 'var(--radius-sm)', fontWeight: '600', fontSize: '15px',
          transition: 'background var(--transition-base)',
        }}
      >
        Back to Home
      </a>
    </div>
  );
}

// Lazy load all pages
const Home          = lazy(() => import('./pages/Home'));
const Shop          = lazy(() => import('./pages/Shop'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Cart          = lazy(() => import('./pages/Cart'));
const Checkout      = lazy(() => import('./pages/Checkout'));
const Login         = lazy(() => import('./pages/Login'));
const Profile       = lazy(() => import('./pages/Profile'));
const TryOn         = lazy(() => import('./pages/TryOn'));

// Admin pages
const AdminDashboard = lazy(() => import('./pages/Admin/Dashboard'));
const AdminProducts  = lazy(() => import('./pages/Admin/Products'));
const AdminCategories = lazy(() => import('./pages/Admin/Categories'));
const AdminOrders    = lazy(() => import('./pages/Admin/Orders'));
const AdminUsers     = lazy(() => import('./pages/Admin/Users'));
const AdminCoupons   = lazy(() => import('./pages/Admin/Coupons'));

const PageLoader = () => (
  <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <Loader size={40} />
  </div>
);

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <ToastProvider>
            <ScrollToTop />
            <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
              <Navbar />
              <main style={{ flex: 1 }}>
                <Suspense fallback={<PageLoader />}>
                  <Routes>
                    <Route path="/"               element={<Home />} />
                    <Route path="/shop"            element={<Shop />} />
                    <Route path="/product/:slug"   element={<ProductDetail />} />
                    <Route path="/cart"            element={<Cart />} />
                    <Route path="/checkout"        element={<Checkout />} />
                    <Route path="/login"           element={<Login />} />
                    <Route path="/profile"         element={<Profile />} />
                    <Route path="/try-on"          element={<TryOn />} />
                    <Route path="/admin"           element={<AdminDashboard />} />
                    <Route path="/admin/products"  element={<AdminProducts />} />
                    <Route path="/admin/categories" element={<AdminCategories />} />
                    <Route path="/admin/orders"    element={<AdminOrders />} />
                    <Route path="/admin/users"     element={<AdminUsers />} />
                    <Route path="/admin/coupons"   element={<AdminCoupons />} />
                    <Route path="*"                element={<NotFound />} />
                  </Routes>
                </Suspense>
              </main>
              <Footer />
              <CartDrawer />
            </div>
          </ToastProvider>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
