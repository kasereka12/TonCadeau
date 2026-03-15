import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle, Lock } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useLang } from '../context/LanguageContext';

const ForgotPasswordPage = () => {
    const { t } = useLang();
    const [email, setEmail]     = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent]       = useState(false);
    const [error, setError]     = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password`,
        });

        setLoading(false);

        if (err) {
            setError(t.common.error);
        } else {
            setSent(true);
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Left panel */}
            <div
                className="hidden lg:flex lg:w-1/2 bg-cover bg-center relative"
                style={{ backgroundImage: "url('/bannier4.jpg')" }}
            >
                <div className="absolute inset-0 bg-gradient-to-br from-[#6fc7d9]/90 to-[#a7549b]/90" />
                <div className="relative z-10 flex flex-col justify-center items-center text-center px-12 text-white">
                    <div className="w-24 h-24 mx-auto mb-6 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center">
                        <Lock className="h-12 w-12 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold mb-4">{t.auth.forgotTitle}</h1>
                    <div className="h-1 w-24 bg-white mx-auto rounded-full mb-6" />
                    <p className="text-lg max-w-sm leading-relaxed opacity-90">{t.auth.forgotDesc}</p>
                </div>
            </div>

            {/* Right panel */}
            <div className="w-full lg:w-1/2 flex items-center justify-center bg-gradient-to-br from-[#6fc7d9]/5 to-[#a7549b]/5 px-8">
                <div className="w-full max-w-md">
                    <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl p-10 border border-white/50">

                        {sent ? (
                            /* ── Success state ── */
                            <div className="text-center py-4">
                                <div className="w-20 h-20 mx-auto mb-6 bg-emerald-100 rounded-full flex items-center justify-center">
                                    <CheckCircle className="h-10 w-10 text-emerald-500" />
                                </div>
                                <h2 className="text-2xl font-bold text-slate-900 mb-3">Email envoyé !</h2>
                                <p className="text-slate-600 text-sm leading-relaxed mb-8">{t.auth.resetSent}</p>
                                <Link to="/login"
                                    className="inline-flex items-center gap-2 text-sm font-semibold text-[#a7549b] hover:text-[#6fc7d9] transition-colors">
                                    <ArrowLeft className="h-4 w-4" />
                                    {t.auth.backToLogin}
                                </Link>
                            </div>
                        ) : (
                            /* ── Form state ── */
                            <>
                                <div className="text-center mb-8">
                                    <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-[#6fc7d9] to-[#a7549b] rounded-full flex items-center justify-center">
                                        <Mail className="h-10 w-10 text-white" />
                                    </div>
                                    <h2 className="text-3xl font-bold bg-gradient-to-r from-[#6fc7d9] to-[#a7549b] bg-clip-text text-transparent">
                                        {t.auth.forgotTitle}
                                    </h2>
                                    <p className="text-gray-500 mt-2 text-sm leading-relaxed">{t.auth.forgotDesc}</p>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-5">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            {t.auth.email}
                                        </label>
                                        <input
                                            type="email"
                                            required
                                            value={email}
                                            onChange={e => setEmail(e.target.value)}
                                            placeholder="votre@email.com"
                                            className="w-full px-4 py-3 border-2 border-[#6fc7d9]/30 rounded-xl focus:ring-2 focus:ring-[#a7549b] focus:border-[#a7549b] transition-all outline-none"
                                        />
                                    </div>

                                    {error && (
                                        <p className="text-red-500 text-sm text-center font-medium bg-red-50 py-2 px-4 rounded-xl">
                                            {error}
                                        </p>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-gradient-to-r from-[#6fc7d9] to-[#a7549b] text-white py-4 rounded-xl font-bold hover:shadow-xl hover:scale-105 transition-all duration-300 disabled:opacity-60 disabled:scale-100">
                                        {loading ? t.auth.sending : t.auth.sendLink}
                                    </button>
                                </form>

                                <div className="mt-6 text-center">
                                    <Link to="/login"
                                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#a7549b] hover:text-[#6fc7d9] transition-colors">
                                        <ArrowLeft className="h-4 w-4" />
                                        {t.auth.backToLogin}
                                    </Link>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
