// Données des produits pour la plateforme de cadeaux
export const products = [
    {
        id: 1,
        name: "Bouquet de Roses Rouges",
        category: "Fleurs",
        price: 45.99,
        description: "Magnifique bouquet de 12 roses rouges fraîches",
        image: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=400",
        stock: 25,
        supplier: "Fleurs & Co",
        rating: 4.8,
        tags: ["romantique", "anniversaire", "amour"]
    },
    {
        id: 2,
        name: "Chocolats Artisanaux",
        category: "Gourmandises",
        price: 32.50,
        description: "Assortiment de chocolats fins artisanaux",
        image: "https://images.unsplash.com/photo-1511381939415-e44015466834?w=400",
        stock: 50,
        supplier: "ChocoDeluxe",
        rating: 4.9,
        tags: ["gourmand", "artisanal", "luxe"]
    },
    {
        id: 3,
        name: "Montre Élégante",
        category: "Accessoires",
        price: 89.99,
        description: "Montre bracelet en cuir véritable",
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400",
        stock: 15,
        supplier: "TimeLux",
        rating: 4.7,
        tags: ["élégant", "professionnel", "qualité"]
    },
    {
        id: 4,
        name: "Coffret Beauté",
        category: "Beauté",
        price: 67.00,
        description: "Coffret de produits de beauté premium",
        image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400",
        stock: 30,
        supplier: "BeautyBox",
        rating: 4.6,
        tags: ["beauté", "soin", "premium"]
    },
    {
        id: 5,
        name: "Livre Personnalisé",
        category: "Culture",
        price: 24.99,
        description: "Livre personnalisé avec dédicace",
        image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400",
        stock: 100,
        supplier: "BookCraft",
        rating: 4.5,
        tags: ["personnalisé", "culture", "unique"]
    },
    {
        id: 6,
        name: "Plante Verte",
        category: "Décoration",
        price: 18.99,
        description: "Plante verte d'intérieur en pot",
        image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400",
        stock: 40,
        supplier: "GreenLife",
        rating: 4.4,
        tags: ["nature", "décoration", "durable"]
    }
];

export const categories = [
    { id: "all", name: "Tous les produits" },
    { id: "Fleurs", name: "Fleurs" },
    { id: "Gourmandises", name: "Gourmandises" },
    { id: "Accessoires", name: "Accessoires" },
    { id: "Beauté", name: "Beauté" },
    { id: "Culture", name: "Culture" },
    { id: "Décoration", name: "Décoration" }
];

export const suppliers = [
    { id: 1, name: "Fleurs & Co", email: "contact@fleurs-co.fr" },
    { id: 2, name: "ChocoDeluxe", email: "info@chocodeluxe.fr" },
    { id: 3, name: "TimeLux", email: "service@timelux.fr" },
    { id: 4, name: "BeautyBox", email: "hello@beautybox.fr" },
    { id: 5, name: "BookCraft", email: "contact@bookcraft.fr" },
    { id: 6, name: "GreenLife", email: "info@greenlife.fr" }
];
