# Editoria API

## Description

API REST pour la gestion d'un système éditorial complet permettant la gestion d'articles, de catégories, de notifications et d'imports de données. Architecture MVC avec TypeScript et Express.

## Prérequis

- Node.js version 18 ou supérieure
- npm ou yarn

## Installation

```bash
# Installation des dépendances
npm install

# Initialisation de la base de données avec des données de test
npm run seed
```

## Lancement

```bash
# Mode développement (avec hot reload)
npm run dev

# Build pour la production
npm run build

# Démarrage en production
npm start
```

Le serveur sera accessible sur `http://localhost:5000`

## Choix techniques

### Architecture
- **Architecture MVC** : Séparation claire entre les modèles, contrôleurs et routes pour une meilleure maintenabilité
- **Structure modulaire** : Chaque entité (article, category, notification, network, import) a son propre module avec controller, service, routes et model

### Technologies utilisées
- **Express.js** : Framework web minimaliste et flexible pour Node.js
- **TypeScript** : Typage statique pour réduire les erreurs et améliorer la maintenabilité
- **Better-SQLite3** : Base de données SQLite embarquée, simple et performante, adaptée pour un prototype ou une petite application
- **tsx** : Pour le développement avec hot reload TypeScript

### Justifications
- **SQLite** choisi pour sa simplicité de déploiement (pas de serveur DB externe) et sa performance pour une application de taille moyenne
- **Express** pour sa légèreté et sa grande communauté
- **Architecture en couches** (routes → controllers → services → models) pour faciliter les tests et la scalabilité

### Compromis effectués
- SQLite plutôt que PostgreSQL/MySQL : limite la scalabilité mais simplifie le déploiement
- Pas d'ORM (Prisma, TypeORM) : code SQL direct pour des performances optimales et une compréhension claire
- Validation basique : pourrait être améliorée avec Zod ou Joi

## Fonctionnalités implémentées

### ✅ Complet
- CRUD Articles (création, lecture, mise à jour, suppression)
- CRUD Catégories
- CRUD Notifications
- Gestion des réseaux sociaux (network)
- Import de données (import d'articles en masse)
- Middlewares CORS, Logger, Error Handler
- Base de données SQLite avec schéma complet
- Système de seed pour données de test
- Health check endpoint
- Génération automatique de slugs pour les articles
- Gestion des relations entre articles et catégories

### ⚠️ Partiel
- Authentification/Autorisation (non implémentée, à ajouter)
- Validation des données (basique, pourrait être renforcée)

### ❌ Non fait
- Tests unitaires et d'intégration
- Documentation API (Swagger/OpenAPI)
- Système de pagination avancé
- Rate limiting
- Upload de fichiers/images

## Ce qui aurait été fait avec plus de temps

1. **Tests** : Mise en place de tests unitaires (Jest) et d'intégration pour tous les endpoints
2. **Authentification** : JWT + refresh tokens pour sécuriser l'API
3. **Documentation API** : Swagger/OpenAPI pour documenter tous les endpoints
4. **Validation robuste** : Intégration de Zod pour valider toutes les entrées
5. **Pagination** : Système de pagination, tri et filtrage avancé pour toutes les listes
6. **Upload d'images** : Gestion d'upload d'images pour les articles avec stockage cloud (S3, Cloudinary)
7. **Cache** : Redis pour le cache des requêtes fréquentes
8. **Migrations** : Système de migrations de base de données (Knex, Prisma)
9. **Monitoring** : Logs structurés et monitoring (Winston + ELK Stack)
10. **Rate limiting** : Protection contre les abus avec express-rate-limit

## Tests

```bash
# Les tests ne sont pas encore implémentés
# À venir : npm test
```

## Difficultés rencontrées

### 1. Configuration TypeScript avec ES Modules
**Problème** : Conflits entre CommonJS et ES Modules avec TypeScript  
**Solution** : Configuration de `"type": "module"` dans package.json et utilisation des extensions `.js` dans les imports

### 2. Typage Better-SQLite3
**Problème** : Typage strict des requêtes SQL avec TypeScript  
**Solution** : Création d'interfaces TypeScript personnalisées pour chaque modèle et utilisation de generics

### 3. Gestion des relations
**Problème** : SQLite ne gère pas les relations de la même manière qu'un ORM  
**Solution** : Jointures SQL manuelles et mapping des résultats dans les services

### 4. Structure des données
**Problème** : Décider de la structure optimale pour les notifications et les imports  
**Solution** : Analyse des besoins et création d'un schéma flexible permettant l'extension
