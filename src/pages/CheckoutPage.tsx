import { useState, useRef } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import {
    CreditCard, ShieldCheck, Lock, ChevronRight, CheckCircle,
    ArrowLeft, Smartphone, AlertCircle, Package, Truck,
    MessageSquare, RefreshCw, ExternalLink,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { supabase } from '../lib/supabase';

/* ─── Types ──────────────────────────────────────────────────────────────── */
type PayMethod = 'cmi' | 'stripe' | 'paypal';
type Stage = 'method' | 'form' | 'processing' | 'otp' | 'confirmed';

interface CardData { number: string; name: string; expiry: string; cvv: string }
interface CardErrors { number?: string; name?: string; expiry?: string; cvv?: string }

/* ─── Helpers ────────────────────────────────────────────────────────────── */
const fmtCardNum  = (v: string) => v.replace(/\D/g,'').slice(0,16).replace(/(\d{4})(?=\d)/g,'$1 ');
const fmtExpiry   = (v: string) => { const d = v.replace(/\D/g,'').slice(0,4); return d.length>=2?`${d.slice(0,2)}/${d.slice(2)}`:d; };
const fmtCvv      = (v: string) => v.replace(/\D/g,'').slice(0,4);
const maskNum     = (n: string) => { const d = n.replace(/\s/g,''); return d.length===16 ? `•••• •••• •••• ${d.slice(12)}` : n; };

function luhn(n: string): boolean {
    const d = n.replace(/\s/g,''); if (d.length<13) return false;
    let sum=0; let alt=false;
    for (let i=d.length-1;i>=0;i--) { let x=parseInt(d[i],10); if(alt){x*=2;if(x>9)x-=9;} sum+=x; alt=!alt; }
    return sum%10===0;
}

function validate(card: CardData): CardErrors {
    const e: CardErrors = {};
    if (!luhn(card.number))             e.number = 'Numéro de carte invalide';
    if (card.name.trim().length < 2)    e.name   = 'Nom requis';
    const [mm,yy] = card.expiry.split('/');
    const now = new Date(); const m=parseInt(mm,10); const y=parseInt('20'+yy,10);
    if (!mm||!yy||m<1||m>12||y<now.getFullYear()||(y===now.getFullYear()&&m<now.getMonth()+1))
        e.expiry = 'Date invalide';
    if (card.cvv.length < 3)            e.cvv    = 'CVV invalide';
    return e;
}

/* ─── Payment method metadata ────────────────────────────────────────────── */
const METHODS = [
    {
        id: 'cmi' as PayMethod,
        name: 'Carte Bancaire Marocaine',
        sub: 'CMI · Visa · Mastercard · 3D Secure',
        color: '#00843D',
        bg: 'from-[#00843D]/10 to-[#0066CC]/10',
        border: 'border-[#00843D]/30',
        badge: 'bg-[#00843D]/10 text-[#00843D]',
        logo: (
            <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-black tracking-tight text-white px-1.5 py-0.5 rounded" style={{background:'#00843D'}}>CMI</span>
                <span className="text-[10px] font-black tracking-tight text-white px-1.5 py-0.5 rounded" style={{background:'#1A1F71'}}>VISA</span>
                <span className="text-[10px] font-black text-white px-1.5 py-0.5 rounded" style={{background:'#EB001B'}}>MC</span>
            </div>
        ),
        note: 'Paiement sécurisé via la plateforme CMI (Centre Monétique Interbancaire). Authentification 3D Secure requise.',
    },
    {
        id: 'stripe' as PayMethod,
        name: 'Carte Internationale',
        sub: 'Stripe · Visa · Mastercard · Amex',
        color: '#635BFF',
        bg: 'from-[#635BFF]/10 to-[#0A2540]/10',
        border: 'border-[#635BFF]/30',
        badge: 'bg-[#635BFF]/10 text-[#635BFF]',
        logo: (
            <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-black tracking-tight px-2 py-0.5 rounded text-white" style={{background:'#635BFF'}}>stripe</span>
                <span className="text-[10px] font-black tracking-tight text-white px-1.5 py-0.5 rounded" style={{background:'#1A1F71'}}>VISA</span>
                <span className="text-[10px] font-black text-white px-1.5 py-0.5 rounded" style={{background:'#2E77BC'}}>AMEX</span>
            </div>
        ),
        note: 'Paiement sécurisé via Stripe. Chiffrement TLS 256-bit. Aucune donnée bancaire stockée sur nos serveurs.',
    },
    {
        id: 'paypal' as PayMethod,
        name: 'PayPal',
        sub: 'Compte PayPal · Paiement express',
        color: '#003087',
        bg: 'from-[#003087]/10 to-[#009cde]/10',
        border: 'border-[#003087]/30',
        badge: 'bg-[#003087]/10 text-[#003087]',
        logo: (
            <div className="flex items-center gap-1">
                <span className="text-[14px] font-black" style={{color:'#003087'}}>Pay</span>
                <span className="text-[14px] font-black" style={{color:'#009cde'}}>Pal</span>
            </div>
        ),
        note: "Vous serez redirigé vers PayPal pour finaliser votre paiement en toute sécurité avec votre compte ou carte.",
    },
];

/* ─── Sub-components ─────────────────────────────────────────────────────── */
const inputCls = 'w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#aa5a9e] focus:ring-2 focus:ring-[#aa5a9e]/15 transition-all';
const errCls   = 'text-[11px] text-red-500 mt-1 flex items-center gap-1';

/* ─── Main component ─────────────────────────────────────────────────────── */
const CheckoutPage = () => {
    const { items, giftBundles, deliveryInfo, giftMessage, getTotalPrice, clearCart } = useCart();
    const { user } = useAuth();
    const { toast } = useToast();
    const navigate = useNavigate();

    const [stage,  setStage]  = useState<Stage>('method');
    const [method, setMethod] = useState<PayMethod | null>(null);
    const [card,   setCard]   = useState<CardData>({ number:'', name:'', expiry:'', cvv:'' });
    const [errors, setErrors] = useState<CardErrors>({});
    const [otp,    setOtp]    = useState('');
    const [otpErr, setOtpErr] = useState('');
    const [orderId, setOrderId] = useState('');
    const [paypalLoading, setPaypalLoading] = useState(false);
    const cardRef = useRef<HTMLInputElement>(null);

    /* Guard */
    if (!items.length && stage !== 'confirmed') return <Navigate to="/cart" replace />;

    const total   = getTotalPrice();
    const meta    = METHODS.find(m => m.id === method);
    const isCard  = method === 'cmi' || method === 'stripe';

    /* ── Card input handlers ── */
    const handleCard = (field: keyof CardData, raw: string) => {
        let v = raw;
        if (field === 'number') v = fmtCardNum(raw);
        if (field === 'expiry') v = fmtExpiry(raw);
        if (field === 'cvv')    v = fmtCvv(raw);
        setCard(prev => ({ ...prev, [field]: v }));
        setErrors(prev => ({ ...prev, [field]: undefined }));
    };

    /* ── Submit card ── */
    const handleCardSubmit = () => {
        const errs = validate(card);
        if (Object.keys(errs).length) { setErrors(errs); return; }
        if (!user) { toast('Vous devez être connecté pour passer une commande.', 'error'); return; }

        setStage('processing');
        setTimeout(async () => {
            if (method === 'cmi') {
                setStage('otp');
            } else {
                await finalise();
            }
        }, 2200);
    };

    /* ── OTP verify (CMI 3DS) ── */
    const handleOtp = () => {
        if (otp.length !== 6) { setOtpErr('Code à 6 chiffres requis'); return; }
        setOtpErr('');
        setStage('processing');
        setTimeout(async () => { await finalise(); }, 1800);
    };

    /* ── PayPal flow ── */
    const handlePayPal = () => {
        if (!user) { toast('Vous devez être connecté pour passer une commande.', 'error'); return; }
        setPaypalLoading(true);
        setTimeout(() => {
            setPaypalLoading(false);
            setStage('processing');
            setTimeout(async () => { await finalise(); }, 1500);
        }, 2000);
    };

    /* ── Save order → Supabase ── */
    const finalise = async () => {
        if (!user) return;
        const id = `ORD-${Date.now()}`;

        const { error } = await supabase.from('orders').insert({
            id,
            user_id:        user.id,
            items:          items,
            gift_bundles:   giftBundles,
            delivery_info:  deliveryInfo,
            gift_message:   giftMessage,
            total,
            status:         'confirmed',
            payment_method: method,
        });

        if (error) {
            toast('Erreur lors de la sauvegarde de la commande. Veuillez réessayer.', 'error');
            setStage('form');
            return;
        }

        setOrderId(id);
        clearCart();
        setStage('confirmed');
    };

    /* ─────────────────────────────────────────────── RENDER ── */

    /* ── Processing overlay ── */
    if (stage === 'processing') {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
                <div className="text-center">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center"
                        style={{ background: 'linear-gradient(135deg, #aa5a9e22, #6fc7d922)' }}>
                        <RefreshCw className="h-9 w-9 text-[#aa5a9e] animate-spin" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 mb-2">Traitement en cours…</h2>
                    <p className="text-slate-400 text-sm">Validation du paiement auprès de {meta?.name}</p>
                    <div className="mt-6 w-48 h-1 mx-auto bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full animate-[processing_2.2s_ease-in-out_forwards]"
                            style={{ background: 'linear-gradient(90deg, #aa5a9e, #6fc7d9)' }} />
                    </div>
                    <style>{`@keyframes processing{from{width:0}to{width:100%}}`}</style>
                </div>
            </div>
        );
    }

    /* ── OTP / 3D Secure screen (CMI) ── */
    if (stage === 'otp') {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
                <div className="bg-white rounded-3xl border border-slate-100 shadow-xl p-8 w-full max-w-sm">
                    {/* CMI 3DS header */}
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Authentification</p>
                            <h2 className="text-lg font-bold text-slate-900">3D Secure</h2>
                        </div>
                        <div className="flex gap-1">
                            <span className="text-[10px] font-black text-white px-1.5 py-0.5 rounded" style={{background:'#00843D'}}>CMI</span>
                            <span className="w-10 h-6 flex items-center justify-center rounded" style={{background:'#F26522'}}>
                                <span className="text-[9px] font-black text-white">3DS</span>
                            </span>
                        </div>
                    </div>

                    <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-6 flex items-start gap-2.5">
                        <Smartphone className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-amber-800 leading-relaxed">
                            Un code à usage unique a été envoyé par SMS au numéro lié à votre carte <span className="font-bold">{maskNum(card.number)}</span>.
                        </p>
                    </div>

                    <div className="mb-4">
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                            Code OTP (6 chiffres)
                        </label>
                        <input
                            type="text"
                            inputMode="numeric"
                            maxLength={6}
                            value={otp}
                            onChange={e => { setOtp(e.target.value.replace(/\D/g,'').slice(0,6)); setOtpErr(''); }}
                            className={inputCls + ' text-center text-2xl tracking-[0.5em] font-bold'}
                            placeholder="• • • • • •"
                            autoFocus
                        />
                        {otpErr && (
                            <p className={errCls}><AlertCircle className="h-3 w-3" />{otpErr}</p>
                        )}
                    </div>

                    <button
                        onClick={handleOtp}
                        className="w-full py-3.5 rounded-2xl text-white font-semibold text-sm transition-all hover:opacity-90 hover:shadow-xl flex items-center justify-center gap-2"
                        style={{ background: 'linear-gradient(135deg, #00843D, #0066CC)' }}>
                        <ShieldCheck className="h-4 w-4" />
                        Valider le paiement
                    </button>

                    <p className="text-center text-xs text-slate-400 mt-4">
                        Vous n'avez pas reçu le code ?{' '}
                        <button className="text-[#00843D] font-semibold hover:underline" onClick={() => setOtp('')}>
                            Renvoyer
                        </button>
                    </p>
                </div>
            </div>
        );
    }

    /* ── Confirmation screen ── */
    if (stage === 'confirmed') {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
                <div className="text-center max-w-md">
                    {/* Animated check */}
                    <div className="relative w-24 h-24 mx-auto mb-6">
                        <div className="absolute inset-0 rounded-full animate-ping opacity-20"
                            style={{ background: 'linear-gradient(135deg, #aa5a9e, #6fc7d9)', animationDuration:'1.5s' }} />
                        <div className="relative w-24 h-24 rounded-full flex items-center justify-center shadow-xl"
                            style={{ background: 'linear-gradient(135deg, #aa5a9e, #6fc7d9)' }}>
                            <CheckCircle className="h-12 w-12 text-white" />
                        </div>
                    </div>

                    <h1 className="text-3xl font-bold text-slate-900 mb-2">Commande confirmée !</h1>
                    <p className="text-slate-500 text-sm mb-1">Votre paiement a été accepté avec succès.</p>
                    <p className="text-slate-400 text-xs mb-8">
                        Réf. <span className="font-bold text-slate-600">{orderId}</span> · via{' '}
                        <span className="font-semibold">{meta?.name}</span>
                    </p>

                    <div className="bg-white rounded-2xl border border-slate-100 p-5 mb-8 text-left space-y-2">
                        <div className="flex items-center gap-2 text-sm text-slate-700">
                            <Package className="h-4 w-4 text-[#aa5a9e]" />
                            <span>Un e-mail de confirmation va être envoyé.</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-700">
                            <Truck className="h-4 w-4 text-[#6fc7d9]" />
                            <span>Livraison prévue sous 2–5 jours ouvrables.</span>
                        </div>
                        {giftMessage && (
                            <div className="flex items-start gap-2 text-sm text-slate-700">
                                <MessageSquare className="h-4 w-4 text-[#aa5a9e] flex-shrink-0 mt-0.5" />
                                <span className="italic">"{giftMessage}"</span>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Link to="/orders"
                            className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl text-white text-sm font-semibold hover:opacity-90 hover:shadow-lg transition-all"
                            style={{ background: 'linear-gradient(135deg, #aa5a9e, #6fc7d9)' }}>
                            Voir mes commandes
                            <ChevronRight className="h-4 w-4" />
                        </Link>
                        <Link to="/"
                            className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-white border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition-all">
                            Retour à l'accueil
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    /* ────────────────────────────── MAIN CHECKOUT LAYOUT ── */
    return (
        <div className="min-h-screen bg-slate-50">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

                {/* Header */}
                <div className="mb-8 flex items-center gap-4">
                    <button onClick={() => stage === 'form' ? setStage('method') : navigate('/cart')}
                        className="w-9 h-9 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-all flex-shrink-0">
                        <ArrowLeft className="h-4 w-4" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Paiement sécurisé</h1>
                        <p className="text-slate-400 text-sm mt-0.5 flex items-center gap-1.5">
                            <Lock className="h-3 w-3" />
                            Connexion chiffrée SSL · Vos données sont protégées
                        </p>
                    </div>
                </div>

                {/* Step indicator */}
                <div className="flex items-center gap-2 mb-8">
                    {[
                        { label: 'Méthode', active: stage === 'method', done: stage === 'form' },
                        { label: 'Détails', active: stage === 'form',   done: false },
                    ].map((s, i) => (
                        <div key={i} className="flex items-center gap-2">
                            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all
                                ${s.done ? 'text-white' : s.active ? 'text-white' : 'bg-slate-200 text-slate-400'}`}
                                style={s.done || s.active ? { background: 'linear-gradient(135deg, #aa5a9e, #6fc7d9)' } : {}}>
                                {s.done ? <CheckCircle className="h-4 w-4" /> : i + 1}
                            </div>
                            <span className={`text-sm font-medium ${s.active ? 'text-slate-900' : 'text-slate-400'}`}>
                                {s.label}
                            </span>
                            {i < 1 && <ChevronRight className="h-4 w-4 text-slate-300 mx-1" />}
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* ── LEFT : payment form ── */}
                    <div className="lg:col-span-2 space-y-4">

                        {/* ═══ STAGE: method selection ═══ */}
                        {stage === 'method' && (
                            <div className="space-y-3">
                                <h2 className="font-bold text-slate-900">Choisissez votre méthode de paiement</h2>
                                {METHODS.map(m => (
                                    <button key={m.id} onClick={() => { setMethod(m.id); setStage('form'); }}
                                        className={`w-full text-left bg-white border-2 rounded-2xl p-5 hover:shadow-md transition-all duration-200 group
                                            ${method === m.id ? m.border + ' shadow-md' : 'border-slate-100 hover:border-slate-200'}`}>
                                        <div className="flex items-center gap-4">
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br ${m.bg} border border-white`}>
                                                <CreditCard className="h-5 w-5" style={{ color: m.color }} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <p className="font-bold text-slate-900">{m.name}</p>
                                                    {m.logo}
                                                </div>
                                                <p className="text-xs text-slate-400 mt-0.5">{m.sub}</p>
                                            </div>
                                            <ChevronRight className="h-5 w-5 text-slate-300 group-hover:text-slate-500 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                                        </div>
                                        <p className="text-xs text-slate-500 mt-3 pl-16 leading-relaxed">{m.note}</p>
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* ═══ STAGE: payment form ═══ */}
                        {stage === 'form' && method && meta && (
                            <div>
                                {/* Method badge */}
                                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold mb-5 ${meta.badge}`}>
                                    <ShieldCheck className="h-3.5 w-3.5" />
                                    Paiement via {meta.name}
                                    {meta.logo}
                                </div>

                                {/* ── PAYPAL ── */}
                                {method === 'paypal' && (
                                    <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-5">
                                        <div className="text-center py-4">
                                            <div className="text-5xl font-black mb-2">
                                                <span style={{color:'#003087'}}>Pay</span>
                                                <span style={{color:'#009cde'}}>Pal</span>
                                            </div>
                                            <p className="text-slate-500 text-sm mb-6">
                                                Vous allez être redirigé vers PayPal pour finaliser votre paiement de{' '}
                                                <span className="font-bold text-slate-900">{total.toFixed(2)} DH</span>.
                                            </p>
                                            <div className="bg-slate-50 rounded-xl p-4 text-xs text-slate-500 text-left mb-6 space-y-1.5">
                                                <p className="flex items-center gap-2"><CheckCircle className="h-3.5 w-3.5 text-emerald-500" />Paiement crypté et sécurisé</p>
                                                <p className="flex items-center gap-2"><CheckCircle className="h-3.5 w-3.5 text-emerald-500" />Protection acheteur PayPal incluse</p>
                                                <p className="flex items-center gap-2"><CheckCircle className="h-3.5 w-3.5 text-emerald-500" />Aucune donnée bancaire partagée avec TonCadeau</p>
                                            </div>
                                            <button onClick={handlePayPal} disabled={paypalLoading}
                                                className="w-full py-4 rounded-2xl text-white font-bold text-base transition-all hover:opacity-90 hover:shadow-xl disabled:opacity-60 flex items-center justify-center gap-3"
                                                style={{ background: paypalLoading ? '#ccc' : 'linear-gradient(135deg, #003087, #009cde)' }}>
                                                {paypalLoading ? (
                                                    <><RefreshCw className="h-5 w-5 animate-spin" />Redirection en cours…</>
                                                ) : (
                                                    <><ExternalLink className="h-5 w-5" />Payer avec PayPal</>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* ── CMI / STRIPE card form ── */}
                                {isCard && (
                                    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">

                                        {/* Virtual card preview */}
                                        <div className="p-6 relative overflow-hidden"
                                            style={{ background: method==='cmi'
                                                ? 'linear-gradient(135deg, #00843D 0%, #0066CC 100%)'
                                                : 'linear-gradient(135deg, #635BFF 0%, #0A2540 100%)' }}>
                                            <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full opacity-10"
                                                style={{ background: 'radial-gradient(circle, white, transparent)' }} />
                                            <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full opacity-10"
                                                style={{ background: 'radial-gradient(circle, white, transparent)' }} />
                                            <div className="relative">
                                                <div className="flex justify-between items-start mb-6">
                                                    <div>
                                                        {method==='cmi'
                                                            ? <span className="text-white font-black text-sm tracking-widest">CMI</span>
                                                            : <span className="text-white font-black text-sm italic tracking-tight">stripe</span>}
                                                    </div>
                                                    <div className="w-10 h-7 rounded-md" style={{background:'linear-gradient(135deg,#FFD700,#FFA500,#FFD700)'}} />
                                                </div>
                                                <p className="text-white/60 text-[10px] mb-1 tracking-widest">NUMÉRO DE CARTE</p>
                                                <p className="text-white font-mono text-lg tracking-[0.25em] mb-4">
                                                    {card.number || '•••• •••• •••• ••••'}
                                                </p>
                                                <div className="flex justify-between">
                                                    <div>
                                                        <p className="text-white/60 text-[9px] tracking-widest mb-0.5">TITULAIRE</p>
                                                        <p className="text-white text-sm font-semibold uppercase tracking-wide truncate max-w-[140px]">
                                                            {card.name || 'NOM PRÉNOM'}
                                                        </p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-white/60 text-[9px] tracking-widest mb-0.5">EXPIRATION</p>
                                                        <p className="text-white text-sm font-semibold">{card.expiry || 'MM/YY'}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Form fields */}
                                        <div className="p-6 space-y-4">
                                            {/* Card number */}
                                            <div>
                                                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                                                    Numéro de carte
                                                </label>
                                                <div className="relative">
                                                    <input ref={cardRef} type="text" inputMode="numeric"
                                                        value={card.number} onChange={e => handleCard('number', e.target.value)}
                                                        className={inputCls + (errors.number?' border-red-300 focus:border-red-400 focus:ring-red-100':'')}
                                                        placeholder="1234 5678 9012 3456" maxLength={19} />
                                                    <CreditCard className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                                                </div>
                                                {errors.number && <p className={errCls}><AlertCircle className="h-3 w-3" />{errors.number}</p>}
                                            </div>

                                            {/* Name */}
                                            <div>
                                                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                                                    Nom du titulaire
                                                </label>
                                                <input type="text"
                                                    value={card.name} onChange={e => handleCard('name', e.target.value.toUpperCase())}
                                                    className={inputCls + (errors.name?' border-red-300 focus:border-red-400 focus:ring-red-100':'')}
                                                    placeholder="PRÉNOM NOM" />
                                                {errors.name && <p className={errCls}><AlertCircle className="h-3 w-3" />{errors.name}</p>}
                                            </div>

                                            {/* Expiry + CVV */}
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                                                        Date d'expiration
                                                    </label>
                                                    <input type="text" inputMode="numeric"
                                                        value={card.expiry} onChange={e => handleCard('expiry', e.target.value)}
                                                        className={inputCls + (errors.expiry?' border-red-300 focus:border-red-400 focus:ring-red-100':'')}
                                                        placeholder="MM/AA" maxLength={5} />
                                                    {errors.expiry && <p className={errCls}><AlertCircle className="h-3 w-3" />{errors.expiry}</p>}
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                                                        CVV / CVC
                                                    </label>
                                                    <input type="password" inputMode="numeric"
                                                        value={card.cvv} onChange={e => handleCard('cvv', e.target.value)}
                                                        className={inputCls + (errors.cvv?' border-red-300 focus:border-red-400 focus:ring-red-100':'')}
                                                        placeholder="•••" maxLength={4} />
                                                    {errors.cvv && <p className={errCls}><AlertCircle className="h-3 w-3" />{errors.cvv}</p>}
                                                </div>
                                            </div>

                                            {/* CMI note */}
                                            {method === 'cmi' && (
                                                <div className="bg-blue-50 border border-blue-100 rounded-xl p-3.5 flex items-start gap-2.5">
                                                    <Smartphone className="h-4 w-4 text-blue-500 flex-shrink-0 mt-0.5" />
                                                    <p className="text-xs text-blue-700 leading-relaxed">
                                                        Une authentification <strong>3D Secure</strong> sera requise. Vous recevrez un code OTP par SMS de votre banque.
                                                    </p>
                                                </div>
                                            )}

                                            {/* Submit */}
                                            <button onClick={handleCardSubmit}
                                                className="w-full py-3.5 rounded-2xl text-white font-semibold text-sm transition-all hover:opacity-90 hover:shadow-xl flex items-center justify-center gap-2 mt-2"
                                                style={{ background: method==='cmi'
                                                    ? 'linear-gradient(135deg, #00843D, #0066CC)'
                                                    : 'linear-gradient(135deg, #635BFF, #0A2540)' }}>
                                                <Lock className="h-4 w-4" />
                                                Payer {total.toFixed(2)} DH
                                            </button>

                                            <p className="text-center text-xs text-slate-400 flex items-center justify-center gap-1.5">
                                                <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                                                Paiement sécurisé · Chiffrement SSL 256 bits
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* ── RIGHT : order summary ── */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl border border-slate-100 p-5 sticky top-24 space-y-5">
                            <h3 className="font-bold text-slate-900 text-sm">Récapitulatif</h3>

                            {/* Gift bundles */}
                            {giftBundles.length > 0 && (
                                <div className="space-y-2">
                                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                                        <Gift className="h-3 w-3 text-[#aa5a9e]" />
                                        Cadeaux composés ({giftBundles.length})
                                    </p>
                                    {giftBundles.map(b => (
                                        <div key={b.id} className="rounded-xl border border-[#aa5a9e]/20 bg-[#aa5a9e]/5 px-3 py-2.5 space-y-1.5">
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs font-bold text-[#aa5a9e]">
                                                    {b.personaLabel || 'Cadeau'}{b.recipientName ? ` · ${b.recipientName}` : ''}
                                                </span>
                                                <span className="text-xs font-bold text-slate-900">{b.total.toFixed(2)} DH</span>
                                            </div>
                                            {b.items.map((it, i) => (
                                                <div key={i} className="flex items-center gap-2 text-xs text-slate-600">
                                                    <img src={it.image||'/placeholder.jpg'} alt={it.name}
                                                        onError={e=>{(e.target as HTMLImageElement).src='/placeholder.jpg';}}
                                                        className="w-7 h-7 rounded-lg object-cover bg-slate-100 flex-shrink-0" />
                                                    <span className="flex-1 truncate">{it.name}</span>
                                                    <span className="text-slate-400 flex-shrink-0">x{it.quantity}</span>
                                                </div>
                                            ))}
                                            {b.message && <p className="text-[10px] italic text-slate-500 border-t border-[#aa5a9e]/10 pt-1.5">"{b.message}"</p>}
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Items */}
                            {items.length > 0 && (
                            <div className="space-y-3 max-h-40 overflow-y-auto pr-1">
                                {items.map(item => (
                                    <div key={item.id} className="flex items-center gap-3">
                                        <div className="relative flex-shrink-0">
                                            <img src={item.image||'/placeholder.jpg'} alt={item.name}
                                                onError={e=>{(e.target as HTMLImageElement).src='/placeholder.jpg';}}
                                                className="w-12 h-12 rounded-lg object-cover bg-slate-100" />
                                            <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-slate-700 text-white text-[10px] font-bold flex items-center justify-center">
                                                {item.quantity}
                                            </span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-slate-900 truncate">{item.name}</p>
                                        </div>
                                        <p className="text-sm font-bold text-slate-900 flex-shrink-0">
                                            {(item.price * item.quantity).toFixed(2)} DH
                                        </p>
                                    </div>
                                ))}
                            </div>
                            )}

                            {/* Delivery summary */}
                            {deliveryInfo.recipientName && (
                                <div className="border-t border-slate-100 pt-4 space-y-1">
                                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Livraison</p>
                                    <p className="text-sm text-slate-700 font-medium">{deliveryInfo.recipientName}</p>
                                    <p className="text-xs text-slate-400 leading-relaxed">{deliveryInfo.deliveryAddress}</p>
                                </div>
                            )}

                            {/* Totals */}
                            <div className="border-t border-slate-100 pt-4 space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Sous-total</span>
                                    <span className="text-slate-900 font-medium">{total.toFixed(2)} DH</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Livraison</span>
                                    <span className="font-semibold text-emerald-500">Gratuite</span>
                                </div>
                                <div className="flex justify-between items-end pt-2 border-t border-slate-100">
                                    <span className="font-bold text-slate-900">Total</span>
                                    <div className="text-right">
                                        <p className="text-xl font-bold" style={{ color: '#aa5a9e' }}>
                                            {total.toFixed(2)} DH
                                        </p>
                                        <p className="text-xs text-slate-400">${(total * 0.10).toFixed(2)}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Trust badges */}
                            <div className="border-t border-slate-100 pt-4 grid grid-cols-3 gap-2">
                                {[
                                    { icon: ShieldCheck, label: 'Sécurisé', color: '#00843D' },
                                    { icon: Lock,        label: 'Chiffré',  color: '#635BFF' },
                                    { icon: CreditCard,  label: '3D Secure', color: '#aa5a9e' },
                                ].map(({ icon: Icon, label, color }) => (
                                    <div key={label} className="flex flex-col items-center gap-1 text-center">
                                        <Icon className="h-5 w-5" style={{ color }} />
                                        <span className="text-[10px] text-slate-400 font-medium">{label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
