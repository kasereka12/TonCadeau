import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, User, Store, ChevronDown, UserPlus } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import logo from '../../public/logo.png';

const Header = () => {
    const { getTotalItems } = useCart();
    const { user, signOut } = useAuth();
    const [isScrolled, setIsScrolled] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const role = user?.user_metadata?.role as string | undefined;

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 100);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const headerStyle = {
        background: isScrolled ? 'rgba(255,255,255,0.01)' : 'linear-gradient(135deg, #aa5a9eff 40%, #6fc7d9 100%)',
    };

    const linkClass = 'text-white hover:text-[#6fc7d9] transition-colors duration-300';

    return (
        <header
            className={`shadow-md sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'backdrop-blur-md' : ''}`}
            style={headerStyle}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">

                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2">
                        <img src={logo} alt="TonCadeau.fr Logo" className="h-30 w-25" />
                        <span className="hidden md:inline text-2xl font-bold text-white">
                            TonCadeau.net
                        </span>
                    </Link>

                    {/* Actions */}
                    <div className="flex items-center space-x-4">
                        <Link to="/" className={`px-3 py-2 rounded-md text-sm font-medium ${linkClass}`}>
                            Accueil
                        </Link>

                        {/* Connexion Dropdown */}
                        <div className="relative" ref={dropdownRef}>
                            {user ? (
                                /* Utilisateur connecté */
                                <div className="flex items-center space-x-2">
                                    <span className="hidden sm:inline text-sm text-white/80 font-medium">
                                        {user.user_metadata?.full_name ?? user.email}
                                    </span>
                                    <button
                                        onClick={() => setDropdownOpen(v => !v)}
                                        className={`flex items-center space-x-1 ${linkClass}`}
                                    >
                                        <User className="h-5 w-5" />
                                        <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
                                    </button>

                                    {dropdownOpen && (
                                        <div className="absolute right-0 top-10 w-48 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50">
                                            {role === 'supplier' && (
                                                <Link
                                                    to="/supplier"
                                                    onClick={() => setDropdownOpen(false)}
                                                    className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gradient-to-r hover:from-[#6fc7d9]/10 hover:to-[#a7549b]/10 transition-all"
                                                >
                                                    <Store className="h-4 w-4 text-[#a7549b]" />
                                                    Mon tableau de bord
                                                </Link>
                                            )}
                                            <button
                                                onClick={() => { signOut(); setDropdownOpen(false); }}
                                                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-red-500 hover:bg-red-50 transition-all"
                                            >
                                                <User className="h-4 w-4" />
                                                Se déconnecter
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                /* Non connecté */
                                <>
                                    <button
                                        onClick={() => setDropdownOpen(v => !v)}
                                        className={`flex items-center space-x-1 ${linkClass}`}
                                    >
                                        <User className="h-5 w-5" />
                                        <span className="hidden sm:inline text-sm font-medium">Se connecter</span>
                                        <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
                                    </button>

                                    {dropdownOpen && (
                                        <div className="absolute right-0 top-10 w-52 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50">
                                            <div className="px-4 py-2 border-b border-gray-100">
                                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Connexion</p>
                                            </div>
                                            <Link
                                                to="/login"
                                                onClick={() => setDropdownOpen(false)}
                                                className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gradient-to-r hover:from-[#6fc7d9]/10 hover:to-[#a7549b]/10 transition-all"
                                            >
                                                <User className="h-4 w-4 text-[#6fc7d9]" />
                                                Espace Client
                                            </Link>
                                            <Link
                                                to="/supplier"
                                                onClick={() => setDropdownOpen(false)}
                                                className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gradient-to-r hover:from-[#6fc7d9]/10 hover:to-[#a7549b]/10 transition-all"
                                            >
                                                <Store className="h-4 w-4 text-[#a7549b]" />
                                                Espace Fournisseur
                                            </Link>
                                            <div className="px-4 py-2 border-t border-gray-100">
                                                <Link
                                                    to="/register"
                                                    onClick={() => setDropdownOpen(false)}
                                                    className="flex items-center gap-2 text-xs text-[#a7549b] font-semibold hover:text-[#6fc7d9] transition-colors"
                                                >
                                                    <UserPlus className="h-3 w-3" />
                                                    Créer un compte
                                                </Link>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>

                        {/* Panier */}
                        <Link
                            to="/cart"
                            className={`relative flex items-center space-x-1 ${linkClass}`}
                        >
                            <ShoppingCart className="h-5 w-5" />
                            <span className="hidden sm:inline text-sm font-medium">Panier</span>
                            {getTotalItems() > 0 && (
                                <span className="absolute -top-2 -right-2 bg-gradient-to-r from-[#6fc7d9] to-[#a7549b] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center shadow-lg">
                                    {getTotalItems()}
                                </span>
                            )}
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
