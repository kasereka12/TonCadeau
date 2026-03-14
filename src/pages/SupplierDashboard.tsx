import React, { useState, useEffect, useRef } from 'react';
import {
    Package, TrendingUp, DollarSign, Plus, Trash2,
    Upload, X, Store, LogOut, BarChart3,
    AlertTriangle, Menu, Star, Eye, EyeOff,
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import type { Product } from '../types';

// ─── helpers ────────────────────────────────────────────────────────────────
const Field = ({
    label, children,
}: { label: string; children: React.ReactNode }) => (
    <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
        {children}
    </div>
);

const inputCls =
    'w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all';

// ────────────────────────────────────────────────────────────────────────────
const SupplierDashboard = () => {
    const { user, signIn, signOut } = useAuth();

    // ── state ──
    const [products, setProducts]         = useState<Product[]>([]);
    const [email, setEmail]               = useState('');
    const [password, setPassword]         = useState('');
    const [showPwd, setShowPwd]           = useState(false);
    const [loginError, setLoginError]     = useState('');
    const [loginLoading, setLoginLoading] = useState(false);
    const [activeNav, setActiveNav]       = useState<'dashboard' | 'products'>('dashboard');
    const [sidebarOpen, setSidebarOpen]   = useState(true);
    const [showPanel, setShowPanel]       = useState(false);
    const [newProduct, setNewProduct]     = useState({ name: '', category: '', price: '', description: '', stock: '' });
    const [imageFile, setImageFile]       = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState('');
    const [uploading, setUploading]       = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const isSupplier   = user?.user_metadata?.role === 'supplier';
    const supplierName = (user?.user_metadata?.supplier_name ?? '') as string;
    const initials     = supplierName.split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2) || 'F';

    useEffect(() => {
        if (isSupplier && supplierName) fetchProducts();
    }, [isSupplier, supplierName]);

    const fetchProducts = async () => {
        const { data, error } = await supabase
            .from('products').select('*')
            .eq('supplier', supplierName)
            .order('created_at', { ascending: false });
        if (!error && data) setProducts(data);
    };

    // ── handlers ──
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoginError(''); setLoginLoading(true);
        const { data, error } = await signIn(email, password);
        setLoginLoading(false);
        if (error) { setLoginError('Email ou mot de passe incorrect.'); return; }
        if (data?.user?.user_metadata?.role !== 'supplier') {
            await signOut();
            setLoginError("Accès refusé. Ce compte n'a pas les droits fournisseur.");
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
    };

    const clearImage = () => {
        setImageFile(null); setImagePreview('');
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const resetPanel = () => {
        setNewProduct({ name: '', category: '', price: '', description: '', stock: '' });
        clearImage(); setShowPanel(false);
    };

    const handleAddProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!imageFile) { alert('Veuillez sélectionner une image.'); return; }
        setUploading(true);
        const ext      = imageFile.name.split('.').pop();
        const filePath = `${supplierName}/${Date.now()}.${ext}`;
        const { error: upErr } = await supabase.storage
            .from('product-images').upload(filePath, imageFile, { upsert: false });
        if (upErr) { alert(`Erreur upload : ${upErr.message}`); setUploading(false); return; }
        const { data: urlData } = supabase.storage.from('product-images').getPublicUrl(filePath);
        const { data, error } = await supabase.from('products').insert([{
            name: newProduct.name, category: newProduct.category,
            price: parseFloat(newProduct.price), description: newProduct.description,
            stock: parseInt(newProduct.stock), image: urlData.publicUrl,
            supplier: supplierName, rating: 4.5, tags: [],
        }]).select().single();
        setUploading(false);
        if (!error && data) { setProducts(prev => [data as Product, ...prev]); resetPanel(); }
        else alert(`Erreur : ${error?.message ?? "Impossible d'ajouter le produit."}`);
    };

    const handleDelete = async (id: number | string) => {
        if (!window.confirm('Supprimer ce produit ?')) return;
        const { error } = await supabase.from('products').delete().eq('id', id);
        if (!error) setProducts(prev => prev.filter(p => p.id !== id));
    };

    // ── derived ──
    const stats = [
        { label: 'Produits',      value: products.length,                          icon: Package,       bg: 'bg-violet-50',  text: 'text-violet-600' },
        { label: 'Ventes',        value: '1 250',                                  icon: TrendingUp,    bg: 'bg-emerald-50', text: 'text-emerald-600' },
        { label: 'Revenus',       value: '15 680 €',                               icon: DollarSign,    bg: 'bg-blue-50',    text: 'text-blue-600' },
        { label: 'Stock faible',  value: products.filter(p => p.stock < 10).length, icon: AlertTriangle, bg: 'bg-orange-50',  text: 'text-orange-600' },
    ];

    // ── nav items ──
    const navItems = [
        { id: 'dashboard', label: 'Tableau de bord', icon: BarChart3 },
        { id: 'products',  label: 'Mes produits',    icon: Package },
    ] as const;

    // ════════════════════════════════════════════════════════════════════════
    // LOGIN SCREEN
    // ════════════════════════════════════════════════════════════════════════
    if (!user || !isSupplier) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
                {/* Decorative blobs */}
                <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-violet-600/20 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-cyan-600/15 rounded-full blur-3xl pointer-events-none" />

                <div className="relative w-full max-w-[420px]">
                    <div className="bg-white/8 backdrop-blur-2xl border border-white/15 rounded-3xl p-8 shadow-2xl">
                        {/* Brand */}
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 mx-auto mb-5 bg-gradient-to-br from-violet-500 to-purple-700 rounded-2xl flex items-center justify-center shadow-xl shadow-purple-900/40">
                                <Store className="h-8 w-8 text-white" />
                            </div>
                            <h1 className="text-2xl font-bold text-white tracking-tight">Espace Fournisseur</h1>
                            <p className="text-white/45 text-sm mt-1">Accédez à votre tableau de bord</p>
                        </div>

                        <form onSubmit={handleLogin} className="space-y-4">
                            <Field label="">
                                <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-1.5">Email</label>
                                <input
                                    type="email" required value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    className="w-full bg-white/8 border border-white/15 rounded-xl px-4 py-3 text-white text-sm placeholder-white/25 focus:outline-none focus:border-violet-500 focus:bg-white/12 transition-all"
                                    placeholder="votre@email.com"
                                />
                            </Field>

                            <div>
                                <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-1.5">Mot de passe</label>
                                <div className="relative">
                                    <input
                                        type={showPwd ? 'text' : 'password'} required value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        className="w-full bg-white/8 border border-white/15 rounded-xl px-4 py-3 pr-12 text-white text-sm placeholder-white/25 focus:outline-none focus:border-violet-500 focus:bg-white/12 transition-all"
                                        placeholder="••••••••"
                                    />
                                    <button type="button" onClick={() => setShowPwd(v => !v)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
                                        {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>

                            {loginError && (
                                <div className="bg-red-500/15 border border-red-500/25 rounded-xl px-4 py-3">
                                    <p className="text-red-300 text-sm text-center">{loginError}</p>
                                </div>
                            )}

                            <button type="submit" disabled={loginLoading}
                                className="w-full mt-2 bg-gradient-to-r from-violet-600 to-purple-700 text-white py-3 rounded-xl text-sm font-semibold hover:from-violet-500 hover:to-purple-600 hover:shadow-xl hover:shadow-purple-900/40 transition-all duration-200 disabled:opacity-60">
                                {loginLoading ? 'Connexion…' : 'Se connecter'}
                            </button>
                        </form>

                        <div className="mt-6 pt-6 border-t border-white/10 text-center">
                            <p className="text-white/35 text-xs">
                                Pas encore fournisseur ?{' '}
                                <a href="/supplier/register" className="text-violet-400 hover:text-violet-300 font-medium transition-colors">
                                    Créer un compte
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // ════════════════════════════════════════════════════════════════════════
    // DASHBOARD
    // ════════════════════════════════════════════════════════════════════════
    return (
        <div className="flex h-[calc(100vh-64px)] bg-slate-50 overflow-hidden">

            {/* ── SIDEBAR ───────────────────────────────────────────────── */}
            <aside className={`${sidebarOpen ? 'w-60' : 'w-[72px]'} bg-slate-900 flex flex-col flex-shrink-0 transition-all duration-300 ease-in-out`}>
                {/* Toggle + logo */}
                <div className="flex items-center gap-3 px-4 py-5 border-b border-slate-800">
                    <button onClick={() => setSidebarOpen(v => !v)}
                        className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center flex-shrink-0 transition-all">
                        <Menu className="h-4 w-4" />
                    </button>
                    {sidebarOpen && (
                        <span className="text-white font-bold text-base whitespace-nowrap overflow-hidden">TonCadeau</span>
                    )}
                </div>

                {/* Nav */}
                <nav className="flex-1 p-3 space-y-1 mt-2">
                    {navItems.map(item => {
                        const Icon   = item.icon;
                        const active = activeNav === item.id;
                        return (
                            <button key={item.id}
                                onClick={() => setActiveNav(item.id)}
                                title={!sidebarOpen ? item.label : undefined}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150
                                    ${active
                                        ? 'bg-violet-600 text-white shadow-lg shadow-violet-900/40'
                                        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                    }`}>
                                <Icon className="h-4.5 w-4.5 flex-shrink-0 h-5 w-5" />
                                {sidebarOpen && <span className="whitespace-nowrap">{item.label}</span>}
                            </button>
                        );
                    })}
                </nav>

                {/* User */}
                <div className="p-3 border-t border-slate-800">
                    <div className={`flex items-center gap-3 p-2 rounded-xl ${!sidebarOpen ? 'justify-center' : ''}`}>
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center flex-shrink-0 text-white text-xs font-bold">
                            {initials}
                        </div>
                        {sidebarOpen && (
                            <>
                                <div className="flex-1 min-w-0">
                                    <p className="text-white text-sm font-medium truncate">{supplierName}</p>
                                    <p className="text-slate-500 text-xs">Fournisseur</p>
                                </div>
                                <button onClick={signOut}
                                    className="text-slate-500 hover:text-red-400 transition-colors p-1" title="Déconnexion">
                                    <LogOut className="h-4 w-4" />
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </aside>

            {/* ── MAIN ──────────────────────────────────────────────────── */}
            <div className="flex-1 flex flex-col overflow-hidden">

                {/* Top bar */}
                <header className="bg-white border-b border-slate-100 px-6 h-16 flex items-center justify-between flex-shrink-0">
                    <div>
                        <h1 className="font-semibold text-slate-900 text-base">
                            {activeNav === 'dashboard' ? 'Tableau de bord' : 'Mes produits'}
                        </h1>
                        <p className="text-xs text-slate-400">Bonjour, {supplierName} 👋</p>
                    </div>
                    <button
                        onClick={() => setShowPanel(true)}
                        className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:shadow-lg hover:shadow-violet-500/25">
                        <Plus className="h-4 w-4" />
                        Nouveau produit
                    </button>
                </header>

                {/* Scrollable content */}
                <main className="flex-1 overflow-y-auto p-6">

                    {/* ── DASHBOARD TAB ── */}
                    {activeNav === 'dashboard' && (
                        <>
                            {/* Stats */}
                            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
                                {stats.map(s => {
                                    const Icon = s.icon;
                                    return (
                                        <div key={s.label} className="bg-white rounded-2xl p-5 border border-slate-100 hover:shadow-md transition-shadow">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center`}>
                                                    <Icon className={`h-5 w-5 ${s.text}`} />
                                                </div>
                                                <span className="text-[10px] font-semibold text-slate-400 bg-slate-50 px-2 py-1 rounded-lg uppercase tracking-wide">
                                                    ce mois
                                                </span>
                                            </div>
                                            <p className="text-2xl font-bold text-slate-900">{s.value}</p>
                                            <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Recent products */}
                            <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                                <div className="px-5 py-4 border-b border-slate-50 flex items-center justify-between">
                                    <h2 className="font-semibold text-slate-900 text-sm">Produits récents</h2>
                                    <button onClick={() => setActiveNav('products')}
                                        className="text-violet-600 hover:text-violet-700 text-xs font-semibold transition-colors">
                                        Voir tout →
                                    </button>
                                </div>
                                <div className="divide-y divide-slate-50">
                                    {products.slice(0, 6).map(p => (
                                        <div key={p.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-slate-50/60 transition-colors">
                                            <img
                                                src={p.image || '/placeholder.jpg'}
                                                alt={p.name}
                                                onError={e => { (e.target as HTMLImageElement).src = '/placeholder.jpg'; }}
                                                className="w-11 h-11 rounded-xl object-cover flex-shrink-0 bg-slate-100"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-slate-900 truncate">{p.name}</p>
                                                <p className="text-xs text-slate-400">{p.category}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-bold text-slate-900">{p.price} €</p>
                                                <span className={`text-[11px] font-medium px-2 py-0.5 rounded-lg ${p.stock < 10 ? 'bg-red-50 text-red-500' : 'bg-emerald-50 text-emerald-600'}`}>
                                                    {p.stock} en stock
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                    {products.length === 0 && (
                                        <div className="text-center py-14 text-slate-400">
                                            <Package className="h-10 w-10 mx-auto mb-3 opacity-25" />
                                            <p className="text-sm font-medium">Aucun produit pour l'instant</p>
                                            <button onClick={() => setShowPanel(true)}
                                                className="mt-3 text-violet-600 text-xs font-semibold hover:text-violet-700 transition-colors">
                                                + Ajouter mon premier produit
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </>
                    )}

                    {/* ── PRODUCTS TAB ── */}
                    {activeNav === 'products' && (
                        <div>
                            <p className="text-xs text-slate-400 mb-4 font-medium">{products.length} produit{products.length !== 1 ? 's' : ''}</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                {products.map(p => (
                                    <div key={p.id}
                                        className="group bg-white border border-slate-100 rounded-2xl overflow-hidden hover:shadow-lg hover:border-slate-200 transition-all duration-200">
                                        <div className="relative overflow-hidden bg-slate-100">
                                            <img
                                                src={p.image || '/placeholder.jpg'}
                                                alt={p.name}
                                                onError={e => { (e.target as HTMLImageElement).src = '/placeholder.jpg'; }}
                                                className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                            {/* Delete overlay */}
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200 flex items-start justify-end p-2.5">
                                                <button
                                                    onClick={() => handleDelete(p.id)}
                                                    className="w-8 h-8 bg-red-500 text-white rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-red-600 transition-all shadow-lg">
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                </button>
                                            </div>
                                            {/* Stock badge */}
                                            <span className={`absolute bottom-2.5 left-2.5 text-[11px] font-semibold px-2.5 py-1 rounded-lg shadow
                                                ${p.stock < 10 ? 'bg-red-500 text-white' : 'bg-white/90 text-slate-700'}`}>
                                                {p.stock < 10 ? `⚠ ${p.stock} restants` : `${p.stock} en stock`}
                                            </span>
                                        </div>
                                        <div className="p-4">
                                            <span className="inline-block text-[11px] text-violet-600 font-semibold bg-violet-50 px-2.5 py-0.5 rounded-lg mb-2">
                                                {p.category}
                                            </span>
                                            <h3 className="font-semibold text-slate-900 text-sm truncate">{p.name}</h3>
                                            <p className="text-slate-400 text-xs mt-1 line-clamp-2 leading-relaxed">{p.description}</p>
                                            <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-50">
                                                <span className="font-bold text-slate-900">{p.price} €</span>
                                                <div className="flex items-center gap-1">
                                                    <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
                                                    <span className="text-xs text-slate-400">{p.rating}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {/* Add card */}
                                <button onClick={() => setShowPanel(true)}
                                    className="min-h-[300px] border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center gap-3 text-slate-400 hover:border-violet-300 hover:text-violet-500 hover:bg-violet-50/40 transition-all duration-200">
                                    <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center">
                                        <Plus className="h-6 w-6" />
                                    </div>
                                    <span className="text-sm font-medium">Ajouter un produit</span>
                                </button>
                            </div>
                        </div>
                    )}
                </main>
            </div>

            {/* ── SLIDE-OVER PANEL ──────────────────────────────────────── */}
            {showPanel && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
                        onClick={resetPanel}
                    />
                    {/* Panel */}
                    <div className="fixed right-0 top-0 h-full w-full max-w-[440px] bg-white z-50 shadow-2xl flex flex-col animate-slide-in">
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 flex-shrink-0">
                            <div>
                                <h2 className="font-bold text-slate-900">Nouveau produit</h2>
                                <p className="text-xs text-slate-400 mt-0.5">Remplissez les informations ci-dessous</p>
                            </div>
                            <button onClick={resetPanel}
                                className="w-9 h-9 rounded-xl border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-all">
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        {/* Form (flex-1 so footer sticks to bottom) */}
                        <form id="add-form" onSubmit={handleAddProduct} className="flex-1 flex flex-col overflow-hidden">
                            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
                                {/* Image upload */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Image du produit</label>
                                    {imagePreview ? (
                                        <div className="relative rounded-2xl overflow-hidden border border-slate-200">
                                            <img src={imagePreview} alt="Aperçu" className="w-full h-48 object-cover" />
                                            <button type="button" onClick={clearImage}
                                                className="absolute top-3 right-3 w-8 h-8 bg-red-500 text-white rounded-xl flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg">
                                                <X className="h-3.5 w-3.5" />
                                            </button>
                                        </div>
                                    ) : (
                                        <div
                                            onClick={() => fileInputRef.current?.click()}
                                            className="w-full h-48 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-violet-300 hover:bg-violet-50/40 transition-all group">
                                            <div className="w-12 h-12 rounded-2xl bg-slate-100 group-hover:bg-violet-100 flex items-center justify-center mb-3 transition-colors">
                                                <Upload className="h-5 w-5 text-slate-400 group-hover:text-violet-500 transition-colors" />
                                            </div>
                                            <p className="text-sm font-medium text-slate-600">Cliquer pour uploader</p>
                                            <p className="text-xs text-slate-400 mt-1">JPG, PNG, WEBP — max 5 Mo</p>
                                        </div>
                                    )}
                                    <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                                </div>

                                {/* Name */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Nom du produit</label>
                                    <input type="text" required value={newProduct.name}
                                        onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
                                        className={inputCls} placeholder="Ex: Bouquet de roses rouges" />
                                </div>

                                {/* Category */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Catégorie</label>
                                    <select required value={newProduct.category}
                                        onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}
                                        className={inputCls + ' bg-white'}>
                                        <option value="">Choisir une catégorie</option>
                                        <option>Fleurs</option>
                                        <option>Gourmandises</option>
                                        <option>Accessoires</option>
                                        <option>Beauté</option>
                                        <option>Culture</option>
                                        <option>Décoration</option>
                                    </select>
                                </div>

                                {/* Price + Stock */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Prix (€)</label>
                                        <input type="number" step="0.01" required value={newProduct.price}
                                            onChange={e => setNewProduct({ ...newProduct, price: e.target.value })}
                                            className={inputCls} placeholder="0.00" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Stock</label>
                                        <input type="number" required value={newProduct.stock}
                                            onChange={e => setNewProduct({ ...newProduct, stock: e.target.value })}
                                            className={inputCls} placeholder="0" />
                                    </div>
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
                                    <textarea required value={newProduct.description}
                                        onChange={e => setNewProduct({ ...newProduct, description: e.target.value })}
                                        className={inputCls + ' resize-none'} rows={3}
                                        placeholder="Décrivez votre produit…" />
                                </div>
                            </div>

                            {/* Footer actions */}
                            <div className="px-6 py-4 border-t border-slate-100 flex gap-3 flex-shrink-0">
                                <button type="button" onClick={resetPanel}
                                    className="flex-1 border border-slate-200 rounded-xl py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all">
                                    Annuler
                                </button>
                                <button type="submit" disabled={uploading}
                                    className="flex-1 bg-violet-600 hover:bg-violet-700 text-white rounded-xl py-3 text-sm font-semibold transition-all hover:shadow-lg hover:shadow-violet-500/20 disabled:opacity-60">
                                    {uploading ? 'Upload en cours…' : 'Publier le produit'}
                                </button>
                            </div>
                        </form>
                    </div>
                </>
            )}
        </div>
    );
};

export default SupplierDashboard;
