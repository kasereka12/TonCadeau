import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, User, Store, ChevronDown, UserPlus, LogOut, LayoutDashboard } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import logo from '../../public/logo.png';

const Header = () => {
    const { getTotalItems } = useCart();
    const { user, signOut } = useAuth();
    const [isScrolled, setIsScrolled] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const role         = user?.user_metadata?.role as string | undefined;
    const displayName  = (user?.user_metadata?.full_name ?? user?.email ?? '') as string;
    const initials     = displayName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || '?';
    const cartCount    = getTotalItems();

    useEffect(() => {
        const onScroll = () => setIsScrolled(window.scrollY > 60);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
        const onClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node))
                setDropdownOpen(false);
        };
        document.addEventListener('mousedown', onClickOutside);
        return () => document.removeEventListener('mousedown', onClickOutside);
    }, []);

    const close = () => setDropdownOpen(false);

    return (
        <header
            className="sticky top-0 z-50 transition-all duration-300"
            style={{
                background: isScrolled
                    ? 'rgba(170,90,158,0.55)'
                    : 'linear-gradient(135deg, #aa5a9e 0%, #8a4db0 50%, #6fc7d9 100%)',
                backdropFilter: isScrolled ? 'blur(18px)' : 'none',
                WebkitBackdropFilter: isScrolled ? 'blur(18px)' : 'none',
                borderBottom: isScrolled ? '1px solid rgba(255,255,255,0.12)' : '1px solid transparent',
                boxShadow: isScrolled ? '0 4px 30px rgba(0,0,0,0.15)' : '0 2px 20px rgba(0,0,0,0.1)',
            }}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-[68px] gap-6">

                    {/* ── Logo ── */}
                    <Link to="/" className="flex items-center gap-3 flex-shrink-0 group">
                        <img src={logo} alt="TonCadeau" className="h-10 w-auto" />
                        <span className="hidden md:inline text-lg font-bold text-white tracking-tight group-hover:text-white/80 transition-colors">
                            TonCadeau<span className="font-light opacity-75">.net</span>
                        </span>
                    </Link>

                    {/* ── Nav links (center) ── */}
                    <nav className="hidden md:flex items-center gap-1">
                        {[
                            { to: '/',              label: 'Accueil' },
                            { to: '/products',      label: 'Produits' },
                            { to: '/compose-gift',  label: 'Composer un cadeau' },
                        ].map(link => (
                            <Link
                                key={link.to}
                                to={link.to}
                                className="px-4 py-2 rounded-full text-sm font-medium text-white/85 hover:text-white hover:bg-white/15 transition-all duration-200"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    {/* ── Right actions ── */}
                    <div className="flex items-center gap-2">

                        {/* Cart */}
                        <Link
                            to="/cart"
                            className="relative flex items-center gap-2 px-4 py-2 rounded-full text-white/85 hover:text-white hover:bg-white/15 transition-all duration-200"
                        >
                            <ShoppingCart className="h-5 w-5" />
                            <span className="hidden sm:inline text-sm font-medium">Panier</span>
                            {cartCount > 0 && (
                                <span className="absolute -top-0.5 -right-0.5 min-w-[20px] h-5 px-1 bg-white text-[#aa5a9e] text-[11px] font-bold rounded-full flex items-center justify-center shadow-md">
                                    {cartCount}
                                </span>
                            )}
                        </Link>

                        {/* Account dropdown */}
                        <div className="relative" ref={dropdownRef}>
                            {user ? (
                                /* ── Connected ── */
                                <button
                                    onClick={() => setDropdownOpen(v => !v)}
                                    className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-full bg-white/15 hover:bg-white/25 border border-white/20 transition-all duration-200"
                                >
                                    {/* Avatar */}
                                    <div className="w-7 h-7 rounded-full bg-white/30 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                                        {initials}
                                    </div>
                                    <span className="hidden sm:inline text-sm font-medium text-white max-w-[120px] truncate">
                                        {displayName}
                                    </span>
                                    <ChevronDown className={`h-3.5 w-3.5 text-white/70 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
                                </button>
                            ) : (
                                /* ── Not connected ── */
                                <button
                                    onClick={() => setDropdownOpen(v => !v)}
                                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-white text-[#aa5a9e] hover:bg-white/90 font-semibold text-sm transition-all duration-200 shadow-md hover:shadow-lg"
                                >
                                    <User className="h-4 w-4" />
                                    <span className="hidden sm:inline">Se connecter</span>
                                    <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
                                </button>
                            )}

                            {/* ── Dropdown panel ── */}
                            {dropdownOpen && (
                                <div className="absolute right-0 top-[calc(100%+10px)] w-56 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/60 overflow-hidden z-50"
                                    style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.15), 0 0 0 1px rgba(255,255,255,0.5)' }}>

                                    {user ? (
                                        /* Connected menu */
                                        <>
                                            {/* User info header */}
                                            <div className="px-4 py-3 border-b border-gray-100/80">
                                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Mon compte</p>
                                                <p className="text-sm font-medium text-gray-800 mt-0.5 truncate">{displayName}</p>
                                            </div>

                                            {role === 'supplier' && (
                                                <Link to="/supplier" onClick={close}
                                                    className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-[#aa5a9e]/8 hover:to-[#6fc7d9]/8 transition-all group">
                                                    <div className="w-8 h-8 rounded-xl bg-[#aa5a9e]/10 flex items-center justify-center group-hover:bg-[#aa5a9e]/20 transition-colors">
                                                        <LayoutDashboard className="h-4 w-4 text-[#aa5a9e]" />
                                                    </div>
                                                    <span className="font-medium">Mon tableau de bord</span>
                                                </Link>
                                            )}

                                            <div className="p-2 border-t border-gray-100/80">
                                                <button
                                                    onClick={() => { signOut(); close(); }}
                                                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all">
                                                    <LogOut className="h-4 w-4" />
                                                    Se déconnecter
                                                </button>
                                            </div>
                                        </>
                                    ) : (
                                        /* Guest menu */
                                        <>
                                            <div className="px-4 pt-3 pb-2">
                                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Connexion</p>
                                            </div>

                                            <div className="px-2 pb-1 space-y-0.5">
                                                <Link to="/login" onClick={close}
                                                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-700 hover:bg-[#6fc7d9]/10 transition-all group">
                                                    <div className="w-8 h-8 rounded-xl bg-[#6fc7d9]/10 flex items-center justify-center group-hover:bg-[#6fc7d9]/20 transition-colors">
                                                        <User className="h-4 w-4 text-[#6fc7d9]" />
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-gray-800">Espace Client</p>
                                                        <p className="text-[11px] text-gray-400">Suivez vos commandes</p>
                                                    </div>
                                                </Link>

                                                <Link to="/supplier" onClick={close}
                                                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-700 hover:bg-[#aa5a9e]/10 transition-all group">
                                                    <div className="w-8 h-8 rounded-xl bg-[#aa5a9e]/10 flex items-center justify-center group-hover:bg-[#aa5a9e]/20 transition-colors">
                                                        <Store className="h-4 w-4 text-[#aa5a9e]" />
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-gray-800">Espace Fournisseur</p>
                                                        <p className="text-[11px] text-gray-400">Gérez vos produits</p>
                                                    </div>
                                                </Link>
                                            </div>

                                            <div className="mx-2 mb-2 mt-1 p-3 rounded-xl bg-gradient-to-r from-[#aa5a9e]/8 to-[#6fc7d9]/8 border border-[#aa5a9e]/10">
                                                <Link to="/register" onClick={close}
                                                    className="flex items-center gap-2 text-sm font-semibold text-[#aa5a9e] hover:text-[#6fc7d9] transition-colors">
                                                    <UserPlus className="h-4 w-4" />
                                                    Créer un compte gratuit
                                                </Link>
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
