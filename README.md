# 👨‍🍳 Chefa - Ton Chef Expert Culinaire

Application mobile pour apprendre à cuisiner et enregistrer tes recettes.

## 🚀 Démarrage Rapide

### 1. Installation

```bash
npm install
```

### 2. Configuration de la Clé API Gemini

1. Crée un fichier `.env.local` à la racine du projet
2. Ajoute ta clé API Gemini :

```bash
GEMINI_API_KEY=ta_cle_api_ici
```

**Comment obtenir une clé API :**
- Va sur [Google AI Studio](https://makersuite.google.com/app/apikey)
- Crée une clé API
- Copie-la dans `.env.local`

### 3. Lancer l'Application

```bash
npm run dev
```

Ouvre [http://localhost:3000](http://localhost:3000) dans ton navigateur.

## ✨ Fonctionnalités Principales

### 🎯 WOW Feature : Photo → Recette
- Ajoute une photo de n'importe quel plat
- L'IA génère automatiquement la recette complète
- Ajoutée directement dans ta bibliothèque

### 📚 Ma Bibliothèque de Recettes
- Enregistre toutes tes recettes
- Favoris et organisation
- Recherche et filtres par catégorie

### 🎓 Apprendre à Cuisiner
- Guide étape par étape
- Timer intégré
- Chat IA contextuel pour poser des questions
- Progression et gamification

## 🔧 Configuration

Voir [SETUP.md](./SETUP.md) pour le guide complet de configuration et dépannage.

## 📱 Format Mobile

L'application est optimisée pour **iPhone 15 Pro Max** (430px de largeur) et fonctionne sur tous les écrans mobiles.

## 🛠️ Technologies

- **Framework** : Next.js 16 avec React 19
- **Styling** : Tailwind CSS
- **IA** : Google Gemini 2.0 Flash Experimental
- **Storage** : localStorage
- **Icons** : Lucide React

## 📝 Notes

- Les données sont stockées localement dans le navigateur
- La clé API Gemini est nécessaire pour les fonctionnalités IA
- Voir SETUP.md pour la configuration détaillée
