import { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import {
    ShoppingBag, ChevronDown, ChevronUp, RefreshCw,
    MapPin, Calendar, Clock, MessageSquare, Package,
    ChevronRight, Truck, CheckCircle, CircleDot, XCircle, Loader,
} from 'lucide-react';
import type { Order } from '../types';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

const STATUS_CONFIG = {
    pending:   { label: 'En attente',  color: 'bg-amber-100 text-amber-700',   icon: CircleDot },
    confirmed: { label: 'Confirmée',   color: 'bg-blue-100 text-blue-700',     icon: CheckCircle },
    shipped:   { label: 'Expédiée',    color: 'bg-purple-100 text-purple-700', icon: Truck },
    delivered: { label: 'Livrée',      color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle },
    cancelled: { label: 'Annulée',     color: 'bg-red-100 text-red-600',       icon: XCircle },
} as const;

const DELIVERY_TIME_LABELS: Record<string, string> = {
    morning:   'Matin (9h–12h)',
    afternoon: 'Après-midi (14h–17h)',
    evening:   'Soirée (17h–20h)',
};

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString('fr-FR', {
        day: '2-digit', month: 'long', year: 'numeric',
    });
}

function formatTime(iso: string) {
    return new Date(iso).toLocaleTimeString('fr-FR', {
        hour: '2-digit', minute: '2-digit',
    });
}

const OrderHistoryPage = () => {
    const { user } = useAuth();
    const { addToCart } = useCart();
    const { toast } = useToast();
    const [orders, setOrders] = useState<Order[]>([]);
    const [expanded, setExpanded] = useState<string | null>(null);

    useEffect(() => {
        const stored = localStorage.getItem('tc_orders');
        if (stored) setOrders(JSON.parse(stored));
    }, []);

    if (!user) return <Navigate to="/login" state={{ from: '/orders' }} replace />;

    const toggleExpand = (id: string) =>
        setExpanded(prev => (prev === id ? null : id));

    const handleReorder = (order: Order) => {
        order.items.forEach(item => addToCart(item));
        toast(`${order.items.length} article${order.items.length > 1 ? 's' : ''} ajouté${order.items.length > 1 ? 's' : ''} au panier.`, 'success');
    };

    // ── Empty state ─────────────────────────────────────────────────────────
    if (orders.length === 0) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
                <div className="text-center max-w-sm">
                    <div className="w-24 h-24 mx-auto mb-6 rounded-3xl flex items-center justify-center"
                        style={{ background: 'linear-gradient(135deg, #aa5a9e22, #6fc7d922)' }}>
                        <ShoppingBag className="h-10 w-10 text-slate-300" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900 mb-2">Aucune commande</h1>
                    <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                        Vous n'avez pas encore passé de commande. Découvrez nos cadeaux et faites plaisir à vos proches.
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

    // ── Order list ───────────────────────────────────────────────────────────
    return (
        <div className="min-h-screen bg-slate-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900">Mes commandes</h1>
                    <p className="text-slate-400 text-sm mt-1">
                        {orders.length} commande{orders.length > 1 ? 's' : ''} au total
                    </p>
                </div>

                <div className="space-y-4">
                    {orders.map(order => {
                        const cfg = STATUS_CONFIG[order.status];
                        const StatusIcon = cfg.icon;
                        const isOpen = expanded === order.id;

                        return (
                            <div key={order.id}
                                className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow">

                                {/* ── Order header ── */}
                                <div className="px-6 py-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-0">

                                    {/* Left: id + date */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className="font-bold text-slate-900 text-sm">{order.id}</span>
                                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold ${cfg.color}`}>
                                                <StatusIcon className="h-3 w-3" />
                                                {cfg.label}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
                                            <span className="flex items-center gap-1">
                                                <Calendar className="h-3 w-3" />
                                                {formatDate(order.date)}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Clock className="h-3 w-3" />
                                                {formatTime(order.date)}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Center: item thumbnails */}
                                    <div className="flex items-center -space-x-2 flex-shrink-0 mx-4">
                                        {order.items.slice(0, 4).map((item, i) => (
                                            <img
                                                key={i}
                                                src={item.image || '/placeholder.jpg'}
                                                alt={item.name}
                                                onError={e => { (e.target as HTMLImageElement).src = '/placeholder.jpg'; }}
                                                className="w-9 h-9 rounded-full object-cover border-2 border-white bg-slate-100"
                                                style={{ zIndex: 4 - i }}
                                            />
                                        ))}
                                        {order.items.length > 4 && (
                                            <div className="w-9 h-9 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500"
                                                style={{ zIndex: 0 }}>
                                                +{order.items.length - 4}
                                            </div>
                                        )}
                                    </div>

                                    {/* Right: total + actions */}
                                    <div className="flex items-center gap-3 flex-shrink-0">
                                        <div className="text-right hidden sm:block">
                                            <p className="text-xs text-slate-400">Total</p>
                                            <p className="font-bold text-slate-900">
                                                {order.total.toFixed(2)} DH
                                                <span className="text-xs font-normal text-slate-400 ml-1">
                                                    (${(order.total * 0.10).toFixed(2)})
                                                </span>
                                            </p>
                                        </div>

                                        <button
                                            onClick={() => handleReorder(order)}
                                            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-white transition-all hover:opacity-90 hover:shadow-md flex-shrink-0"
                                            style={{ background: 'linear-gradient(135deg, #aa5a9e, #6fc7d9)' }}>
                                            <RefreshCw className="h-3.5 w-3.5" />
                                            Recommander
                                        </button>

                                        <button
                                            onClick={() => toggleExpand(order.id)}
                                            className="w-9 h-9 flex items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors flex-shrink-0">
                                            {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                                        </button>
                                    </div>
                                </div>

                                {/* ── Expanded details ── */}
                                {isOpen && (
                                    <div className="border-t border-slate-100 px-6 py-5 space-y-5 bg-slate-50/50">

                                        {/* Articles */}
                                        <div>
                                            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                                                <Package className="h-3.5 w-3.5" />
                                                Articles ({order.items.length})
                                            </h3>
                                            <div className="space-y-2">
                                                {order.items.map((item, i) => (
                                                    <div key={i} className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 border border-slate-100">
                                                        <img
                                                            src={item.image || '/placeholder.jpg'}
                                                            alt={item.name}
                                                            onError={e => { (e.target as HTMLImageElement).src = '/placeholder.jpg'; }}
                                                            className="w-12 h-12 rounded-lg object-cover bg-slate-100 flex-shrink-0"
                                                        />
                                                        <div className="flex-1 min-w-0">
                                                            <p className="font-semibold text-slate-900 text-sm truncate">{item.name}</p>
                                                            <p className="text-xs text-slate-400 truncate">{item.description}</p>
                                                        </div>
                                                        <div className="text-right flex-shrink-0">
                                                            <p className="text-xs text-slate-400">x{item.quantity}</p>
                                                            <p className="font-bold text-sm" style={{ color: '#aa5a9e' }}>
                                                                {(item.price * item.quantity).toFixed(2)} DH
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {/* Delivery info */}
                                            <div className="bg-white rounded-xl border border-slate-100 p-4">
                                                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                                                    <Truck className="h-3.5 w-3.5" />
                                                    Livraison
                                                </h3>
                                                <div className="space-y-1.5 text-sm">
                                                    <p className="font-semibold text-slate-900">{order.deliveryInfo.recipientName}</p>
                                                    {order.deliveryInfo.recipientEmail && (
                                                        <p className="text-slate-400 text-xs">{order.deliveryInfo.recipientEmail}</p>
                                                    )}
                                                    <p className="flex items-start gap-1.5 text-slate-600 text-xs">
                                                        <MapPin className="h-3.5 w-3.5 mt-0.5 flex-shrink-0 text-slate-400" />
                                                        {order.deliveryInfo.deliveryAddress}
                                                    </p>
                                                    {order.deliveryInfo.deliveryDate && (
                                                        <p className="flex items-center gap-1.5 text-slate-600 text-xs">
                                                            <Calendar className="h-3.5 w-3.5 flex-shrink-0 text-slate-400" />
                                                            {new Date(order.deliveryInfo.deliveryDate).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}
                                                            {order.deliveryInfo.deliveryTime && (
                                                                <span className="text-slate-400">· {DELIVERY_TIME_LABELS[order.deliveryInfo.deliveryTime] ?? order.deliveryInfo.deliveryTime}</span>
                                                            )}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Summary + gift message */}
                                            <div className="space-y-3">
                                                {/* Total */}
                                                <div className="bg-white rounded-xl border border-slate-100 p-4">
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-sm text-slate-500">Total payé</span>
                                                        <span className="font-bold text-lg" style={{ color: '#aa5a9e' }}>
                                                            {order.total.toFixed(2)} DH
                                                            <span className="text-xs font-normal text-slate-400 ml-1">(${(order.total * 0.10).toFixed(2)})</span>
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Gift message */}
                                                {order.giftMessage && (
                                                    <div className="bg-white rounded-xl border border-slate-100 p-4">
                                                        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                                            <MessageSquare className="h-3.5 w-3.5" />
                                                            Message cadeau
                                                        </h3>
                                                        <p className="text-sm text-slate-700 italic leading-relaxed">"{order.giftMessage}"</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Reorder full CTA */}
                                        <button
                                            onClick={() => handleReorder(order)}
                                            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 hover:shadow-lg"
                                            style={{ background: 'linear-gradient(135deg, #aa5a9e, #6fc7d9)' }}>
                                            <RefreshCw className="h-4 w-4" />
                                            Recommander cette commande
                                        </button>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default OrderHistoryPage;
