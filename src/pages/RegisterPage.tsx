import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { UserPlus, Store, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

type Role = 'client' | 'supplier';

const RegisterPage = () => {
    const { signUp } = useAuth();

    const [role, setRole] = useState<Role>('client');
    const [fullName, setFullName] = useState('');
    const [supplierName, setSupplierName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Les mots de passe ne correspondent pas.');
            return;
        }
        if (password.length < 6) {
            setError('Le mot de passe doit contenir au moins 6 caractères.');
            return;
        }
        if (role === 'supplier' && !supplierName.trim()) {
            setError('Veuillez entrer le nom de votre boutique.');
            return;
        }

        setLoading(true);

        const metadata: Record<string, string> = {
            role,
            full_name: fullName,
            ...(role === 'supplier' && { supplier_name: supplierName }),
        };

        const { error: signUpError } = await signUp(email, password, metadata);
        setLoading(false);

        if (signUpError) {
            setError(signUpError.message);
            return;
        }

        setSuccess(true);
    };

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#6fc7d9]/10 via-white to-[#a7549b]/10 px-6">
                <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl p-10 border border-white/50 max-w-md w-full text-center">
                    <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-[#6fc7d9] to-[#a7549b] rounded-full flex items-center justify-center">
                        <UserPlus className="h-10 w-10 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold mb-3 bg-gradient-to-r from-[#6fc7d9] to-[#a7549b] bg-clip-text text-transparent">
                        Compte créé !
                    </h2>
                    <p className="text-gray-600 mb-6">
                        Un email de confirmation vous a été envoyé à <strong>{email}</strong>.<br />
                        Vérifiez votre boîte mail pour activer votre compte.
                    </p>
                    <Link
                        to={role === 'supplier' ? '/supplier' : '/'}
                        className="inline-block bg-gradient-to-r from-[#6fc7d9] to-[#a7549b] text-white px-8 py-3 rounded-xl font-bold hover:shadow-xl hover:scale-105 transition-all duration-300"
                    >
                        {role === 'supplier' ? 'Aller au tableau de bord' : 'Retour à l\'accueil'}
                    </Link>
                </div>
            </div>
        );
    }

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
                        <h1 className="text-5xl font-bold mb-4">TonCadeau.net</h1>
                        <div className="h-1 w-32 bg-white mx-auto rounded-full" />
                    </div>
                    <p className="text-xl mb-6 max-w-md leading-relaxed">
                        Rejoignez notre plateforme et commencez à offrir des cadeaux uniques
                    </p>
                    <div className="grid grid-cols-2 gap-6 mt-8">
                        <div className="bg-white/20 backdrop-blur-md rounded-xl p-6">
                            <User className="h-10 w-10 mx-auto mb-3" />
                            <p className="text-sm font-semibold">Compte Client</p>
                        </div>
                        <div className="bg-white/20 backdrop-blur-md rounded-xl p-6">
                            <Store className="h-10 w-10 mx-auto mb-3" />
                            <p className="text-sm font-semibold">Espace Fournisseur</p>
                        </div>
                        <div className="bg-white/20 backdrop-blur-md rounded-xl p-6">
                            <UserPlus className="h-10 w-10 mx-auto mb-3" />
                            <p className="text-sm font-semibold">Inscription Rapide</p>
                        </div>
                        <div className="bg-white/20 backdrop-blur-md rounded-xl p-6">
                            <UserPlus className="h-10 w-10 mx-auto mb-3" />
                            <p className="text-sm font-semibold">100% Gratuit</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Colonne Droite */}
            <div className="w-full lg:w-1/2 flex items-center justify-center bg-gradient-to-br from-[#6fc7d9]/5 to-[#a7549b]/5 px-8 py-12">
                <div className="w-full max-w-md">
                    <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl p-10 border border-white/50">
                        <div className="text-center mb-8">
                            <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-[#6fc7d9] to-[#a7549b] rounded-full flex items-center justify-center">
                                <UserPlus className="h-10 w-10 text-white" />
                            </div>
                            <h2 className="text-3xl font-bold bg-gradient-to-r from-[#6fc7d9] to-[#a7549b] bg-clip-text text-transparent">
                                Créer un compte
                            </h2>
                            <p className="text-gray-600 mt-2">Rejoignez la communauté TonCadeau</p>
                        </div>

                        {/* Role Selector */}
                        <div className="grid grid-cols-2 gap-3 mb-6">
                            <button
                                type="button"
                                onClick={() => setRole('client')}
                                className={`flex items-center justify-center gap-2 py-3 rounded-xl font-semibold border-2 transition-all duration-300 ${role === 'client'
                                    ? 'bg-gradient-to-r from-[#6fc7d9] to-[#a7549b] text-white border-transparent shadow-lg scale-105'
                                    : 'border-[#6fc7d9]/30 text-gray-600 hover:border-[#a7549b]/50'
                                    }`}
                            >
                                <User className="h-4 w-4" />
                                Client
                            </button>
                            <button
                                type="button"
                                onClick={() => setRole('supplier')}
                                className={`flex items-center justify-center gap-2 py-3 rounded-xl font-semibold border-2 transition-all duration-300 ${role === 'supplier'
                                    ? 'bg-gradient-to-r from-[#6fc7d9] to-[#a7549b] text-white border-transparent shadow-lg scale-105'
                                    : 'border-[#6fc7d9]/30 text-gray-600 hover:border-[#a7549b]/50'
                                    }`}
                            >
                                <Store className="h-4 w-4" />
                                Fournisseur
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">
                                    Nom complet
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={fullName}
                                    onChange={e => setFullName(e.target.value)}
                                    className="w-full px-4 py-3 border-2 border-[#6fc7d9]/30 rounded-xl focus:ring-2 focus:ring-[#a7549b] focus:border-[#a7549b] transition-all"
                                    placeholder="Jean Dupont"
                                />
                            </div>

                            {role === 'supplier' && (
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                                        Nom de la boutique
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={supplierName}
                                        onChange={e => setSupplierName(e.target.value)}
                                        className="w-full px-4 py-3 border-2 border-[#6fc7d9]/30 rounded-xl focus:ring-2 focus:ring-[#a7549b] focus:border-[#a7549b] transition-all"
                                        placeholder="Ma Boutique de Fleurs"
                                    />
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">
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
                                <label className="block text-sm font-semibold text-gray-700 mb-1">
                                    Mot de passe
                                </label>
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    className="w-full px-4 py-3 border-2 border-[#6fc7d9]/30 rounded-xl focus:ring-2 focus:ring-[#a7549b] focus:border-[#a7549b] transition-all"
                                    placeholder="••••••••"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">
                                    Confirmer le mot de passe
                                </label>
                                <input
                                    type="password"
                                    required
                                    value={confirmPassword}
                                    onChange={e => setConfirmPassword(e.target.value)}
                                    className="w-full px-4 py-3 border-2 border-[#6fc7d9]/30 rounded-xl focus:ring-2 focus:ring-[#a7549b] focus:border-[#a7549b] transition-all"
                                    placeholder="••••••••"
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
                                className="w-full bg-gradient-to-r from-[#6fc7d9] to-[#a7549b] text-white py-4 rounded-xl font-bold hover:shadow-xl hover:scale-105 transition-all duration-300 disabled:opacity-60 disabled:scale-100"
                            >
                                {loading ? 'Création du compte...' : 'Créer mon compte'}
                            </button>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-sm text-gray-600">
                                Déjà un compte ?{' '}
                                <Link
                                    to={role === 'supplier' ? '/supplier' : '/admin'}
                                    className="text-[#a7549b] hover:text-[#6fc7d9] font-semibold"
                                >
                                    Se connecter
                                </Link>
                            </p>
                        </div>

                        <div className="mt-4 p-4 bg-gradient-to-r from-[#6fc7d9]/10 to-[#a7549b]/10 rounded-xl">
                            <p className="text-xs text-gray-600 text-center">
                                🔒 Vos données sont protégées et sécurisées
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
