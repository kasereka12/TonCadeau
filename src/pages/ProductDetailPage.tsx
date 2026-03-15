import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ShoppingCart, ArrowLeft, Star, Package, Tag, ChevronRight, Plus, Minus } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useCart } from '../context/CartContext';
import type { Product } from '../types';

const RECIPIENT_LABELS: Record<string, string> = {
    papa:        'Homme',
    conjoint:    'Femme',
    enfant:      'Jeune Garçon',
    famille:     'Jeune Fille',
    'bebe-garcon': 'Bébé Garçon',
    'bebe-fille':  'Bébé Fille',
};

const ProductDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { addToCart } = useCart();

    const [product, setProduct]   = useState<Product | null>(null);
    const [related, setRelated]   = useState<Product[]>([]);
    const [loading, setLoading]   = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [added, setAdded]       = useState(false);

    useEffect(() => {
        if (!id) return;
        setLoading(true);
        setQuantity(1);
        setAdded(false);

        supabase.from('products').select('*').eq('id', id).single()
            .then(({ data, error }) => {
                if (error || !data) { navigate('/products'); return; }
                setProduct(data as Product);

                // Fetch related (same category, exclude current)
                supabase.from('products').select('*')
                    .eq('category', (data as Product).category)
                    .neq('id', id)
                    .limit(4)
                    .then(({ data: rel }) => {
                        if (rel) setRelated(rel as Product[]);
                    });

                setLoading(false);
            });
    }, [id]);

    const handleAddToCart = () => {
        if (!product) return;
        for (let i = 0; i < quantity; i++) addToCart(product);
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    // ── Loading ──
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #aa5a9e22 0%, #ffffff 50%, #6fc7d922 100%)' }}>
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 rounded-full border-4 border-[#aa5a9e]/20 border-t-[#aa5a9e] animate-spin" />
                    <p className="text-slate-400 text-sm font-medium">Chargement…</p>
                </div>
            </div>
        );
    }

    if (!product) return null;

    const recipientLabel = product.tags?.[0] ? RECIPIENT_LABELS[product.tags[0]] : null;

    return (
        <div className="min-h-screen bg-slate-50">

            {/* ── Breadcrumb ── */}
            <div className="bg-white border-b border-slate-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                    <nav className="flex items-center gap-1.5 text-xs text-slate-400">
                        <Link to="/" className="hover:text-slate-600 transition-colors">Accueil</Link>
                        <ChevronRight className="h-3 w-3" />
                        <Link to="/products" className="hover:text-slate-600 transition-colors">Produits</Link>
                        <ChevronRight className="h-3 w-3" />
                        <span className="text-slate-700 font-medium truncate max-w-[200px]">{product.name}</span>
                    </nav>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

                {/* ── Back button ── */}
                <button onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-800 mb-8 transition-colors group">
                    <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
                    Retour
                </button>

                {/* ── Main card ── */}
                <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden mb-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2">

                        {/* Image */}
                        <div className="relative bg-slate-100 flex items-center justify-center min-h-[360px] lg:min-h-[500px]">
                            <img
                                src={product.image || '/placeholder.jpg'}
                                alt={product.name}
                                onError={e => { (e.target as HTMLImageElement).src = '/placeholder.jpg'; }}
                                className="w-full h-full object-cover absolute inset-0"
                            />
                            {/* Overlay badges */}
                            <div className="absolute top-4 left-4 flex flex-col gap-2">
                                <span className="text-xs font-semibold px-3 py-1.5 rounded-full text-white shadow-md"
                                    style={{ background: 'linear-gradient(135deg, #aa5a9e, #6fc7d9)' }}>
                                    {product.category}
                                </span>
                                {recipientLabel && (
                                    <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-white/90 text-slate-700 shadow-md">
                                        Pour : {recipientLabel}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Info */}
                        <div className="p-8 lg:p-12 flex flex-col">

                            {/* Supplier */}
                            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">
                                {product.supplier}
                            </p>

                            {/* Name */}
                            <h1 className="text-3xl font-bold text-slate-900 leading-tight mb-4">
                                {product.name}
                            </h1>

                            {/* Rating */}
                            <div className="flex items-center gap-2 mb-5">
                                <div className="flex items-center gap-0.5">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i}
                                            className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'text-amber-400 fill-amber-400' : 'text-slate-200 fill-slate-200'}`}
                                        />
                                    ))}
                                </div>
                                <span className="text-sm font-semibold text-slate-700">{product.rating}</span>
                                <span className="text-sm text-slate-400">· Évaluation produit</span>
                            </div>

                            {/* Price */}
                            <div className="flex items-end gap-3 mb-6 pb-6 border-b border-slate-100">
                                <span className="text-4xl font-bold text-slate-900">{product.price} €</span>
                                <span className={`mb-1 text-sm font-semibold px-2.5 py-1 rounded-lg ${
                                    product.stock < 10
                                        ? 'bg-red-50 text-red-500'
                                        : 'bg-emerald-50 text-emerald-600'
                                }`}>
                                    {product.stock < 10
                                        ? `⚠ Plus que ${product.stock}`
                                        : `✓ ${product.stock} disponibles`}
                                </span>
                            </div>

                            {/* Description */}
                            <p className="text-slate-500 leading-relaxed mb-8 flex-1">
                                {product.description}
                            </p>

                            {/* Quantity selector */}
                            <div className="flex items-center gap-4 mb-5">
                                <span className="text-sm font-semibold text-slate-600">Quantité</span>
                                <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden">
                                    <button
                                        onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                        className="w-10 h-10 flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors">
                                        <Minus className="h-4 w-4" />
                                    </button>
                                    <span className="w-10 text-center text-sm font-bold text-slate-900">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                                        className="w-10 h-10 flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors">
                                        <Plus className="h-4 w-4" />
                                    </button>
                                </div>
                                <span className="text-sm text-slate-400">
                                    Total : <strong className="text-slate-700">{(product.price * quantity).toFixed(2)} €</strong>
                                </span>
                            </div>

                            {/* CTA buttons */}
                            <div className="flex gap-3">
                                <button
                                    onClick={handleAddToCart}
                                    disabled={product.stock === 0}
                                    className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl font-semibold text-sm transition-all duration-300 ${
                                        added
                                            ? 'bg-emerald-500 text-white'
                                            : 'text-white hover:opacity-90 hover:shadow-xl disabled:opacity-50'
                                    }`}
                                    style={!added ? { background: 'linear-gradient(135deg, #aa5a9e, #6fc7d9)' } : {}}
                                >
                                    <ShoppingCart className="h-4 w-4" />
                                    {added ? 'Ajouté !' : 'Ajouter au panier'}
                                </button>
                                <Link
                                    to="/compose-gift"
                                    className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl border-2 border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50 font-semibold text-sm transition-all"
                                >
                                    🎁 Composer
                                </Link>
                            </div>

                            {/* Trust badges */}
                            <div className="grid grid-cols-3 gap-3 mt-6 pt-6 border-t border-slate-100">
                                {[
                                    { icon: '🚚', label: 'Livraison rapide' },
                                    { icon: '🔒', label: 'Paiement sécurisé' },
                                    { icon: '↩️', label: 'Retour facile' },
                                ].map(b => (
                                    <div key={b.label} className="flex flex-col items-center gap-1 text-center">
                                        <span className="text-lg">{b.icon}</span>
                                        <span className="text-[11px] text-slate-400 font-medium">{b.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Related products ── */}
                {related.length > 0 && (
                    <div>
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="text-xl font-bold text-slate-900">Dans la même catégorie</h2>
                            <Link to={`/products`}
                                className="text-sm font-semibold transition-colors hover:opacity-80"
                                style={{ color: '#aa5a9e' }}>
                                Voir tout →
                            </Link>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {related.map(p => (
                                <Link key={p.id} to={`/products/${p.id}`}
                                    className="bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-md hover:border-slate-200 transition-all duration-200 group">
                                    <div className="overflow-hidden bg-slate-100">
                                        <img
                                            src={p.image || '/placeholder.jpg'}
                                            alt={p.name}
                                            onError={e => { (e.target as HTMLImageElement).src = '/placeholder.jpg'; }}
                                            className="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                    </div>
                                    <div className="p-3">
                                        <p className="text-sm font-semibold text-slate-900 truncate">{p.name}</p>
                                        <div className="flex items-center justify-between mt-1.5">
                                            <span className="font-bold text-sm" style={{ color: '#aa5a9e' }}>{p.price} €</span>
                                            <div className="flex items-center gap-0.5">
                                                <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
                                                <span className="text-xs text-slate-400">{p.rating}</span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductDetailPage;
