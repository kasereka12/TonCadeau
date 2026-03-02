import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, Star, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

/* ═══════════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════════ */

const products = [
    {
        id: 1,
        name: 'Coffret Cadeau Luxe',
        description: 'Un assortiment élégant de produits premium pour marquer les occasions spéciales',
        price: 89.99,
        rating: 4.8,
        image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=400&h=300&fit=crop'
    },
    {
        id: 2,
        name: 'Bougie Parfumée Artisanale',
        description: 'Créez une ambiance chaleureuse avec nos bougies faites à la main',
        price: 34.99,
        rating: 4.9,
        image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=400&h=300&fit=crop'
    },
    {
        id: 3,
        name: 'Coffret Thé Premium',
        description: 'Une sélection de thés rares du monde entier dans un coffret élégant',
        price: 45.99,
        rating: 4.7,
        image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=300&fit=crop'
    },
    {
        id: 4,
        name: 'Ensemble Spa Relaxation',
        description: 'Offrez un moment de détente avec ce coffret spa complet',
        price: 65.99,
        rating: 4.9,
        image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400&h=300&fit=crop'
    }
];

const recipients = [
    { key: 'papa', icon: 'fa-solid fa-person', label: 'Homme' },
    { key: 'conjoint', icon: 'fa-solid fa-person-dress', label: 'Femme' },
    { key: 'enfant', icon: 'fa-solid fa-child', label: 'Jeune Garçon' },
    { key: 'famille', icon: 'fa-solid fa-child-dress', label: 'Jeune Fille' },
    { key: 'bebe-garcon', icon: 'fa-solid fa-baby', label: 'Bébé Garçon' },
    { key: 'bebe-fille', icon: 'fa-solid fa-baby', label: 'Bébé Fille' },
];

const heroSlides = [
    {
        url: '/bannier4.jpg',
        title: 'Créez des Moments Inoubliables',
        description: 'Des cadeaux personnalisés pour toutes les occasions'
    },
    {
        url: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=1200&h=800&fit=crop',
        title: 'Qualité Premium Garantie',
        description: 'Des produits sélectionnés avec soin par nos experts'
    },
    {
        url: 'https://images.unsplash.com/photo-1511556820780-d912e42b4980?w=1200&h=800&fit=crop',
        title: 'Livraison Express Disponible',
        description: 'Recevez vos cadeaux rapidement partout au Maroc'
    }
];

const bannerSlides = [
    { url: '/header1.jpg' },
    { url: '/header2.jpg' },
    { url: '/header3.jpg' }
];

/* ═══════════════════════════════════════════════
   HOOKS
   ═══════════════════════════════════════════════ */

function useInView(options = {}) {
    const ref = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
            { threshold: 0.15, ...options }
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
                transform: isVisible ? 'translateY(0)' : 'translateY(24px)',
                transition: `opacity 0.6s cubic-bezier(0.16,1,0.3,1) ${delay}s, transform 0.6s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
            }}
        >
            {children}
        </div>
    );
};

const SectionHeading = ({ overline, title, subtitle }) => (
    <div className="text-center mb-16">
        {overline && (
            <span className="inline-block text-[11px] font-semibold tracking-[0.2em] uppercase text-cyan-400 mb-3">
                {overline}
            </span>
        )}
        <h2
            className="text-3xl md:text-4xl font-bold text-white mb-3"
            style={{ fontFamily: "'Playfair Display', Georgia, serif", letterSpacing: '-0.3px' }}
        >
            {title}
        </h2>
        {subtitle && (
            <p className="text-base text-slate-400 font-light max-w-lg mx-auto leading-relaxed">
                {subtitle}
            </p>
        )}
    </div>
);

const Dots = ({ count, active, onSelect, className = '' }) => (
    <div className={`flex gap-2 ${className}`}>
        {Array.from({ length: count }).map((_, i) => (
            <button
                key={i}
                onClick={() => onSelect(i)}
                className={`h-1.5 rounded-full transition-all duration-500 ${i === active ? 'bg-white w-8' : 'bg-white/30 hover:bg-white/50 w-1.5'
                    }`}
            />
        ))}
    </div>
);

/* ═══════════════════════════════════════════════
   HOMEPAGE
   ═══════════════════════════════════════════════ */

const HomePage = () => {
    const [heroIdx, setHeroIdx] = useState(0);
    const [bannerIdx, setBannerIdx] = useState(0);

    useEffect(() => {
        const id = setInterval(() => setHeroIdx((p) => (p + 1) % heroSlides.length), 8000);
        return () => clearInterval(id);
    }, []);

    useEffect(() => {
        const id = setInterval(() => setBannerIdx((p) => (p + 1) % bannerSlides.length), 8000);
        return () => clearInterval(id);
    }, []);

    return (
        <div className="min-h-screen bg-[#020617]" style={{ fontFamily: "'DM Sans', sans-serif" }}>

            {/* ════════════════ HERO ════════════════ */}
            <section className="relative h-screen overflow-hidden">
                {heroSlides.map((slide, i) => (
                    <div
                        key={i}
                        className={`absolute inset-0 transition-opacity duration-[1.2s] ease-in-out ${i === heroIdx ? 'opacity-100' : 'opacity-0'
                            }`}
                    >
                        <img
                            src={slide.url}
                            alt=""
                            className="w-full h-full object-cover"
                            style={{ transform: 'scale(1.05)' }}
                        />
                    </div>
                ))}

                {/* Overlay — neutral dark, no colored tint */}
                <div
                    className="absolute inset-0"
                    style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.25) 50%, #020617 100%)' }}
                />

                {/* Content */}
                <div className="relative z-10 h-full flex flex-col items-center justify-center px-6">
                    <div className="max-w-2xl w-full text-center">
                        {/* Animated titles */}
                        <div className="relative h-44 md:h-52 flex items-center justify-center">
                            {heroSlides.map((slide, i) => (
                                <div
                                    key={i}
                                    className="absolute inset-0 flex flex-col items-center justify-center"
                                    style={{
                                        opacity: i === heroIdx ? 1 : 0,
                                        transform: i === heroIdx ? 'translateY(0)' : 'translateY(16px)',
                                        transition: 'opacity 0.7s ease-out, transform 0.7s ease-out',
                                        pointerEvents: i === heroIdx ? 'auto' : 'none',
                                    }}
                                >
                                    <h1
                                        className="text-4xl md:text-[3.5rem] font-bold text-white leading-[1.1] mb-4"
                                        style={{ fontFamily: "'Playfair Display', Georgia, serif", letterSpacing: '-0.5px' }}
                                    >
                                        {slide.title}
                                    </h1>
                                    <p className="text-lg text-white/60 font-light">
                                        {slide.description}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* Search */}
                        <div className="relative w-full max-w-xl mx-auto mt-4">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-slate-400 pointer-events-none" />
                            <input
                                type="text"
                                placeholder="Recherchez un cadeau, une occasion..."
                                className="w-full bg-white/95 backdrop-blur-md pl-13 pr-36 py-4 text-slate-800 rounded-full text-sm placeholder-slate-400 focus:outline-none"
                                style={{
                                    paddingLeft: '52px',
                                    boxShadow: '0 20px 60px rgba(0,0,0,0.25), 0 0 0 1px rgba(255,255,255,0.1)',
                                }}
                            />
                            <button
                                className="absolute right-1.5 top-1/2 -translate-y-1/2 text-white px-6 py-2.5 rounded-full text-sm font-semibold transition-shadow duration-300"
                                style={{
                                    background: 'linear-gradient(135deg, #38c9df, #8b5cf6)',
                                    boxShadow: '0 4px 16px rgba(56,201,223,0.2)',
                                }}
                            >
                                Rechercher
                            </button>
                        </div>
                    </div>

                    <Dots
                        count={heroSlides.length}
                        active={heroIdx}
                        onSelect={setHeroIdx}
                        className="absolute bottom-8 left-1/2 -translate-x-1/2"
                    />
                </div>
            </section>

            {/* ════════════════ RECIPIENTS ════════════════ */}
            <section className="py-24 px-6">
                <FadeIn>
                    <SectionHeading
                        overline="Destinataire"
                        title="Pour Qui Cherches-Tu Un Cadeau ?"
                        subtitle="Sélectionne la personne à qui tu veux offrir un cadeau"
                    />
                </FadeIn>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
                    {recipients.map((r, i) => (
                        <FadeIn key={r.key} delay={0.08 * i}>
                            <Link
                                to={`/products?recipient=${r.key}`}
                                className="group relative flex flex-col items-center justify-center py-10 px-4 rounded-2xl transition-all duration-300"
                                style={{
                                    border: '1px solid rgba(255,255,255,0.05)',
                                    background: 'linear-gradient(135deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.borderColor = 'rgba(56,201,223,0.25)';
                                    e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
                                    e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))';
                                }}
                            >
                                <div className="text-4xl mb-3 text-white/50 group-hover:text-white/90 transition-colors duration-300">
                                    <i className={r.icon} />
                                </div>
                                <span className="text-sm font-medium text-slate-500 group-hover:text-white transition-colors duration-300">
                                    {r.label}
                                </span>
                            </Link>
                        </FadeIn>
                    ))}
                </div>
            </section>

            {/* ════════════════ BANNER ════════════════ */}
            <section className="py-12 px-6">
                <div className="max-w-5xl mx-auto">
                    <FadeIn>
                        <div className="relative h-72 md:h-80 rounded-2xl overflow-hidden">
                            {bannerSlides.map((slide, i) => (
                                <div
                                    key={i}
                                    className={`absolute inset-0 transition-opacity duration-[1s] ease-in-out ${i === bannerIdx ? 'opacity-100' : 'opacity-0'
                                        }`}
                                >
                                    <img src={slide.url} alt="" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                        <button
                                            className="text-white px-8 py-3.5 rounded-full text-sm font-semibold backdrop-blur-md inline-flex items-center gap-2.5 transition-all duration-300 hover:bg-white/15"
                                            style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}
                                        >
                                            Personnaliser maintenant
                                            <ArrowRight className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}

                            <Dots
                                count={bannerSlides.length}
                                active={bannerIdx}
                                onSelect={setBannerIdx}
                                className="absolute bottom-5 left-1/2 -translate-x-1/2"
                            />
                        </div>
                    </FadeIn>
                </div>
            </section>

            {/* ════════════════ PRODUCTS ════════════════ */}
            <section className="py-24 px-6">
                <div className="max-w-6xl mx-auto">
                    <FadeIn>
                        <SectionHeading
                            overline="Sélection"
                            title="Produits Vedettes"
                            subtitle="Découvrez nos coups de cœur du moment"
                        />
                    </FadeIn>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        {products.map((product, i) => (
                            <FadeIn key={product.id} delay={0.08 * i}>
                                <div
                                    className="group flex flex-col rounded-2xl overflow-hidden transition-all duration-400 hover:-translate-y-1"
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
                                    <div className="overflow-hidden">
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                                        />
                                    </div>

                                    <div className="p-5 flex flex-col flex-1">
                                        <h3 className="text-[15px] font-semibold text-white mb-1">
                                            {product.name}
                                        </h3>
                                        <p className="text-[13px] text-slate-500 font-light leading-relaxed mb-4 line-clamp-2">
                                            {product.description}
                                        </p>

                                        <div className="flex items-center gap-0.5 mb-4">
                                            {[...Array(5)].map((_, j) => (
                                                <Star
                                                    key={j}
                                                    className={`h-3.5 w-3.5 ${j < Math.floor(product.rating)
                                                            ? 'text-amber-400 fill-amber-400'
                                                            : 'text-white/10'
                                                        }`}
                                                />
                                            ))}
                                            <span className="text-[11px] text-slate-600 ml-1.5">{product.rating}</span>
                                        </div>

                                        <div className="flex justify-between items-center mt-auto">
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
                                            <Link
                                                to={`/products/${product.id}`}
                                                className="text-sm font-medium text-slate-400 hover:text-white px-4 py-1.5 rounded-lg transition-all duration-300"
                                                style={{ border: '1px solid rgba(255,255,255,0.08)' }}
                                                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; }}
                                                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
                                            >
                                                Voir
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </FadeIn>
                        ))}
                    </div>

                    <FadeIn delay={0.4}>
                        <div className="text-center mt-14">
                            <Link
                                to="/products"
                                className="inline-flex items-center gap-2.5 text-white px-10 py-3.5 rounded-full text-sm font-semibold transition-shadow duration-300"
                                style={{
                                    background: 'linear-gradient(135deg, #38c9df, #8b5cf6)',
                                    boxShadow: '0 4px 20px rgba(56,201,223,0.15)',
                                }}
                                onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 8px 32px rgba(56,201,223,0.25)'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 4px 20px rgba(56,201,223,0.15)'; }}
                            >
                                Voir Tous les Produits
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>
                    </FadeIn>
                </div>
            </section>
        </div>
    );
};

export default HomePage;