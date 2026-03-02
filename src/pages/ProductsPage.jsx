import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Star, Search, SlidersHorizontal, X } from 'lucide-react';
import { products, categories } from '../data/products';
import { useCart } from '../context/CartContext';

/* ═══════════════════════════════════════════════
   HOOKS
   ═══════════════════════════════════════════════ */

function useInView(options = {}) {
    const ref = useRef(null);
    const [isVisible, setIsVisible] = useState(false);
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
            { threshold: 0.1, ...options }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);
    return [ref, isVisible];
}

/* ═══════════════════════════════════════════════
   SMALL COMPONENTS
   ═══════════════════════════════════════════════ */

const FadeIn = ({ children, delay = 0, className = '' }) => {
    const [ref, isVisible] = useInView();
    return (
        <div
            ref={ref}
            className={className}
            style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                transition: `opacity 0.5s cubic-bezier(0.16,1,0.3,1) ${delay}s, transform 0.5s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
            }}
        >
            {children}
        </div>
    );
};

const categoryOptions = [
    { value: 'all', label: 'Toutes catégories' },
    { value: 'electronique', label: 'Électronique' },
    { value: 'vestimentaire', label: 'Vestimentaire' },
    { value: 'beaute', label: 'Accessoire de beauté' },
    { value: 'nourriture', label: 'Friandise & nourriture' },
    { value: 'art', label: 'Art' },
    { value: 'arcade', label: 'Arcade' },
    { value: 'evenement', label: 'Événement' },
];

const sortOptions = [
    { value: 'default', label: 'Trier par' },
    { value: 'name', label: 'Nom (A-Z)' },
    { value: 'price-low', label: 'Prix croissant' },
    { value: 'price-high', label: 'Prix décroissant' },
    { value: 'rating', label: 'Meilleures notes' },
];

/* ═══════════════════════════════════════════════
   PRODUCTS PAGE
   ═══════════════════════════════════════════════ */

const ProductsPage = () => {
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('default');
    const { addToCart } = useCart();

    const filteredProducts = products
        .filter((product) => {
            const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
            const matchesSearch =
                product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()));
            return matchesCategory && matchesSearch;
        })
        .sort((a, b) => {
            switch (sortBy) {
                case 'price-low': return a.price - b.price;
                case 'price-high': return b.price - a.price;
                case 'rating': return b.rating - a.rating;
                case 'name': return a.name.localeCompare(b.name);
                default: return 0;
            }
        });

    const handleAddToCart = (product) => {
        addToCart(product);
    };

    const clearFilters = () => {
        setSearchTerm('');
        setSelectedCategory('all');
        setSortBy('default');
    };

    const hasActiveFilters = searchTerm || selectedCategory !== 'all' || sortBy !== 'default';

    return (
        <div className="main-section min-h-screen bg-[#020617]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            <div className="max-w-7xl mx-auto px-6 py-12">

                {/* ── HEADER ── */}
                <FadeIn>
                    <div className="text-center mb-12">
                        <span className="inline-block text-[11px] font-semibold tracking-[0.2em] uppercase text-cyan-400 mb-3">
                            Catalogue
                        </span>
                        <h1
                            className="text-3xl md:text-5xl font-bold text-white mb-4"
                            style={{ fontFamily: "'Playfair Display', Georgia, serif", letterSpacing: '-0.5px' }}
                        >
                            Nos Produits
                        </h1>
                        <p style={{ color: 'rgba(255,255,255,0.65)' }} className="text-base font-light max-w-md mx-auto leading-relaxed">
                            Découvrez notre sélection de produits de qualité pour composer des cadeaux parfaits
                        </p>
                    </div>
                </FadeIn>

                {/* ── FILTERS BAR ── */}
                <FadeIn delay={0.1}>
                    <div
                        className="rounded-2xl p-5 mb-10"
                        style={{
                            background: 'linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))',
                            border: '1px solid rgba(255,255,255,0.06)',
                        }}
                    >
                        <div className="flex flex-col md:flex-row gap-3">
                            {/* Search */}
                            <div className="relative flex-1">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none" style={{ color: 'rgba(255,255,255,0.4)' }} />
                                <input
                                    type="text"
                                    placeholder="Rechercher un produit..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full bg-white/[0.04] text-white pl-11 pr-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-cyan-400/30 transition-all duration-300"
                                    style={{ border: '1px solid rgba(255,255,255,0.06)', color: '#ffffff' }}
                                />
                                {searchTerm && (
                                    <button
                                        onClick={() => setSearchTerm('')}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 hover:text-white transition-colors"
                                        style={{ color: 'rgba(255,255,255,0.5)' }}
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                )}
                            </div>

                            {/* Category */}
                            <div className="relative md:w-52">
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    className="w-full appearance-none bg-white/[0.04] text-white px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-cyan-400/30 transition-all duration-300 cursor-pointer"
                                    style={{ border: '1px solid rgba(255,255,255,0.06)' }}
                                >
                                    {categoryOptions.map((opt) => (
                                        <option key={opt.value} value={opt.value} style={{ background: '#0f172a', color: '#ffffff' }}>
                                            {opt.label}
                                        </option>
                                    ))}
                                </select>
                                <SlidersHorizontal className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none" style={{ color: 'rgba(255,255,255,0.4)' }} />
                            </div>

                            {/* Sort */}
                            <div className="relative md:w-48">
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="w-full appearance-none bg-white/[0.04] text-white px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-cyan-400/30 transition-all duration-300 cursor-pointer"
                                    style={{ border: '1px solid rgba(255,255,255,0.06)' }}
                                >
                                    {sortOptions.map((opt) => (
                                        <option key={opt.value} value={opt.value} style={{ background: '#0f172a', color: '#ffffff' }}>
                                            {opt.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Active filters indicator */}
                        {hasActiveFilters && (
                            <div className="flex items-center gap-3 mt-4 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                                <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px' }}>Filtres actifs</span>
                                <button
                                    onClick={clearFilters}
                                    className="text-xs text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
                                >
                                    Tout effacer
                                </button>
                            </div>
                        )}
                    </div>
                </FadeIn>

                {/* ── RESULTS COUNT ── */}
                <FadeIn delay={0.15}>
                    <div className="mb-8">
                        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px' }}>
                            <span className="text-white font-medium">{filteredProducts.length}</span>
                            {' '}produit{filteredProducts.length > 1 ? 's' : ''} trouvé{filteredProducts.length > 1 ? 's' : ''}
                        </p>
                    </div>
                </FadeIn>

                {/* ── PRODUCTS GRID ── */}
                {filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                        {filteredProducts.map((product, i) => (
                            <FadeIn key={product.id} delay={Math.min(0.08 * i, 0.4)}>
                                <div
                                    className="group flex flex-col rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1"
                                    style={{
                                        border: '1px solid rgba(255,255,255,0.05)',
                                        background: 'linear-gradient(135deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))',
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                                        e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.2)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
                                        e.currentTarget.style.boxShadow = 'none';
                                    }}
                                >
                                    {/* Image */}
                                    <Link to={`/products/${product.id}`} className="block overflow-hidden">
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                                        />
                                    </Link>

                                    {/* Body */}
                                    <div className="p-5 flex flex-col flex-1">
                                        {/* Category tag */}
                                        <span
                                            className="inline-block self-start text-[10px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full mb-3"
                                            style={{
                                                background: 'linear-gradient(135deg, rgba(56,201,223,0.12), rgba(139,92,246,0.12))',
                                                color: '#38c9df',
                                                border: '1px solid rgba(56,201,223,0.15)',
                                            }}
                                        >
                                            {product.category}
                                        </span>

                                        <Link to={`/products/${product.id}`}>
                                            <h3 className="text-[15px] font-semibold text-white mb-1.5 group-hover:text-cyan-300 transition-colors duration-300">
                                                {product.name}
                                            </h3>
                                        </Link>

                                        <p className="text-[13px] font-light leading-relaxed mb-4 line-clamp-2" style={{ color: 'rgba(255,255,255,0.55)' }}>
                                            {product.description}
                                        </p>

                                        {/* Rating */}
                                        <div className="flex items-center gap-0.5 mb-4">
                                            {[...Array(5)].map((_, j) => (
                                                <Star
                                                    key={j}
                                                    className={`h-3.5 w-3.5 ${j < Math.floor(product.rating) ? 'text-amber-400 fill-amber-400' : ''}`}
                                                    style={j >= Math.floor(product.rating) ? { color: 'rgba(255,255,255,0.12)' } : {}}
                                                />
                                            ))}
                                            <span className="ml-1.5" style={{ fontSize: '11px', color: 'rgba(255,255,255,0.45)' }}>{product.rating}</span>
                                        </div>

                                        {/* Price + Stock */}
                                        <div className="flex items-center justify-between mb-5">
                                            <span
                                                className="text-lg font-bold"
                                                style={{
                                                    background: 'linear-gradient(135deg, #38c9df, #a67dff)',
                                                    WebkitBackgroundClip: 'text',
                                                    WebkitTextFillColor: 'transparent',
                                                }}
                                            >
                                                {product.price} €
                                            </span>
                                            <span className="text-[11px] font-medium px-2 py-0.5 rounded-full"
                                                style={{ color: 'rgba(255,255,255,0.5)', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
                                            >
                                                Stock: {product.stock}
                                            </span>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex gap-2 mt-auto">
                                            <Link
                                                to={`/products/${product.id}`}
                                                className="flex-1 text-center text-sm font-medium py-2.5 rounded-xl transition-all duration-300"
                                                style={{ color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.08)' }}
                                                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; e.currentTarget.style.color = '#ffffff'; }}
                                                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; }}
                                            >
                                                Personnaliser
                                            </Link>
                                            <button
                                                onClick={() => handleAddToCart(product)}
                                                className="flex-1 text-sm font-semibold text-white py-2.5 rounded-xl transition-shadow duration-300"
                                                style={{
                                                    background: 'linear-gradient(135deg, #38c9df, #8b5cf6)',
                                                    boxShadow: '0 2px 12px rgba(56,201,223,0.15)',
                                                }}
                                                onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 4px 20px rgba(56,201,223,0.25)'; }}
                                                onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 2px 12px rgba(56,201,223,0.15)'; }}
                                            >
                                                Ajouter
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </FadeIn>
                        ))}
                    </div>
                ) : (
                    /* ── EMPTY STATE ── */
                    <FadeIn>
                        <div
                            className="text-center py-20 rounded-2xl"
                            style={{
                                background: 'linear-gradient(135deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))',
                                border: '1px solid rgba(255,255,255,0.06)',
                            }}
                        >
                            <div
                                className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center"
                                style={{ background: 'linear-gradient(135deg, rgba(56,201,223,0.1), rgba(139,92,246,0.1))' }}
                            >
                                <Search className="h-8 w-8" style={{ color: 'rgba(255,255,255,0.45)' }} />
                            </div>
                            <p className="text-white text-lg font-medium mb-2">Aucun produit trouvé</p>
                            <p style={{ color: 'rgba(255,255,255,0.55)' }} className="text-sm mb-8 max-w-xs mx-auto">
                                Essayez de modifier vos critères de recherche
                            </p>
                            <button
                                onClick={clearFilters}
                                className="inline-flex items-center gap-2 text-white px-8 py-3 rounded-full text-sm font-semibold transition-shadow duration-300"
                                style={{
                                    background: 'linear-gradient(135deg, #38c9df, #8b5cf6)',
                                    boxShadow: '0 4px 20px rgba(56,201,223,0.15)',
                                }}
                            >
                                Réinitialiser les filtres
                            </button>
                        </div>
                    </FadeIn>
                )}
            </div>
        </div>
    );
};

export default ProductsPage;