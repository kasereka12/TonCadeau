import { useState } from 'react';
import type { ReactNode } from 'react';
import type { DeliveryInfo, Order } from '../types';
import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, CreditCard, Truck, ShoppingCart, Gift, ChevronRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

const inputCls =
    'w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#aa5a9e] focus:ring-2 focus:ring-[#aa5a9e]/15 transition-all';

const Label = ({ children, required }: { children: ReactNode; required?: boolean }) => (
    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
        {children}{required && <span className="text-[#aa5a9e] ml-0.5">*</span>}
    </label>
);

const CartPage = () => {
    const {
        items, giftMessage, deliveryInfo,
        updateQuantity, removeFromCart, clearCart,
        setGiftMessage, setDeliveryInfo, getTotalPrice,
    } = useCart();

    const { toast } = useToast();
    const [isCheckingOut, setIsCheckingOut] = useState(false);

    const handleQuantityChange = (productId: number | string, newQuantity: number) => {
        if (newQuantity <= 0) removeFromCart(productId);
        else updateQuantity(productId, newQuantity);
    };

    const handleDeliveryInfoChange = (field: keyof DeliveryInfo, value: string) => {
        setDeliveryInfo({ ...deliveryInfo, [field]: value });
    };

    const handleCheckout = () => {
        if (items.length === 0) return;
        if (!deliveryInfo.recipientName || !deliveryInfo.deliveryAddress) {
            toast('Veuillez remplir les informations de livraison.', 'error'); return;
        }
        setIsCheckingOut(true);
        setTimeout(() => {
            const order: Order = {
                id: `ORD-${Date.now()}`,
                date: new Date().toISOString(),
                items: [...items],
                deliveryInfo: { ...deliveryInfo },
                giftMessage,
                total: getTotalPrice(),
                status: 'confirmed',
            };
            const existing: Order[] = JSON.parse(localStorage.getItem('tc_orders') || '[]');
            localStorage.setItem('tc_orders', JSON.stringify([order, ...existing]));
            toast('Commande passée avec succès ! Votre cadeau sera livré bientôt.', 'success');
            clearCart();
            setIsCheckingOut(false);
        }, 2000);
    };

    // ── Empty state ──────────────────────────────────────────────────────────
    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
                <div className="text-center max-w-sm">
                    <div className="w-24 h-24 mx-auto mb-6 rounded-3xl flex items-center justify-center"
                        style={{ background: 'linear-gradient(135deg, #aa5a9e22, #6fc7d922)' }}>
                        <ShoppingCart className="h-10 w-10 text-slate-300" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900 mb-2">Votre panier est vide</h1>
                    <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                        Découvrez nos produits et composez le cadeau parfait pour vos proches.
                    </p>
                    <Link to="/products"
                        className="inline-flex items-center gap-2 text-white px-8 py-3.5 rounded-2xl text-sm font-semibold transition-all hover:opacity-90 hover:shadow-xl"
                        style={{ background: 'linear-gradient(135deg, #aa5a9e, #6fc7d9)' }}>
                        Voir les produits
                        <ChevronRight className="h-4 w-4" />
                    </Link>
                </div>
            </div>
        );
    }

    // ── Cart with items ───────────────────────────────────────────────────────
    return (
        <div className="min-h-screen bg-slate-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900">Mon Panier</h1>
                    <p className="text-slate-400 text-sm mt-1">
                        {items.length} article{items.length > 1 ? 's' : ''} · {getTotalPrice().toFixed(2)} DH <span className="text-xs opacity-60">(${(getTotalPrice() * 0.10).toFixed(2)})</span>
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* ── LEFT : items + gift message ── */}
                    <div className="lg:col-span-2 space-y-5">

                        {/* Articles */}
                        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                            <div className="px-6 py-4 border-b border-slate-50 flex items-center justify-between">
                                <h2 className="font-bold text-slate-900 text-sm">
                                    Articles <span className="text-slate-400 font-normal ml-1">({items.length})</span>
                                </h2>
                                <button onClick={clearCart}
                                    className="text-xs text-slate-400 hover:text-red-500 transition-colors font-medium">
                                    Vider le panier
                                </button>
                            </div>

                            <div className="divide-y divide-slate-50">
                                {items.map(item => (
                                    <div key={item.id} className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50/50 transition-colors group">
                                        {/* Image */}
                                        <img
                                            src={item.image || '/placeholder.jpg'}
                                            alt={item.name}
                                            onError={e => { (e.target as HTMLImageElement).src = '/placeholder.jpg'; }}
                                            className="w-16 h-16 object-cover rounded-xl flex-shrink-0 bg-slate-100"
                                        />

                                        {/* Info */}
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-slate-900 text-sm truncate">{item.name}</p>
                                            <p className="text-xs text-slate-400 mt-0.5 truncate">{item.description}</p>
                                            <p className="text-sm font-bold mt-1" style={{ color: '#aa5a9e' }}>
                                                {item.price} DH
                                            </p>
                                        </div>

                                        {/* Quantity */}
                                        <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden flex-shrink-0">
                                            <button
                                                onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                                className="w-8 h-8 flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors">
                                                <Minus className="h-3.5 w-3.5" />
                                            </button>
                                            <span className="w-8 text-center text-sm font-bold text-slate-900">
                                                {item.quantity}
                                            </span>
                                            <button
                                                onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                                className="w-8 h-8 flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors">
                                                <Plus className="h-3.5 w-3.5" />
                                            </button>
                                        </div>

                                        {/* Subtotal + delete */}
                                        <div className="text-right flex-shrink-0 w-20">
                                            <p className="font-bold text-slate-900 text-sm">
                                                {(item.price * item.quantity).toFixed(2)} DH
                                            </p>
                                            <button
                                                onClick={() => removeFromCart(item.id)}
                                                className="mt-1.5 text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Gift message */}
                        <div className="bg-white rounded-2xl border border-slate-100 p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                                    style={{ background: 'linear-gradient(135deg, #aa5a9e22, #6fc7d922)' }}>
                                    <Gift className="h-4 w-4" style={{ color: '#aa5a9e' }} />
                                </div>
                                <h2 className="font-bold text-slate-900 text-sm">Message cadeau</h2>
                            </div>
                            <textarea
                                value={giftMessage}
                                onChange={e => setGiftMessage(e.target.value)}
                                placeholder="Écrivez un message personnalisé pour le destinataire…"
                                className={inputCls + ' resize-none'}
                                rows={3}
                            />
                        </div>
                    </div>

                    {/* ── RIGHT : delivery + summary ── */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl border border-slate-100 p-6 sticky top-24 space-y-6">

                            {/* Delivery section */}
                            <div>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                                        style={{ background: 'linear-gradient(135deg, #aa5a9e22, #6fc7d922)' }}>
                                        <Truck className="h-4 w-4" style={{ color: '#6fc7d9' }} />
                                    </div>
                                    <h2 className="font-bold text-slate-900 text-sm">Livraison</h2>
                                </div>

                                <div className="space-y-3">
                                    <div>
                                        <Label required>Nom du destinataire</Label>
                                        <input type="text"
                                            value={deliveryInfo.recipientName}
                                            onChange={e => handleDeliveryInfoChange('recipientName', e.target.value)}
                                            className={inputCls} placeholder="Jean Dupont" />
                                    </div>
                                    <div>
                                        <Label>Email du destinataire</Label>
                                        <input type="email"
                                            value={deliveryInfo.recipientEmail}
                                            onChange={e => handleDeliveryInfoChange('recipientEmail', e.target.value)}
                                            className={inputCls} placeholder="jean@email.com" />
                                    </div>
                                    <div>
                                        <Label required>Adresse de livraison</Label>
                                        <textarea
                                            value={deliveryInfo.deliveryAddress}
                                            onChange={e => handleDeliveryInfoChange('deliveryAddress', e.target.value)}
                                            className={inputCls + ' resize-none'} rows={2}
                                            placeholder="12 Rue des Fleurs, Casablanca" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <Label>Date</Label>
                                            <input type="date"
                                                value={deliveryInfo.deliveryDate}
                                                onChange={e => handleDeliveryInfoChange('deliveryDate', e.target.value)}
                                                className={inputCls} />
                                        </div>
                                        <div>
                                            <Label>Heure</Label>
                                            <select
                                                value={deliveryInfo.deliveryTime}
                                                onChange={e => handleDeliveryInfoChange('deliveryTime', e.target.value)}
                                                className={inputCls + ' bg-white'}>
                                                <option value="">Choisir</option>
                                                <option value="morning">Matin (9h–12h)</option>
                                                <option value="afternoon">Après-midi (14h–17h)</option>
                                                <option value="evening">Soirée (17h–20h)</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Summary */}
                            <div className="border-t border-slate-100 pt-5 space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Sous-total</span>
                                    <span className="font-medium text-slate-900">{getTotalPrice().toFixed(2)} DH <span className="text-xs opacity-60">(${(getTotalPrice() * 0.10).toFixed(2)})</span></span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Livraison</span>
                                    <span className="font-semibold text-emerald-500">Gratuite</span>
                                </div>
                                <div className="flex justify-between pt-3 border-t border-slate-100">
                                    <span className="font-bold text-slate-900">Total</span>
                                    <span className="text-xl font-bold" style={{ color: '#aa5a9e' }}>
                                        {getTotalPrice().toFixed(2)} DH <span className="text-xs opacity-60">(${(getTotalPrice() * 0.10).toFixed(2)})</span>
                                    </span>
                                </div>
                            </div>

                            {/* CTA */}
                            <button
                                onClick={handleCheckout}
                                disabled={isCheckingOut}
                                className="w-full flex items-center justify-center gap-2 text-white py-3.5 rounded-2xl font-semibold text-sm transition-all hover:opacity-90 hover:shadow-xl disabled:opacity-60"
                                style={{ background: 'linear-gradient(135deg, #aa5a9e, #6fc7d9)' }}>
                                {isCheckingOut ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Traitement…
                                    </>
                                ) : (
                                    <>
                                        <CreditCard className="h-4 w-4" />
                                        Passer la commande
                                    </>
                                )}
                            </button>

                            {/* Trust */}
                            <p className="text-center text-xs text-slate-400">
                                Paiement sécurisé · Livraison gratuite
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPage;
