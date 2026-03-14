import React, { useState, useEffect, useRef } from 'react';
import { Plus, Edit, Trash2, Package, TrendingUp, DollarSign, Store, Upload, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import type { Product } from '../types';

const SupplierDashboard = () => {
    const { user, signIn, signOut } = useAuth();
    const [products, setProducts] = useState<Product[]>([]);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState('');
    const [loginLoading, setLoginLoading] = useState(false);
    const [newProduct, setNewProduct] = useState({
        name: '', category: '', price: '', description: '', stock: ''
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>('');
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const isSupplier = user?.user_metadata?.role === 'supplier';
    const supplierName = user?.user_metadata?.supplier_name ?? '';

    useEffect(() => {
        if (isSupplier && supplierName) fetchProducts();
    }, [isSupplier, supplierName]);

    const fetchProducts = async () => {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('supplier', supplierName)
            .order('created_at', { ascending: false });
        if (!error && data) setProducts(data);
    };

    const stats = {
        totalProducts: products.length,
        totalSales: 1250,
        totalRevenue: 15680.50,
        lowStock: products.filter(p => p.stock < 10).length
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoginError('');
        setLoginLoading(true);
        const { data, error } = await signIn(email, password);
        setLoginLoading(false);
        if (error) {
            setLoginError('Email ou mot de passe incorrect.');
            return;
        }
        if (data?.user?.user_metadata?.role !== 'supplier') {
            await signOut();
            setLoginError('Accès refusé. Ce compte n\'a pas les droits fournisseur.');
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
    };

    const clearImage = () => {
        setImageFile(null);
        setImagePreview('');
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleAddProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!imageFile) {
            alert('Veuillez sélectionner une image.');
            return;
        }
        setUploading(true);

        // 1. Upload de l'image vers Supabase Storage
        const ext = imageFile.name.split('.').pop();
        const filePath = `${supplierName}/${Date.now()}.${ext}`;
        const { error: uploadError } = await supabase.storage
            .from('product-images')
            .upload(filePath, imageFile, { upsert: false });

        if (uploadError) {
            alert(`Erreur upload image : ${uploadError.message}`);
            setUploading(false);
            return;
        }

        // 2. Récupérer l'URL publique
        const { data: urlData } = supabase.storage
            .from('product-images')
            .getPublicUrl(filePath);
        const imageUrl = urlData.publicUrl;

        // 3. Insérer le produit avec l'URL de l'image
        const { data, error } = await supabase.from('products').insert([{
            name: newProduct.name,
            category: newProduct.category,
            price: parseFloat(newProduct.price),
            description: newProduct.description,
            stock: parseInt(newProduct.stock),
            image: imageUrl,
            supplier: supplierName,
            rating: 4.5,
            tags: []
        }]).select().single();

        setUploading(false);

        if (!error && data) {
            setProducts(prev => [data as Product, ...prev]);
            setNewProduct({ name: '', category: '', price: '', description: '', stock: '' });
            clearImage();
            alert('Produit ajouté avec succès !');
        } else {
            alert(`Erreur : ${error?.message ?? 'Impossible d\'ajouter le produit.'}`);
        }
    };

    const handleDeleteProduct = async (id: number | string) => {
        if (!window.confirm('Supprimer ce produit ?')) return;
        const { error } = await supabase.from('products').delete().eq('id', id);
        if (!error) setProducts(prev => prev.filter(p => p.id !== id));
    };

    if (!user || !isSupplier) {
        return (
            <div className="min-h-screen flex">
                {/* Colonne Gauche */}
                <div
                    className="hidden lg:flex lg:w-1/2 bg-cover bg-center relative"
                    style={{ backgroundImage: "url('../public/bannier4.jpg')" }}
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-[#6fc7d9]/90 to-[#a7549b]/90"></div>
                    <div className="relative z-10 flex flex-col justify-center items-center text-center px-12 text-white">
                        <div className="mb-8">
                            <div className="w-24 h-24 mx-auto mb-6 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center">
                                <Store className="h-14 w-14 text-white" />
                            </div>
                            <h1 className="text-5xl font-bold mb-4">Espace Fournisseur</h1>
                            <div className="h-1 w-32 bg-white mx-auto rounded-full"></div>
                        </div>
                        <p className="text-xl mb-6 max-w-md leading-relaxed">
                            Gérez vos produits et développez votre activité sur CadeauBox
                        </p>
                        <div className="grid grid-cols-2 gap-6 mt-8">
                            <div className="bg-white/20 backdrop-blur-md rounded-xl p-6">
                                <Package className="h-10 w-10 mx-auto mb-3" />
                                <p className="text-sm font-semibold">Gestion Produits</p>
                            </div>
                            <div className="bg-white/20 backdrop-blur-md rounded-xl p-6">
                                <TrendingUp className="h-10 w-10 mx-auto mb-3" />
                                <p className="text-sm font-semibold">Statistiques Ventes</p>
                            </div>
                            <div className="bg-white/20 backdrop-blur-md rounded-xl p-6">
                                <DollarSign className="h-10 w-10 mx-auto mb-3" />
                                <p className="text-sm font-semibold">Suivi Revenus</p>
                            </div>
                            <div className="bg-white/20 backdrop-blur-md rounded-xl p-6">
                                <Store className="h-10 w-10 mx-auto mb-3" />
                                <p className="text-sm font-semibold">Support Client</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Colonne Droite - Formulaire */}
                <div className="w-full lg:w-1/2 flex items-center justify-center bg-gradient-to-br from-[#6fc7d9]/5 to-[#a7549b]/5 px-8">
                    <div className="w-full max-w-md">
                        <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl p-10 border border-white/50">
                            <div className="text-center mb-8">
                                <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-[#6fc7d9] to-[#a7549b] rounded-full flex items-center justify-center">
                                    <Store className="h-10 w-10 text-white" />
                                </div>
                                <h2 className="text-3xl font-bold bg-gradient-to-r from-[#6fc7d9] to-[#a7549b] bg-clip-text text-transparent">
                                    Connexion Fournisseur
                                </h2>
                                <p className="text-gray-600 mt-2">Accédez à votre tableau de bord</p>
                            </div>

                            <form onSubmit={handleLogin} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
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
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Mot de passe</label>
                                    <input
                                        type="password"
                                        required
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        className="w-full px-4 py-3 border-2 border-[#6fc7d9]/30 rounded-xl focus:ring-2 focus:ring-[#a7549b] focus:border-[#a7549b] transition-all"
                                        placeholder="••••••••"
                                    />
                                </div>

                                {loginError && (
                                    <p className="text-red-500 text-sm text-center font-medium">{loginError}</p>
                                )}

                                <button
                                    type="submit"
                                    disabled={loginLoading}
                                    className="w-full bg-gradient-to-r from-[#6fc7d9] to-[#a7549b] text-white py-4 rounded-xl font-bold hover:shadow-xl hover:scale-105 transition-all duration-300 disabled:opacity-60 disabled:scale-100"
                                >
                                    {loginLoading ? 'Connexion...' : 'Se connecter'}
                                </button>
                            </form>

                            <div className="mt-6 p-4 bg-gradient-to-r from-[#6fc7d9]/10 to-[#a7549b]/10 rounded-xl">
                                <p className="text-xs text-gray-600 text-center">
                                    🔒 Connexion sécurisée - Espace réservé aux fournisseurs
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#6fc7d9]/10 via-white to-[#a7549b]/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex flex-col sm:flex-row justify-between items-center text-center sm:text-left bg-white/95 backdrop-blur-md rounded-2xl shadow-xl p-6 border border-white/50 gap-4 sm:gap-0">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-[#6fc7d9] to-[#a7549b] bg-clip-text text-transparent">
                                Tableau de Bord Fournisseur
                            </h1>
                            <p className="text-base sm:text-lg text-gray-600 mt-1">
                                Bienvenue, <span className="font-semibold">{supplierName}</span>
                            </p>
                        </div>
                        <button
                            onClick={signOut}
                            className="bg-gradient-to-r from-red-500 to-red-600 text-white px-5 sm:px-6 py-2.5 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 w-full sm:w-auto"
                        >
                            Déconnexion
                        </button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl p-6 border border-white/50 hover:scale-105 transition-all duration-300">
                        <div className="flex items-center">
                            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                                <Package className="h-7 w-7 text-white" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-semibold text-gray-600">Produits</p>
                                <p className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent">{stats.totalProducts}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl p-6 border border-white/50 hover:scale-105 transition-all duration-300">
                        <div className="flex items-center">
                            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                                <TrendingUp className="h-7 w-7 text-white" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-semibold text-gray-600">Ventes</p>
                                <p className="text-3xl font-bold bg-gradient-to-r from-green-500 to-green-700 bg-clip-text text-transparent">{stats.totalSales}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl p-6 border border-white/50 hover:scale-105 transition-all duration-300">
                        <div className="flex items-center">
                            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#6fc7d9] to-[#a7549b] flex items-center justify-center">
                                <DollarSign className="h-7 w-7 text-white" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-semibold text-gray-600">Chiffre d'affaires</p>
                                <p className="text-2xl font-bold bg-gradient-to-r from-[#6fc7d9] to-[#a7549b] bg-clip-text text-transparent">{stats.totalRevenue.toFixed(2)}€</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl p-6 border border-white/50 hover:scale-105 transition-all duration-300">
                        <div className="flex items-center">
                            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center">
                                <Package className="h-7 w-7 text-white" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-semibold text-gray-600">Stock Faible</p>
                                <p className="text-3xl font-bold bg-gradient-to-r from-red-500 to-red-700 bg-clip-text text-transparent">{stats.lowStock}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Add Product Form */}
                    <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl p-6 border border-white/50">
                        <h2 className="text-xl font-bold mb-6 flex items-center">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#6fc7d9] to-[#a7549b] flex items-center justify-center mr-3">
                                <Plus className="h-5 w-5 text-white" />
                            </div>
                            <span className="bg-gradient-to-r from-[#6fc7d9] to-[#a7549b] bg-clip-text text-transparent">
                                Ajouter un Produit
                            </span>
                        </h2>

                        <form onSubmit={handleAddProduct} className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Nom du produit</label>
                                <input
                                    type="text"
                                    value={newProduct.name}
                                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                                    className="w-full px-4 py-2.5 border-2 border-[#6fc7d9]/30 rounded-xl focus:ring-2 focus:ring-[#a7549b] focus:border-[#a7549b] transition-all"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Catégorie</label>
                                <select
                                    value={newProduct.category}
                                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                                    className="w-full px-4 py-2.5 border-2 border-[#6fc7d9]/30 rounded-xl focus:ring-2 focus:ring-[#a7549b] focus:border-[#a7549b] transition-all bg-white"
                                    required
                                >
                                    <option value="">Choisir une catégorie</option>
                                    <option value="Fleurs">Fleurs</option>
                                    <option value="Gourmandises">Gourmandises</option>
                                    <option value="Accessoires">Accessoires</option>
                                    <option value="Beauté">Beauté</option>
                                    <option value="Culture">Culture</option>
                                    <option value="Décoration">Décoration</option>
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Prix (€)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={newProduct.price}
                                        onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                                        className="w-full px-4 py-2.5 border-2 border-[#6fc7d9]/30 rounded-xl focus:ring-2 focus:ring-[#a7549b] focus:border-[#a7549b] transition-all"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Stock</label>
                                    <input
                                        type="number"
                                        value={newProduct.stock}
                                        onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                                        className="w-full px-4 py-2.5 border-2 border-[#6fc7d9]/30 rounded-xl focus:ring-2 focus:ring-[#a7549b] focus:border-[#a7549b] transition-all"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
                                <textarea
                                    value={newProduct.description}
                                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                                    className="w-full px-4 py-2.5 border-2 border-[#6fc7d9]/30 rounded-xl focus:ring-2 focus:ring-[#a7549b] focus:border-[#a7549b] transition-all"
                                    rows={3}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Image du produit</label>
                                {imagePreview ? (
                                    <div className="relative w-full h-40 rounded-xl overflow-hidden border-2 border-[#6fc7d9]/30">
                                        <img src={imagePreview} alt="Aperçu" className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={clearImage}
                                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-all"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                ) : (
                                    <div
                                        onClick={() => fileInputRef.current?.click()}
                                        className="w-full h-40 border-2 border-dashed border-[#6fc7d9]/50 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-[#a7549b] hover:bg-[#a7549b]/5 transition-all"
                                    >
                                        <Upload className="h-8 w-8 text-[#6fc7d9] mb-2" />
                                        <p className="text-sm font-semibold text-gray-600">Cliquer pour choisir une image</p>
                                        <p className="text-xs text-gray-400 mt-1">JPG, PNG, WEBP — max 5 Mo</p>
                                    </div>
                                )}
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={uploading}
                                className="w-full bg-gradient-to-r from-[#6fc7d9] to-[#a7549b] text-white py-3 rounded-xl font-bold hover:shadow-xl hover:scale-105 transition-all duration-300 disabled:opacity-60 disabled:scale-100"
                            >
                                {uploading ? 'Upload en cours...' : 'Ajouter le Produit'}
                            </button>
                        </form>
                    </div>

                    {/* Products List */}
                    <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl p-6 border border-white/50">
                        <h2 className="text-xl font-bold mb-6 bg-gradient-to-r from-[#6fc7d9] to-[#a7549b] bg-clip-text text-transparent">
                            Mes Produits
                        </h2>

                        <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                            {products.map((product) => (
                                <div key={product.id} className="flex items-center space-x-4 p-4 border-2 border-[#6fc7d9]/20 rounded-xl hover:border-[#a7549b]/40 hover:shadow-lg transition-all duration-300 bg-white/50">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-20 h-20 object-cover rounded-xl shadow-md"
                                    />
                                    <div className="flex-1">
                                        <h3 className="font-bold text-gray-800">{product.name}</h3>
                                        <p className="text-sm font-medium bg-gradient-to-r from-[#6fc7d9] to-[#a7549b] bg-clip-text text-transparent">{product.category}</p>
                                        <p className="font-bold bg-gradient-to-r from-[#6fc7d9] to-[#a7549b] bg-clip-text text-transparent">{product.price}€</p>
                                        <p className={`text-sm font-semibold ${product.stock < 10 ? 'text-red-600' : 'text-green-600'}`}>
                                            Stock: {product.stock}
                                        </p>
                                    </div>
                                    <div className="flex space-x-2">
                                        <button className="p-2.5 text-blue-500 hover:bg-blue-50 rounded-lg hover:scale-110 transition-all">
                                            <Edit className="h-5 w-5" />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteProduct(product.id)}
                                            className="p-2.5 text-red-500 hover:bg-red-50 rounded-lg hover:scale-110 transition-all"
                                        >
                                            <Trash2 className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {products.length === 0 && (
                                <p className="text-center text-gray-500 py-8">Aucun produit pour l'instant.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SupplierDashboard;
