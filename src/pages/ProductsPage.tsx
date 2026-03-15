import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Star, Search, X } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { supabase } from '../lib/supabase';
import { useCart } from '../context/CartContext';
import type { Product } from '../types';

const RECIPIENTS = [
    { key: 'papa',        icon: 'fa-solid fa-person',       label: 'Homme' },
    { key: 'conjoint',    icon: 'fa-solid fa-person-dress',  label: 'Femme' },
    { key: 'enfant',      icon: 'fa-solid fa-child',         label: 'Jeune Garçon' },
    { key: 'famille',     icon: 'fa-solid fa-child-dress',   label: 'Jeune Fille' },
    { key: 'bebe-garcon', icon: 'fa-solid fa-baby',          label: 'Bébé Garçon' },
    { key: 'bebe-fille',  icon: 'fa-solid fa-baby',          label: 'Bébé Fille' },
];

const ProductsPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [products, setProducts] = useState<Product[]>([]);
    const [loadingProducts, setLoadingProducts] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('default');
    const { addToCart } = useCart();

    const [activeCategory, setActiveCategory] = useState('all');

    const activeRecipient = searchParams.get('recipient') ?? '';

    useEffect(() => {
        const fetchProducts = async () => {
            const { data, error } = await supabase.from('products').select('*');
            if (!error && data) setProducts(data);
            setLoadingProducts(false);
        };
        fetchProducts();
    }, []);

    // Catégories dérivées des produits chargés
    const categories = ['all', ...Array.from(new Set(products.map(p => p.category))).filter(Boolean)];

    const setRecipient = (key: string) => {
        if (key === activeRecipient) {
            searchParams.delete('recipient');
        } else {
            searchParams.set('recipient', key);
        }
        setSearchParams(searchParams);
    };

    const filteredProducts = products
        .filter(product => {
            const matchesRecipient = !activeRecipient || product.tags.includes(activeRecipient);
            const matchesCategory  = activeCategory === 'all' || product.category === activeCategory;
            const matchesSearch    = !searchTerm ||
                product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.description.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesRecipient && matchesCategory && matchesSearch;
        })
        .sort((a, b) => {
            switch (sortBy) {
                case 'price-low':  return a.price - b.price;
                case 'price-high': return b.price - a.price;
                case 'rating':     return b.rating - a.rating;
                default:           return 0;
            }
        });

    const activeLabel = RECIPIENTS.find(r => r.key === activeRecipient)?.label ?? '';

    const { toast } = useToast();

    const handleAddToCart = (product: Product) => {
        addToCart(product);
        toast(`${product.name} ajouté au panier !`, 'success');
    };

    return (
        <div className=" main-section min-h-screen bg-gradient-to-br from-[#6fc7d9]/10 via-white to-[#a7549b]/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8 text-center">
                    <h1 className="text-4xl font-bold mb-3 text-white">
                        {activeRecipient ? `Cadeaux pour ${activeLabel}` : 'Nos Produits'}
                    </h1>
                    <p className="text-white/60">
                        {activeRecipient
                            ? `${filteredProducts.length} cadeau${filteredProducts.length > 1 ? 'x' : ''} disponible${filteredProducts.length > 1 ? 's' : ''}`
                            : 'Sélectionnez un profil ou parcourez tous nos produits'}
                    </p>
                </div>

                {/* ── Persona filter pills ── */}
                <div className="mb-5">
                    <div className="flex flex-wrap gap-2 justify-center">
                        {RECIPIENTS.map(r => {
                            const active = activeRecipient === r.key;
                            return (
                                <button
                                    key={r.key}
                                    onClick={() => setRecipient(r.key)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border-2 transition-all duration-200 ${
                                        active
                                            ? 'bg-white text-[#aa5a9e] border-white shadow-lg scale-105'
                                            : 'bg-white/10 text-white border-white/20 hover:bg-white/20 hover:border-white/40'
                                    }`}
                                >
                                    <i className={r.icon} />
                                    {r.label}
                                    {active && <X className="h-3.5 w-3.5 ml-0.5 opacity-60" />}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* ── Category filter ── */}
                {!loadingProducts && categories.length > 1 && (
                    <div className="mb-5 flex flex-wrap gap-2 justify-center">
                        {categories.map(cat => {
                            const active = activeCategory === cat;
                            return (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-all duration-200 ${
                                        active
                                            ? 'text-white border-transparent shadow-md'
                                            : 'bg-white/10 text-white/70 border-white/20 hover:bg-white/20 hover:text-white'
                                    }`}
                                    style={active ? { background: 'linear-gradient(135deg, #aa5a9e, #6fc7d9)', borderColor: 'transparent' } : {}}
                                >
                                    {cat === 'all' ? 'Tous' : cat}
                                </button>
                            );
                        })}
                    </div>
                )}

                {/* ── Search + Sort ── */}
                <div className="bg-white/10 backdrop-blur-md border-2 border-white/20 rounded-2xl shadow-lg p-4 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="relative md:col-span-2">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/50" />
                            <input
                                type="text"
                                placeholder="Rechercher un produit..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="w-full bg-white/10 text-white placeholder-white/40 pl-10 pr-4 py-2.5 border-2 border-white/20 rounded-xl focus:outline-none focus:border-white/50 transition-all"
                            />
                        </div>
                        <select
                            value={sortBy}
                            onChange={e => setSortBy(e.target.value)}
                            className="w-full bg-white/10 backdrop-blur text-white border-2 border-white/20 rounded-xl px-4 py-2.5 focus:outline-none focus:border-white/50 transition-all"
                        >
                            <option value="default" className="text-slate-800">Trier par défaut</option>
                            <option value="price-low" className="text-slate-800">Prix croissant</option>
                            <option value="price-high" className="text-slate-800">Prix décroissant</option>
                            <option value="rating" className="text-slate-800">Mieux notés</option>
                        </select>
                    </div>
                </div>

                {/* Results Count */}
                {!loadingProducts && (
                    <div className="mb-5 flex items-center gap-3 flex-wrap">
                        <p className="text-white/60 text-sm font-medium">
                            {filteredProducts.length} produit{filteredProducts.length > 1 ? 's' : ''}
                            {activeRecipient && <span className="ml-1">· <strong className="text-white">{activeLabel}</strong></span>}
                            {activeCategory !== 'all' && <span className="ml-1">· <strong className="text-white">{activeCategory}</strong></span>}
                        </p>
                        {(activeRecipient || activeCategory !== 'all' || searchTerm) && (
                            <button
                                onClick={() => { setSearchTerm(''); setActiveCategory('all'); setSearchParams({}); }}
                                className="flex items-center gap-1 text-xs text-white/50 hover:text-white/80 transition-colors"
                            >
                                <X className="h-3 w-3" /> Tout effacer
                            </button>
                        )}
                    </div>
                )}

                {/* Products Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredProducts.map((product) => (
                        <div key={product.id} className="bg-white/10 backdrop-blur-md border-2 border-white/20 rounded-2xl overflow-hidden hover:bg-white/20 hover:border-[#6fc7d9] hover:scale-105 transition-all duration-300 cursor-pointer flex flex-col">
                            <Link to={`/products/${product.id}`}>
                                <div className="relative overflow-hidden">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#a7549b]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                </div>
                            </Link>
                            <div className="p-5">
                                <div className="mb-2">
                                    <span className="inline-block bg-gradient-to-r from-[#6fc7d9] to-[#a7549b] text-white text-xs px-3 py-1 rounded-full font-medium shadow-md">
                                        {product.category}
                                    </span>
                                </div>
                                <h3 className="font-bold text-lg mb-2 text-white group-hover:text-[#a7549b] transition-colors">{product.name}</h3>
                                <p className="text-white/80 text-sm mb-3 line-clamp-2">{product.description}</p>

                                <div className="flex items-center mb-3">
                                    <div className="flex text-yellow-400">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'fill-current' : ''}`}
                                            />
                                        ))}
                                    </div>
                                    <span className="text-sm text-gray-600 ml-2 font-medium">({product.rating})</span>
                                </div>

                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-2xl font-bold bg-gradient-to-r from-[#6fc7d9] to-[#a7549b] bg-clip-text text-transparent">
                                        {product.price} DH <span className="text-xs opacity-60">${(product.price * 0.10).toFixed(0)}</span>
                                    </span>
                                    <span className="text-sm text-white/60 bg-white/10 px-2 py-1 rounded-full">
                                        Qté : {product.stock}
                                    </span>
                                </div>

                                <div className="flex space-x-2">
                                    <Link
                                        to={`/products/${product.id}`}
                                        className="flex-1 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 px-4 py-2.5 rounded-xl text-sm font-semibold hover:from-gray-200 hover:to-gray-300 hover:shadow-md transition-all text-center"
                                    >
                                        Personnaliser
                                    </Link>
                                    <button
                                        onClick={() => handleAddToCart(product)}
                                        className="flex-1 bg-gradient-to-r from-[#6fc7d9] to-[#a7549b] text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300"
                                    >
                                        Ajouter
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredProducts.length === 0 && (
                    <div className="text-center py-16 bg-white/80 backdrop-blur-md rounded-2xl shadow-lg">
                        <div className="mb-4">
                            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-[#6fc7d9] to-[#a7549b] rounded-full flex items-center justify-center">
                                <Search className="h-12 w-12 text-white" />
                            </div>
                        </div>
                        <p className="text-gray-600 text-lg mb-2">Aucun produit trouvé pour votre recherche.</p>
                        <p className="text-gray-500 text-sm mb-6">Essayez de modifier vos critères de recherche</p>
                        <button
                            onClick={() => {
                                setSearchTerm('');
                                setSearchParams({});
                            }}
                            className="bg-gradient-to-r from-[#6fc7d9] to-[#a7549b] text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300"
                        >
                            Réinitialiser les filtres
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductsPage;