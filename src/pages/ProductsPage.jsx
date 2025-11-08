import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, Filter, Search } from 'lucide-react';
import { products, categories } from '../data/products';
import { useCart } from '../context/CartContext';

const ProductsPage = () => {
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('name');
    const { addToCart } = useCart();

    const filteredProducts = products
        .filter(product => {
            const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
            const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
            return matchesCategory && matchesSearch;
        })
        .sort((a, b) => {
            switch (sortBy) {
                case 'price-low':
                    return a.price - b.price;
                case 'price-high':
                    return b.price - a.price;
                case 'rating':
                    return b.rating - a.rating;
                case 'name':
                default:
                    return a.name.localeCompare(b.name);
            }
        });

    const handleAddToCart = (product) => {
        addToCart(product);
        alert(`${product.name} ajouté au panier !`);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#6fc7d9]/10 via-white to-[#a7549b]/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8 text-center">
                    <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-[#6fc7d9] to-[#a7549b] bg-clip-text text-transparent">
                        Nos Produits
                    </h1>
                    <p className="text-lg text-gray-700">
                        Découvrez notre sélection de produits de qualité pour composer des cadeaux parfaits
                    </p>
                </div>

                {/* Filters */}
                <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-6 mb-8 border border-white/50">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#a7549b]" />
                            <input
                                type="text"
                                placeholder="Rechercher un produit..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 border-2 border-[#6fc7d9]/30 rounded-xl focus:ring-2 focus:ring-[#a7549b] focus:border-[#a7549b] transition-all"
                            />
                        </div>

                        {/* Category Filter */}
                        <div>
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="w-full px-4 py-2.5 border-2 border-[#6fc7d9]/30 rounded-xl focus:ring-2 focus:ring-[#a7549b] focus:border-[#a7549b] transition-all bg-white"
                            >
                                {categories.map(category => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Sort */}
                        <div>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="w-full px-4 py-2.5 border-2 border-[#6fc7d9]/30 rounded-xl focus:ring-2 focus:ring-[#a7549b] focus:border-[#a7549b] transition-all bg-white"
                            >
                                <option value="name">Trier par nom</option>
                                <option value="price-low">Prix croissant</option>
                                <option value="price-high">Prix décroissant</option>
                                <option value="rating">Meilleures notes</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Results Count */}
                <div className="mb-6">
                    <p className="text-gray-700 font-medium">
                        {filteredProducts.length} produit{filteredProducts.length > 1 ? 's' : ''} trouvé{filteredProducts.length > 1 ? 's' : ''}
                    </p>
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredProducts.map((product) => (
                        <div key={product.id} className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl hover:scale-105 transition-all duration-300 border border-white/50 group">
                            <Link to={`/products/${product.id}`}>
                                <div className="relative overflow-hidden">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#a7549b]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                </div>
                            </Link>
                            <div className="p-5">
                                <div className="mb-2">
                                    <span className="inline-block bg-gradient-to-r from-[#6fc7d9] to-[#a7549b] text-white text-xs px-3 py-1 rounded-full font-medium shadow-md">
                                        {product.category}
                                    </span>
                                </div>
                                <h3 className="font-bold text-lg mb-2 text-gray-800 group-hover:text-[#a7549b] transition-colors">{product.name}</h3>
                                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>

                                <div className="flex items-center mb-3">
                                    <div className="flex text-yellow-400">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'fill-current' : ''}`}
                                            />
                                        ))}
                                    </div>
                                    <span className="text-sm text-gray-600 ml-2 font-medium">({product.rating})</span>
                                </div>

                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-2xl font-bold bg-gradient-to-r from-[#6fc7d9] to-[#a7549b] bg-clip-text text-transparent">
                                        {product.price}€
                                    </span>
                                    <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                        Stock: {product.stock}
                                    </span>
                                </div>

                                <div className="flex space-x-2">
                                    <Link
                                        to={`/products/${product.id}`}
                                        className="flex-1 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 px-4 py-2.5 rounded-xl text-sm font-semibold hover:from-gray-200 hover:to-gray-300 hover:shadow-md transition-all text-center"
                                    >
                                        Voir Détails
                                    </Link>
                                    <button
                                        onClick={() => handleAddToCart(product)}
                                        className="flex-1 bg-gradient-to-r from-[#6fc7d9] to-[#a7549b] text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300"
                                    >
                                        Ajouter
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredProducts.length === 0 && (
                    <div className="text-center py-16 bg-white/80 backdrop-blur-md rounded-2xl shadow-lg">
                        <div className="mb-4">
                            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-[#6fc7d9] to-[#a7549b] rounded-full flex items-center justify-center">
                                <Search className="h-12 w-12 text-white" />
                            </div>
                        </div>
                        <p className="text-gray-600 text-lg mb-2">Aucun produit trouvé pour votre recherche.</p>
                        <p className="text-gray-500 text-sm mb-6">Essayez de modifier vos critères de recherche</p>
                        <button
                            onClick={() => {
                                setSearchTerm('');
                                setSelectedCategory('all');
                            }}
                            className="bg-gradient-to-r from-[#6fc7d9] to-[#a7549b] text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300"
                        >
                            Réinitialiser les filtres
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductsPage;