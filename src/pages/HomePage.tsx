import { useState, useEffect } from 'react';
import { ArrowRight, Star, Search } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import type { Product } from '../types';

const recipients = [
    { key: 'papa', icon: 'fa-solid fa-person', label: 'Homme', ageRange: '18 ans +' },
    { key: 'conjoint', icon: 'fa-solid fa-person-dress', label: 'Femme', ageRange: '18 ans +' },
    { key: 'enfant', icon: 'fa-solid fa-child', label: 'Jeune Garçon', ageRange: '6 – 17 ans' },
    { key: 'famille', icon: 'fa-solid fa-child-dress', label: 'Jeune Fille', ageRange: '6 – 17 ans' },
    { key: 'bebe-garcon', icon: 'fa-solid fa-baby', label: 'Bébé Garçon', ageRange: '0 – 5 ans' },
    { key: 'bebe-fille', icon: 'fa-solid fa-baby', label: 'Bébé Fille', ageRange: '0 – 5 ans' },
];

const HomePage = () => {
    const navigate = useNavigate();
    const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentSlide, setCurrentSlide] = useState(0);
    const [heroSlide, setHeroSlide] = useState(0);
    const [productSlide, setProductSlide] = useState(0);
    const [visibleCount, setVisibleCount] = useState(window.innerWidth < 768 ? 1 : 3);
    const [newsletterEmail, setNewsletterEmail] = useState('');
    const [newsletterSent, setNewsletterSent] = useState(false);
    const [contact, setContact] = useState({ name: '', email: '', message: '' });
    const [contactSent, setContactSent] = useState(false);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const q = searchQuery.trim();
        if (q) navigate(`/products?q=${encodeURIComponent(q)}`);
        else navigate('/products');
    };

    const handleNewsletter = (e: React.FormEvent) => {
        e.preventDefault();
        if (newsletterEmail) { setNewsletterSent(true); setNewsletterEmail(''); }
    };

    const handleContact = (e: React.FormEvent) => {
        e.preventDefault();
        if (contact.name && contact.email && contact.message) {
            setContactSent(true);
            setContact({ name: '', email: '', message: '' });
        }
    };

    const heroImages = [
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

    const carouselImages = [
        { url: '/Header5.jpeg', title: 'Cadeaux Personnalisés', description: 'Créez des moments inoubliables' },
        { url: '/Header6.jpeg', title: 'Qualité Premium', description: 'Des produits sélectionnés avec soin' },
        { url: '/Header7.jpeg', title: 'Livraison Rapide', description: 'Recevez vos cadeaux en temps voulu' },
        { url: '/Header8.jpeg', title: 'Livraison Rapide', description: 'Recevez vos cadeaux en temps voulu' },
        { url: '/Header9.jpeg', title: 'Livraison Rapide', description: 'Recevez vos cadeaux en temps voulu' }
    ];

    useEffect(() => {
        supabase.from('products').select('*').order('created_at', { ascending: false }).limit(12)
            .then(({ data }) => { if (data) setFeaturedProducts(data as Product[]); });
    }, []);

    useEffect(() => {
        const heroTimer = setInterval(() => {
            setHeroSlide((prev) => (prev + 1) % heroImages.length);
        }, 10000);
        return () => clearInterval(heroTimer);
    }, []);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
        }, 10000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const onResize = () => setVisibleCount(window.innerWidth < 768 ? 1 : 3);
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, []);

    useEffect(() => {
        if (featuredProducts.length <= visibleCount) return;
        const maxSlide = featuredProducts.length - visibleCount;
        setProductSlide((prev) => (prev > maxSlide ? 0 : prev));
        const t = setInterval(() => {
            setProductSlide((prev) => (prev >= maxSlide ? 0 : prev + 1));
        }, 2500);
        return () => clearInterval(t);
    }, [featuredProducts, visibleCount]);

    return (
        <div className="min-h-screen bg-gray-50">

            {/* ──────────────── HERO SECTION ──────────────── */}
            <section className="relative h-screen overflow-hidden">
                {heroImages.map((image, index) => (
                    <div
                        key={index}
                        className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === heroSlide ? 'opacity-100' : 'opacity-0'
                            }`}
                    >
                        <img
                            src={image.url}
                            alt={image.title}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40" />
                    </div>
                ))}

                <div className="relative z-10 h-full flex items-center justify-center">
                    <div className="max-w-3xl mx-auto px-6 text-center">
                        {heroImages.map((image, index) => (
                            <div
                                key={index}
                                className={`transition-all duration-700 ease-out ${index === heroSlide
                                    ? 'opacity-100 translate-y-0'
                                    : 'opacity-0 translate-y-6 absolute inset-0 flex flex-col items-center justify-center'
                                    }`}
                            >
                                <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight leading-tight mb-4">
                                    {image.title}
                                </h1>
                                <p className="text-lg md:text-xl text-white/80 font-light mb-10">
                                    {image.description}
                                </p>
                            </div>
                        ))}

                        {/* Search Bar */}
                        <form onSubmit={handleSearch} className="relative w-full max-w-xl mx-auto mt-4">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                placeholder="Recherchez un cadeau..."
                                className="w-full bg-white/95 backdrop-blur-sm pl-14 pr-36 py-4 text-gray-800 rounded-full shadow-xl focus:outline-none focus:ring-2 focus:ring-white/50 text-base placeholder-gray-400"
                            />
                            <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-cyan-400 to-purple-500 text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:opacity-90 transition-opacity">
                                Rechercher
                            </button>
                        </form>
                    </div>
                </div>

                {/* Indicators */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                    {heroImages.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setHeroSlide(index)}
                            className={`h-2 rounded-full transition-all duration-500 ${index === heroSlide
                                ? 'bg-white w-8'
                                : 'bg-white/40 hover:bg-white/60 w-2'
                                }`}
                        />
                    ))}
                </div>
            </section>

            {/* ──────────────── MAIN CONTENT ──────────────── */}
            <div className="main-section">

                {/* ── RECIPIENTS ── */}
                <section className="py-24 flex justify-center items-center">
                    <div className="max-w-5xl w-full px-6">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-3">
                                Pour Qui Cherches-Tu Un Cadeau ?
                            </h2>
                            <p className="text-base text-white/70 font-light">
                                Sélectionne la personne à qui tu veux offrir un cadeau
                            </p>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-5 max-w-3xl mx-auto">
                            {recipients.map((r) => (
                                <Link
                                    key={r.key}
                                    to={`/products?recipient=${r.key}`}
                                    className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl py-8 px-4 text-center hover:bg-white/10 hover:border-white/30 transition-all duration-300"
                                >
                                    <div className="text-5xl mb-4 transition-transform duration-300 group-hover:scale-110">
                                        <i className={`${r.icon} text-white/80 group-hover:text-white`} />
                                    </div>
                                    <h3 className="text-base font-semibold text-white/90 group-hover:text-white transition-colors">
                                        {r.label}
                                    </h3>
                                    <p className="text-xs text-white/50 mt-1 group-hover:text-white/70 transition-colors">
                                        {r.ageRange}
                                    </p>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── MIDDLE CAROUSEL ── */}
                <section className="py-16 px-6">
                    <div className="max-w-6xl mx-auto">
                        <div className="relative h-80 md:h-96 rounded-2xl overflow-hidden">
                            {carouselImages.map((image, index) => (
                                <div
                                    key={index}
                                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100' : 'opacity-0'
                                        }`}
                                >
                                    <img
                                        src={image.url}
                                        alt={image.title}
                                        className="w-full h-full object-cover"
                                    />
                                    {/* Gradient only at bottom — image visible above */}
                                    <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/65 to-transparent pointer-events-none" />
                                    <div className="absolute inset-x-0 bottom-6 flex justify-center">
                                        <Link
                                            to="/compose-gift"
                                            className="bg-white/15 backdrop-blur-md border border-white/30 text-white px-8 py-3.5 rounded-full text-sm font-semibold hover:bg-white/30 hover:scale-105 transition-all duration-300 inline-flex items-center gap-2 shadow-lg"
                                        >
                                            Personnaliser maintenant
                                            <ArrowRight className="h-4 w-4" />
                                        </Link>
                                    </div>
                                </div>
                            ))}

                            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
                                {carouselImages.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentSlide(index)}
                                        className={`h-2 rounded-full transition-all duration-500 ${index === currentSlide
                                            ? 'bg-white w-8'
                                            : 'bg-white/40 hover:bg-white/60 w-2'
                                            }`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── FEATURED PRODUCTS ── */}
                <section className="py-24 px-6">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-14">
                            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-3">
                                Produits Vedettes
                            </h2>
                            <p className="text-base text-white/70 font-light">
                                Découvrez nos coups de cœur du moment
                            </p>
                        </div>

                        {/* Sliding carousel — 3 visible */}
                        <div className="relative overflow-hidden">
                            <div
                                className="flex transition-transform duration-700 ease-in-out"
                                style={{ transform: `translateX(calc(-${productSlide} * (100% / ${visibleCount})))` }}
                            >
                                {featuredProducts.map((product) => (
                                    <div
                                        key={product.id}
                                        className="shrink-0 px-2.5"
                                        style={{ width: `calc(100% / ${visibleCount})` }}
                                    >
                                        <div className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 hover:border-white/25 transition-all duration-300 flex flex-col h-full">
                                            <div className="overflow-hidden">
                                                <img
                                                    src={product.image || '/placeholder.jpg'}
                                                    alt={product.name}
                                                    className="w-full h-52 object-cover transition-transform duration-500 group-hover:scale-105"
                                                    onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.jpg'; }}
                                                />
                                            </div>
                                            <div className="p-5 flex flex-col flex-1">
                                                <h3 className="font-semibold text-base text-white mb-1.5">
                                                    {product.name}
                                                </h3>
                                                <p className="text-white/60 text-sm mb-3 line-clamp-2 font-light leading-relaxed">
                                                    {product.description}
                                                </p>
                                                <div className="flex items-center mb-4">
                                                    <div className="flex gap-0.5">
                                                        {[...Array(5)].map((_, i) => (
                                                            <Star
                                                                key={i}
                                                                className={`h-3.5 w-3.5 ${i < Math.floor(product.rating)
                                                                    ? 'text-amber-400 fill-amber-400'
                                                                    : 'text-white/20'
                                                                    }`}
                                                            />
                                                        ))}
                                                    </div>
                                                    <span className="text-xs text-white/50 ml-2">{product.rating}</span>
                                                </div>
                                                <div className="flex justify-between items-center mt-auto">
                                                    <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                                                        {product.price} DH <span className="text-xs opacity-60">${(product.price * 0.10).toFixed(0)}</span>
                                                    </span>
                                                    <Link
                                                        to={`/products/${product.id}`}
                                                        className="bg-white/10 border border-white/15 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-white/20 transition-all duration-300"
                                                    >
                                                        Voir
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Dots */}
                            <div className="flex justify-center gap-2 mt-8">
                                {featuredProducts.length > visibleCount &&
                                    Array.from({ length: featuredProducts.length - visibleCount + 1 }).map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setProductSlide(i)}
                                            className={`h-2 rounded-full transition-all duration-500 ${i === productSlide ? 'bg-white w-8' : 'bg-white/30 hover:bg-white/50 w-2'}`}
                                        />
                                    ))
                                }
                            </div>
                        </div>

                        <div className="text-center mt-12">
                            <Link
                                to="/products"
                                className="bg-gradient-to-r from-cyan-400 to-purple-500 text-white px-10 py-3.5 rounded-full text-sm font-semibold hover:opacity-90 transition-opacity inline-flex items-center gap-2"
                            >
                                Voir Tous les Produits
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>
                    </div>
                </section>

                {/* ── NEWSLETTER ── */}
                <section className="py-24 px-6 flex justify-center items-center">
                    <div className="max-w-2xl w-full text-center">
                        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl px-8 py-14">
                            <div className="text-4xl mb-5">
                                <i className="fa-solid fa-envelope text-white/70" />
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-3">
                                Restez Inspiré
                            </h2>
                            <p className="text-base text-white/60 font-light mb-8">
                                Recevez nos meilleures idées cadeaux, offres exclusives et nouveautés directement dans votre boîte mail.
                            </p>
                            {newsletterSent ? (
                                <div className="bg-cyan-400/10 border border-cyan-400/30 rounded-2xl px-6 py-4 text-cyan-300 font-medium">
                                    Merci ! Vous êtes maintenant abonné(e) à notre newsletter.
                                </div>
                            ) : (
                                <form onSubmit={handleNewsletter} className="flex flex-col sm:flex-row gap-3">
                                    <input
                                        type="email"
                                        value={newsletterEmail}
                                        onChange={(e) => setNewsletterEmail(e.target.value)}
                                        placeholder="Votre adresse email..."
                                        required
                                        className="flex-1 bg-white/8 border border-white/15 rounded-full px-6 py-3.5 text-white placeholder-white/40 focus:outline-none focus:border-white/40 text-sm"
                                    />
                                    <button
                                        type="submit"
                                        className="bg-gradient-to-r from-cyan-400 to-purple-500 text-white px-8 py-3.5 rounded-full text-sm font-semibold hover:opacity-90 transition-opacity whitespace-nowrap"
                                    >
                                        S'abonner
                                    </button>
                                </form>
                            )}
                            <p className="text-xs text-white/30 mt-4">
                                Pas de spam. Désabonnement possible à tout moment.
                            </p>
                        </div>
                    </div>
                </section>

                {/* ── CONTACT ── */}
                <section className="py-24 px-6 flex justify-center items-center">
                    <div className="max-w-4xl w-full">
                        <div className="text-center mb-14">
                            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-3">
                                Contactez-Nous
                            </h2>
                            <p className="text-base text-white/60 font-light">
                                Une question, une suggestion ? On est là pour vous aider.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8 items-start">
                            {/* Info */}
                            <div className="flex flex-col gap-5">
                                {[
                                    { icon: 'fa-solid fa-location-dot', title: 'Adresse', detail: 'Casablanca, Maroc' },
                                    { icon: 'fa-solid fa-phone', title: 'Téléphone', detail: '+212 6 00 00 00 00' },
                                    { icon: 'fa-solid fa-envelope', title: 'Email', detail: 'contact@toncadeau.ma' },
                                ].map((item) => (
                                    <div key={item.title} className="flex items-center gap-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl px-6 py-5">
                                        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-400/20 to-purple-500/20 border border-white/10 flex items-center justify-center shrink-0">
                                            <i className={`${item.icon} text-white/70 text-sm`} />
                                        </div>
                                        <div>
                                            <p className="text-xs text-white/40 mb-0.5">{item.title}</p>
                                            <p className="text-sm font-medium text-white/90">{item.detail}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Form */}
                            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl px-8 py-8">
                                {contactSent ? (
                                    <div className="text-center py-8">
                                        <div className="text-4xl mb-4">
                                            <i className="fa-solid fa-circle-check text-cyan-400" />
                                        </div>
                                        <p className="text-white font-semibold text-lg mb-1">Message envoyé !</p>
                                        <p className="text-white/50 text-sm">Nous vous répondrons dans les plus brefs délais.</p>
                                        <button
                                            onClick={() => setContactSent(false)}
                                            className="mt-6 text-xs text-white/40 hover:text-white/70 transition-colors underline"
                                        >
                                            Envoyer un autre message
                                        </button>
                                    </div>
                                ) : (
                                    <form onSubmit={handleContact} className="flex flex-col gap-4">
                                        <div>
                                            <label className="block text-xs text-white/50 mb-1.5 ml-1">Nom complet</label>
                                            <input
                                                type="text"
                                                value={contact.name}
                                                onChange={(e) => setContact({ ...contact, name: e.target.value })}
                                                placeholder="Votre nom..."
                                                required
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-white placeholder-white/30 focus:outline-none focus:border-white/30 text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-white/50 mb-1.5 ml-1">Email</label>
                                            <input
                                                type="email"
                                                value={contact.email}
                                                onChange={(e) => setContact({ ...contact, email: e.target.value })}
                                                placeholder="Votre email..."
                                                required
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-white placeholder-white/30 focus:outline-none focus:border-white/30 text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-white/50 mb-1.5 ml-1">Message</label>
                                            <textarea
                                                value={contact.message}
                                                onChange={(e) => setContact({ ...contact, message: e.target.value })}
                                                placeholder="Votre message..."
                                                required
                                                rows={4}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-white placeholder-white/30 focus:outline-none focus:border-white/30 text-sm resize-none"
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            className="bg-gradient-to-r from-cyan-400 to-purple-500 text-white px-8 py-3.5 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity inline-flex items-center justify-center gap-2 mt-1"
                                        >
                                            Envoyer le message
                                            <ArrowRight className="h-4 w-4" />
                                        </button>
                                    </form>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

            </div>
        </div>
    );
};

export default HomePage;