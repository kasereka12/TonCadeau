import React, { useState, useEffect } from 'react';
import { ArrowRight, Star, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

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

const HomePage = () => {
    const featuredProducts = products.slice(0, 4);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [heroSlide, setHeroSlide] = useState(0);

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
        { url: '/header1.jpg', title: 'Cadeaux Personnalisés', description: 'Créez des moments inoubliables' },
        { url: '/header2.jpg', title: 'Qualité Premium', description: 'Des produits sélectionnés avec soin' },
        { url: '/header3.jpg', title: 'Livraison Rapide', description: 'Recevez vos cadeaux en temps voulu' }
    ];

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
                        <div className="relative w-full max-w-xl mx-auto mt-4">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Recherchez un cadeau..."
                                className="w-full bg-white/95 backdrop-blur-sm pl-14 pr-36 py-4 text-gray-800 rounded-full shadow-xl focus:outline-none focus:ring-2 focus:ring-white/50 text-base placeholder-gray-400"
                            />
                            <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-cyan-400 to-purple-500 text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:opacity-90 transition-opacity">
                                Rechercher
                            </button>
                        </div>
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
                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                        <button className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-8 py-3.5 rounded-full text-sm font-semibold hover:bg-white/20 transition-all duration-300 inline-flex items-center gap-2">
                                            Personnaliser maintenant
                                            <ArrowRight className="h-4 w-4" />
                                        </button>
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

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                            {featuredProducts.map((product) => (
                                <div
                                    key={product.id}
                                    className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 hover:border-white/25 transition-all duration-300 flex flex-col"
                                >
                                    <div className="overflow-hidden">
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
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
                                            <span className="text-xs text-white/50 ml-2">
                                                {product.rating}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center mt-auto">
                                            <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                                                {product.price} €
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
                            ))}
                        </div>

                        <div className="text-center mt-14">
                            <button className="bg-gradient-to-r from-cyan-400 to-purple-500 text-white px-10 py-3.5 rounded-full text-sm font-semibold hover:opacity-90 transition-opacity inline-flex items-center gap-2">
                                Voir Tous les Produits
                                <ArrowRight className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default HomePage;