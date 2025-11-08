import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Minus, ShoppingCart, Heart, Star } from 'lucide-react';
import { products, categories } from '../data/products';
import { useCart } from '../context/CartContext';

const ComposeGiftPage = () => {
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [giftMessage, setGiftMessage] = useState('');
    const [recipientName, setRecipientName] = useState('');
    const { addToCart } = useCart();

    const filteredProducts = products.filter(product =>
        selectedCategory === 'all' || product.category === selectedCategory
    );

    const addProductToGift = (product) => {
        const existingProduct = selectedProducts.find(p => p.id === product.id);
        if (existingProduct) {
            setSelectedProducts(selectedProducts.map(p =>
                p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p
            ));
        } else {
            setSelectedProducts([...selectedProducts, { ...product, quantity: 1 }]);
        }
    };

    const removeProductFromGift = (productId) => {
        setSelectedProducts(selectedProducts.filter(p => p.id !== productId));
    };

    const updateProductQuantity = (productId, quantity) => {
        if (quantity <= 0) {
            removeProductFromGift(productId);
        } else {
            setSelectedProducts(selectedProducts.map(p =>
                p.id === productId ? { ...p, quantity } : p
            ));
        }
    };

    const getTotalPrice = () => {
        return selectedProducts.reduce((total, product) => total + (product.price * product.quantity), 0);
    };

    const handleAddGiftToCart = () => {
        if (selectedProducts.length === 0) {
            alert('Veuillez sélectionner au moins un produit pour votre cadeau.');
            return;
        }

        // Ajouter chaque produit au panier
        selectedProducts.forEach(product => {
            for (let i = 0; i < product.quantity; i++) {
                addToCart(product);
            }
        });

        alert('Votre cadeau personnalisé a été ajouté au panier !');

        // Réinitialiser
        setSelectedProducts([]);
        setGiftMessage('');
        setRecipientName('');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#6fc7d9]/10 via-white to-[#a7549b]/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8 text-center">
                    <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-[#6fc7d9] to-[#a7549b] bg-clip-text text-transparent">
                        Composer un Cadeau
                    </h1>
                    <p className="text-lg text-gray-700">
                        Sélectionnez les produits qui composeront votre cadeau personnalisé
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Products Selection */}
                    <div className="lg:col-span-2">
                        {/* Category Filter */}
                        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl p-6 mb-6 border border-white/50">
                            <h2 className="text-xl font-bold mb-4 text-gray-800">Choisir une Catégorie</h2>
                            <div className="flex flex-wrap gap-3">
                                {categories.map(category => (
                                    <button
                                        key={category.id}
                                        onClick={() => setSelectedCategory(category.id)}
                                        className={`px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 ${selectedCategory === category.id
                                                ? 'bg-gradient-to-r from-[#6fc7d9] to-[#a7549b] text-white shadow-lg scale-105'
                                                : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 hover:from-[#6fc7d9]/20 hover:to-[#a7549b]/20 hover:scale-105'
                                            }`}
                                    >
                                        {category.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Products Grid */}
                        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl p-6 border border-white/50">
                            <h2 className="text-xl font-bold mb-4 text-gray-800">Produits Disponibles</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {filteredProducts.map((product) => (
                                    <div key={product.id} className="border-2 border-[#6fc7d9]/20 rounded-xl p-4 hover:border-[#a7549b]/40 hover:shadow-xl transition-all duration-300 bg-white/50">
                                        <div className="flex space-x-4">
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                className="w-24 h-24 object-cover rounded-xl shadow-md"
                                            />
                                            <div className="flex-1">
                                                <h3 className="font-bold text-base text-gray-800">{product.name}</h3>
                                                <p className="text-gray-600 text-xs mb-2 line-clamp-2">{product.description}</p>
                                                <div className="flex items-center mb-2">
                                                    <div className="flex text-yellow-400">
                                                        {[...Array(5)].map((_, i) => (
                                                            <Star
                                                                key={i}
                                                                className={`h-3 w-3 ${i < Math.floor(product.rating) ? 'fill-current' : ''}`}
                                                            />
                                                        ))}
                                                    </div>
                                                    <span className="text-xs text-gray-600 ml-1">({product.rating})</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-lg font-bold bg-gradient-to-r from-[#6fc7d9] to-[#a7549b] bg-clip-text text-transparent">
                                                        {product.price}€
                                                    </span>
                                                    <button
                                                        onClick={() => addProductToGift(product)}
                                                        className="bg-gradient-to-r from-[#6fc7d9] to-[#a7549b] text-white px-3 py-2 rounded-lg text-sm font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center space-x-1"
                                                    >
                                                        <Plus className="h-4 w-4" />
                                                        <span>Ajouter</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Gift Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl p-6 sticky top-8 border border-white/50">
                            <h2 className="text-xl font-bold mb-4 flex items-center">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#6fc7d9] to-[#a7549b] flex items-center justify-center mr-3">
                                    <Heart className="h-5 w-5 text-white" />
                                </div>
                                <span className="bg-gradient-to-r from-[#6fc7d9] to-[#a7549b] bg-clip-text text-transparent">
                                    Votre Cadeau
                                </span>
                            </h2>

                            {/* Selected Products */}
                            <div className="mb-6">
                                {selectedProducts.length === 0 ? (
                                    <div className="text-center py-8 bg-gradient-to-br from-[#6fc7d9]/10 to-[#a7549b]/10 rounded-xl">
                                        <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-[#6fc7d9] to-[#a7549b] rounded-full flex items-center justify-center">
                                            <Heart className="h-8 w-8 text-white" />
                                        </div>
                                        <p className="text-gray-600 font-medium">
                                            Aucun produit sélectionné
                                        </p>
                                        <p className="text-gray-500 text-sm mt-1">
                                            Commencez à composer votre cadeau
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {selectedProducts.map((product) => (
                                            <div key={product.id} className="flex items-center space-x-3 p-3 bg-gradient-to-br from-[#6fc7d9]/10 to-[#a7549b]/10 rounded-xl border border-[#6fc7d9]/20 hover:border-[#a7549b]/40 transition-all duration-300">
                                                <img
                                                    src={product.image}
                                                    alt={product.name}
                                                    className="w-14 h-14 object-cover rounded-lg shadow-md"
                                                />
                                                <div className="flex-1">
                                                    <h4 className="font-semibold text-sm text-gray-800">{product.name}</h4>
                                                    <p className="font-bold bg-gradient-to-r from-[#6fc7d9] to-[#a7549b] bg-clip-text text-transparent text-sm">
                                                        {product.price}€
                                                    </p>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <button
                                                        onClick={() => updateProductQuantity(product.id, product.quantity - 1)}
                                                        className="w-7 h-7 rounded-full bg-gradient-to-br from-[#6fc7d9]/30 to-[#a7549b]/30 flex items-center justify-center hover:from-[#6fc7d9]/50 hover:to-[#a7549b]/50 hover:scale-110 transition-all duration-300"
                                                    >
                                                        <Minus className="h-3 w-3 text-[#a7549b]" />
                                                    </button>
                                                    <span className="w-6 text-center text-sm font-bold">{product.quantity}</span>
                                                    <button
                                                        onClick={() => updateProductQuantity(product.id, product.quantity + 1)}
                                                        className="w-7 h-7 rounded-full bg-gradient-to-br from-[#6fc7d9]/30 to-[#a7549b]/30 flex items-center justify-center hover:from-[#6fc7d9]/50 hover:to-[#a7549b]/50 hover:scale-110 transition-all duration-300"
                                                    >
                                                        <Plus className="h-3 w-3 text-[#a7549b]" />
                                                    </button>
                                                </div>
                                                <button
                                                    onClick={() => removeProductFromGift(product.id)}
                                                    className="text-red-500 hover:text-red-700 hover:scale-125 transition-all duration-300 font-bold text-xl"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Gift Message */}
                            <div className="mb-6">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Message Cadeau
                                </label>
                                <textarea
                                    value={giftMessage}
                                    onChange={(e) => setGiftMessage(e.target.value)}
                                    placeholder="Écrivez un message personnalisé..."
                                    className="w-full px-4 py-3 border-2 border-[#6fc7d9]/30 rounded-xl focus:ring-2 focus:ring-[#a7549b] focus:border-[#a7549b] transition-all"
                                    rows="3"
                                />
                            </div>

                            {/* Recipient Name */}
                            <div className="mb-6">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Nom du Destinataire
                                </label>
                                <input
                                    type="text"
                                    value={recipientName}
                                    onChange={(e) => setRecipientName(e.target.value)}
                                    placeholder="Nom de la personne qui recevra le cadeau"
                                    className="w-full px-4 py-3 border-2 border-[#6fc7d9]/30 rounded-xl focus:ring-2 focus:ring-[#a7549b] focus:border-[#a7549b] transition-all"
                                />
                            </div>

                            {/* Total */}
                            <div className="border-t-2 border-[#6fc7d9]/20 pt-4 mb-6">
                                <div className="flex justify-between items-center">
                                    <span className="text-lg font-bold text-gray-800">Total:</span>
                                    <span className="text-3xl font-bold bg-gradient-to-r from-[#6fc7d9] to-[#a7549b] bg-clip-text text-transparent">
                                        {getTotalPrice().toFixed(2)}€
                                    </span>
                                </div>
                            </div>

                            {/* Add to Cart Button */}
                            <button
                                onClick={handleAddGiftToCart}
                                disabled={selectedProducts.length === 0}
                                className="w-full bg-gradient-to-r from-[#6fc7d9] to-[#a7549b] text-white py-4 rounded-xl font-bold hover:shadow-xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center space-x-2"
                            >
                                <ShoppingCart className="h-5 w-5" />
                                <span>Ajouter au Panier</span>
                            </button>

                            <div className="mt-4 p-3 bg-gradient-to-r from-[#6fc7d9]/10 to-[#a7549b]/10 rounded-xl">
                                <p className="text-xs text-gray-600 text-center font-medium">
                                    💝 Vous pourrez personnaliser la livraison lors du checkout
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ComposeGiftPage;