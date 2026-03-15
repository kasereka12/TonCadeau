import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Trash2, Edit3, Calendar, Bell, Check, X, RotateCcw, Cake, Heart, PartyPopper, Lock, Info } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import type { ImportantDate } from '../types/index';

// ── Constants ─────────────────────────────────────────────────────────────────

const DATE_TYPES: { value: ImportantDate['type']; label: string; icon: LucideIcon; color: string }[] = [
    { value: 'birthday',    label: 'Anniversaire',           icon: Cake,        color: 'from-pink-400 to-rose-500' },
    { value: 'anniversary', label: 'Anniversaire de couple', icon: Heart,       color: 'from-red-400 to-pink-500' },
    { value: 'fete',        label: 'Fête / Célébration',     icon: PartyPopper, color: 'from-amber-400 to-orange-500' },
    { value: 'other',       label: 'Autre',                  icon: Calendar,    color: 'from-[#6fc7d9] to-[#aa5a9e]' },
];

const REMINDER_OPTIONS = [
    { value: 1,  label: '1 jour avant' },
    { value: 3,  label: '3 jours avant' },
    { value: 7,  label: '1 semaine avant' },
    { value: 14, label: '2 semaines avant' },
    { value: 30, label: '1 mois avant' },
];

const EMPTY_FORM = {
    title: '',
    date: '',
    type: 'birthday' as ImportantDate['type'],
    reminder_days: 7,
    recurring: true,
    notes: '',
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function getNextOccurrence(dateStr: string, recurring: boolean): Date | null {
    const [year, month, day] = dateStr.split('-').map(Number);
    const today = new Date(); today.setHours(0, 0, 0, 0);
    if (!recurring) {
        const d = new Date(year, month - 1, day);
        return d >= today ? d : null;
    }
    let d = new Date(today.getFullYear(), month - 1, day);
    if (d < today) d = new Date(today.getFullYear() + 1, month - 1, day);
    return d;
}

function daysUntil(dateStr: string, recurring: boolean): number | null {
    const next = getNextOccurrence(dateStr, recurring);
    if (!next) return null;
    const today = new Date(); today.setHours(0, 0, 0, 0);
    return Math.round((next.getTime() - today.getTime()) / 86_400_000);
}

function formatDate(dateStr: string): string {
    const [, month, day] = dateStr.split('-').map(Number);
    return new Date(2000, month - 1, day).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' });
}

function typeInfo(type: ImportantDate['type']) {
    return DATE_TYPES.find(t => t.value === type) ?? DATE_TYPES[3];
}

// ── Component ─────────────────────────────────────────────────────────────────

const ImportantDatesPage = () => {
    const { user } = useAuth();
    const { importantDates, addDate, updateDate, deleteDate, loading } = useNotifications();
    const { toast } = useToast();

    const [form, setForm] = useState(EMPTY_FORM);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [showForm, setShowForm] = useState(false);

    // ── Not logged in ──
    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center px-6"
                style={{ background: 'linear-gradient(135deg, #aa5a9e22 0%, #ffffff 50%, #6fc7d922 100%)' }}>
                <div className="text-center max-w-sm">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-3xl flex items-center justify-center"
                        style={{ background: 'linear-gradient(135deg, #aa5a9e22, #6fc7d922)' }}>
                        <Lock className="h-9 w-9 text-[#aa5a9e]" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900 mb-2">Connexion requise</h1>
                    <p className="text-slate-400 text-sm mb-8">
                        Connectez-vous pour gérer vos dates importantes et recevoir des rappels personnalisés.
                    </p>
                    <Link to="/login"
                        className="inline-flex items-center gap-2 text-white px-8 py-3.5 rounded-2xl text-sm font-semibold hover:opacity-90 hover:shadow-xl transition-all"
                        style={{ background: 'linear-gradient(135deg, #aa5a9e, #6fc7d9)' }}>
                        Se connecter
                    </Link>
                </div>
            </div>
        );
    }

    // ── Form handlers ──
    const resetForm = () => { setForm(EMPTY_FORM); setEditingId(null); setShowForm(false); };

    const startEdit = (d: ImportantDate) => {
        setForm({ title: d.title, date: d.date, type: d.type, reminder_days: d.reminder_days, recurring: d.recurring, notes: d.notes ?? '' });
        setEditingId(d.id);
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.title || !form.date) { toast('Titre et date sont requis.', 'error'); return; }
        setSubmitting(true);
        try {
            if (editingId) {
                await updateDate(editingId, form);
                toast('Date mise à jour !', 'success');
            } else {
                await addDate(form);
                toast('Date ajoutée ! Vous recevrez un rappel.', 'success');
            }
            resetForm();
        } catch {
            toast('Une erreur est survenue.', 'error');
        }
        setSubmitting(false);
    };

    const handleDelete = async (id: string, title: string) => {
        if (!window.confirm(`Supprimer "${title}" ?`)) return;
        await deleteDate(id);
        toast('Date supprimée.', 'info');
    };

    // ── Sort dates by next occurrence ──
    const sortedDates = [...importantDates].sort((a, b) => {
        const da = daysUntil(a.date, a.recurring) ?? 999;
        const db = daysUntil(b.date, b.recurring) ?? 999;
        return da - db;
    });

    return (
        <div className="min-h-screen bg-slate-50">

            {/* ── Hero ── */}
            <div className="relative overflow-hidden py-12 px-4 text-center"
                style={{ background: 'linear-gradient(135deg, #aa5a9e 0%, #8a4db0 50%, #6fc7d9 100%)' }}>
                <div className="max-w-3xl mx-auto">
                    <div className="inline-flex items-center gap-2 bg-white/15 rounded-full px-4 py-1.5 text-white/80 text-sm font-medium mb-4">
                        <Bell className="h-3.5 w-3.5" />
                        Rappels personnalisés
                    </div>
                    <h1 className="text-4xl font-bold text-white mb-3">Mon Calendrier</h1>
                    <p className="text-white/70 text-lg mb-6">
                        Enregistrez vos dates importantes et recevez des alertes pour ne jamais oublier.
                    </p>
                    {!showForm && (
                        <button
                            onClick={() => setShowForm(true)}
                            className="inline-flex items-center gap-2 bg-white text-[#aa5a9e] px-6 py-3 rounded-2xl font-semibold text-sm hover:bg-white/90 hover:shadow-xl transition-all"
                        >
                            <Plus className="h-4 w-4" />
                            Ajouter une date
                        </button>
                    )}
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-10 space-y-6">

                {/* ── Add / Edit form ── */}
                {showForm && (
                    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-50 flex items-center justify-between"
                            style={{ background: 'linear-gradient(135deg, #aa5a9e08, #6fc7d908)' }}>
                            <h2 className="font-bold text-slate-900">
                                {editingId ? 'Modifier la date' : 'Nouvelle date importante'}
                            </h2>
                            <button onClick={resetForm} className="text-slate-400 hover:text-slate-600 transition-colors">
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-5">
                            {/* Type selector */}
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                                    Type d'événement
                                </label>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                    {DATE_TYPES.map(t => (
                                        <button
                                            key={t.value}
                                            type="button"
                                            onClick={() => setForm(f => ({ ...f, type: t.value }))}
                                            className={`flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border-2 text-center transition-all ${
                                                form.type === t.value
                                                    ? 'border-[#aa5a9e] bg-[#aa5a9e]/5 text-[#aa5a9e]'
                                                    : 'border-slate-100 bg-slate-50 text-slate-500 hover:border-slate-200'
                                            }`}
                                        >
                                            <t.icon className="h-5 w-5" />
                                            <span className="text-[11px] font-semibold leading-tight">{t.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Title + Date row */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                                        Titre <span className="text-[#aa5a9e]">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={form.title}
                                        onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                                        placeholder="Ex: Anniversaire de Maman"
                                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#aa5a9e] focus:ring-2 focus:ring-[#aa5a9e]/15 transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                                        Date <span className="text-[#aa5a9e]">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        value={form.date}
                                        onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-[#aa5a9e] focus:ring-2 focus:ring-[#aa5a9e]/15 transition-all"
                                    />
                                </div>
                            </div>

                            {/* Reminder + Recurring row */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                                        Me rappeler
                                    </label>
                                    <select
                                        value={form.reminder_days}
                                        onChange={e => setForm(f => ({ ...f, reminder_days: Number(e.target.value) }))}
                                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-[#aa5a9e] focus:ring-2 focus:ring-[#aa5a9e]/15 transition-all"
                                    >
                                        {REMINDER_OPTIONS.map(o => (
                                            <option key={o.value} value={o.value}>{o.label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                                        Se répète chaque année
                                    </label>
                                    <button
                                        type="button"
                                        onClick={() => setForm(f => ({ ...f, recurring: !f.recurring }))}
                                        className={`flex items-center gap-3 w-full px-4 py-2.5 rounded-xl border-2 text-sm font-medium transition-all ${
                                            form.recurring
                                                ? 'border-[#aa5a9e] bg-[#aa5a9e]/5 text-[#aa5a9e]'
                                                : 'border-slate-200 bg-slate-50 text-slate-500'
                                        }`}
                                    >
                                        <RotateCcw className="h-4 w-4" />
                                        {form.recurring ? 'Oui, chaque année' : 'Non, une seule fois'}
                                    </button>
                                </div>
                            </div>

                            {/* Notes */}
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                                    Notes (optionnel)
                                </label>
                                <textarea
                                    value={form.notes}
                                    onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                                    placeholder="Idées cadeaux, préférences..."
                                    rows={2}
                                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#aa5a9e] focus:ring-2 focus:ring-[#aa5a9e]/15 transition-all resize-none"
                                />
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 pt-1">
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex items-center gap-2 text-white px-6 py-3 rounded-2xl font-semibold text-sm transition-all hover:opacity-90 hover:shadow-lg disabled:opacity-60"
                                    style={{ background: 'linear-gradient(135deg, #aa5a9e, #6fc7d9)' }}
                                >
                                    <Check className="h-4 w-4" />
                                    {editingId ? 'Enregistrer' : 'Ajouter'}
                                </button>
                                <button type="button" onClick={resetForm}
                                    className="px-6 py-3 rounded-2xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 transition-all">
                                    Annuler
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* ── Dates list ── */}
                {loading ? (
                    <div className="flex items-center justify-center py-16">
                        <div className="w-10 h-10 rounded-full border-4 border-[#aa5a9e]/20 border-t-[#aa5a9e] animate-spin" />
                    </div>
                ) : sortedDates.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-3xl border border-slate-100">
                        <Calendar className="h-12 w-12 mx-auto mb-4 text-slate-300" />
                        <h3 className="text-xl font-bold text-slate-900 mb-2">Aucune date enregistrée</h3>
                        <p className="text-slate-400 text-sm mb-6">
                            Ajoutez des dates importantes pour recevoir des rappels et ne jamais oublier.
                        </p>
                        <button
                            onClick={() => setShowForm(true)}
                            className="inline-flex items-center gap-2 text-white px-6 py-3 rounded-2xl font-semibold text-sm hover:opacity-90 hover:shadow-lg transition-all"
                            style={{ background: 'linear-gradient(135deg, #aa5a9e, #6fc7d9)' }}
                        >
                            <Plus className="h-4 w-4" />
                            Ajouter ma première date
                        </button>
                    </div>
                ) : (
                    <div className="space-y-3">
                        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider px-1">
                            {sortedDates.length} date{sortedDates.length > 1 ? 's' : ''} enregistrée{sortedDates.length > 1 ? 's' : ''}
                        </h2>
                        {sortedDates.map(d => {
                            const days = daysUntil(d.date, d.recurring);
                            const info = typeInfo(d.type);
                            const isToday = days === 0;
                            const isSoon  = days !== null && days <= d.reminder_days && days > 0;
                            const isPast  = days === null;

                            return (
                                <div
                                    key={d.id}
                                    className={`bg-white rounded-2xl border overflow-hidden transition-all hover:shadow-md group ${
                                        isToday ? 'border-[#aa5a9e] shadow-md' : isSoon ? 'border-amber-200' : 'border-slate-100'
                                    }`}
                                >
                                    <div className="flex items-center gap-4 p-5">
                                        {/* Icon */}
                                        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${info.color} flex items-center justify-center flex-shrink-0 shadow-sm`}>
                                            <info.icon className="h-6 w-6 text-white" />
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start gap-2 flex-wrap">
                                                <h3 className="font-bold text-slate-900 text-base truncate">{d.title}</h3>
                                                {isToday && (
                                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white flex-shrink-0"
                                                        style={{ background: 'linear-gradient(135deg, #aa5a9e, #6fc7d9)' }}>
                                                        AUJOURD'HUI
                                                    </span>
                                                )}
                                                {isSoon && (
                                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 flex-shrink-0">
                                                        Dans {days} jour{days! > 1 ? 's' : ''}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-3 mt-1 flex-wrap">
                                                <span className="flex items-center gap-1 text-sm text-slate-500">
                                                    <Calendar className="h-3.5 w-3.5" />
                                                    {formatDate(d.date)}
                                                    {d.recurring && <RotateCcw className="h-3 w-3 ml-0.5 text-slate-300" />}
                                                </span>
                                                <span className="flex items-center gap-1 text-sm text-slate-400">
                                                    <Bell className="h-3.5 w-3.5" />
                                                    {d.reminder_days}j avant
                                                </span>
                                                {isPast && !d.recurring && (
                                                    <span className="text-xs text-slate-300 italic">Date passée</span>
                                                )}
                                                {!isPast && !isToday && !isSoon && days !== null && (
                                                    <span className="text-sm text-slate-400">Dans {days} jour{days > 1 ? 's' : ''}</span>
                                                )}
                                            </div>
                                            {d.notes && (
                                                <p className="text-xs text-slate-400 mt-1 italic truncate">{d.notes}</p>
                                            )}
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => startEdit(d)}
                                                className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-[#aa5a9e] hover:bg-[#aa5a9e]/8 transition-all"
                                            >
                                                <Edit3 className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(d.id, d.title)}
                                                className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* ── CTA to shop ── */}
                {sortedDates.length > 0 && (
                    <div className="rounded-2xl p-5 text-center"
                        style={{ background: 'linear-gradient(135deg, #aa5a9e15, #6fc7d915)' }}>
                        <p className="text-slate-700 font-medium mb-3 flex items-center justify-center gap-2">
                            <Info className="h-4 w-4 text-slate-500" />
                            Une date approche ? Trouvez le cadeau parfait dès maintenant.
                        </p>
                        <Link to="/products"
                            className="inline-flex items-center gap-2 text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:opacity-90 hover:shadow-md transition-all"
                            style={{ background: 'linear-gradient(135deg, #aa5a9e, #6fc7d9)' }}>
                            Voir les produits
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ImportantDatesPage;
