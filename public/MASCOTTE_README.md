# Mascotte Chefa 🦉👨‍🍳

## Ajout de l'image de la mascotte

Pour que la mascotte Chefa s'affiche correctement dans l'application, vous devez ajouter l'image de la chouette chef dans le dossier `public/`.

### Instructions

1. Nommez l'image : `chefa-mascot.png`
2. Placez-la dans le dossier : `public/chefa-mascot.png`
3. Format recommandé : PNG avec fond transparent
4. Taille recommandée : 512x512px ou plus (le composant s'adapte automatiquement)

### Fallback

Si l'image n'est pas trouvée, le composant affichera automatiquement un emoji de chouette avec un chapeau de chef (🦉👨‍🍳) comme fallback.

### Utilisation

La mascotte est déjà intégrée dans :
- **HomeScreen** : Petite version animée dans le header
- **OnboardingScreen** : Grande version animée sur chaque écran d'onboarding
- **Section Photo → Recette** : Version moyenne dans la carte de fonctionnalité

Vous pouvez également utiliser le composant `ChefaMascot` dans d'autres écrans :

```tsx
import { ChefaMascot } from '@/components/ChefaMascot';

<ChefaMascot size="md" animated />
```

### Tailles disponibles

- `sm` : 64x64px (w-16 h-16)
- `md` : 96x96px (w-24 h-24) - par défaut
- `lg` : 128x128px (w-32 h-32)
- `xl` : 192x192px (w-48 h-48)

