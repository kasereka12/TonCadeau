import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, CreditCard, Truck, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';

/* ═══════════════════════════════════════════════
   DESIGN TOKENS
   ═══════════════════════════════════════════════ */

const t = {
    bg: '#020617',
    card: 'linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.015))',
    border: '1px solid rgba(255,255,255,0.06)',
    borderHover: '1px solid rgba(255,255,255,0.12)',
    input: {
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.08)',
        color: '#ffffff',
    },
    text: '#ffffff',
    textSec: 'rgba(255,255,255,0.6)',
    textTer: 'rgba(255,255,255,0.4)',
    cyan: '#38c9df',
    gradient: 'linear-gradient(135deg, #38c9df, #8b5cf6)',
    glow: '0 4px 20px rgba(56,201,223,0.2)',
};

/* ═══════════════════════════════════════════════
   CART PAGE
   ═══════════════════════════════════════════════ */

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
        setDeliveryInfo({ ...deliveryInfo, [field]: value });
    };

    const handleCheckout = () => {
        if (items.length === 0) return;
        if (!deliveryInfo.recipientName || !deliveryInfo.deliveryAddress) {
            alert('Veuillez remplir les informations de livraison.');
            return;
        }
        setIsCheckingOut(true);
        setTimeout(() => {
            alert('Commande passée avec succès ! Votre cadeau sera livré bientôt.');
            clearCart();
            setIsCheckingOut(false);
        }, 2000);
    };

    /* ── Label component ── */
    const Label = ({ children, required }) => (
        <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'rgba(255,255,255,0.7)', marginBottom: '6px' }}>
            {children}{required && <span style={{ color: t.cyan }}> *</span>}
        </label>
    );

    /* ── Input class string ── */
    const inputClass = "w-full px-4 py-2.5 rounded-xl text-sm text-white focus:outline-none transition-all duration-300";

    /* ══════ EMPTY STATE ══════ */
    if (items.length === 0) {
        return (
            <div className="main-section min-h-screen flex items-center justify-center px-6" style={{ background: t.bg, fontFamily: "'DM Sans', sans-serif" }}>
                <div className="text-center max-w-md">
                    <div
                        className="w-24 h-24 mx-auto mb-8 rounded-full flex items-center justify-center"
                        style={{ background: 'rgba(56,201,223,0.08)' }}
                    >
                        <ShoppingCart className="h-10 w-10" style={{ color: 'rgba(255,255,255,0.4)' }} />
                    </div>
                    <h1
                        className="text-3xl font-bold text-white mb-3"
                        style={{ fontFamily: "'Playfair Display', Georgia, serif", letterSpacing: '-0.3px' }}
                    >
                        Votre panier est vide
                    </h1>
                    <p style={{ color: t.textSec, fontSize: '15px', fontWeight: 300, lineHeight: 1.6, marginBottom: '32px' }}>
                        Découvrez nos produits et composez le cadeau parfait !
                    </p>
                    <Link
                        to="/products"
                        className="inline-flex items-center gap-2 text-white px-8 py-3.5 rounded-full text-sm font-semibold transition-shadow duration-300"
                        style={{ background: t.gradient, boxShadow: t.glow }}
                    >
                        Voir les Produits
                    </Link>
                </div>
            </div>
        );
    }

    /* ══════ CART WITH ITEMS ══════ */
    return (
        <div className="main-section min-h-screen" style={{ background: t.bg, fontFamily: "'DM Sans', sans-serif" }}>
            <div className="max-w-7xl mx-auto px-6 py-12">

                {/* Header */}
                <div className="mb-10">
                    <span style={{ color: t.cyan, fontSize: '11px', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', display: 'inline-block', marginBottom: '12px' }}>
                        Panier
                    </span>
                    <h1
                        className="text-3xl md:text-4xl font-bold text-white"
                        style={{ fontFamily: "'Playfair Display', Georgia, serif", letterSpacing: '-0.3px' }}
                    >
                        Mon Panier
                    </h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* ── CART ITEMS ── */}
                    <div className="lg:col-span-2">
                        <div className="rounded-2xl p-6" style={{ background: t.card, border: t.border }}>
                            <h2 className="text-lg font-semibold text-white mb-6">
                                Articles ({items.length})
                            </h2>

                            <div className="space-y-4">
                                {items.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex items-center gap-4 p-4 rounded-xl transition-all duration-300"
                                        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}
                                        onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
                                        onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'; }}
                                    >
                                        {/* Image */}
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                                        />

                                        {/* Info */}
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-white font-semibold text-sm mb-1 truncate">{item.name}</h3>
                                            <p style={{ color: t.textTer, fontSize: '12px', fontWeight: 300 }} className="truncate">{item.description}</p>
                                            <span
                                                className="text-sm font-bold mt-1 inline-block"
                                                style={{ background: 'linear-gradient(135deg, #38c9df, #a67dff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
                                            >
                                                {item.price} €
                                            </span>
                                        </div>

                                        {/* Quantity */}
                                        <div className="flex items-center gap-2 flex-shrink-0">
                                            <button
                                                onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                                className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200"
                                                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}
                                                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; }}
                                                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
                                            >
                                                <Minus className="h-3.5 w-3.5 text-white" />
                                            </button>
                                            <span className="w-8 text-center text-white font-semibold text-sm">{item.quantity}</span>
                                            <button
                                                onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                                className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200"
                                                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}
                                                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; }}
                                                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
                                            >
                                                <Plus className="h-3.5 w-3.5 text-white" />
                                            </button>
                                        </div>

                                        {/* Total + Delete */}
                                        <div className="text-right flex-shrink-0">
                                            <span
                                                className="text-base font-bold block"
                                                style={{ background: 'linear-gradient(135deg, #38c9df, #a67dff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
                                            >
                                                {(item.price * item.quantity).toFixed(2)} €
                                            </span>
                                            <button
                                                onClick={() => removeFromCart(item.id)}
                                                className="mt-1.5 transition-colors duration-200"
                                                style={{ color: 'rgba(255,255,255,0.3)' }}
                                                onMouseEnter={(e) => { e.currentTarget.style.color = '#ef4444'; }}
                                                onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.3)'; }}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Clear cart */}
                            <div className="mt-6 pt-5" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                                <button
                                    onClick={clearCart}
                                    className="text-sm font-medium transition-colors duration-200"
                                    style={{ color: 'rgba(255,255,255,0.4)' }}
                                    onMouseEnter={(e) => { e.currentTarget.style.color = '#ef4444'; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.4)'; }}
                                >
                                    Vider le panier
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* ── CHECKOUT SIDEBAR ── */}
                    <div className="lg:col-span-1">
                        <div className="rounded-2xl p-6 sticky top-24" style={{ background: t.card, border: t.border }}>

                            {/* Title */}
                            <div className="flex items-center gap-3 mb-6">
                                <div
                                    className="w-9 h-9 rounded-lg flex items-center justify-center"
                                    style={{ background: 'rgba(56,201,223,0.1)' }}
                                >
                                    <CreditCard className="h-4 w-4" style={{ color: t.cyan }} />
                                </div>
                                <h2 className="text-lg font-semibold text-white">Finaliser</h2>
                            </div>

                            {/* Gift Message */}
                            <div className="mb-5">
                                <Label>Message cadeau</Label>
                                <textarea
                                    value={giftMessage}
                                    onChange={(e) => setGiftMessage(e.target.value)}
                                    placeholder="Écrivez un message personnalisé..."
                                    className={inputClass}
                                    style={t.input}
                                    rows="3"
                                />
                            </div>

                            {/* Delivery */}
                            <div className="mb-6">
                                <div className="flex items-center gap-2.5 mb-4">
                                    <div className="w-7 h-7 rounded-md flex items-center justify-center" style={{ background: 'rgba(56,201,223,0.1)' }}>
                                        <Truck className="h-3.5 w-3.5" style={{ color: t.cyan }} />
                                    </div>
                                    <h3 className="text-sm font-semibold text-white">Livraison</h3>
                                </div>

                                <div className="space-y-3">
                                    <div>
                                        <Label required>Nom du destinataire</Label>
                                        <input
                                            type="text"
                                            value={deliveryInfo.recipientName}
                                            onChange={(e) => handleDeliveryInfoChange('recipientName', e.target.value)}
                                            className={inputClass}
                                            style={t.input}
                                        />
                                    </div>
                                    <div>
                                        <Label>Email du destinataire</Label>
                                        <input
                                            type="email"
                                            value={deliveryInfo.recipientEmail}
                                            onChange={(e) => handleDeliveryInfoChange('recipientEmail', e.target.value)}
                                            className={inputClass}
                                            style={t.input}
                                        />
                                    </div>
                                    <div>
                                        <Label required>Adresse de livraison</Label>
                                        <textarea
                                            value={deliveryInfo.deliveryAddress}
                                            onChange={(e) => handleDeliveryInfoChange('deliveryAddress', e.target.value)}
                                            className={inputClass}
                                            style={t.input}
                                            rows="2"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <Label>Date</Label>
                                            <input
                                                type="date"
                                                value={deliveryInfo.deliveryDate}
                                                onChange={(e) => handleDeliveryInfoChange('deliveryDate', e.target.value)}
                                                className={inputClass}
                                                style={t.input}
                                            />
                                        </div>
                                        <div>
                                            <Label>Heure</Label>
                                            <select
                                                value={deliveryInfo.deliveryTime}
                                                onChange={(e) => handleDeliveryInfoChange('deliveryTime', e.target.value)}
                                                className={inputClass + " cursor-pointer appearance-none"}
                                                style={t.input}
                                            >
                                                <option value="" style={{ background: '#0f172a', color: '#fff' }}>Choisir</option>
                                                <option value="morning" style={{ background: '#0f172a', color: '#fff' }}>Matin (9h-12h)</option>
                                                <option value="afternoon" style={{ background: '#0f172a', color: '#fff' }}>Après-midi (14h-17h)</option>
                                                <option value="evening" style={{ background: '#0f172a', color: '#fff' }}>Soirée (17h-20h)</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Summary */}
                            <div className="pt-5 mb-5" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span style={{ color: t.textSec, fontSize: '14px' }}>Sous-total</span>
                                        <span className="text-white font-medium text-sm">{getTotalPrice().toFixed(2)} €</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span style={{ color: t.textSec, fontSize: '14px' }}>Livraison</span>
                                        <span style={{ color: '#10b981', fontSize: '14px', fontWeight: 500 }}>Gratuite</span>
                                    </div>
                                    <div className="flex justify-between pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                                        <span className="text-white font-semibold">Total</span>
                                        <span
                                            className="text-lg font-bold"
                                            style={{ background: 'linear-gradient(135deg, #38c9df, #a67dff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
                                        >
                                            {getTotalPrice().toFixed(2)} €
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* CTA */}
                            <button
                                onClick={handleCheckout}
                                disabled={isCheckingOut}
                                className="w-full text-white py-3.5 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                style={{ background: t.gradient, boxShadow: t.glow }}
                                onMouseEnter={(e) => { if (!isCheckingOut) e.currentTarget.style.boxShadow = '0 8px 32px rgba(56,201,223,0.3)'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.boxShadow = t.glow; }}
                            >
                                {isCheckingOut ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white" />
                                        <span>Traitement...</span>
                                    </>
                                ) : (
                                    <>
                                        <CreditCard className="h-4 w-4" />
                                        <span>Passer la Commande</span>
                                    </>
                                )}
                            </button>

                            {/* Trust badge */}
                            <div
                                className="mt-4 py-3 px-4 rounded-xl text-center"
                                style={{ background: 'rgba(56,201,223,0.05)', border: '1px solid rgba(56,201,223,0.08)' }}
                            >
                                <p style={{ color: t.textTer, fontSize: '12px', fontWeight: 500 }}>
                                    Paiement sécurisé · Livraison gratuite
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