import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, Package, TrendingUp, Users, DollarSign, Store } from 'lucide-react';
import { products, suppliers } from '../data/products';

const SupplierDashboard = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [supplierId, setSupplierId] = useState(1); // Simuler un fournisseur connecté
    const [newProduct, setNewProduct] = useState({
        name: '',
        category: '',
        price: '',
        description: '',
        stock: '',
        image: ''
    });

    // Simuler les produits du fournisseur
    const supplierProducts = products.filter(p => p.supplier === suppliers[supplierId - 1]?.name);

    // Simuler les statistiques
    const stats = {
        totalProducts: supplierProducts.length,
        totalSales: 1250,
        totalRevenue: 15680.50,
        lowStock: supplierProducts.filter(p => p.stock < 10).length
    };

    const handleLogin = (e) => {
        e.preventDefault();
        setIsLoggedIn(true);
    };

    const handleAddProduct = (e) => {
        e.preventDefault();
        alert('Produit ajouté avec succès !');
        setNewProduct({
            name: '',
            category: '',
            price: '',
            description: '',
            stock: '',
            image: ''
        });
    };

    const handleDeleteProduct = (productId) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
            alert('Produit supprimé !');
        }
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
                            <div className="w-24 h-24 mx-auto mb-6 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center">
                                <Store className="h-14 w-14 text-white" />
                            </div>
                            <h1 className="text-5xl font-bold mb-4">Espace Fournisseur</h1>
                            <div className="h-1 w-32 bg-white mx-auto rounded-full"></div>
                        </div>
                        <p className="text-xl mb-6 max-w-md leading-relaxed">
                            Gérez vos produits et développez votre activité sur CadeauBox
                        </p>
                        <div className="grid grid-cols-2 gap-6 mt-8">
                            <div className="bg-white/20 backdrop-blur-md rounded-xl p-6">
                                <Package className="h-10 w-10 mx-auto mb-3" />
                                <p className="text-sm font-semibold">Gestion Produits</p>
                            </div>
                            <div className="bg-white/20 backdrop-blur-md rounded-xl p-6">
                                <TrendingUp className="h-10 w-10 mx-auto mb-3" />
                                <p className="text-sm font-semibold">Statistiques Ventes</p>
                            </div>
                            <div className="bg-white/20 backdrop-blur-md rounded-xl p-6">
                                <DollarSign className="h-10 w-10 mx-auto mb-3" />
                                <p className="text-sm font-semibold">Suivi Revenus</p>
                            </div>
                            <div className="bg-white/20 backdrop-blur-md rounded-xl p-6">
                                <Users className="h-10 w-10 mx-auto mb-3" />
                                <p className="text-sm font-semibold">Support Client</p>
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
                                    <Store className="h-10 w-10 text-white" />
                                </div>
                                <h2 className="text-3xl font-bold bg-gradient-to-r from-[#6fc7d9] to-[#a7549b] bg-clip-text text-transparent">
                                    Connexion Fournisseur
                                </h2>
                                <p className="text-gray-600 mt-2">Accédez à votre tableau de bord</p>
                            </div>

                            <form onSubmit={handleLogin} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        required
                                        className="w-full px-4 py-3 border-2 border-[#6fc7d9]/30 rounded-xl focus:ring-2 focus:ring-[#a7549b] focus:border-[#a7549b] transition-all"
                                        placeholder="votre@email.com"
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

                            <div className="mt-6 text-center">
                                <p className="text-sm text-gray-600">
                                    Pas encore de compte fournisseur ?{' '}
                                    <Link to="/supplier/register" className="text-[#a7549b] hover:text-[#6fc7d9] font-semibold">
                                        S'inscrire
                                    </Link>
                                </p>
                            </div>

                            <div className="mt-6 p-4 bg-gradient-to-r from-[#6fc7d9]/10 to-[#a7549b]/10 rounded-xl">
                                <p className="text-xs text-gray-600 text-center">
                                    🔒 Connexion sécurisée - Espace réservé aux fournisseurs
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
                                Tableau de Bord Fournisseur
                            </h1>
                            <p className="text-base sm:text-lg text-gray-600 mt-1">
                                Bienvenue,{" "}
                                <span className="font-semibold">
                                    {suppliers[supplierId - 1]?.name}
                                </span>
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
                                <TrendingUp className="h-7 w-7 text-white" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-semibold text-gray-600">Ventes</p>
                                <p className="text-3xl font-bold bg-gradient-to-r from-green-500 to-green-700 bg-clip-text text-transparent">
                                    {stats.totalSales}
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

                    <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl p-6 border border-white/50 hover:scale-105 transition-all duration-300">
                        <div className="flex items-center">
                            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center">
                                <Users className="h-7 w-7 text-white" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-semibold text-gray-600">Stock Faible</p>
                                <p className="text-3xl font-bold bg-gradient-to-r from-red-500 to-red-700 bg-clip-text text-transparent">
                                    {stats.lowStock}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Add Product Form */}
                    <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl p-6 border border-white/50">
                        <h2 className="text-xl font-bold mb-6 flex items-center">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#6fc7d9] to-[#a7549b] flex items-center justify-center mr-3">
                                <Plus className="h-5 w-5 text-white" />
                            </div>
                            <span className="bg-gradient-to-r from-[#6fc7d9] to-[#a7549b] bg-clip-text text-transparent">
                                Ajouter un Produit
                            </span>
                        </h2>

                        <form onSubmit={handleAddProduct} className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">
                                    Nom du produit
                                </label>
                                <input
                                    type="text"
                                    value={newProduct.name}
                                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                                    className="w-full px-4 py-2.5 border-2 border-[#6fc7d9]/30 rounded-xl focus:ring-2 focus:ring-[#a7549b] focus:border-[#a7549b] transition-all"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">
                                    Catégorie
                                </label>
                                <select
                                    value={newProduct.category}
                                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                                    className="w-full px-4 py-2.5 border-2 border-[#6fc7d9]/30 rounded-xl focus:ring-2 focus:ring-[#a7549b] focus:border-[#a7549b] transition-all bg-white"
                                    required
                                >
                                    <option value="">Choisir une catégorie</option>
                                    <option value="Fleurs">Fleurs</option>
                                    <option value="Gourmandises">Gourmandises</option>
                                    <option value="Accessoires">Accessoires</option>
                                    <option value="Beauté">Beauté</option>
                                    <option value="Culture">Culture</option>
                                    <option value="Décoration">Décoration</option>
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                                        Prix (€)
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={newProduct.price}
                                        onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                                        className="w-full px-4 py-2.5 border-2 border-[#6fc7d9]/30 rounded-xl focus:ring-2 focus:ring-[#a7549b] focus:border-[#a7549b] transition-all"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                                        Stock
                                    </label>
                                    <input
                                        type="number"
                                        value={newProduct.stock}
                                        onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                                        className="w-full px-4 py-2.5 border-2 border-[#6fc7d9]/30 rounded-xl focus:ring-2 focus:ring-[#a7549b] focus:border-[#a7549b] transition-all"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">
                                    Description
                                </label>
                                <textarea
                                    value={newProduct.description}
                                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                                    className="w-full px-4 py-2.5 border-2 border-[#6fc7d9]/30 rounded-xl focus:ring-2 focus:ring-[#a7549b] focus:border-[#a7549b] transition-all"
                                    rows="3"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">
                                    URL de l'image
                                </label>
                                <input
                                    type="url"
                                    value={newProduct.image}
                                    onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                                    className="w-full px-4 py-2.5 border-2 border-[#6fc7d9]/30 rounded-xl focus:ring-2 focus:ring-[#a7549b] focus:border-[#a7549b] transition-all"
                                    placeholder="https://example.com/image.jpg"
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-gradient-to-r from-[#6fc7d9] to-[#a7549b] text-white py-3 rounded-xl font-bold hover:shadow-xl hover:scale-105 transition-all duration-300"
                            >
                                Ajouter le Produit
                            </button>
                        </form>
                    </div>

                    {/* Products List */}
                    <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl p-6 border border-white/50">
                        <h2 className="text-xl font-bold mb-6 bg-gradient-to-r from-[#6fc7d9] to-[#a7549b] bg-clip-text text-transparent">
                            Mes Produits
                        </h2>

                        <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                            {supplierProducts.map((product) => (
                                <div key={product.id} className="flex items-center space-x-4 p-4 border-2 border-[#6fc7d9]/20 rounded-xl hover:border-[#a7549b]/40 hover:shadow-lg transition-all duration-300 bg-white/50">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-20 h-20 object-cover rounded-xl shadow-md"
                                    />
                                    <div className="flex-1">
                                        <h3 className="font-bold text-gray-800">{product.name}</h3>
                                        <p className="text-sm font-medium bg-gradient-to-r from-[#6fc7d9] to-[#a7549b] bg-clip-text text-transparent">
                                            {product.category}
                                        </p>
                                        <p className="font-bold bg-gradient-to-r from-[#6fc7d9] to-[#a7549b] bg-clip-text text-transparent">
                                            {product.price}€
                                        </p>
                                        <p className={`text-sm font-semibold ${product.stock < 10 ? 'text-red-600' : 'text-green-600'}`}>
                                            Stock: {product.stock}
                                        </p>
                                    </div>
                                    <div className="flex space-x-2">
                                        <button className="p-2.5 text-blue-500 hover:bg-blue-50 rounded-lg hover:scale-110 transition-all">
                                            <Edit className="h-5 w-5" />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteProduct(product.id)}
                                            className="p-2.5 text-red-500 hover:bg-red-50 rounded-lg hover:scale-110 transition-all"
                                        >
                                            <Trash2 className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SupplierDashboard;