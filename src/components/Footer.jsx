import React from 'react';
import { Link } from 'react-router-dom';
import { Gift, Mail, Phone, MapPin } from 'lucide-react';
import logo from '../../public/logo.png';


const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Logo et description */}
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center space-x-2 mb-4">
                            <img src={logo} alt="TonCadeau.fr Logo" className="h-30 w-25" />
                            <span className="text-2xl font-bold">TonCadeau.fr</span>
                        </div>
                        <p className="text-gray-300 mb-4 max-w-md">
                            La plateforme de référence pour composer et offrir des cadeaux personnalisés.
                            Découvrez notre sélection de produits de qualité et créez des moments inoubliables.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="text-gray-300 hover:text-pink-500 transition-colors">
                                Facebook
                            </a>
                            <a href="#" className="text-gray-300 hover:text-pink-500 transition-colors">
                                Instagram
                            </a>
                            <a href="#" className="text-gray-300 hover:text-pink-500 transition-colors">
                                Twitter
                            </a>
                        </div>
                    </div>

                    {/* Liens rapides */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Liens Rapides</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/" className="text-gray-300 hover:text-pink-500 transition-colors">
                                    Accueil
                                </Link>
                            </li>
                            <li>
                                <Link to="/products" className="text-gray-300 hover:text-pink-500 transition-colors">
                                    Produits
                                </Link>
                            </li>
                            <li>
                                <Link to="/compose-gift" className="text-gray-300 hover:text-pink-500 transition-colors">
                                    Composer un Cadeau
                                </Link>
                            </li>
                            <li>
                                <Link to="/supplier" className="text-gray-300 hover:text-pink-500 transition-colors">
                                    Devenir Fournisseur
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Contact</h3>
                        <div className="space-y-3">
                            <div className="flex items-center space-x-2">
                                <Mail className="h-4 w-4 text-pink-500" />
                                <span className="text-gray-300">contact@cadeaubox.fr</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Phone className="h-4 w-4 text-pink-500" />
                                <span className="text-gray-300">01 23 45 67 89</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <MapPin className="h-4 w-4 text-pink-500" />
                                <span className="text-gray-300">Casablanca, MAROC</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-700 mt-8 pt-8 text-center">
                    <p className="text-gray-300">
                        © 2025 TonCadeau.fr. Tous droits réservés.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
