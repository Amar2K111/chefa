import { Technique } from '@/types';

export const techniques: Technique[] = [
  { id: 1, name: "Découpe en julienne", category: "Découpe", difficulty: 2, learned: true, icon: "🔪" },
  { id: 2, name: "Brunoise", category: "Découpe", difficulty: 3, learned: true, icon: "🔪" },
  { id: 3, name: "Émulsion", category: "Sauce", difficulty: 3, learned: true, icon: "🥄" },
  { id: 4, name: "Pocher un œuf", category: "Cuisson", difficulty: 2, learned: true, icon: "🥚" },
  { id: 5, name: "Caramélisation", category: "Sucré", difficulty: 3, learned: false, icon: "🍬" },
  { id: 6, name: "Tempérage chocolat", category: "Sucré", difficulty: 4, learned: false, icon: "🍫" },
  { id: 7, name: "Saisir la viande", category: "Cuisson", difficulty: 2, learned: true, icon: "🥩" },
  { id: 8, name: "Réduction", category: "Sauce", difficulty: 2, learned: true, icon: "🍯" }
];

