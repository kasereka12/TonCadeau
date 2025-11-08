# CadeauBox - Plateforme de Cadeaux Personnalisés

Une plateforme e-commerce moderne développée avec React et Vite pour la vente et la composition de cadeaux personnalisés.

## 🎁 Fonctionnalités

### Pour les Clients
- **Catalogue de produits** : Découvrez une sélection de produits de qualité
- **Composeur de cadeaux** : Créez des cadeaux personnalisés en sélectionnant plusieurs produits
- **Panier intelligent** : Gérez vos achats avec un système de panier avancé
- **Personnalisation** : Ajoutez des messages cadeaux et personnalisez la livraison
- **Interface responsive** : Design moderne et adaptatif pour tous les appareils

### Pour les Fournisseurs
- **Tableau de bord fournisseur** : Gérez vos produits et votre stock
- **Ajout de produits** : Ajoutez facilement de nouveaux produits à votre catalogue
- **Suivi des ventes** : Consultez vos statistiques de vente et revenus
- **Gestion du stock** : Surveillez et mettez à jour vos niveaux de stock

### Pour les Administrateurs
- **Panneau d'administration** : Vue d'ensemble complète de la plateforme
- **Gestion des produits** : Modérez et gérez tous les produits de la plateforme
- **Gestion des fournisseurs** : Supervisez les comptes fournisseurs
- **Statistiques** : Suivez les performances globales de la plateforme
- **Paramètres** : Configurez les paramètres de la plateforme

## 🚀 Technologies Utilisées

- **Frontend** : React 18 + TypeScript
- **Build Tool** : Vite
- **Styling** : Tailwind CSS
- **Routing** : React Router DOM
- **Icons** : Lucide React
- **State Management** : React Context API

## 📦 Installation

1. **Cloner le projet**
   ```bash
   git clone <url-du-repo>
   cd cadeau
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Lancer le serveur de développement**
   ```bash
   npm run dev
   ```

4. **Ouvrir dans le navigateur**
   ```
   http://localhost:5173
   ```

## 🏗️ Structure du Projet

```
src/
├── components/          # Composants réutilisables
│   ├── Header.jsx      # En-tête de navigation
│   └── Footer.jsx      # Pied de page
├── context/            # Contextes React
│   └── CartContext.jsx # Gestion du panier
├── data/               # Données statiques
│   └── products.js     # Catalogue de produits
├── pages/              # Pages de l'application
│   ├── HomePage.jsx    # Page d'accueil
│   ├── ProductsPage.jsx # Catalogue produits
│   ├── ComposeGiftPage.jsx # Composeur de cadeaux
│   ├── CartPage.jsx    # Panier et checkout
│   ├── SupplierDashboard.jsx # Tableau fournisseur
│   └── AdminPanel.jsx  # Panneau administrateur
├── styles/             # Styles personnalisés
├── utils/              # Utilitaires
├── App.tsx             # Composant principal
├── main.ts             # Point d'entrée
└── style.css           # Styles globaux
```

## 🎯 Pages Disponibles

- **/** - Page d'accueil avec présentation des produits vedettes
- **/products** - Catalogue complet avec filtres et recherche
- **/compose-gift** - Composeur de cadeaux personnalisés
- **/cart** - Panier et processus de commande
- **/supplier** - Tableau de bord fournisseur
- **/admin** - Panneau d'administration

## 🎨 Design et UX

- **Design moderne** : Interface claire et intuitive
- **Responsive** : Adapté à tous les écrans (mobile, tablette, desktop)
- **Couleurs** : Palette rose/violet pour une ambiance chaleureuse
- **Animations** : Transitions fluides et micro-interactions
- **Accessibilité** : Respect des standards d'accessibilité web

## 🔧 Fonctionnalités Techniques

### Gestion d'État
- Context API pour la gestion du panier
- État local pour les formulaires et interactions

### Navigation
- React Router pour la navigation SPA
- Liens actifs et navigation intuitive

### Données
- Données statiques pour la démonstration
- Structure prête pour l'intégration d'une API

### Performance
- Lazy loading des composants
- Optimisation des images
- Build optimisé avec Vite

## 🚀 Déploiement

### Build de Production
```bash
npm run build
```

### Preview du Build
```bash
npm run preview
```

## 🔮 Évolutions Futures

- **Base de données** : Intégration d'une base de données réelle
- **Authentification** : Système de connexion utilisateur
- **Paiement** : Intégration d'un système de paiement
- **Notifications** : Système de notifications en temps réel
- **API** : Développement d'une API REST
- **Tests** : Ajout de tests unitaires et d'intégration

## 📝 Notes de Développement

Ce projet est développé de manière statique pour la démonstration. Dans un environnement de production, il faudrait :

1. Intégrer une base de données (PostgreSQL, MongoDB, etc.)
2. Développer une API backend (Node.js, Python, etc.)
3. Implémenter un système d'authentification sécurisé
4. Ajouter un système de paiement (Stripe, PayPal, etc.)
5. Mettre en place des tests automatisés
6. Configurer un système de déploiement continu

## 👥 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :
- Signaler des bugs
- Proposer de nouvelles fonctionnalités
- Améliorer la documentation
- Optimiser le code

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier LICENSE pour plus de détails.

---

Développé avec ❤️ pour créer des moments inoubliables
