import { Badge } from '@/types';

export const badges: Badge[] = [
  { id: 1, name: "Premier Chef", icon: "🔪", earned: true, description: "Première recette complétée" },
  { id: 2, name: "Maître des Œufs", icon: "🥚", earned: true, description: "5 techniques d'œufs maîtrisées" },
  { id: 3, name: "Speed Master", icon: "⏱️", earned: true, description: "Recette en moins de 15 min" },
  { id: 4, name: "Végétal Pro", icon: "🌱", earned: false, description: "10 recettes végétariennes" },
  { id: 5, name: "Sans Brûler", icon: "🔥", earned: true, description: "20 recettes sans incident" },
  { id: 6, name: "Italien Expert", icon: "🇮🇹", earned: false, description: "Maîtriser 5 plats italiens" },
  { id: 7, name: "Pâtissier", icon: "🎂", earned: false, description: "Réaliser 5 desserts" },
  { id: 8, name: "Semaine Parfaite", icon: "✨", earned: true, description: "7 jours consécutifs" }
];

