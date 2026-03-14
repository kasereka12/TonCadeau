import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
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
import './style.css';

function App() {
    return (
        <AuthProvider>
            <CartProvider>
                <Router>
                    <div className="min-h-screen flex flex-col">
                        <Header />
                        <main className="flex-1">
                            <Routes>
                                <Route path="/" element={<HomePage />} />
                                <Route path="/products" element={<ProductsPage />} />
                                <Route path="/compose-gift" element={<ComposeGiftPage />} />
                                <Route path="/cart" element={<CartPage />} />
                                <Route path="/supplier" element={<SupplierDashboard />} />
                                <Route path="/supplier/login" element={<SupplierDashboard />} />
                                <Route path="/admin/gestion" element={<AdminPanel />} />
                                <Route path="/login" element={<LoginPage />} />
                                <Route path="/register" element={<RegisterPage />} />
                                <Route path="/supplier/register" element={<RegisterPage />} />
                            </Routes>
                        </main>
                        <Footer />
                    </div>
                </Router>
            </CartProvider>
        </AuthProvider>
    );
}

export default App;
