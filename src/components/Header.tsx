import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, User, Store, ChevronDown, UserPlus, LogOut, LayoutDashboard, Bell, Calendar, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import logo from '../../public/logo.png';

const TYPE_ICONS: Record<string, string> = {
    birthday: '🎂', anniversary: '💑', fete: '🎉', other: '📅',
};

const Header = () => {
    const { getTotalItems } = useCart();
    const { user, signOut } = useAuth();
    const { notifications, unreadCount, markAllRead } = useNotifications();
    const [isScrolled, setIsScrolled]       = useState(false);
    const [dropdownOpen, setDropdownOpen]   = useState(false);
    const [notifOpen, setNotifOpen]         = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const notifRef    = useRef<HTMLDivElement>(null);

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
            if (notifRef.current && !notifRef.current.contains(e.target as Node))
                setNotifOpen(false);
        };
        document.addEventListener('mousedown', onClickOutside);
        return () => document.removeEventListener('mousedown', onClickOutside);
    }, []);

    const close = () => setDropdownOpen(false);

    const openNotif = () => {
        setNotifOpen(v => !v);
        setDropdownOpen(false);
    };

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

                        {/* ── Notification bell (only when logged in) ── */}
                        {user && (
                            <div className="relative" ref={notifRef}>
                                <button
                                    onClick={openNotif}
                                    className="relative w-10 h-10 flex items-center justify-center rounded-full text-white/85 hover:text-white hover:bg-white/15 transition-all duration-200"
                                    aria-label="Notifications"
                                >
                                    <Bell className="h-5 w-5" />
                                    {unreadCount > 0 && (
                                        <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-md animate-pulse">
                                            {unreadCount}
                                        </span>
                                    )}
                                </button>

                                {/* Notification dropdown */}
                                {notifOpen && (
                                    <div className="absolute right-0 top-[calc(100%+10px)] w-80 bg-white/97 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/60 overflow-hidden z-50"
                                        style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.15), 0 0 0 1px rgba(255,255,255,0.5)' }}>

                                        {/* Header */}
                                        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100"
                                            style={{ background: 'linear-gradient(135deg, #aa5a9e08, #6fc7d908)' }}>
                                            <div className="flex items-center gap-2">
                                                <Bell className="h-4 w-4 text-[#aa5a9e]" />
                                                <span className="font-bold text-slate-900 text-sm">Rappels</span>
                                                {unreadCount > 0 && (
                                                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-red-100 text-red-600">
                                                        {unreadCount} nouveau{unreadCount > 1 ? 'x' : ''}
                                                    </span>
                                                )}
                                            </div>
                                            <button onClick={() => setNotifOpen(false)}
                                                className="text-slate-400 hover:text-slate-600 transition-colors">
                                                <X className="h-4 w-4" />
                                            </button>
                                        </div>

                                        {/* List */}
                                        <div className="max-h-72 overflow-y-auto">
                                            {notifications.length === 0 ? (
                                                <div className="text-center py-8 px-4">
                                                    <div className="text-3xl mb-2">🎉</div>
                                                    <p className="text-sm text-slate-500 font-medium">Aucun rappel pour le moment</p>
                                                    <p className="text-xs text-slate-400 mt-1">Vos dates importantes apparaîtront ici</p>
                                                </div>
                                            ) : (
                                                notifications.map(n => (
                                                    <div key={n.id}
                                                        className="flex items-start gap-3 px-4 py-3 border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                                                        <span className="text-xl flex-shrink-0 mt-0.5">{TYPE_ICONS[n.type]}</span>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-semibold text-slate-900 truncate">{n.title}</p>
                                                            <p className="text-xs text-slate-500 mt-0.5">
                                                                {n.daysUntil === 0
                                                                    ? "C'est aujourd'hui ! 🎉"
                                                                    : `Dans ${n.daysUntil} jour${n.daysUntil > 1 ? 's' : ''}`}
                                                            </p>
                                                        </div>
                                                        {n.daysUntil === 0 && (
                                                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full text-white flex-shrink-0 mt-0.5"
                                                                style={{ background: 'linear-gradient(135deg, #aa5a9e, #6fc7d9)' }}>
                                                                AUJOURD'HUI
                                                            </span>
                                                        )}
                                                        {n.daysUntil > 0 && n.daysUntil <= 3 && (
                                                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700 flex-shrink-0 mt-0.5">
                                                                BIENTÔT
                                                            </span>
                                                        )}
                                                    </div>
                                                ))
                                            )}
                                        </div>

                                        {/* Footer */}
                                        <div className="px-4 py-3 border-t border-slate-100 flex items-center justify-between gap-2">
                                            <Link to="/my-dates"
                                                onClick={() => setNotifOpen(false)}
                                                className="flex items-center gap-1.5 text-xs font-semibold transition-colors hover:opacity-80"
                                                style={{ color: '#aa5a9e' }}>
                                                <Calendar className="h-3.5 w-3.5" />
                                                Mon calendrier
                                            </Link>
                                            {unreadCount > 0 && (
                                                <button
                                                    onClick={markAllRead}
                                                    className="text-xs text-slate-400 hover:text-slate-600 font-medium transition-colors"
                                                >
                                                    Tout marquer comme lu
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Account dropdown */}
                        <div className="relative" ref={dropdownRef}>
                            {user ? (
                                /* ── Connected ── */
                                <button
                                    onClick={() => setDropdownOpen(v => !v)}
                                    className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-full bg-white/15 hover:bg-white/25 border border-white/20 transition-all duration-200"
                                >
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
                                        <>
                                            <div className="px-4 py-3 border-b border-gray-100/80">
                                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Mon compte</p>
                                                <p className="text-sm font-medium text-gray-800 mt-0.5 truncate">{displayName}</p>
                                            </div>

                                            <div className="px-2 py-1 space-y-0.5">
                                                <Link to="/my-dates" onClick={close}
                                                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-700 hover:bg-gradient-to-r hover:from-[#aa5a9e]/8 hover:to-[#6fc7d9]/8 transition-all group">
                                                    <div className="w-8 h-8 rounded-xl bg-[#6fc7d9]/10 flex items-center justify-center group-hover:bg-[#6fc7d9]/20 transition-colors">
                                                        <Calendar className="h-4 w-4 text-[#6fc7d9]" />
                                                    </div>
                                                    <span className="font-medium">Mon calendrier</span>
                                                </Link>

                                                {role === 'supplier' && (
                                                    <Link to="/supplier" onClick={close}
                                                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-700 hover:bg-gradient-to-r hover:from-[#aa5a9e]/8 hover:to-[#6fc7d9]/8 transition-all group">
                                                        <div className="w-8 h-8 rounded-xl bg-[#aa5a9e]/10 flex items-center justify-center group-hover:bg-[#aa5a9e]/20 transition-colors">
                                                            <LayoutDashboard className="h-4 w-4 text-[#aa5a9e]" />
                                                        </div>
                                                        <span className="font-medium">Mon tableau de bord</span>
                                                    </Link>
                                                )}
                                            </div>

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
