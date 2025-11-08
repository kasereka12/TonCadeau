import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, User, Gift } from 'lucide-react';
import { useCart } from '../context/CartContext';
import logo from '../../public/logo.png';

const Header = () => {
    const { getTotalItems } = useCart();
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 100);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header
            className={`shadow-md sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'backdrop-blur-md' : ''
                }`}
            style={{
                background: isScrolled
                    ? 'rgba(255, 255, 255, 0.01)'
                    : 'linear-gradient(135deg, #a7549b 40%, #6fc7d9 100%)',
                backgroundImage: isScrolled
                    ? 'none'
                    : 'linear-gradient(135deg, #aa5a9eff 40%, #6fc7d9 100%)'
            }}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2">
                        <img src={logo} alt="TonCadeau.fr Logo" className="h-30 w-25" />
                        <span className={`m-0 text-2xl font-bold transition-colors duration-300 ${isScrolled ? 'text-white' : 'text-white'
                            }`}>TonCadeau.fr</span>
                    </Link>

                    {/* Navigation */}
                    <nav className="hidden md:flex space-x-8">

                    </nav>

                    {/* Actions */}
                    <div className="flex items-center space-x-4">
                        <Link
                            to="/"
                            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 ${isScrolled
                                ? 'text-white hover:text-[#6fc7d9]'
                                : 'text-white hover:text-[#6fc7d9]'
                                }`}
                        >
                            Accueil
                        </Link>
                        <Link
                            to="/admin"
                            className={`flex items-center space-x-1 transition-colors duration-300 ${isScrolled
                                ? 'text-white hover:text-[#6fc7d9]'
                                : 'text-white hover:text-[#6fc7d9]'
                                }`}
                        >
                            <User className="h-5 w-5" />
                            <span className="hidden sm:inline text-sm font-medium">Se connecter</span>
                        </Link>

                        <Link
                            to="/cart"
                            className={`relative flex items-center space-x-1 transition-colors duration-300 ${isScrolled
                                ? 'text-white hover:text-[#6fc7d9]'
                                : 'text-white hover:text-[#6fc7d9]'
                                }`}
                        >
                            <ShoppingCart className="h-5 w-5" />
                            <span className="hidden sm:inline text-sm font-medium">Panier</span>
                            {getTotalItems() > 0 && (
                                <span className="absolute -top-2 -right-2 bg-gradient-to-r from-[#6fc7d9] to-[#a7549b] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center shadow-lg">
                                    {getTotalItems()}
                                </span>
                            )}
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;