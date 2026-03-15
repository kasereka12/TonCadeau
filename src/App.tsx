import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
// @ts-ignore: Header is a JS file without type declarations
import Header from './components/Header';
// @ts-ignore: Footer is a JS file without type declarations
import Footer from './components/Footer';
// @ts-ignore: HomePage is a JS file without type declarations
import HomePage from './pages/HomePage';
// @ts-ignore: ProductsPage is a JS file without type declarations
import ProductsPage from './pages/ProductsPage';
// @ts-ignore: ComposeGiftPage is a JS file without type declarations
import ComposeGiftPage from './pages/ComposeGiftPage';
// @ts-ignore: CartPage is a JS file without type declarations
import CartPage from './pages/CartPage';
// @ts-ignore: SupplierDashboard is a JS file without type declarations
import SupplierDashboard from './pages/SupplierDashboard';
// @ts-ignore: AdminPanel is a JS file without type declarations
import AdminPanel from './pages/AdminPanel';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import ProductDetailPage from './pages/ProductDetailPage';
import ImportantDatesPage from './pages/ImportantDatesPage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import CheckoutPage from './pages/CheckoutPage';
import { NotificationProvider } from './context/NotificationContext';
import { LanguageProvider } from './context/LanguageContext';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ProfilePage from './pages/ProfilePage';
import Preloader from './components/Preloader';
import './style.css';

function AppLayout() {
    const location = useLocation();
    const isAdmin = location.pathname.startsWith('/admin');
    return (
        <div className="min-h-screen flex flex-col">
            {!isAdmin && <Header />}
            <main className="flex-1">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/products" element={<ProductsPage />} />
                    <Route path="/products/:id" element={<ProductDetailPage />} />
                    <Route path="/compose-gift" element={<ComposeGiftPage />} />
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/supplier" element={<SupplierDashboard />} />
                    <Route path="/supplier/login" element={<SupplierDashboard />} />
                    <Route path="/admin/gestion" element={<AdminPanel />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/supplier/register" element={<RegisterPage />} />
                    <Route path="/my-dates" element={<ImportantDatesPage />} />
                    <Route path="/orders" element={<OrderHistoryPage />} />
                    <Route path="/checkout" element={<CheckoutPage />} />
                    <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                </Routes>
            </main>
            {!isAdmin && <Footer />}
        </div>
    );
}

function App() {
    return (
        <AuthProvider>
            <LanguageProvider>
            <ToastProvider>
            <NotificationProvider>
            <CartProvider>
                <Preloader />
                <Router>
                    <AppLayout />
                </Router>
            </CartProvider>
            </NotificationProvider>
            </ToastProvider>
            </LanguageProvider>
        </AuthProvider>
    );
}

export default App;
