import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { User, Mail, Shield, Calendar, Save, KeyRound, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LanguageContext';

const ROLE_COLORS: Record<string, string> = {
    admin:    'bg-red-100 text-red-700',
    supplier: 'bg-[#aa5a9e]/10 text-[#aa5a9e]',
    client:   'bg-[#6fc7d9]/10 text-[#3b9db2]',
};

const ProfilePage = () => {
    const { user } = useAuth();
    const { t }    = useLang();

    const [fullName, setFullName]         = useState(user?.user_metadata?.full_name ?? '');
    const [saving, setSaving]             = useState(false);
    const [saved, setSaved]               = useState(false);

    const [newPassword, setNewPassword]   = useState('');
    const [showPwd, setShowPwd]           = useState(false);
    const [savingPwd, setSavingPwd]       = useState(false);
    const [pwdSaved, setPwdSaved]         = useState(false);
    const [pwdError, setPwdError]         = useState('');

    if (!user) return <Navigate to="/login" replace />;

    const role        = (user.user_metadata?.role as string) || 'client';
    const email       = user.email ?? '';
    const createdAt   = new Date(user.created_at).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' });

    const roleLabelMap: Record<string, string> = {
        admin:    t.profile.admin,
        supplier: t.profile.supplier,
        client:   t.profile.client,
    };

    const handleSaveProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        await supabase.auth.updateUser({ data: { full_name: fullName } });
        // Sync profiles table
        await supabase.from('profiles').update({ full_name: fullName }).eq('id', user.id);
        setSaving(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
    };

    const handleSavePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setPwdError('');
        if (newPassword.length < 8) { setPwdError(t.profile.passwordHint); return; }
        setSavingPwd(true);
        const { error } = await supabase.auth.updateUser({ password: newPassword });
        setSavingPwd(false);
        if (error) { setPwdError(t.common.error); return; }
        setPwdSaved(true);
        setNewPassword('');
        setTimeout(() => setPwdSaved(false), 2500);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#6fc7d9]/5 to-[#a7549b]/5 py-10 px-4">
            <div className="max-w-2xl mx-auto space-y-6">

                {/* Header card */}
                <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 flex flex-col sm:flex-row items-center gap-6">
                    <div className="w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-bold flex-shrink-0"
                        style={{ background: 'linear-gradient(135deg, #aa5a9e, #6fc7d9)' }}>
                        {(user.user_metadata?.full_name?.[0] ?? email[0] ?? '?').toUpperCase()}
                    </div>
                    <div className="text-center sm:text-left">
                        <h1 className="text-2xl font-bold text-slate-900">
                            {user.user_metadata?.full_name || email}
                        </h1>
                        <p className="text-slate-500 text-sm mt-0.5">{email}</p>
                        <span className={`inline-block mt-2 text-xs font-bold px-3 py-1 rounded-full ${ROLE_COLORS[role] ?? ROLE_COLORS.client}`}>
                            {roleLabelMap[role] ?? role}
                        </span>
                    </div>
                </div>

                {/* Personal info */}
                <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
                    <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                        <User className="h-5 w-5 text-[#aa5a9e]" />
                        {t.profile.personalInfo}
                    </h2>

                    <form onSubmit={handleSaveProfile} className="space-y-5">
                        {/* Full name */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t.profile.fullName}</label>
                            <input
                                type="text"
                                value={fullName}
                                onChange={e => setFullName(e.target.value)}
                                className="w-full px-4 py-3 border-2 border-[#6fc7d9]/30 rounded-xl focus:ring-2 focus:ring-[#a7549b] focus:border-[#a7549b] transition-all outline-none"
                            />
                        </div>

                        {/* Email (read-only) */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
                                <Mail className="h-3.5 w-3.5" /> {t.profile.email}
                            </label>
                            <input
                                type="email"
                                value={email}
                                readOnly
                                className="w-full px-4 py-3 border-2 border-slate-100 bg-slate-50 text-slate-500 rounded-xl cursor-not-allowed"
                            />
                        </div>

                        {/* Role */}
                        <div className="flex gap-6">
                            <div className="flex-1">
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
                                    <Shield className="h-3.5 w-3.5" /> {t.profile.role}
                                </label>
                                <div className="px-4 py-3 rounded-xl bg-slate-50 border-2 border-slate-100">
                                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${ROLE_COLORS[role] ?? ROLE_COLORS.client}`}>
                                        {roleLabelMap[role] ?? role}
                                    </span>
                                </div>
                            </div>
                            <div className="flex-1">
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
                                    <Calendar className="h-3.5 w-3.5" /> {t.profile.memberSince}
                                </label>
                                <div className="px-4 py-3 rounded-xl bg-slate-50 border-2 border-slate-100 text-sm text-slate-600">
                                    {createdAt}
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={saving}
                            className="flex items-center gap-2 px-6 py-3 rounded-xl text-white text-sm font-semibold transition-all hover:opacity-90 hover:shadow-lg disabled:opacity-60"
                            style={{ background: 'linear-gradient(135deg, #aa5a9e, #6fc7d9)' }}>
                            {saved
                                ? <><CheckCircle className="h-4 w-4" />{t.profile.saved}</>
                                : saving
                                    ? <><Save className="h-4 w-4 animate-spin" />{t.profile.saving}</>
                                    : <><Save className="h-4 w-4" />{t.profile.saveChanges}</>
                            }
                        </button>
                    </form>
                </div>

                {/* Change password */}
                <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
                    <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                        <KeyRound className="h-5 w-5 text-[#aa5a9e]" />
                        {t.profile.changePassword}
                    </h2>

                    <form onSubmit={handleSavePassword} className="space-y-5">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t.profile.newPassword}</label>
                            <div className="relative">
                                <input
                                    type={showPwd ? 'text' : 'password'}
                                    value={newPassword}
                                    onChange={e => setNewPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full px-4 py-3 pr-12 border-2 border-[#6fc7d9]/30 rounded-xl focus:ring-2 focus:ring-[#a7549b] focus:border-[#a7549b] transition-all outline-none"
                                />
                                <button type="button" onClick={() => setShowPwd(v => !v)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#a7549b] transition-colors">
                                    {showPwd ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                            <p className="text-xs text-slate-400 mt-1">{t.profile.passwordHint}</p>
                        </div>

                        {pwdError && (
                            <p className="text-red-500 text-sm font-medium bg-red-50 py-2 px-4 rounded-xl">{pwdError}</p>
                        )}

                        <button
                            type="submit"
                            disabled={savingPwd || !newPassword}
                            className="flex items-center gap-2 px-6 py-3 rounded-xl text-white text-sm font-semibold transition-all hover:opacity-90 hover:shadow-lg disabled:opacity-50"
                            style={{ background: 'linear-gradient(135deg, #aa5a9e, #6fc7d9)' }}>
                            {pwdSaved
                                ? <><CheckCircle className="h-4 w-4" />{t.profile.passwordUpdated}</>
                                : savingPwd
                                    ? t.profile.saving
                                    : <><KeyRound className="h-4 w-4" />{t.profile.changePassword}</>
                            }
                        </button>
                    </form>
                </div>

            </div>
        </div>
    );
};

export default ProfilePage;
