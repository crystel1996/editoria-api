# API Editoria

API REST pour la gestion d'articles avec architecture MVC.

## 🚀 Démarrage rapide

### Installation

```bash
npm install
```

### Initialiser la base de données avec des données de test

```bash
npm run seed
```

### Démarrer le serveur en mode développement

```bash
npm run dev
```

Le serveur sera accessible sur `http://localhost:3000`

### Build pour la production

```bash
npm run build
npm start
```

## 📁 Structure du projet

```
api/
├── src/
│   ├── controllers/     # Contrôleurs (logique des routes)
│   ├── services/        # Services (logique métier)
│   ├── routes/          # Définition des routes
│   ├── models/          # Modèles TypeScript
│   ├── middlewares/     # Middlewares Express
│   ├── utils/           # Utilitaires (DB, helpers)
│   ├── server.ts        # Point d'entrée du serveur
│   └── seed.ts          # Script de données de test
├── package.json
└── tsconfig.json
```

## 🔌 API Endpoints

### Articles
- `GET /api/articles` - Liste paginée avec filtres
  - Query params: `status`, `network`, `category`, `featured`, `search`, `page`, `limit`
- `GET /api/articles/:id` - Détail d'un article
- `POST /api/articles` - Créer un article
- `PUT /api/articles/:id` - Modifier un article
- `DELETE /api/articles/:id` - Supprimer un article
- `PATCH /api/articles/:id/status` - Changer le statut
- `POST /api/articles/:id/notify` - Envoyer notification email

### Catégories
- `GET /api/categories` - Liste complète
- `POST /api/categories` - Créer une catégorie
- `PUT /api/categories/:id` - Modifier une catégorie
- `DELETE /api/categories/:id` - Supprimer une catégorie

### Réseaux
- `GET /api/networks` - Liste complète
- `POST /api/networks` - Créer un réseau
- `PUT /api/networks/:id` - Modifier un réseau
- `DELETE /api/networks/:id` - Supprimer un réseau

### Notifications
- `GET /api/notifications` - Historique des notifications

### Import
- `POST /api/import/articles` - Importer articles depuis JSON

## 💾 Base de données

SQLite avec les tables suivantes:
- `articles` - Articles
- `categories` - Catégories
- `networks` - Réseaux
- `article_categories` - Relation many-to-many
- `email_notifications` - Historique des notifications

## 🛠️ Technologies

- **Express** - Framework web
- **TypeScript** - Typage statique
- **better-sqlite3** - Base de données SQLite
- **ts-node-dev** - Développement avec rechargement auto
