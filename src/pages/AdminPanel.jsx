import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Package, TrendingUp, DollarSign, Settings, Eye, Edit, Trash2 } from 'lucide-react';
import { products, suppliers } from '../data/products';

const AdminPanel = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [activeTab, setActiveTab] = useState('dashboard');

    // Simuler les statistiques
    const stats = {
        totalProducts: products.length,
        totalSuppliers: suppliers.length,
        totalOrders: 1250,
        totalRevenue: 45680.50
    };

    const handleLogin = (e) => {
        e.preventDefault();
        setIsLoggedIn(true);
    };

    if (!isLoggedIn) {
        return (
            <div className="min-h-screen flex">
                {/* Colonne Gauche - Image & Branding */}
                <div
                    className="hidden lg:flex lg:w-1/2 bg-cover bg-center relative"
                    style={{ backgroundImage: "url('../public/bannier4.jpg')" }}
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-[#6fc7d9]/90 to-[#a7549b]/90"></div>
                    <div className="relative z-10 flex flex-col justify-center items-center text-center px-12 text-white">
                        <div className="mb-8">
                            <h1 className="text-5xl font-bold mb-4">CadeauBox</h1>
                            <div className="h-1 w-32 bg-white mx-auto rounded-full"></div>
                        </div>
                        <p className="text-xl mb-6 max-w-md leading-relaxed">
                            Plateforme de gestion des cadeaux personnalisés
                        </p>
                        <div className="grid grid-cols-2 gap-6 mt-8">
                            <div className="bg-white/20 backdrop-blur-md rounded-xl p-6">
                                <Package className="h-10 w-10 mx-auto mb-3" />
                                <p className="text-sm font-semibold">Gestion des Produits</p>
                            </div>
                            <div className="bg-white/20 backdrop-blur-md rounded-xl p-6">
                                <Users className="h-10 w-10 mx-auto mb-3" />
                                <p className="text-sm font-semibold">Gestion des Fournisseurs</p>
                            </div>
                            <div className="bg-white/20 backdrop-blur-md rounded-xl p-6">
                                <TrendingUp className="h-10 w-10 mx-auto mb-3" />
                                <p className="text-sm font-semibold">Statistiques Avancées</p>
                            </div>
                            <div className="bg-white/20 backdrop-blur-md rounded-xl p-6">
                                <Settings className="h-10 w-10 mx-auto mb-3" />
                                <p className="text-sm font-semibold">Paramètres Complets</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Colonne Droite - Formulaire de Connexion */}
                <div className="w-full lg:w-1/2 flex items-center justify-center bg-gradient-to-br from-[#6fc7d9]/5 to-[#a7549b]/5 px-8">
                    <div className="w-full max-w-md">
                        <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl p-10 border border-white/50">
                            <div className="text-center mb-8">
                                <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-[#6fc7d9] to-[#a7549b] rounded-full flex items-center justify-center">
                                    <Settings className="h-10 w-10 text-white" />
                                </div>
                                <h2 className="text-3xl font-bold bg-gradient-to-r from-[#6fc7d9] to-[#a7549b] bg-clip-text text-transparent">
                                    Connexion Admin
                                </h2>
                                <p className="text-gray-600 mt-2">Accédez au panneau d'administration</p>
                            </div>

                            <form onSubmit={handleLogin} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Email Administrateur
                                    </label>
                                    <input
                                        type="email"
                                        required
                                        className="w-full px-4 py-3 border-2 border-[#6fc7d9]/30 rounded-xl focus:ring-2 focus:ring-[#a7549b] focus:border-[#a7549b] transition-all"
                                        placeholder="admin@cadeaubox.fr"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Mot de passe
                                    </label>
                                    <input
                                        type="password"
                                        required
                                        className="w-full px-4 py-3 border-2 border-[#6fc7d9]/30 rounded-xl focus:ring-2 focus:ring-[#a7549b] focus:border-[#a7549b] transition-all"
                                        placeholder="••••••••"
                                    />
                                </div>

                                <div className="flex items-center justify-between text-sm">
                                    <label className="flex items-center">
                                        <input type="checkbox" className="mr-2 rounded border-[#6fc7d9]" />
                                        <span className="text-gray-600">Se souvenir de moi</span>
                                    </label>
                                    <a href="#" className="text-[#a7549b] hover:text-[#6fc7d9] font-medium">
                                        Mot de passe oublié ?
                                    </a>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-gradient-to-r from-[#6fc7d9] to-[#a7549b] text-white py-4 rounded-xl font-bold hover:shadow-xl hover:scale-105 transition-all duration-300"
                                >
                                    Se connecter
                                </button>
                            </form>

                            <div className="mt-6 p-4 bg-gradient-to-r from-[#6fc7d9]/10 to-[#a7549b]/10 rounded-xl">
                                <p className="text-xs text-gray-600 text-center">
                                    🔒 Connexion sécurisée - Accès réservé aux administrateurs
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#6fc7d9]/10 via-white to-[#a7549b]/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex flex-col sm:flex-row justify-between items-center text-center sm:text-left bg-white/95 backdrop-blur-md rounded-2xl shadow-xl p-6 border border-white/50 gap-4 sm:gap-0">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-[#6fc7d9] to-[#a7549b] bg-clip-text text-transparent">
                                Panneau Administrateur
                            </h1>
                            <p className="text-base sm:text-lg text-gray-600 mt-1">
                                Gestion de la plateforme CadeauBox
                            </p>
                        </div>

                        <button
                            onClick={() => setIsLoggedIn(false)}
                            className="bg-gradient-to-r from-red-500 to-red-600 text-white px-5 sm:px-6 py-2.5 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 w-full sm:w-auto"
                        >
                            Déconnexion
                        </button>
                    </div>

                </div>

                {/* Navigation Tabs */}
                <div className="mb-8">
                    <nav className="flex flex-wrap justify-center md:justify-start gap-2 md:space-x-4 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl p-3 border border-white/50">
                        {[
                            { id: 'dashboard', name: 'Tableau de Bord', icon: TrendingUp },
                            { id: 'products', name: 'Produits', icon: Package },
                            { id: 'suppliers', name: 'Fournisseurs', icon: Users },
                            { id: 'settings', name: 'Paramètres', icon: Settings }
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center justify-center space-x-2 px-4 py-2 rounded-xl font-semibold transition-all duration-300 w-full sm:w-auto ${activeTab === tab.id
                                    ? 'bg-gradient-to-r from-[#6fc7d9] to-[#a7549b] text-white shadow-lg scale-105'
                                    : 'text-gray-700 hover:bg-gradient-to-r hover:from-[#6fc7d9]/10 hover:to-[#a7549b]/10'
                                    }`}
                            >
                                <tab.icon className="h-5 w-5" />
                                <span className="text-sm sm:text-base">{tab.name}</span>
                            </button>
                        ))}
                    </nav>

                </div>

                {/* Dashboard Tab */}
                {activeTab === 'dashboard' && (
                    <div>
                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                            <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl p-6 border border-white/50 hover:scale-105 transition-all duration-300">
                                <div className="flex items-center">
                                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                                        <Package className="h-7 w-7 text-white" />
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-semibold text-gray-600">Produits</p>
                                        <p className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent">
                                            {stats.totalProducts}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl p-6 border border-white/50 hover:scale-105 transition-all duration-300">
                                <div className="flex items-center">
                                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                                        <Users className="h-7 w-7 text-white" />
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-semibold text-gray-600">Fournisseurs</p>
                                        <p className="text-3xl font-bold bg-gradient-to-r from-green-500 to-green-700 bg-clip-text text-transparent">
                                            {stats.totalSuppliers}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl p-6 border border-white/50 hover:scale-105 transition-all duration-300">
                                <div className="flex items-center">
                                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center">
                                        <TrendingUp className="h-7 w-7 text-white" />
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-semibold text-gray-600">Commandes</p>
                                        <p className="text-3xl font-bold bg-gradient-to-r from-yellow-500 to-yellow-700 bg-clip-text text-transparent">
                                            {stats.totalOrders}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl p-6 border border-white/50 hover:scale-105 transition-all duration-300">
                                <div className="flex items-center">
                                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#6fc7d9] to-[#a7549b] flex items-center justify-center">
                                        <DollarSign className="h-7 w-7 text-white" />
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-semibold text-gray-600">Chiffre d'affaires</p>
                                        <p className="text-2xl font-bold bg-gradient-to-r from-[#6fc7d9] to-[#a7549b] bg-clip-text text-transparent">
                                            {stats.totalRevenue.toFixed(2)}€
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl p-6 border border-white/50">
                            <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-[#6fc7d9] to-[#a7549b] bg-clip-text text-transparent">
                                Activité Récente
                            </h2>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-[#6fc7d9]/10 to-[#a7549b]/10 rounded-xl border border-[#6fc7d9]/20 hover:border-[#a7549b]/40 transition-all">
                                    <div>
                                        <p className="font-semibold text-gray-800">Nouvelle commande #1234</p>
                                        <p className="text-sm text-gray-600">Bouquet de roses - 45.99€</p>
                                    </div>
                                    <span className="text-sm text-gray-500 font-medium">Il y a 2 heures</span>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-[#6fc7d9]/10 to-[#a7549b]/10 rounded-xl border border-[#6fc7d9]/20 hover:border-[#a7549b]/40 transition-all">
                                    <div>
                                        <p className="font-semibold text-gray-800">Nouveau fournisseur inscrit</p>
                                        <p className="text-sm text-gray-600">Fleurs & Co</p>
                                    </div>
                                    <span className="text-sm text-gray-500 font-medium">Il y a 4 heures</span>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-[#6fc7d9]/10 to-[#a7549b]/10 rounded-xl border border-[#6fc7d9]/20 hover:border-[#a7549b]/40 transition-all">
                                    <div>
                                        <p className="font-semibold text-gray-800">Produit ajouté</p>
                                        <p className="text-sm text-gray-600">Chocolats Artisanaux</p>
                                    </div>
                                    <span className="text-sm text-gray-500 font-medium">Il y a 6 heures</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Products Tab */}
                {activeTab === 'products' && (
                    <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl p-6 border border-white/50">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold bg-gradient-to-r from-[#6fc7d9] to-[#a7549b] bg-clip-text text-transparent">
                                Gestion des Produits
                            </h2>
                            <button className="bg-gradient-to-r from-[#6fc7d9] to-[#a7549b] text-white px-6 py-3 rounded-xl font-semibold hover:shadow-xl hover:scale-105 transition-all duration-300">
                                Ajouter un Produit
                            </button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b-2 border-[#6fc7d9]/20">
                                        <th className="text-left py-4 px-4 font-bold text-gray-700">Produit</th>
                                        <th className="text-left py-4 px-4 font-bold text-gray-700">Catégorie</th>
                                        <th className="text-left py-4 px-4 font-bold text-gray-700">Prix</th>
                                        <th className="text-left py-4 px-4 font-bold text-gray-700">Stock</th>
                                        <th className="text-left py-4 px-4 font-bold text-gray-700">Fournisseur</th>
                                        <th className="text-left py-4 px-4 font-bold text-gray-700">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map((product) => (
                                        <tr key={product.id} className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-[#6fc7d9]/5 hover:to-[#a7549b]/5 transition-all">
                                            <td className="py-4 px-4">
                                                <div className="flex items-center space-x-3">
                                                    <img
                                                        src={product.image}
                                                        alt={product.name}
                                                        className="w-14 h-14 object-cover rounded-lg shadow-md"
                                                    />
                                                    <div>
                                                        <p className="font-semibold text-gray-800">{product.name}</p>
                                                        <p className="text-sm text-gray-600">{product.description}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-4">
                                                <span className="bg-gradient-to-r from-[#6fc7d9] to-[#a7549b] text-white text-xs px-3 py-1 rounded-full font-medium">
                                                    {product.category}
                                                </span>
                                            </td>
                                            <td className="py-4 px-4 font-bold bg-gradient-to-r from-[#6fc7d9] to-[#a7549b] bg-clip-text text-transparent">
                                                {product.price}€
                                            </td>
                                            <td className="py-4 px-4">
                                                <span className={`font-semibold ${product.stock < 10 ? 'text-red-600' : 'text-green-600'}`}>
                                                    {product.stock}
                                                </span>
                                            </td>
                                            <td className="py-4 px-4 text-gray-700">{product.supplier}</td>
                                            <td className="py-4 px-4">
                                                <div className="flex space-x-2">
                                                    <button className="text-blue-500 hover:text-blue-700 hover:scale-125 transition-all">
                                                        <Eye className="h-5 w-5" />
                                                    </button>
                                                    <button className="text-green-500 hover:text-green-700 hover:scale-125 transition-all">
                                                        <Edit className="h-5 w-5" />
                                                    </button>
                                                    <button className="text-red-500 hover:text-red-700 hover:scale-125 transition-all">
                                                        <Trash2 className="h-5 w-5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Suppliers Tab */}
                {activeTab === 'suppliers' && (
                    <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl p-6 border border-white/50">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold bg-gradient-to-r from-[#6fc7d9] to-[#a7549b] bg-clip-text text-transparent">
                                Gestion des Fournisseurs
                            </h2>
                            <button className="bg-gradient-to-r from-[#6fc7d9] to-[#a7549b] text-white px-6 py-3 rounded-xl font-semibold hover:shadow-xl hover:scale-105 transition-all duration-300">
                                Ajouter un Fournisseur
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {suppliers.map((supplier) => (
                                <div key={supplier.id} className="border-2 border-[#6fc7d9]/20 rounded-xl p-5 hover:border-[#a7549b]/40 hover:shadow-xl transition-all duration-300 bg-white/50">
                                    <h3 className="font-bold text-lg mb-2 text-gray-800">{supplier.name}</h3>
                                    <p className="text-gray-600 text-sm mb-4">{supplier.email}</p>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-semibold bg-gradient-to-r from-[#6fc7d9] to-[#a7549b] bg-clip-text text-transparent">
                                            {products.filter(p => p.supplier === supplier.name).length} produits
                                        </span>
                                        <div className="flex space-x-2">
                                            <button className="text-blue-500 hover:text-blue-700 hover:scale-125 transition-all">
                                                <Eye className="h-5 w-5" />
                                            </button>
                                            <button className="text-green-500 hover:text-green-700 hover:scale-125 transition-all">
                                                <Edit className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Settings Tab */}
                {activeTab === 'settings' && (
                    <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl p-6 border border-white/50">
                        <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-[#6fc7d9] to-[#a7549b] bg-clip-text text-transparent">
                            Paramètres de la Plateforme
                        </h2>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Nom de la plateforme
                                </label>
                                <input
                                    type="text"
                                    defaultValue="CadeauBox"
                                    className="w-full px-4 py-3 border-2 border-[#6fc7d9]/30 rounded-xl focus:ring-2 focus:ring-[#a7549b] focus:border-[#a7549b] transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Email de contact
                                </label>
                                <input
                                    type="email"
                                    defaultValue="contact@cadeaubox.fr"
                                    className="w-full px-4 py-3 border-2 border-[#6fc7d9]/30 rounded-xl focus:ring-2 focus:ring-[#a7549b] focus:border-[#a7549b] transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Frais de livraison (€)
                                </label>
                                <input
                                    type="number"
                                    defaultValue="0"
                                    className="w-full px-4 py-3 border-2 border-[#6fc7d9]/30 rounded-xl focus:ring-2 focus:ring-[#a7549b] focus:border-[#a7549b] transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Commission fournisseur (%)
                                </label>
                                <input
                                    type="number"
                                    defaultValue="10"
                                    className="w-full px-4 py-3 border-2 border-[#6fc7d9]/30 rounded-xl focus:ring-2 focus:ring-[#a7549b] focus:border-[#a7549b] transition-all"
                                />
                            </div>

                            <button className="bg-gradient-to-r from-[#6fc7d9] to-[#a7549b] text-white px-8 py-4 rounded-xl font-bold hover:shadow-xl hover:scale-105 transition-all duration-300">
                                Sauvegarder les Paramètres
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminPanel;