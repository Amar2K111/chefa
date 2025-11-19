# 🚀 Guide de Configuration - Chefa

## 📋 Configuration Requise

### 1. Clé API Gemini

L'application utilise **Google Gemini 2.0 Flash Experimental** pour toutes les fonctionnalités IA.

**Étapes pour obtenir une clé API :**

1. Va sur [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Connecte-toi avec ton compte Google
3. Clique sur "Create API Key"
4. Copie ta clé API

### 2. Configuration des Variables d'Environnement

Crée un fichier `.env.local` à la racine du projet :

```bash
GEMINI_API_KEY=ta_cle_api_ici
```

**Important :**
- Ne partage JAMAIS ta clé API publiquement
- Le fichier `.env.local` est déjà dans `.gitignore` (il ne sera pas commité)

### 3. Modèles Gemini Utilisés

L'application utilise actuellement :
- **Modèle** : `gemini-2.0-flash-exp` (Gemini 2.0 Flash Experimental)
- **Fonctionnalités** :
  - Photo → Recette (analyse d'images)
  - Génération de recettes (texte)
  - Chat IA (assistant culinaire)

### 4. Vérification de la Configuration

Pour vérifier que tout fonctionne :

1. Démarre le serveur : `npm run dev`
2. Ouvre l'app dans le navigateur
3. Essaie la fonctionnalité "Photo → Recette"
4. Si tu vois une erreur, vérifie :
   - Que `.env.local` existe
   - Que `GEMINI_API_KEY` est bien défini
   - Que ta clé API est valide
   - Que ta clé API a accès aux modèles avec vision

## 🔧 Dépannage

### Erreur : "Clé API Gemini non configurée"
- Vérifie que `.env.local` existe à la racine du projet
- Vérifie que `GEMINI_API_KEY=...` est bien dans le fichier
- Redémarre le serveur après avoir ajouté la clé

### Erreur : "Le modèle d'analyse d'image n'est pas disponible"
- Ta clé API n'a peut-être pas accès aux modèles avec vision
- Certains modèles nécessitent un plan payant
- Solution : Utilise la fonctionnalité "Ajouter une recette" avec description textuelle

### Erreur : "Quota API dépassé"
- Tu as atteint la limite gratuite de l'API Gemini
- Attends un peu ou upgrade ton plan Google AI

## 📱 Utilisation de l'Application

### Fonctionnalités Principales

1. **Photo → Recette** (WOW Feature)
   - Ajoute une photo de plat
   - L'IA génère automatiquement la recette complète

2. **Ajouter une Recette**
   - Décris un plat avec du texte
   - L'IA génère la recette

3. **Apprendre à Cuisiner**
   - Mode cuisson étape par étape
   - Timer intégré
   - Chat IA pour poser des questions

4. **Ma Bibliothèque**
   - Enregistre toutes tes recettes
   - Favoris
   - Recherche et filtres

## 🎯 Modèles Disponibles

Si tu veux changer de modèle, voici les options :

- `gemini-1.5-flash` - Stable, supporte les images
- `gemini-1.5-pro` - Plus puissant, supporte les images
- `gemini-2.0-flash-exp` - Expérimental (actuellement utilisé)
- `gemini-pro` - Ancien modèle, pas de vision

Pour changer, modifie le nom du modèle dans :
- `src/app/api/photo-to-recipe/route.ts`
- `src/app/api/generate-recipe/route.ts`
- `src/app/api/chat/route.ts`

