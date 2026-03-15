import React, { useState, useEffect, useRef } from 'react';
import { Navigate } from 'react-router-dom';
import {
    Package, TrendingUp, DollarSign, AlertTriangle,
    Plus, Trash2, Upload, X, LogOut,
    Edit3, Star,
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import type { Product } from '../types';

const inputCls ='w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#aa5a9e] focus:ring-2 focus:ring-[#aa5a9e]/15 transition-all';


const SupplierDashboard = () => {
    const { user, signOut } = useAuth();
    const { toast } = useToast();

    const [products, setProducts] = useState<Product[]>([]);
    const MOROCCAN_CITIES = [
        'Casablanca','Rabat','Marrakech','Fès','Tanger','Agadir','Meknès','Oujda',
        'Kénitra','Tétouan','Safi','El Jadida','Nador','Béni Mellal','Mohammedia',
        'Khouribga','Settat','Larache','Khémisset','Berrechid','Taza','Laâyoune',
    ];

    const [newProduct, setNewProduct]       = useState({ name: '', recipient: '', category: '', city: '', price: '', description: '', stock: '' });
    const [imageFile, setImageFile]         = useState<File | null>(null);
    const [imagePreview, setImagePreview]   = useState('');
    const [uploading, setUploading]         = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
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

    const handleAddProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!imageFile) { toast('Veuillez sélectionner une image.', 'error'); return; }
        setUploading(true);
        const ext      = imageFile.name.split('.').pop();
        const filePath = `${supplierName}/${Date.now()}.${ext}`;
        const { error: upErr } = await supabase.storage
            .from('product-images').upload(filePath, imageFile, { upsert: false });
        if (upErr) { toast(`Erreur upload : ${upErr.message}`, 'error'); setUploading(false); return; }
        const { data: urlData } = supabase.storage.from('product-images').getPublicUrl(filePath);
        const { data, error } = await supabase.from('products').insert([{
            name: newProduct.name, category: newProduct.category,
            price: parseFloat(newProduct.price), description: newProduct.description,
            stock: parseInt(newProduct.stock), image: urlData.publicUrl,
            supplier: supplierName, rating: 4.5, tags: newProduct.recipient ? [newProduct.recipient] : [],
            city: newProduct.city || null,
        }]).select().single();
        setUploading(false);
        if (!error && data) {
            setProducts(prev => [data as Product, ...prev]);
            setNewProduct({ name: '', recipient: '', category: '', city: '', price: '', description: '', stock: '' });
            clearImage();
            toast('Produit ajouté avec succès !', 'success');
        } else {
            toast(`Erreur : ${error?.message ?? "Impossible d'ajouter le produit."}`, 'error');
        }
    };

    const handleStartEdit = (product: Product) => {
        setEditingProduct(product);
        setNewProduct({
            name:        product.name,
            recipient:   (product.tags?.[0] ?? ''),
            category:    product.category,
            city:        product.city ?? '',
            price:       String(product.price),
            description: product.description,
            stock:       String(product.stock),
        });
        setImageFile(null);
        setImagePreview(product.image ?? '');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelEdit = () => {
        setEditingProduct(null);
        setNewProduct({ name: '', recipient: '', category: '', city: '', price: '', description: '', stock: '' });
        clearImage();
    };

    const handleUpdateProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingProduct) return;
        setUploading(true);
        let imageUrl = editingProduct.image;
        if (imageFile) {
            const ext      = imageFile.name.split('.').pop();
            const filePath = `${supplierName}/${Date.now()}.${ext}`;
            const { error: upErr } = await supabase.storage
                .from('product-images').upload(filePath, imageFile, { upsert: false });
            if (upErr) { toast(`Erreur upload : ${upErr.message}`, 'error'); setUploading(false); return; }
            const { data: urlData } = supabase.storage.from('product-images').getPublicUrl(filePath);
            imageUrl = urlData.publicUrl;
        }
        const { data, error } = await supabase.from('products').update({
            name:        newProduct.name,
            category:    newProduct.category,
            price:       parseFloat(newProduct.price),
            description: newProduct.description,
            stock:       parseInt(newProduct.stock),
            image:       imageUrl,
            tags:        newProduct.recipient ? [newProduct.recipient] : [],
            city:        newProduct.city || null,
        }).eq('id', editingProduct.id).select().single();
        setUploading(false);
        if (!error && data) {
            setProducts(prev => prev.map(p => p.id === editingProduct.id ? data as Product : p));
            toast('Produit mis à jour !', 'success');
            handleCancelEdit();
        } else {
            toast(`Erreur : ${error?.message ?? 'Impossible de modifier le produit.'}`, 'error');
        }
    };

    const handleDelete = async (id: number | string) => {
        if (!window.confirm('Supprimer ce produit ?')) return;
        const { error } = await supabase.from('products').delete().eq('id', id);
        if (!error) setProducts(prev => prev.filter(p => p.id !== id));
    };

    const stats = [
        {
            label: 'Produits',
            value: products.length,
            icon: Package,
            gradient: 'from-[#aa5a9e] to-[#8a3d8f]',
            light: 'bg-[#aa5a9e]/10',
            text: 'text-[#aa5a9e]',
        },
        {
            label: 'Ventes ce mois',
            value: '1 250',
            icon: TrendingUp,
            gradient: 'from-[#6fc7d9] to-[#4aafc2]',
            light: 'bg-[#6fc7d9]/10',
            text: 'text-[#6fc7d9]',
        },
        {
            label: 'Chiffre d\'affaires',
            value: '15 680 DH',
            icon: DollarSign,
            gradient: 'from-violet-500 to-purple-700',
            light: 'bg-violet-50',
            text: 'text-violet-600',
        },
        {
            label: 'Quantité faible',
            value: products.filter(p => p.stock < 10).length,
            icon: AlertTriangle,
            gradient: 'from-orange-400 to-red-500',
            light: 'bg-orange-50',
            text: 'text-orange-500',
        },
    ];

    if (!user || !isSupplier) return <Navigate to="/login" state={{ from: '/supplier' }} replace />;

    // ════════════════════════════════════════════════════════════════════════
    // DASHBOARD
    // ════════════════════════════════════════════════════════════════════════
    return (
        <div className="min-h-screen bg-slate-50">

            {/* ── Top header bar ── */}
            <div className="bg-white border-b border-slate-100 sticky top-[68px] z-30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {/* Avatar */}
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                            style={{ background: 'linear-gradient(135deg, #aa5a9e, #6fc7d9)' }}>
                            {initials}
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-slate-900">{supplierName}</p>
                            <p className="text-xs text-slate-400">Tableau de bord fournisseur</p>
                        </div>
                    </div>
                    <button onClick={signOut}
                        className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-red-500 hover:bg-red-50 px-3 py-2 rounded-xl transition-all duration-200">
                        <LogOut className="h-4 w-4" />
                        <span className="hidden sm:inline">Déconnexion</span>
                    </button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* ── Stats ── */}
                <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
                    {stats.map(s => {
                        const Icon = s.icon;
                        return (
                            <div key={s.label}
                                className="bg-white rounded-2xl border border-slate-100 p-5 hover:shadow-md transition-shadow duration-200">
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`w-10 h-10 rounded-xl ${s.light} flex items-center justify-center`}>
                                        <Icon className={`h-5 w-5 ${s.text}`} />
                                    </div>
                                    <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-300">
                                        total
                                    </span>
                                </div>
                                <p className="text-2xl font-bold text-slate-900 mb-0.5">{s.value}</p>
                                <p className="text-xs text-slate-400 font-medium">{s.label}</p>
                            </div>
                        );
                    })}
                </div>

                {/* ── Main 2-column grid ── */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    {/* ── LEFT : Add / Edit product form ── */}
                    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                        {/* Card header */}
                        <div className="px-6 py-5 border-b border-slate-50 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                                    style={{ background: 'linear-gradient(135deg, #aa5a9e, #6fc7d9)' }}>
                                    {editingProduct ? <Edit3 className="h-4 w-4 text-white" /> : <Plus className="h-4 w-4 text-white" />}
                                </div>
                                <div>
                                    <h2 className="font-bold text-slate-900 text-sm">
                                        {editingProduct ? 'Modifier le produit' : 'Ajouter un produit'}
                                    </h2>
                                    <p className="text-xs text-slate-400">
                                        {editingProduct ? editingProduct.name : 'Remplissez le formulaire ci-dessous'}
                                    </p>
                                </div>
                            </div>
                            {editingProduct && (
                                <button type="button" onClick={handleCancelEdit}
                                    className="flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-slate-600 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-all">
                                    <X className="h-3.5 w-3.5" />
                                    Annuler
                                </button>
                            )}
                        </div>

                        <form onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct} className="p-6 space-y-4">
                            {/* Image upload */}
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                                    Image du produit
                                </label>
                                {imagePreview ? (
                                    <div className="relative rounded-2xl overflow-hidden border border-slate-200">
                                        <img src={imagePreview} alt="Aperçu"
                                            className="w-full h-44 object-cover" />
                                        <button type="button" onClick={clearImage}
                                            className="absolute top-3 right-3 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-xl flex items-center justify-center transition-colors shadow-lg">
                                            <X className="h-3.5 w-3.5" />
                                        </button>
                                    </div>
                                ) : (
                                    <div onClick={() => fileInputRef.current?.click()}
                                        className="w-full h-44 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-[#aa5a9e]/40 hover:bg-[#aa5a9e]/3 transition-all group">
                                        <div className="w-12 h-12 rounded-2xl bg-slate-100 group-hover:bg-[#aa5a9e]/10 flex items-center justify-center mb-3 transition-colors">
                                            <Upload className="h-5 w-5 text-slate-400 group-hover:text-[#aa5a9e] transition-colors" />
                                        </div>
                                        <p className="text-sm font-semibold text-slate-500 group-hover:text-slate-700 transition-colors">
                                            Cliquer pour uploader
                                        </p>
                                        <p className="text-xs text-slate-400 mt-1">JPG, PNG, WEBP — max 5 Mo</p>
                                    </div>
                                )}
                                <input ref={fileInputRef} type="file" accept="image/*"
                                    onChange={handleImageChange} className="hidden" />
                            </div>

                            {/* Name */}
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                                    Nom du produit
                                </label>
                                <input type="text" required value={newProduct.name}
                                    onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
                                    className={inputCls} placeholder="Ex: Bouquet de roses rouges" />
                            </div>

                            {/* Persona / Recipient */}
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                                    Pour qui ?
                                </label>
                                <div className="grid grid-cols-3 gap-2">
                                    {[
                                        { key: 'papa',        icon: 'fa-solid fa-person',      label: 'Homme' },
                                        { key: 'conjoint',    icon: 'fa-solid fa-person-dress', label: 'Femme' },
                                        { key: 'enfant',      icon: 'fa-solid fa-child',        label: 'Jeune Garçon' },
                                        { key: 'famille',     icon: 'fa-solid fa-child-dress',  label: 'Jeune Fille' },
                                        { key: 'bebe-garcon', icon: 'fa-solid fa-baby',         label: 'Bébé Garçon' },
                                        { key: 'bebe-fille',  icon: 'fa-solid fa-baby',         label: 'Bébé Fille' },
                                    ].map(p => {
                                        const active = newProduct.recipient === p.key;
                                        return (
                                            <button
                                                key={p.key}
                                                type="button"
                                                onClick={() => setNewProduct({ ...newProduct, recipient: active ? '' : p.key })}
                                                className={`flex flex-col items-center gap-1 py-2.5 px-2 rounded-xl border-2 text-center transition-all duration-150 ${
                                                    active
                                                        ? 'border-[#aa5a9e] bg-[#aa5a9e]/8 text-[#aa5a9e]'
                                                        : 'border-slate-100 bg-slate-50 text-slate-500 hover:border-slate-200 hover:bg-slate-100'
                                                }`}
                                            >
                                                <i className={`${p.icon} text-base leading-none`} />
                                                <span className="text-[10px] font-semibold leading-tight">{p.label}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Category */}
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                                    Catégorie
                                </label>
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

                            {/* City */}
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                                    Ville de départ
                                </label>
                                <select required value={newProduct.city}
                                    onChange={e => setNewProduct({ ...newProduct, city: e.target.value })}
                                    className={inputCls + ' bg-white'}>
                                    <option value="">Choisir une ville</option>
                                    {MOROCCAN_CITIES.map(c => <option key={c}>{c}</option>)}
                                </select>
                            </div>

                            {/* Price + Stock */}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                                        Prix (DH)
                                    </label>
                                    <input type="number" step="0.01" required value={newProduct.price}
                                        onChange={e => setNewProduct({ ...newProduct, price: e.target.value })}
                                        className={inputCls} placeholder="0.00" />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                                        Quantité
                                    </label>
                                    <input type="number" required value={newProduct.stock}
                                        onChange={e => setNewProduct({ ...newProduct, stock: e.target.value })}
                                        className={inputCls} placeholder="0" />
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                                    Description
                                </label>
                                <textarea required value={newProduct.description}
                                    onChange={e => setNewProduct({ ...newProduct, description: e.target.value })}
                                    className={inputCls + ' resize-none'} rows={3}
                                    placeholder="Décrivez votre produit…" />
                            </div>

                            <button type="submit" disabled={uploading}
                                className="w-full text-white py-3 rounded-xl font-semibold text-sm transition-all hover:opacity-90 hover:shadow-lg hover:shadow-[#aa5a9e]/20 disabled:opacity-60 mt-1"
                                style={{ background: 'linear-gradient(135deg, #aa5a9e, #6fc7d9)' }}>
                                {uploading
                                    ? 'Upload en cours…'
                                    : editingProduct ? 'Enregistrer les modifications' : 'Publier le produit'
                                }
                            </button>
                        </form>
                    </div>

                    {/* ── RIGHT : Products list ── */}
                    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden flex flex-col">
                        {/* Card header */}
                        <div className="px-6 py-5 border-b border-slate-50 flex items-center justify-between flex-shrink-0">
                            <div>
                                <h2 className="font-bold text-slate-900 text-sm">Mes produits</h2>
                                <p className="text-xs text-slate-400">{products.length} produit{products.length !== 1 ? 's' : ''} publiés</p>
                            </div>
                            {products.length > 0 && (
                                <span className="text-xs font-semibold px-2.5 py-1 rounded-lg text-[#aa5a9e]"
                                    style={{ background: 'rgba(170,90,158,0.08)' }}>
                                    {products.filter(p => p.stock < 10).length} quantité faible
                                </span>
                            )}
                        </div>

                        {/* List */}
                        <div className="flex-1 overflow-y-auto divide-y divide-slate-50 max-h-[640px]">
                            {products.map(product => (
                                <div key={product.id}
                                    className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50/70 transition-colors group">
                                    {/* Image */}
                                    <div className="relative flex-shrink-0">
                                        <img
                                            src={product.image || '/placeholder.jpg'}
                                            alt={product.name}
                                            onError={e => { (e.target as HTMLImageElement).src = '/placeholder.jpg'; }}
                                            className="w-14 h-14 rounded-xl object-cover bg-slate-100"
                                        />
                                        {product.stock < 10 && (
                                            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-400 rounded-full border-2 border-white" />
                                        )}
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-slate-900 truncate">{product.name}</p>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <span className="text-[11px] font-medium px-2 py-0.5 rounded-lg"
                                                style={{ background: 'rgba(170,90,158,0.08)', color: '#aa5a9e' }}>
                                                {product.category}
                                            </span>
                                            <div className="flex items-center gap-0.5">
                                                <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
                                                <span className="text-[11px] text-slate-400">{product.rating}</span>
                                            </div>
                                        </div>
                                        <p className="text-xs text-slate-400 mt-0.5">
                                            <span className={product.stock < 10 ? 'text-red-400 font-medium' : 'text-slate-400'}>
                                                {product.stock} disponible{product.stock > 1 ? 's' : ''}
                                            </span>
                                        </p>
                                    </div>

                                    {/* Price + actions */}
                                    <div className="flex flex-col items-end gap-2">
                                        <span className="text-sm font-bold text-slate-900">{product.price} DH</span>
                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => handleStartEdit(product)}
                                                className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-[#aa5a9e]/10 flex items-center justify-center text-slate-400 hover:text-[#aa5a9e] transition-all">
                                                <Edit3 className="h-3 w-3" />
                                            </button>
                                            <button onClick={() => handleDelete(product.id)}
                                                className="w-7 h-7 rounded-lg bg-red-50 hover:bg-red-100 flex items-center justify-center text-red-400 hover:text-red-600 transition-all">
                                                <Trash2 className="h-3 w-3" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {products.length === 0 && (
                                <div className="flex flex-col items-center justify-center py-16 text-slate-400">
                                    <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
                                        <Package className="h-7 w-7 opacity-40" />
                                    </div>
                                    <p className="text-sm font-medium text-slate-500">Aucun produit publié</p>
                                    <p className="text-xs text-slate-400 mt-1">Ajoutez votre premier produit avec le formulaire</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SupplierDashboard;
