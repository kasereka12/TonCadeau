import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { User, Eye, EyeOff, Gift, MessageSquare, Star, Lock, Store, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
    const { signIn } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Detect if redirected from a protected page
    const from = (location.state as { from?: string })?.from ?? '';

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const { data, error: signInError } = await signIn(email, password);
        setLoading(false);

        if (signInError) {
            setError('Email ou mot de passe incorrect.');
            return;
        }

        const role = data?.user?.user_metadata?.role;

        // Rediriger selon le rôle
        if (role === 'supplier') {
            navigate('/supplier');
        } else if (role === 'admin') {
            navigate('/admin/gestion');
        } else {
            navigate('/');
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Colonne Gauche */}
            <div
                className="hidden lg:flex lg:w-1/2 bg-cover bg-center relative"
                style={{ backgroundImage: "url('/bannier4.jpg')" }}
            >
                <div className="absolute inset-0 bg-gradient-to-br from-[#6fc7d9]/90 to-[#a7549b]/90" />
                <div className="relative z-10 flex flex-col justify-center items-center text-center px-12 text-white">
                    <div className="mb-8">
                        <div className="w-24 h-24 mx-auto mb-6 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center">
                            <User className="h-14 w-14 text-white" />
                        </div>
                        <h1 className="text-5xl font-bold mb-4">Bienvenue</h1>
                        <div className="h-1 w-32 bg-white mx-auto rounded-full" />
                    </div>
                    <p className="text-xl max-w-md leading-relaxed">
                        Connectez-vous pour accéder à votre espace personnel et suivre vos commandes
                    </p>
                    <div className="mt-10 grid grid-cols-1 gap-4 w-full max-w-xs">
                        <div className="bg-white/20 backdrop-blur-md rounded-xl p-4 flex items-center gap-4">
                            <Gift className="h-6 w-6 text-white/80" />
                            <p className="text-sm font-semibold text-left">Accédez à vos commandes</p>
                        </div>
                        <div className="bg-white/20 backdrop-blur-md rounded-xl p-4 flex items-center gap-4">
                            <MessageSquare className="h-6 w-6 text-white/80" />
                            <p className="text-sm font-semibold text-left">Gérez vos messages cadeaux</p>
                        </div>
                        <div className="bg-white/20 backdrop-blur-md rounded-xl p-4 flex items-center gap-4">
                            <Star className="h-6 w-6 text-white/80" />
                            <p className="text-sm font-semibold text-left">Profitez d'offres exclusives</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Colonne Droite */}
            <div className="w-full lg:w-1/2 flex items-center justify-center bg-gradient-to-br from-[#6fc7d9]/5 to-[#a7549b]/5 px-8">
                <div className="w-full max-w-md">
                    <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl p-10 border border-white/50">
                        <div className="text-center mb-8">
                            <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-[#6fc7d9] to-[#a7549b] rounded-full flex items-center justify-center">
                                {from === '/admin/gestion' ? <Settings className="h-10 w-10 text-white" /> :
                                 from === '/supplier'      ? <Store    className="h-10 w-10 text-white" /> :
                                                            <User     className="h-10 w-10 text-white" />}
                            </div>
                            <h2 className="text-3xl font-bold bg-gradient-to-r from-[#6fc7d9] to-[#a7549b] bg-clip-text text-transparent">
                                Connexion
                            </h2>
                            <p className="text-gray-600 mt-2">
                                {from === '/admin/gestion' ? 'Espace administrateur' :
                                 from === '/supplier'      ? 'Espace fournisseur' :
                                                            'Accédez à votre espace personnel'}
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    className="w-full px-4 py-3 border-2 border-[#6fc7d9]/30 rounded-xl focus:ring-2 focus:ring-[#a7549b] focus:border-[#a7549b] transition-all"
                                    placeholder="votre@email.com"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Mot de passe
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        className="w-full px-4 py-3 pr-12 border-2 border-[#6fc7d9]/30 rounded-xl focus:ring-2 focus:ring-[#a7549b] focus:border-[#a7549b] transition-all"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(v => !v)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#a7549b] transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                            </div>

                            {error && (
                                <p className="text-red-500 text-sm text-center font-medium bg-red-50 py-2 px-4 rounded-xl">
                                    {error}
                                </p>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-[#6fc7d9] to-[#a7549b] text-white py-4 rounded-xl font-bold hover:shadow-xl hover:scale-105 transition-all duration-300 disabled:opacity-60 disabled:scale-100"
                            >
                                {loading ? 'Connexion...' : 'Se connecter'}
                            </button>
                        </form>

                        <div className="mt-6 text-center space-y-3">
                            <p className="text-sm text-gray-600">
                                Pas encore de compte ?{' '}
                                <Link to="/register" className="text-[#a7549b] hover:text-[#6fc7d9] font-semibold">
                                    Créer un compte
                                </Link>
                            </p>
                            <p className="text-sm text-gray-600">
                                Vous êtes fournisseur ?{' '}
                                <Link to="/supplier" className="text-[#a7549b] hover:text-[#6fc7d9] font-semibold">
                                    Espace fournisseur
                                </Link>
                            </p>
                        </div>

                        <div className="mt-6 p-4 bg-gradient-to-r from-[#6fc7d9]/10 to-[#a7549b]/10 rounded-xl">
                            <p className="text-xs text-gray-600 text-center">
                                <Lock className="inline h-3.5 w-3.5 mr-1" />Connexion sécurisée par Supabase Auth
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
