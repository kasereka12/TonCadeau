import React, { useState, useEffect } from 'react';
import { ArrowRight, Star, Truck, Shield, Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';


// Mock products data
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
        image: 'https://images.unsplash.com/photo-1602874801006-ec428a8ee9fb?w=400&h=300&fit=crop'
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

const HomePage = () => {
    const featuredProducts = products.slice(0, 4);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [heroSlide, setHeroSlide] = useState(0);

    // Images du hero carousel
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

    // Images du carousel
    const carouselImages = [
        {
            url: '/hero1.jpg',
            title: 'Cadeaux Personnalisés',
            description: 'Créez des moments inoubliables'
        },
        {
            url: '/hero2.jpg',
            title: 'Qualité Premium',
            description: 'Des produits sélectionnés avec soin'
        },
        {
            url: '/jeunefille.jpg',
            title: 'Livraison Rapide',
            description: 'Recevez vos cadeaux en temps voulu'
        }
    ];

    useEffect(() => {
        const heroTimer = setInterval(() => {
            setHeroSlide((prev) => (prev + 1) % heroImages.length);
        }, 5000);
        return () => clearInterval(heroTimer);
    }, []);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    const nextHeroSlide = () => {
        setHeroSlide((prev) => (prev + 1) % heroImages.length);
    };

    const prevHeroSlide = () => {
        setHeroSlide((prev) => (prev - 1 + heroImages.length) % heroImages.length);
    };

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section with Carousel */}
            <section className="relative h-screen overflow-hidden">
                {/* Carousel Images */}
                {heroImages.map((image, index) => (
                    <div
                        key={index}
                        className={`absolute inset-0 transition-opacity duration-1000 ${index === heroSlide ? 'opacity-100' : 'opacity-0'
                            }`}
                    >
                        <img
                            src={image.url}
                            alt={image.title}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-pink-500/30 to-purple-600/30"></div>
                    </div>
                ))}

                {/* Content Overlay */}
                <div className="relative z-10 h-full flex items-center">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                        <div className="text-center">
                            {/* Animated Title */}
                            {heroImages.map((image, index) => (
                                <div
                                    key={index}
                                    className={`transition-all duration-700 ${index === heroSlide ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 absolute'
                                        }`}
                                >
                                    <h1 className="text-4xl md:text-6xl font-bold mb-4 text-white">
                                        {image.title}
                                    </h1>
                                    <p className="text-xl md:text-2xl text-white/90 mb-8">
                                        {image.description}
                                    </p>
                                </div>
                            ))}

                            {/* Barre de recherche */}
                            <div className="flex justify-center mt-8">
                                <div className="relative w-full max-w-2xl">
                                    <input
                                        type="text"
                                        placeholder="Recherchez un cadeau, une occasion ou une personne..."
                                        className="w-full bg-white px-6 py-4 text-gray-900 rounded-full shadow-lg focus:outline-none focus:ring-4 focus:ring-pink-300 text-lg placeholder-gray-500"
                                    />
                                    <button className="absolute right-2 top-2 bg-gradient-to-r from-cyan-400 to-purple-500 text-white px-6 py-2 rounded-full font-semibold hover:scale-105 transition-transform duration-200">
                                        Rechercher
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


                {/* Indicators */}
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex space-x-3">
                    {heroImages.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setHeroSlide(index)}
                            className={`h-3 rounded-full transition-all duration-300 ${index === heroSlide
                                ? 'bg-white w-10'
                                : 'bg-white/50 hover:bg-white/75 w-3'
                                }`}
                        />
                    ))}
                </div>
            </section>

            {/* Main Content */}
            <div className="main-section">
                {/* Gift Recipient Section */}
                <section className="py-10 flex justify-center items-center min-h-screen">
                    <div className="max-w-7xl w-full px-4 sm:px-4 lg:px-4">
                        <div className="text-center mb-12">
                            <h2 className="text-4xl font-bold text-white mb-4">
                                Pour Qui Cherches-Tu Un Cadeau ?
                            </h2>
                            <p className="text-lg text-white/90">
                                Sélectionne la personne à qui tu veux offrir un cadeau
                            </p>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-15 max-w-5xl mx-auto place-items-center">
                            <Link
                                to="/products?recipient=papa"
                                className="bg-white/10 backdrop-blur-md border-2 border-white/20 rounded-2xl p-6 hover:bg-white/20 hover:border-[#6fc7d9] hover:scale-105 transition-all duration-300 cursor-pointer group w-40 sm:w-48 text-center"
                            >
                                <div className="text-6xl mb-4">
                                    <i className="fa-solid fa-person text-white"></i>
                                </div>
                                <h3 className="text-xl font-bold text-white group-hover:text-[#6fc7d9] transition-colors">
                                    Homme
                                </h3>
                            </Link>

                            <Link
                                to="/products?recipient=conjoint"
                                className="bg-white/10 backdrop-blur-md border-2 border-white/20 rounded-2xl p-6 hover:bg-white/20 hover:border-[#6fc7d9] hover:scale-105 transition-all duration-300 cursor-pointer group w-40 sm:w-48 text-center"
                            >
                                <div className="text-6xl mb-4">
                                    <i className="fa-solid fa-person-dress text-white"></i>
                                </div>
                                <h3 className="text-xl font-bold text-white group-hover:text-[#6fc7d9] transition-colors">
                                    Femme
                                </h3>
                            </Link>

                            <Link
                                to="/products?recipient=enfant"
                                className="bg-white/10 backdrop-blur-md border-2 border-white/20 rounded-2xl p-6 hover:bg-white/20 hover:border-[#6fc7d9] hover:scale-105 transition-all duration-300 cursor-pointer group w-40 sm:w-48 text-center"
                            >
                                <div className="text-6xl mb-4">
                                    <i className="fa-solid fa-child text-white"></i>
                                </div>
                                <h3 className="text-xl font-bold text-white group-hover:text-[#6fc7d9] transition-colors">
                                    Jeune Garçon
                                </h3>
                            </Link>

                            <Link
                                to="/products?recipient=famille"
                                className="bg-white/10 backdrop-blur-md border-2 border-white/20 rounded-2xl p-6 hover:bg-white/20 hover:border-[#6fc7d9] hover:scale-105 transition-all duration-300 cursor-pointer group w-40 sm:w-48 text-center"
                            >
                                <div className="text-6xl mb-4">
                                    <i className="fa-solid fa-child-dress text-white"></i>
                                </div>
                                <h3 className="text-xl font-bold text-white group-hover:text-[#6fc7d9] transition-colors">
                                    Jeune Fille
                                </h3>
                            </Link>

                            <Link
                                to="/products?recipient=bebe-garcon"
                                className="bg-white/10 backdrop-blur-md border-2 border-white/20 rounded-2xl p-6 hover:bg-white/20 hover:border-[#6fc7d9] hover:scale-105 transition-all duration-300 cursor-pointer group w-40 sm:w-48 text-center"
                            >
                                <div className="text-6xl mb-4">
                                    <i className="fa-solid fa-baby text-white"></i>
                                </div>
                                <h3 className="text-xl font-bold text-white group-hover:text-[#6fc7d9] transition-colors">
                                    Bébé Garçon
                                </h3>
                            </Link>

                            <Link
                                to="/products?recipient=bebe-fille"
                                className="bg-white/10 backdrop-blur-md border-2 border-white/20 rounded-2xl p-6 hover:bg-white/20 hover:border-[#6fc7d9] hover:scale-105 transition-all duration-300 cursor-pointer group w-40 sm:w-48 text-center"
                            >
                                <div className="text-6xl mb-4">
                                    <i className="fa-solid fa-baby text-white"></i>
                                </div>
                                <h3 className="text-xl font-bold text-white group-hover:text-[#6fc7d9] transition-colors">
                                    Bébé fille
                                </h3>
                            </Link>
                        </div>
                    </div>
                </section>
                {/* Bottom Carousel Section */}
                <section className="py-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="relative h-96 rounded-3xl overflow-hidden shadow-2xl">
                            {carouselImages.map((image, index) => (
                                <div
                                    key={index}
                                    className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'
                                        }`}
                                >
                                    <img
                                        src={image.url}
                                        alt={image.title}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                        <div className="text-center text-white px-6">
                                            <h3 className="text-5xl font-bold mb-4">{image.title}</h3>
                                            <p className="text-2xl">{image.description}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            <button
                                onClick={prevSlide}
                                className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/50 transition-all duration-300 hover:scale-110"
                            >
                                <ChevronLeft className="h-6 w-6 text-white" />
                            </button>
                            <button
                                onClick={nextSlide}
                                className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/50 transition-all duration-300 hover:scale-110"
                            >
                                <ChevronRight className="h-6 w-6 text-white" />
                            </button>

                            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-3">
                                {carouselImages.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentSlide(index)}
                                        className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentSlide
                                            ? 'bg-white w-8'
                                            : 'bg-white/50 hover:bg-white/75'
                                            }`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </section>


                {/* Featured Products */}
                <section className="py-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-4xl font-bold text-white mb-4">
                                Produits Vedettes
                            </h2>
                            <p className="text-lg text-white/90">
                                Découvrez nos coups de cœur du moment
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {featuredProducts.map((product) => (
                                <div key={product.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl hover:scale-105 transition-all duration-300">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-full h-48 object-cover"
                                    />
                                    <div className="p-5">
                                        <h3 className="font-bold text-lg mb-2 text-gray-800">{product.name}</h3>
                                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
                                        <div className="flex items-center mb-3">
                                            <div className="flex text-yellow-400">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'fill-current' : ''}`}
                                                    />
                                                ))}
                                            </div>
                                            <span className="text-sm text-gray-600 ml-2">({product.rating})</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                                                {product.price}€
                                            </span>
                                            <button className="bg-gradient-to-r from-cyan-400 to-purple-500 text-white px-5 py-2 rounded-lg text-sm font-medium hover:shadow-lg hover:scale-105 transition-all duration-300">
                                                Voir
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="text-center mt-10">
                            <button className="bg-gradient-to-r from-cyan-400 to-purple-500 text-white px-10 py-4 rounded-full font-semibold hover:shadow-xl hover:scale-105 transition-all duration-300 inline-flex items-center space-x-2">
                                <span>Voir Tous les Produits</span>
                                <ArrowRight className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </section>



            </div>
        </div>
    );
};

export default HomePage;