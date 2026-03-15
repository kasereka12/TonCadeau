import { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import {
    LayoutDashboard, Package, Users, Truck, Settings, Trash2,
    LogOut, MapPin, Save, ExternalLink, Menu, X,
    DollarSign, ShoppingBag, Eye, CheckCircle, Clock, AlertCircle,
    ChevronRight, Store,
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { suppliers } from '../data/products';
import type { Product, Order } from '../types';
import logo from '../../public/logo.png';

/* ─── Constants ──────────────────────────────────────────────────────────── */
const MOROCCAN_CITIES = [
    'Casablanca','Rabat','Marrakech','Fès','Tanger','Agadir','Meknès','Oujda',
    'Kénitra','Tétouan','Safi','El Jadida','Nador','Béni Mellal','Mohammedia',
    'Khouribga','Settat','Larache','Khémisset','Berrechid','Taza','Laâyoune',
];
const DELIVERY_KEY = 'tc_delivery_prices';
const loadDelivery = (): Record<string, string> => {
    try { return JSON.parse(localStorage.getItem(DELIVERY_KEY) ?? '{}'); } catch { return {}; }
};

const STATUS_LABELS: Record<string, { label: string; color: string; icon: typeof CheckCircle }> = {
    pending:   { label: 'En attente',  color: 'text-amber-600 bg-amber-50',   icon: Clock },
    confirmed: { label: 'Confirmée',   color: 'text-blue-600 bg-blue-50',     icon: CheckCircle },
    shipped:   { label: 'Expédiée',    color: 'text-purple-600 bg-purple-50', icon: Truck },
    delivered: { label: 'Livrée',      color: 'text-emerald-600 bg-emerald-50', icon: CheckCircle },
    cancelled: { label: 'Annulée',     color: 'text-red-600 bg-red-50',       icon: AlertCircle },
};

/* ─── Sidebar nav items ──────────────────────────────────────────────────── */
const NAV = [
    { id: 'dashboard',  label: 'Tableau de bord', icon: LayoutDashboard },
    { id: 'orders',     label: 'Commandes',        icon: ShoppingBag },
    { id: 'products',   label: 'Produits',          icon: Package },
    { id: 'suppliers',  label: 'Fournisseurs',      icon: Store },
    { id: 'delivery',   label: 'Livraison',         icon: Truck },
    { id: 'settings',   label: 'Paramètres',        icon: Settings },
];

/* ─── Helpers ────────────────────────────────────────────────────────────── */
const SectionTitle = ({ children }: { children: React.ReactNode }) => (
    <h2 className="text-xl font-bold text-slate-900 mb-6">{children}</h2>
);

const StatCard = ({ icon: Icon, label, value, color }: {
    icon: typeof Package; label: string; value: string | number; color: string;
}) => (
    <div className="bg-white rounded-2xl border border-slate-100 p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
            <Icon className="h-6 w-6 text-white" />
        </div>
        <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</p>
            <p className="text-2xl font-bold text-slate-900 mt-0.5">{value}</p>
        </div>
    </div>
);

/* ══════════════════════════════════════════════════════════════════════════ */
const AdminPanel = () => {
    const { user, signOut } = useAuth();
    const isAdmin = user?.user_metadata?.role === 'admin';

    const [active, setActive]               = useState('dashboard');
    const [sidebarOpen, setSidebarOpen]     = useState(false);
    const [products, setProducts]           = useState<Product[]>([]);
    const [orders, setOrders]               = useState<Order[]>([]);
    const [delivery, setDelivery]           = useState<Record<string, string>>(loadDelivery);
    const [deliverySaved, setDeliverySaved] = useState(false);
    const [ordersLoading, setOrdersLoading] = useState(false);

    useEffect(() => {
        if (!isAdmin) return;
        fetchProducts();
        fetchOrders();
    }, [isAdmin]);

    const fetchProducts = async () => {
        const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
        if (data) setProducts(data);
    };

    const fetchOrders = async () => {
        setOrdersLoading(true);
        const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
        if (data) setOrders(data.map(r => ({
            id: r.id, date: r.created_at, items: r.items ?? [],
            giftBundles: r.gift_bundles ?? [], deliveryInfo: r.delivery_info,
            giftMessage: r.gift_message, total: r.total, status: r.status,
            payment_method: r.payment_method,
        })));
        setOrdersLoading(false);
    };

    const handleDeleteProduct = async (id: number | string) => {
        if (!window.confirm('Supprimer ce produit définitivement ?')) return;
        await supabase.from('products').delete().eq('id', id);
        setProducts(prev => prev.filter(p => p.id !== id));
    };

    const handleUpdateOrderStatus = async (orderId: string, status: string) => {
        await supabase.from('orders').update({ status }).eq('id', orderId);
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: status as Order['status'] } : o));
    };

    const saveDelivery = () => {
        localStorage.setItem(DELIVERY_KEY, JSON.stringify(delivery));
        setDeliverySaved(true);
        setTimeout(() => setDeliverySaved(false), 2500);
    };

    const totalRevenue = orders.reduce((t, o) => t + Number(o.total), 0);

    if (!user || !isAdmin) return <Navigate to="/login" state={{ from: '/admin/gestion' }} replace />;

    const navLabel = NAV.find(n => n.id === active)?.label ?? '';

    /* ──────────────────────────────────── SIDEBAR ── */
    const Sidebar = ({ mobile = false }: { mobile?: boolean }) => (
        <aside className={`${mobile ? 'w-72' : 'w-64'} h-full flex flex-col`}
            style={{ background: 'linear-gradient(180deg, #0f172a 0%, #1e1b4b 100%)' }}>

            {/* Logo */}
            <div className="flex items-center gap-3 px-5 py-5 border-b border-white/10">
                <img src={logo} alt="TonCadeau" className="h-9 w-auto" />
                <div>
                    <p className="text-white font-bold text-sm leading-tight">TonCadeau</p>
                    <p className="text-white/40 text-[10px] font-medium tracking-wider uppercase">Admin</p>
                </div>
                {mobile && (
                    <button onClick={() => setSidebarOpen(false)}
                        className="ml-auto text-white/50 hover:text-white transition-colors">
                        <X className="h-5 w-5" />
                    </button>
                )}
            </div>

            {/* Nav */}
            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                {NAV.map(({ id, label, icon: Icon }) => {
                    const isActive = active === id;
                    return (
                        <button key={id}
                            onClick={() => { setActive(id); setSidebarOpen(false); }}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                                isActive
                                    ? 'text-white shadow-lg'
                                    : 'text-white/55 hover:text-white hover:bg-white/8'
                            }`}
                            style={isActive ? { background: 'linear-gradient(135deg, #aa5a9e, #6fc7d9)' } : {}}>
                            <Icon className="h-4 w-4 flex-shrink-0" />
                            {label}
                            {isActive && <ChevronRight className="h-3.5 w-3.5 ml-auto opacity-60" />}
                        </button>
                    );
                })}
            </nav>

            {/* Bottom */}
            <div className="px-3 py-4 border-t border-white/10 space-y-1">
                <Link to="/"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/55 hover:text-white hover:bg-white/8 transition-all">
                    <ExternalLink className="h-4 w-4 flex-shrink-0" />
                    Voir le site
                </Link>
                <button onClick={signOut}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all">
                    <LogOut className="h-4 w-4 flex-shrink-0" />
                    Déconnexion
                </button>
            </div>
        </aside>
    );

    /* ──────────────────────────────────── RENDER ── */
    return (
        <div className="fixed inset-0 z-40 flex bg-slate-50 overflow-hidden">

            {/* Desktop sidebar */}
            <div className="hidden md:flex flex-shrink-0">
                <Sidebar />
            </div>

            {/* Mobile sidebar overlay */}
            {sidebarOpen && (
                <div className="md:hidden fixed inset-0 z-50 flex">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
                    <div className="relative flex-shrink-0">
                        <Sidebar mobile />
                    </div>
                </div>
            )}

            {/* ── Main content ── */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

                {/* Top bar */}
                <header className="h-14 bg-white border-b border-slate-100 flex items-center justify-between px-5 flex-shrink-0 shadow-sm">
                    <div className="flex items-center gap-3">
                        <button onClick={() => setSidebarOpen(true)}
                            className="md:hidden w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 transition-colors">
                            <Menu className="h-5 w-5" />
                        </button>
                        <div>
                            <p className="text-xs text-slate-400 hidden sm:block">Administration</p>
                            <h1 className="text-sm font-bold text-slate-900">{navLabel}</h1>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link to="/"
                            className="hidden sm:flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all">
                            <ExternalLink className="h-3.5 w-3.5" />
                            Voir le site
                        </Link>
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                            style={{ background: 'linear-gradient(135deg, #aa5a9e, #6fc7d9)' }}>
                            {(user?.email?.[0] ?? 'A').toUpperCase()}
                        </div>
                    </div>
                </header>

                {/* Scrollable content */}
                <main className="flex-1 overflow-y-auto p-5 sm:p-7">

                    {/* ══ DASHBOARD ══ */}
                    {active === 'dashboard' && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                <StatCard icon={Package}    label="Produits"    value={products.length}                          color="bg-blue-500" />
                                <StatCard icon={Users}      label="Fournisseurs" value={suppliers.length}                        color="bg-emerald-500" />
                                <StatCard icon={ShoppingBag} label="Commandes"  value={orders.length}                           color="bg-violet-500" />
                                <StatCard icon={DollarSign} label="Revenus"     value={`${totalRevenue.toFixed(0)} DH`}         color="bg-[#aa5a9e]" />
                            </div>

                            {/* Recent orders */}
                            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                                <div className="px-5 py-4 border-b border-slate-50 flex items-center justify-between">
                                    <h3 className="font-bold text-slate-900 text-sm">Commandes récentes</h3>
                                    <button onClick={() => setActive('orders')}
                                        className="text-xs font-semibold text-[#aa5a9e] hover:underline">Voir tout</button>
                                </div>
                                <div className="divide-y divide-slate-50">
                                    {orders.slice(0, 5).map(order => {
                                        const cfg = STATUS_LABELS[order.status] ?? STATUS_LABELS.pending;
                                        const Icon = cfg.icon;
                                        return (
                                            <div key={order.id} className="flex items-center gap-4 px-5 py-3 hover:bg-slate-50/50 transition-colors">
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-semibold text-slate-900 truncate">{order.id}</p>
                                                    <p className="text-xs text-slate-400">{new Date(order.date).toLocaleDateString('fr-FR')}</p>
                                                </div>
                                                <span className={`hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold ${cfg.color}`}>
                                                    <Icon className="h-3 w-3" />{cfg.label}
                                                </span>
                                                <span className="font-bold text-slate-900 text-sm flex-shrink-0">{Number(order.total).toFixed(2)} DH</span>
                                            </div>
                                        );
                                    })}
                                    {orders.length === 0 && (
                                        <p className="text-center text-slate-400 text-sm py-8">Aucune commande</p>
                                    )}
                                </div>
                            </div>

                            {/* Recent products */}
                            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                                <div className="px-5 py-4 border-b border-slate-50 flex items-center justify-between">
                                    <h3 className="font-bold text-slate-900 text-sm">Produits récents</h3>
                                    <button onClick={() => setActive('products')}
                                        className="text-xs font-semibold text-[#aa5a9e] hover:underline">Voir tout</button>
                                </div>
                                <div className="divide-y divide-slate-50">
                                    {products.slice(0, 5).map(p => (
                                        <div key={p.id} className="flex items-center gap-3 px-5 py-3 hover:bg-slate-50/50 transition-colors">
                                            <img src={p.image || '/placeholder.jpg'} alt={p.name}
                                                onError={e => { (e.target as HTMLImageElement).src = '/placeholder.jpg'; }}
                                                className="w-10 h-10 rounded-xl object-cover bg-slate-100 flex-shrink-0" />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-semibold text-slate-900 truncate">{p.name}</p>
                                                <p className="text-xs text-slate-400">{p.supplier}</p>
                                            </div>
                                            <span className={`text-xs font-semibold ${p.stock < 10 ? 'text-red-500' : 'text-emerald-600'}`}>
                                                stock: {p.stock}
                                            </span>
                                            <span className="font-bold text-sm text-slate-900 flex-shrink-0">{p.price} DH</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ══ ORDERS ══ */}
                    {active === 'orders' && (
                        <div className="space-y-4">
                            <SectionTitle>Commandes ({orders.length})</SectionTitle>
                            {ordersLoading ? (
                                <div className="text-center py-16 text-slate-400">Chargement…</div>
                            ) : orders.length === 0 ? (
                                <div className="text-center py-16 text-slate-400">Aucune commande</div>
                            ) : (
                                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm">
                                            <thead className="border-b border-slate-100 bg-slate-50/50">
                                                <tr>
                                                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">Commande</th>
                                                    <th className="hidden sm:table-cell text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">Client</th>
                                                    <th className="hidden md:table-cell text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">Articles</th>
                                                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">Total</th>
                                                    <th className="hidden lg:table-cell text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">Paiement</th>
                                                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">Statut</th>
                                                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-50">
                                                {orders.map(order => {
                                                    const cfg = STATUS_LABELS[order.status] ?? STATUS_LABELS.pending;
                                                    const Icon = cfg.icon;
                                                    const totalItems = order.items.length + (order.giftBundles ?? []).reduce((t, b) => t + b.items.length, 0);
                                                    return (
                                                        <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                                                            <td className="px-4 py-3 font-mono text-xs text-slate-600 whitespace-nowrap max-w-[100px] truncate">{order.id}</td>
                                                            <td className="hidden sm:table-cell px-4 py-3 text-slate-700 whitespace-nowrap">{order.deliveryInfo?.recipientName || '—'}</td>
                                                            <td className="hidden md:table-cell px-4 py-3 text-slate-500">{totalItems} article{totalItems > 1 ? 's' : ''}</td>
                                                            <td className="px-4 py-3 font-bold text-slate-900 whitespace-nowrap">{Number(order.total).toFixed(2)} DH</td>
                                                            <td className="hidden lg:table-cell px-4 py-3">
                                                                {order.payment_method ? (
                                                                    <span className="text-xs font-semibold uppercase px-2 py-0.5 rounded-lg bg-slate-100 text-slate-600">{order.payment_method}</span>
                                                                ) : '—'}
                                                            </td>
                                                            <td className="px-4 py-3">
                                                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold ${cfg.color}`}>
                                                                    <Icon className="h-3 w-3" />
                                                                    <span className="hidden sm:inline">{cfg.label}</span>
                                                                </span>
                                                            </td>
                                                            <td className="px-4 py-3">
                                                                <select
                                                                    value={order.status}
                                                                    onChange={e => handleUpdateOrderStatus(order.id, e.target.value)}
                                                                    className="text-xs border border-slate-200 rounded-lg px-2 py-1.5 bg-white text-slate-700 focus:outline-none focus:border-[#aa5a9e] cursor-pointer">
                                                                    <option value="pending">En attente</option>
                                                                    <option value="confirmed">Confirmée</option>
                                                                    <option value="shipped">Expédiée</option>
                                                                    <option value="delivered">Livrée</option>
                                                                    <option value="cancelled">Annulée</option>
                                                                </select>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* ══ PRODUCTS ══ */}
                    {active === 'products' && (
                        <div>
                            <SectionTitle>Produits ({products.length})</SectionTitle>
                            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead className="border-b border-slate-100 bg-slate-50/50">
                                            <tr>
                                                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">Produit</th>
                                                <th className="hidden sm:table-cell text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">Catégorie</th>
                                                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">Prix</th>
                                                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">Stock</th>
                                                <th className="hidden md:table-cell text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">Fournisseur</th>
                                                <th className="hidden lg:table-cell text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">Ville</th>
                                                <th className="px-4 py-3"></th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-50">
                                            {products.map(p => (
                                                <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                                                    <td className="px-4 py-3">
                                                        <div className="flex items-center gap-3">
                                                            <img src={p.image || '/placeholder.jpg'} alt={p.name}
                                                                onError={e => { (e.target as HTMLImageElement).src = '/placeholder.jpg'; }}
                                                                className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl object-cover bg-slate-100 flex-shrink-0" />
                                                            <div className="min-w-0">
                                                                <p className="font-semibold text-slate-900 truncate max-w-[120px] sm:max-w-[180px]">{p.name}</p>
                                                                <p className="hidden sm:block text-xs text-slate-400 truncate max-w-[160px]">{p.description}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="hidden sm:table-cell px-4 py-3">
                                                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full text-white"
                                                            style={{ background: 'linear-gradient(135deg, #aa5a9e, #6fc7d9)' }}>
                                                            {p.category}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3 font-bold text-slate-900 whitespace-nowrap">{p.price} DH</td>
                                                    <td className="px-4 py-3">
                                                        <span className={`font-semibold text-sm ${p.stock < 10 ? 'text-red-500' : 'text-emerald-600'}`}>
                                                            {p.stock}
                                                        </span>
                                                    </td>
                                                    <td className="hidden md:table-cell px-4 py-3 text-slate-600 whitespace-nowrap">{p.supplier}</td>
                                                    <td className="hidden lg:table-cell px-4 py-3">
                                                        {p.city ? (
                                                            <span className="flex items-center gap-1 text-xs text-slate-600">
                                                                <MapPin className="h-3 w-3 text-[#aa5a9e]" />{p.city}
                                                            </span>
                                                        ) : <span className="text-slate-300 text-xs">—</span>}
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <button onClick={() => handleDeleteProduct(p.id)}
                                                            className="text-slate-300 hover:text-red-500 transition-colors">
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ══ SUPPLIERS ══ */}
                    {active === 'suppliers' && (
                        <div>
                            <SectionTitle>Fournisseurs ({suppliers.length})</SectionTitle>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {suppliers.map(s => {
                                    const count = products.filter(p => p.supplier === s.name).length;
                                    return (
                                        <div key={s.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:shadow-md transition-shadow">
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                                                    style={{ background: 'linear-gradient(135deg, #aa5a9e, #6fc7d9)' }}>
                                                    {s.name[0].toUpperCase()}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-bold text-slate-900 truncate">{s.name}</p>
                                                    <p className="text-xs text-slate-400 truncate">{s.email}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs font-semibold text-slate-500">{count} produit{count > 1 ? 's' : ''}</span>
                                                <button className="text-slate-300 hover:text-[#aa5a9e] transition-colors">
                                                    <Eye className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* ══ DELIVERY ══ */}
                    {active === 'delivery' && (
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h2 className="text-xl font-bold text-slate-900">Prix de livraison</h2>
                                    <p className="text-sm text-slate-400 mt-0.5">Tarifs en MAD par ville</p>
                                </div>
                                <button onClick={saveDelivery}
                                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 hover:shadow-lg"
                                    style={{ background: 'linear-gradient(135deg, #aa5a9e, #6fc7d9)' }}>
                                    <Save className="h-4 w-4" />
                                    {deliverySaved ? 'Sauvegardé !' : 'Sauvegarder'}
                                </button>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                {MOROCCAN_CITIES.map(city => (
                                    <div key={city} className="bg-white rounded-xl border border-slate-100 flex items-center gap-3 px-4 py-3 shadow-sm hover:border-[#aa5a9e]/30 transition-all">
                                        <MapPin className="h-4 w-4 text-[#aa5a9e] flex-shrink-0" />
                                        <span className="text-sm font-medium text-slate-700 flex-1 truncate">{city}</span>
                                        <div className="flex items-center gap-1.5 flex-shrink-0">
                                            <input type="number" min="0" step="0.5" placeholder="0"
                                                value={delivery[city] ?? ''}
                                                onChange={e => setDelivery(prev => ({ ...prev, [city]: e.target.value }))}
                                                className="w-20 text-right text-sm font-bold text-slate-800 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 focus:outline-none focus:border-[#aa5a9e] transition-all" />
                                            <span className="text-xs text-slate-400 font-medium">MAD</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-4 text-xs text-slate-400">
                                {Object.values(delivery).filter(v => v && Number(v) > 0).length} / {MOROCCAN_CITIES.length} villes configurées
                            </div>
                        </div>
                    )}

                    {/* ══ SETTINGS ══ */}
                    {active === 'settings' && (
                        <div className="max-w-xl">
                            <SectionTitle>Paramètres</SectionTitle>
                            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-5">
                                {[
                                    { label: 'Nom de la plateforme', type: 'text',   defaultValue: 'TonCadeau' },
                                    { label: 'Email de contact',      type: 'email',  defaultValue: 'contact@toncadeau.net' },
                                    { label: 'Commission fournisseur (%)', type: 'number', defaultValue: '10' },
                                ].map(({ label, type, defaultValue }) => (
                                    <div key={label}>
                                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">{label}</label>
                                        <input type={type} defaultValue={defaultValue}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-[#aa5a9e] focus:ring-2 focus:ring-[#aa5a9e]/15 transition-all" />
                                    </div>
                                ))}
                                <button className="w-full py-3 rounded-xl text-white text-sm font-semibold transition-all hover:opacity-90 hover:shadow-lg"
                                    style={{ background: 'linear-gradient(135deg, #aa5a9e, #6fc7d9)' }}>
                                    Sauvegarder les paramètres
                                </button>
                            </div>
                        </div>
                    )}

                </main>
            </div>
        </div>
    );
};

export default AdminPanel;
