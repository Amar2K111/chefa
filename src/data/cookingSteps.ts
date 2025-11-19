import { CookingStep } from '@/types';

export const cookingSteps: CookingStep[] = [
  {
    step: 1,
    title: "Préparation des ingrédients",
    description: "Émincez finement l'oignon et hachez l'ail. Préparez le bouillon et gardez-le au chaud.",
    time: 5,
    tip: "💡 Conseil : Garde le bouillon chaud pour une meilleure absorption"
  },
  {
    step: 2,
    title: "Faire revenir",
    description: "Faites fondre le beurre à feu moyen. Ajoutez l'oignon et faites-le suer jusqu'à ce qu'il soit translucide (3-4 min).",
    time: 4,
    tip: "⚠️ Attention : Ne laisse pas l'oignon brunir"
  },
  {
    step: 3,
    title: "Nacrer le riz",
    description: "Ajoutez le riz et remuez pendant 2 minutes jusqu'à ce qu'il devienne translucide sur les bords.",
    time: 2,
    tip: "🔥 Le riz doit être bien enrobé de matière grasse"
  },
  {
    step: 4,
    title: "Cuisson progressive",
    description: "Ajoutez le bouillon louche par louche en remuant constamment. Attendez l'absorption avant d'ajouter la suivante.",
    time: 18,
    tip: "👨‍🍳 La patience est la clé d'un bon risotto"
  },
  {
    step: 5,
    title: "Finition crémeuse",
    description: "Hors du feu, ajoutez le parmesan et le beurre froid. Remuez vigoureusement pour créer la crème.",
    time: 2,
    tip: "✨ Cette étape s'appelle 'mantecatura' en italien"
  }
];

