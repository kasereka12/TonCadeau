import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    ShoppingCart, User, ChevronDown, UserPlus, LogOut, LayoutDashboard,
    Bell, Calendar, X, Home, Package, Gift, Cake, Heart, PartyPopper,
    CalendarDays, ShoppingBag,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { useLang } from '../context/LanguageContext';
import logo from '../../public/logo.png';

const TYPE_ICONS: Record<string, LucideIcon> = {
    birthday: Cake, anniversary: Heart, fete: PartyPopper, other: CalendarDays,
};

/* Nav link keys — labels resolved dynamically via t.nav.* */
const NAV_LINK_DEFS = [
    { to: '/',             key: 'home',        icon: Home,        supplierHidden: false, authRequired: false },
    { to: '/products',     key: 'products',    icon: Package,     supplierHidden: false, authRequired: false },
    { to: '/compose-gift', key: 'composeGift', icon: Gift,        supplierHidden: true,  authRequired: false },
    { to: '/orders',       key: 'myOrders',    icon: ShoppingBag, supplierHidden: true,  authRequired: true  },
] as const;

const DropdownLink = ({ to, icon: Icon, label, color = '#aa5a9e', bg = '#aa5a9e', onClick }: {
    to: string; icon: LucideIcon; label: string; color?: string; bg?: string; onClick: () => void;
}) => (
    <Link to={to} onClick={onClick}
        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-700 hover:bg-gradient-to-r hover:from-[#aa5a9e]/8 hover:to-[#6fc7d9]/8 transition-all group">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center transition-colors"
            style={{ background: `${bg}18` }}>
            <Icon className="h-4 w-4" style={{ color }} />
        </div>
        <span className="font-medium">{label}</span>
    </Link>
);

const Header = () => {
    const { getTotalItems } = useCart();
    const { user, signOut } = useAuth();
    const { notifications, unreadCount, markAllRead } = useNotifications();
    const { lang, setLang, t } = useLang();
    const navigate = useNavigate();
    const [isScrolled, setIsScrolled]     = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [notifOpen, setNotifOpen]       = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const notifRef    = useRef<HTMLDivElement>(null);

    const role        = user?.user_metadata?.role as string | undefined;
    const displayName = (user?.user_metadata?.full_name ?? user?.email ?? '') as string;
    const initials    = displayName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || '?';
    const cartCount   = getTotalItems();
    const isSupplier  = role === 'supplier';
    const isAdmin     = role === 'admin';

    const handleSignOut = async () => {
        await signOut();
        close();
        navigate('/');
    };

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

    const close    = () => setDropdownOpen(false);
    const openNotif = () => { setNotifOpen(v => !v); setDropdownOpen(false); };

    /* Nav links visible for this role + auth state */
    const visibleLinks = NAV_LINK_DEFS
        .filter(l => !(l.supplierHidden && isSupplier) && !(l.authRequired && !user))
        .map(l => ({ ...l, label: t.nav[l.key as keyof typeof t.nav] }));

    return (
        <header
            className="sticky top-0 z-50 transition-all duration-300"
            style={{
                background: isScrolled
                    ? 'rgba(170,90,158,0.55)'
                    : 'linear-gradient(135deg, #aa5a9e 0%, #8a4db0 50%, #6fc7d9 100%)',
                backdropFilter:       isScrolled ? 'blur(18px)' : 'none',
                WebkitBackdropFilter: isScrolled ? 'blur(18px)' : 'none',
                borderBottom: isScrolled ? '1px solid rgba(255,255,255,0.12)' : '1px solid transparent',
                boxShadow:    isScrolled ? '0 4px 30px rgba(0,0,0,0.15)' : '0 2px 20px rgba(0,0,0,0.1)',
            }}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-[68px] gap-4">

                    {/* ── Logo ── */}
                    <Link to="/" className="flex items-center gap-3 flex-shrink-0 group">
                        <img src={logo} alt="TonCadeau" className="h-10 w-auto" />
                        <span className="hidden md:inline text-lg font-bold text-white tracking-tight group-hover:text-white/80 transition-colors">
                            TonCadeau<span className="font-light opacity-75">.net</span>
                        </span>
                    </Link>

                    {/* ── Desktop nav (hidden on mobile) ── */}
                    <nav className="hidden md:flex items-center gap-1 flex-1 justify-center">
                        {visibleLinks.map(({ to, label, icon: Icon }) => (
                            <Link key={to} to={to}
                                className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium text-white/85 hover:text-white hover:bg-white/15 transition-all duration-200">
                                <Icon className="h-4 w-4" />
                                {label}
                            </Link>
                        ))}
                    </nav>

                    {/* ── Right actions ── */}
                    <div className="flex items-center gap-2">

                        {/* Language toggle */}
                        <div className="hidden sm:flex items-center rounded-full bg-white/15 border border-white/20 overflow-hidden text-xs font-bold">
                            {(['fr', 'en'] as const).map(l => (
                                <button key={l} onClick={() => setLang(l)}
                                    className={`px-2.5 py-1.5 transition-all duration-200 uppercase ${lang === l ? 'bg-white text-[#aa5a9e]' : 'text-white/70 hover:text-white'}`}>
                                    {l}
                                </button>
                            ))}
                        </div>

                        {/* Cart */}
                        <Link to="/cart"
                            className="relative flex items-center gap-2 px-3 py-2 rounded-full text-white/85 hover:text-white hover:bg-white/15 transition-all duration-200">
                            <ShoppingCart className="h-5 w-5" />
                            <span className="hidden sm:inline text-sm font-medium">{t.nav.cart}</span>
                            {cartCount > 0 && (
                                <span className="absolute -top-0.5 -right-0.5 min-w-[20px] h-5 px-1 bg-white text-[#aa5a9e] text-[11px] font-bold rounded-full flex items-center justify-center shadow-md">
                                    {cartCount}
                                </span>
                            )}
                        </Link>

                        {/* Admin dashboard shortcut */}
                        {isAdmin && (
                            <Link to="/admin/gestion"
                                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/20 hover:bg-white/30 border border-white/30 text-white text-xs font-bold transition-all duration-200">
                                <LayoutDashboard className="h-3.5 w-3.5" />
                                Admin
                            </Link>
                        )}

                        {/* Notification bell (client only) */}
                        {user && !isSupplier && (
                            <div className="relative" ref={notifRef}>
                                <button onClick={openNotif}
                                    className="relative w-10 h-10 flex items-center justify-center rounded-full text-white/85 hover:text-white hover:bg-white/15 transition-all duration-200"
                                    aria-label="Notifications">
                                    <Bell className="h-5 w-5" />
                                    {unreadCount > 0 && (
                                        <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-md animate-pulse">
                                            {unreadCount}
                                        </span>
                                    )}
                                </button>

                                {notifOpen && (
                                    <div className="absolute right-0 top-[calc(100%+10px)] w-80 bg-white/97 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/60 overflow-hidden z-50"
                                        style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.15), 0 0 0 1px rgba(255,255,255,0.5)' }}>
                                        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100"
                                            style={{ background: 'linear-gradient(135deg, #aa5a9e08, #6fc7d908)' }}>
                                            <div className="flex items-center gap-2">
                                                <Bell className="h-4 w-4 text-[#aa5a9e]" />
                                                <span className="font-bold text-slate-900 text-sm">{t.nav.notifications}</span>
                                                {unreadCount > 0 && (
                                                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-red-100 text-red-600">
                                                        {unreadCount} nouveau{unreadCount > 1 ? 'x' : ''}
                                                    </span>
                                                )}
                                            </div>
                                            <button onClick={() => setNotifOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                                                <X className="h-4 w-4" />
                                            </button>
                                        </div>
                                        <div className="max-h-72 overflow-y-auto">
                                            {notifications.length === 0 ? (
                                                <div className="text-center py-8 px-4">
                                                    <PartyPopper className="h-8 w-8 mx-auto mb-2 text-slate-300" />
                                                    <p className="text-sm text-slate-500 font-medium">Aucun rappel pour le moment</p>
                                                    <p className="text-xs text-slate-400 mt-1">Vos dates importantes apparaîtront ici</p>
                                                </div>
                                            ) : (
                                                notifications.map(n => {
                                                    const Icon = TYPE_ICONS[n.type] ?? CalendarDays;
                                                    return (
                                                        <div key={n.id} className="flex items-start gap-3 px-4 py-3 border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                                                            <Icon className="h-5 w-5 flex-shrink-0 mt-0.5 text-slate-500" />
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-sm font-semibold text-slate-900 truncate">{n.title}</p>
                                                                <p className="text-xs text-slate-500 mt-0.5">
                                                                    {n.daysUntil === 0 ? "C'est aujourd'hui !" : `Dans ${n.daysUntil} jour${n.daysUntil > 1 ? 's' : ''}`}
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
                                                    );
                                                })
                                            )}
                                        </div>
                                        <div className="px-4 py-3 border-t border-slate-100 flex items-center justify-between gap-2">
                                            <Link to="/my-dates" onClick={() => setNotifOpen(false)}
                                                className="flex items-center gap-1.5 text-xs font-semibold transition-colors hover:opacity-80"
                                                style={{ color: '#aa5a9e' }}>
                                                <Calendar className="h-3.5 w-3.5" />
                                                {t.nav.myCalendar}
                                            </Link>
                                            {unreadCount > 0 && (
                                                <button onClick={markAllRead}
                                                    className="text-xs text-slate-400 hover:text-slate-600 font-medium transition-colors">
                                                    {lang === 'fr' ? 'Tout marquer comme lu' : 'Mark all as read'}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* ── Account dropdown ── */}
                        <div className="relative" ref={dropdownRef}>

                            {/* Trigger */}
                            {user ? (
                                <button onClick={() => setDropdownOpen(v => !v)}
                                    className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-full bg-white/15 hover:bg-white/25 border border-white/20 transition-all duration-200">
                                    <div className="w-7 h-7 rounded-full bg-white/30 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                                        {initials}
                                    </div>
                                    <span className="hidden sm:inline text-sm font-medium text-white max-w-[120px] truncate">
                                        {displayName}
                                    </span>
                                    <ChevronDown className={`h-3.5 w-3.5 text-white/70 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
                                </button>
                            ) : (
                                <button onClick={() => setDropdownOpen(v => !v)}
                                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-white text-[#aa5a9e] hover:bg-white/90 font-semibold text-sm transition-all duration-200 shadow-md hover:shadow-lg">
                                    <User className="h-4 w-4" />
                                    <span className="hidden sm:inline">{t.nav.login}</span>
                                    <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
                                </button>
                            )}

                            {/* ── Dropdown panel ── */}
                            {dropdownOpen && (
                                <div className="absolute right-0 top-[calc(100%+10px)] w-64 bg-white/97 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/60 overflow-hidden z-50"
                                    style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.15), 0 0 0 1px rgba(255,255,255,0.5)' }}>

                                    {user ? (
                                        /* ════════ CONNECTED ════════ */
                                        <>
                                            {/* Profile header */}
                                            <div className="px-4 py-3 border-b border-gray-100/80"
                                                style={{ background: 'linear-gradient(135deg, #aa5a9e08, #6fc7d908)' }}>
                                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{lang === 'fr' ? 'Mon compte' : 'My account'}</p>
                                                <p className="text-sm font-bold text-gray-800 mt-0.5 truncate">{displayName}</p>
                                                {role && (
                                                    <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full"
                                                        style={{ background: isSupplier ? '#aa5a9e18' : '#6fc7d918', color: isSupplier ? '#aa5a9e' : '#3b9db2' }}>
                                                        {isAdmin ? lang === 'fr' ? 'Admin' : 'Admin' : isSupplier ? lang === 'fr' ? 'Fournisseur' : 'Supplier' : lang === 'fr' ? 'Client' : 'Client'}
                                                    </span>
                                                )}
                                            </div>

                                            {/* ── Mobile-only nav links (hidden on md+) ── */}
                                            <div className="md:hidden px-2 pt-2 pb-1 border-b border-gray-100/80 space-y-0.5">
                                                {visibleLinks.map(({ to, label, icon: Icon }) => (
                                                    <Link key={to} to={to} onClick={close}
                                                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-700 hover:bg-gray-50 transition-all">
                                                        <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0">
                                                            <Icon className="h-4 w-4 text-slate-500" />
                                                        </div>
                                                        <span className="font-medium">{label}</span>
                                                    </Link>
                                                ))}
                                                {/* Supplier: dashboard link on mobile */}
                                                {isSupplier && (
                                                    <Link to="/supplier" onClick={close}
                                                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-700 hover:bg-gray-50 transition-all">
                                                        <div className="w-8 h-8 rounded-xl bg-[#aa5a9e]/10 flex items-center justify-center">
                                                            <LayoutDashboard className="h-4 w-4 text-[#aa5a9e]" />
                                                        </div>
                                                        <span className="font-medium">{t.nav.dashboard}</span>
                                                    </Link>
                                                )}
                                                {/* Admin: dashboard link on mobile */}
                                                {isAdmin && (
                                                    <Link to="/admin/gestion" onClick={close}
                                                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-700 hover:bg-gray-50 transition-all">
                                                        <div className="w-8 h-8 rounded-xl bg-[#aa5a9e]/10 flex items-center justify-center">
                                                            <LayoutDashboard className="h-4 w-4 text-[#aa5a9e]" />
                                                        </div>
                                                        <span className="font-medium">{t.nav.admin}</span>
                                                    </Link>
                                                )}
                                            </div>

                                            {/* ── Account links ── */}
                                            <div className="px-2 py-1.5 space-y-0.5">
                                                {/* Mon profil — always visible */}
                                                <DropdownLink to="/profile" icon={User} label={t.nav.myProfile}
                                                    color="#aa5a9e" bg="#aa5a9e" onClick={close} />

                                                {!isSupplier && !isAdmin && (
                                                    <>
                                                        <DropdownLink to="/my-dates" icon={Calendar} label={t.nav.myCalendar}
                                                            color="#3b9db2" bg="#6fc7d9" onClick={close} />
                                                        <div className="hidden md:block">
                                                            <DropdownLink to="/orders" icon={ShoppingBag} label={t.nav.myOrders}
                                                                color="#aa5a9e" bg="#aa5a9e" onClick={close} />
                                                        </div>
                                                    </>
                                                )}
                                                {isSupplier && (
                                                    <div className="hidden md:block">
                                                        <DropdownLink to="/supplier" icon={LayoutDashboard} label={t.nav.dashboard}
                                                            color="#aa5a9e" bg="#aa5a9e" onClick={close} />
                                                    </div>
                                                )}
                                                {isAdmin && (
                                                    <div className="hidden md:block">
                                                        <DropdownLink to="/admin/gestion" icon={LayoutDashboard} label={t.nav.admin}
                                                            color="#aa5a9e" bg="#aa5a9e" onClick={close} />
                                                    </div>
                                                )}

                                                {/* Lang toggle in dropdown (mobile only) */}
                                                <div className="md:hidden flex items-center gap-2 px-3 py-2">
                                                    <span className="text-xs font-semibold text-slate-400 mr-1">
                                                        {lang === 'fr' ? 'Langue' : 'Language'}
                                                    </span>
                                                    {(['fr', 'en'] as const).map(l => (
                                                        <button key={l} onClick={() => setLang(l)}
                                                            className={`px-3 py-1 rounded-full text-xs font-bold border transition-all ${lang === l ? 'border-[#aa5a9e] bg-[#aa5a9e]/10 text-[#aa5a9e]' : 'border-slate-200 text-slate-400 hover:border-slate-300'}`}>
                                                            {l.toUpperCase()}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Logout */}
                                            <div className="px-2 pb-2 border-t border-gray-100/80">
                                                <button onClick={handleSignOut}
                                                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all">
                                                    <div className="w-8 h-8 rounded-xl bg-red-50 flex items-center justify-center">
                                                        <LogOut className="h-4 w-4 text-red-400" />
                                                    </div>
                                                    {t.nav.logout}
                                                </button>
                                            </div>
                                        </>
                                    ) : (
                                        /* ════════ NOT CONNECTED ════════ */
                                        <>
                                            {/* ── Mobile-only public nav ── */}
                                            <div className="md:hidden px-2 pt-2 pb-1 border-b border-gray-100/80 space-y-0.5">
                                                {[
                                                    { to: '/',         label: t.nav.home,     icon: Home    },
                                                    { to: '/products', label: t.nav.products,  icon: Package },
                                                ].map(({ to, label, icon: Icon }) => (
                                                    <Link key={to} to={to} onClick={close}
                                                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-700 hover:bg-gray-50 transition-all">
                                                        <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center">
                                                            <Icon className="h-4 w-4 text-slate-500" />
                                                        </div>
                                                        <span className="font-medium">{label}</span>
                                                    </Link>
                                                ))}
                                            </div>

                                            {/* ── Lang toggle (not connected, mobile) ── */}
                                            <div className="md:hidden flex items-center gap-2 px-4 pb-2">
                                                <span className="text-xs font-semibold text-slate-400 mr-1">
                                                    {lang === 'fr' ? 'Langue' : 'Language'}
                                                </span>
                                                {(['fr', 'en'] as const).map(l => (
                                                    <button key={l} onClick={() => setLang(l)}
                                                        className={`px-3 py-1 rounded-full text-xs font-bold border transition-all ${lang === l ? 'border-[#aa5a9e] bg-[#aa5a9e]/10 text-[#aa5a9e]' : 'border-slate-200 text-slate-400 hover:border-slate-300'}`}>
                                                        {l.toUpperCase()}
                                                    </button>
                                                ))}
                                            </div>

                                            {/* ── Single connexion CTA ── */}
                                            <div className="px-3 py-3">
                                                <Link to="/login" onClick={close}
                                                    className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-white text-sm font-bold transition-all hover:opacity-90 hover:shadow-lg"
                                                    style={{ background: 'linear-gradient(135deg, #aa5a9e, #6fc7d9)' }}>
                                                    <User className="h-4 w-4" />
                                                    {t.nav.login}
                                                </Link>
                                            </div>

                                            {/* ── Register ── */}
                                            <div className="px-3 pb-3 pt-0">
                                                <Link to="/register" onClick={close}
                                                    className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-semibold text-[#aa5a9e] border border-[#aa5a9e]/20 bg-[#aa5a9e]/5 hover:bg-[#aa5a9e]/10 transition-all">
                                                    <UserPlus className="h-4 w-4" />
                                                    {t.nav.register}
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
