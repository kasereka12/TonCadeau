import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, CreditCard, Truck, MapPin } from 'lucide-react';
import { useCart } from '../context/CartContext';

const CartPage = () => {
    const {
        items,
        giftMessage,
        deliveryInfo,
        updateQuantity,
        removeFromCart,
        clearCart,
        setGiftMessage,
        setDeliveryInfo,
        getTotalPrice
    } = useCart();

    const [isCheckingOut, setIsCheckingOut] = useState(false);

    const handleQuantityChange = (productId, newQuantity) => {
        if (newQuantity <= 0) {
            removeFromCart(productId);
        } else {
            updateQuantity(productId, newQuantity);
        }
    };

    const handleDeliveryInfoChange = (field, value) => {
        setDeliveryInfo({
            ...deliveryInfo,
            [field]: value
        });
    };

    const handleCheckout = () => {
        if (items.length === 0) {
            alert('Votre panier est vide !');
            return;
        }

        if (!deliveryInfo.recipientName || !deliveryInfo.deliveryAddress) {
            alert('Veuillez remplir les informations de livraison.');
            return;
        }

        setIsCheckingOut(true);

        // Simulation du processus de commande
        setTimeout(() => {
            alert('Commande passée avec succès ! Votre cadeau sera livré bientôt.');
            clearCart();
            setIsCheckingOut(false);
        }, 2000);
    };

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#6fc7d9]/10 via-white to-[#a7549b]/10 flex items-center justify-center">
                <div className="text-center bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-12 border border-white/50">
                    <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-[#6fc7d9] to-[#a7549b] rounded-full flex items-center justify-center">
                        <span className="text-6xl">🛒</span>
                    </div>
                    <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-[#6fc7d9] to-[#a7549b] bg-clip-text text-transparent">
                        Votre panier est vide
                    </h1>
                    <p className="text-gray-600 mb-8 text-lg">Découvrez nos produits et composez le cadeau parfait !</p>
                    <Link
                        to="/products"
                        className="inline-block bg-gradient-to-r from-[#6fc7d9] to-[#a7549b] text-white px-10 py-4 rounded-xl font-semibold hover:shadow-xl hover:scale-105 transition-all duration-300"
                    >
                        Voir les Produits
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#6fc7d9]/10 via-white to-[#a7549b]/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-[#6fc7d9] to-[#a7549b] bg-clip-text text-transparent">
                    Mon Panier
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2">
                        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl p-6 border border-white/50">
                            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Articles dans votre panier</h2>

                            <div className="space-y-4">
                                {items.map((item) => (
                                    <div key={item.id} className="flex items-center space-x-4 p-4 border-2 border-[#6fc7d9]/20 rounded-xl hover:border-[#a7549b]/40 hover:shadow-lg transition-all duration-300 bg-white/50">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-24 h-24 object-cover rounded-xl shadow-md"
                                        />
                                        <div className="flex-1">
                                            <h3 className="font-bold text-lg text-gray-800">{item.name}</h3>
                                            <p className="text-gray-600 text-sm">{item.description}</p>
                                            <p className="font-bold bg-gradient-to-r from-[#6fc7d9] to-[#a7549b] bg-clip-text text-transparent text-lg mt-1">
                                                {item.price}€
                                            </p>
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            <button
                                                onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                                className="w-10 h-10 rounded-full bg-gradient-to-br from-[#6fc7d9]/20 to-[#a7549b]/20 flex items-center justify-center hover:from-[#6fc7d9]/30 hover:to-[#a7549b]/30 hover:scale-110 transition-all duration-300"
                                            >
                                                <Minus className="h-4 w-4 text-[#a7549b]" />
                                            </button>
                                            <span className="w-10 text-center font-bold text-lg">{item.quantity}</span>
                                            <button
                                                onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                                className="w-10 h-10 rounded-full bg-gradient-to-br from-[#6fc7d9]/20 to-[#a7549b]/20 flex items-center justify-center hover:from-[#6fc7d9]/30 hover:to-[#a7549b]/30 hover:scale-110 transition-all duration-300"
                                            >
                                                <Plus className="h-4 w-4 text-[#a7549b]" />
                                            </button>
                                        </div>

                                        <div className="text-right">
                                            <p className="font-bold text-xl bg-gradient-to-r from-[#6fc7d9] to-[#a7549b] bg-clip-text text-transparent">
                                                {(item.price * item.quantity).toFixed(2)}€
                                            </p>
                                            <button
                                                onClick={() => removeFromCart(item.id)}
                                                className="text-red-500 hover:text-red-700 hover:scale-110 mt-2 transition-all duration-300"
                                            >
                                                <Trash2 className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-6 pt-6 border-t-2 border-[#6fc7d9]/20">
                                <button
                                    onClick={clearCart}
                                    className="text-red-500 hover:text-red-700 font-semibold hover:scale-105 transition-all duration-300"
                                >
                                    Vider le panier
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Checkout Form */}
                    <div className="lg:col-span-1">
                        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl p-6 sticky top-8 border border-white/50">
                            <h2 className="text-xl font-bold mb-6 flex items-center">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#6fc7d9] to-[#a7549b] flex items-center justify-center mr-3">
                                    <CreditCard className="h-5 w-5 text-white" />
                                </div>
                                <span className="bg-gradient-to-r from-[#6fc7d9] to-[#a7549b] bg-clip-text text-transparent">
                                    Finaliser la Commande
                                </span>
                            </h2>

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

                            {/* Delivery Information */}
                            <div className="mb-6">
                                <h3 className="text-lg font-bold mb-4 flex items-center">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#6fc7d9] to-[#a7549b] flex items-center justify-center mr-2">
                                        <Truck className="h-4 w-4 text-white" />
                                    </div>
                                    Informations de Livraison
                                </h3>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                                            Nom du destinataire *
                                        </label>
                                        <input
                                            type="text"
                                            value={deliveryInfo.recipientName}
                                            onChange={(e) => handleDeliveryInfoChange('recipientName', e.target.value)}
                                            className="w-full px-4 py-2.5 border-2 border-[#6fc7d9]/30 rounded-xl focus:ring-2 focus:ring-[#a7549b] focus:border-[#a7549b] transition-all"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                                            Email du destinataire
                                        </label>
                                        <input
                                            type="email"
                                            value={deliveryInfo.recipientEmail}
                                            onChange={(e) => handleDeliveryInfoChange('recipientEmail', e.target.value)}
                                            className="w-full px-4 py-2.5 border-2 border-[#6fc7d9]/30 rounded-xl focus:ring-2 focus:ring-[#a7549b] focus:border-[#a7549b] transition-all"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                                            Adresse de livraison *
                                        </label>
                                        <textarea
                                            value={deliveryInfo.deliveryAddress}
                                            onChange={(e) => handleDeliveryInfoChange('deliveryAddress', e.target.value)}
                                            className="w-full px-4 py-2.5 border-2 border-[#6fc7d9]/30 rounded-xl focus:ring-2 focus:ring-[#a7549b] focus:border-[#a7549b] transition-all"
                                            rows="3"
                                            required
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                                Date de livraison
                                            </label>
                                            <input
                                                type="date"
                                                value={deliveryInfo.deliveryDate}
                                                onChange={(e) => handleDeliveryInfoChange('deliveryDate', e.target.value)}
                                                className="w-full px-3 py-2.5 border-2 border-[#6fc7d9]/30 rounded-xl focus:ring-2 focus:ring-[#a7549b] focus:border-[#a7549b] transition-all"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                                Heure
                                            </label>
                                            <select
                                                value={deliveryInfo.deliveryTime}
                                                onChange={(e) => handleDeliveryInfoChange('deliveryTime', e.target.value)}
                                                className="w-full px-3 py-2.5 border-2 border-[#6fc7d9]/30 rounded-xl focus:ring-2 focus:ring-[#a7549b] focus:border-[#a7549b] transition-all bg-white"
                                            >
                                                <option value="">Choisir</option>
                                                <option value="morning">Matin (9h-12h)</option>
                                                <option value="afternoon">Après-midi (14h-17h)</option>
                                                <option value="evening">Soirée (17h-20h)</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Order Summary */}
                            <div className="border-t-2 border-[#6fc7d9]/20 pt-6 mb-6">
                                <div className="space-y-3">
                                    <div className="flex justify-between text-gray-700">
                                        <span className="font-medium">Sous-total:</span>
                                        <span className="font-semibold">{getTotalPrice().toFixed(2)}€</span>
                                    </div>
                                    <div className="flex justify-between text-gray-700">
                                        <span className="font-medium">Livraison:</span>
                                        <span className="font-semibold text-green-600">Gratuite</span>
                                    </div>
                                    <div className="flex justify-between text-xl font-bold border-t-2 border-[#6fc7d9]/30 pt-3">
                                        <span>Total:</span>
                                        <span className="bg-gradient-to-r from-[#6fc7d9] to-[#a7549b] bg-clip-text text-transparent">
                                            {getTotalPrice().toFixed(2)}€
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Checkout Button */}
                            <button
                                onClick={handleCheckout}
                                disabled={isCheckingOut}
                                className="w-full bg-gradient-to-r from-[#6fc7d9] to-[#a7549b] text-white py-4 rounded-xl font-bold hover:shadow-xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center space-x-2"
                            >
                                {isCheckingOut ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                        <span>Traitement...</span>
                                    </>
                                ) : (
                                    <>
                                        <CreditCard className="h-5 w-5" />
                                        <span>Passer la Commande</span>
                                    </>
                                )}
                            </button>

                            <div className="mt-4 p-3 bg-gradient-to-r from-[#6fc7d9]/10 to-[#a7549b]/10 rounded-xl">
                                <p className="text-xs text-gray-600 text-center font-medium">
                                    🔒 Paiement sécurisé - 🚚 Livraison gratuite
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPage;