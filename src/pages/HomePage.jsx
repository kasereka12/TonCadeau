import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Truck, Shield, Heart, User } from 'lucide-react';
import { Filter, Search, ChevronLeft, ChevronRight } from 'lucide-react';

import { products } from '../data/products';
import man from '../../public/homme.jpg';
import women from '../../public/jeunefille.jpg';

import '@fortawesome/fontawesome-free/css/all.min.css';

const HomePage = () => {
    const featuredProducts = products.slice(0, 4);
    const [currentSlide, setCurrentSlide] = useState(0);

    // Images du carousel
    const carouselImages = [
        {
            url: '/homme.jpg',
            title: 'Cadeaux Personnalisés',
            description: 'Créez des moments inoubliables'
        },
        {
            url: '/homme.jpg',
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
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);
    };
    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="bannier from-pink-500 to-purple-600 text-white bg-gradient-to-r">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-6xl font-bold mb-8 text-white">
                            Créez des Moments Inoubliables
                        </h1>

                        {/* Barre de recherche */}
                        <div className="flex justify-center">
                            <div className="relative w-full max-w-2xl">
                                <input
                                    type="text"
                                    placeholder=" Recherchez un cadeau, une occasion ou une personne..."
                                    className="w-full bg-white px-6 py-4 text-gray-900 rounded-full shadow-lg focus:outline-none focus:ring-4 focus:ring-pink-300 text-lg placeholder-gray-500"
                                />
                                <button
                                    className="absolute right-2 top-2 bg-gradient-to-r from-[#6fc7d9] to-[#a7549b] text-white px-6 py-2 rounded-full font-semibold hover:scale-105 transition-transform duration-200"
                                >
                                    Rechercher
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>


            <div className='main-section'>
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


                {/* Features Section */}
                <section className="py-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-white mb-4">
                                Pourquoi Choisir CadeauBox ?
                            </h2>
                            <p className="text-lg text-white/90">
                                Une expérience unique pour offrir des cadeaux qui marquent les esprits
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="text-center bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 hover:bg-white/20 transition-all duration-300">
                                <div className="bg-gradient-to-br from-[#6fc7d9] to-[#a7549b] w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                                    <Heart className="h-10 w-10 text-white" />
                                </div>
                                <h3 className="text-xl font-semibold mb-3 text-white">Personnalisation</h3>
                                <p className="text-white/90 leading-relaxed">
                                    Composez des cadeaux uniques en sélectionnant les produits qui correspondent parfaitement à votre destinataire.
                                </p>
                            </div>

                            <div className="text-center bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 hover:bg-white/20 transition-all duration-300">
                                <div className="bg-gradient-to-br from-[#6fc7d9] to-[#a7549b] w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                                    <Truck className="h-10 w-10 text-white" />
                                </div>
                                <h3 className="text-xl font-semibold mb-3 text-white">Livraison Rapide</h3>
                                <p className="text-white/90 leading-relaxed">
                                    Livraison express disponible pour que votre cadeau arrive au bon moment, même en dernière minute.
                                </p>
                            </div>

                            <div className="text-center bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 hover:bg-white/20 transition-all duration-300">
                                <div className="bg-gradient-to-br from-[#6fc7d9] to-[#a7549b] w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                                    <Shield className="h-10 w-10 text-white" />
                                </div>
                                <h3 className="text-xl font-semibold mb-3 text-white">Qualité Garantie</h3>
                                <p className="text-white/90 leading-relaxed">
                                    Tous nos produits sont sélectionnés avec soin par nos partenaires fournisseurs de confiance.
                                </p>
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
                                <div key={product.id} className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl hover:scale-105 transition-all duration-300 border border-white/30">
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
                                            <span className="text-2xl font-bold bg-gradient-to-r from-[#6fc7d9] to-[#a7549b] bg-clip-text text-transparent">
                                                {product.price}€
                                            </span>
                                            <Link
                                                to={`/products/${product.id}`}
                                                className="bg-gradient-to-r from-[#6fc7d9] to-[#a7549b] text-white px-5 py-2 rounded-lg text-sm font-medium hover:shadow-lg hover:scale-105 transition-all duration-300"
                                            >
                                                Voir
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="text-center mt-10">
                            <Link
                                to="/products"
                                className="bg-gradient-to-r from-[#6fc7d9] to-[#a7549b] text-white px-10 py-4 rounded-full font-semibold hover:shadow-xl hover:scale-105 transition-all duration-300 inline-flex items-center space-x-2"
                            >
                                <span>Voir Tous les Produits</span>
                                <ArrowRight className="h-5 w-5" />
                            </Link>
                        </div>
                    </div>
                </section>
                {/* Carousel Section */}
                <section className="py-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="relative h-96 rounded-3xl overflow-hidden shadow-2xl">
                            {/* Images */}
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
                                    <div className="absolute inset-0  flex items-center justify-center">
                                        <div className="text-center text-white px-6">
                                            <h3 className="text-5xl font-bold mb-4">{image.title}</h3>
                                            <p className="text-2xl">{image.description}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* Navigation Buttons */}
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

                            {/* Indicators */}
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


                {/* CTA Section */}
                <section className="bg-gradient-to-r from-[#6fc7d9] to-[#a7549b] text-white py-20">
                    <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
                        <h2 className="text-4xl font-bold mb-4">
                            Prêt à Créer un Cadeau Unique ?
                        </h2>
                        <p className="text-xl mb-8 text-white/90">
                            Commencez dès maintenant à composer le cadeau parfait
                        </p>
                        <Link
                            to="/compose-gift"
                            className="bg-white text-[#a7549b] px-10 py-4 rounded-full font-bold hover:bg-white/90 hover:scale-105 transition-all duration-300 inline-flex items-center space-x-2 shadow-xl"
                        >
                            <span>Composer Maintenant</span>
                            <ArrowRight className="h-5 w-5" />
                        </Link>
                    </div>
                </section>
            </div>

        </div>
    );
};

export default HomePage;