import { Recipe } from '@/types';

export const recipes: Recipe[] = [
  {
    id: 1,
    title: "Risotto crémeux",
    difficulty: 3,
    time: 35,
    image: "🍚",
    category: "Plat principal",
    unlocked: true,
    description: "Un risotto onctueux à l'italienne, parfaitement crémeux",
    ingredients: ["Riz arborio", "Bouillon", "Parmesan", "Beurre", "Oignon"],
    calories: 450,
    protein: 12
  },
  {
    id: 2,
    title: "Saumon grillé parfait",
    difficulty: 2,
    time: 25,
    image: "🐟",
    category: "Poisson",
    unlocked: true,
    description: "Saumon avec croûte croustillante et cœur moelleux",
    ingredients: ["Saumon", "Citron", "Huile d'olive", "Aneth"],
    calories: 350,
    protein: 28
  },
  {
    id: 3,
    title: "Tarte tatin",
    difficulty: 4,
    time: 60,
    image: "🥧",
    category: "Dessert",
    unlocked: false,
    description: "Dessert français classique aux pommes caramélisées",
    ingredients: ["Pommes", "Sucre", "Beurre", "Pâte feuilletée"],
    calories: 380,
    protein: 4
  },
  {
    id: 4,
    title: "Pâtes carbonara",
    difficulty: 2,
    time: 20,
    image: "🍝",
    category: "Plat principal",
    unlocked: true,
    description: "La vraie recette romaine, crémeuse sans crème",
    ingredients: ["Pâtes", "Guanciale", "Œufs", "Pecorino", "Poivre"],
    calories: 520,
    protein: 18
  },
  {
    id: 5,
    title: "Poulet tikka masala",
    difficulty: 3,
    time: 45,
    image: "🍛",
    category: "Plat principal",
    unlocked: true,
    description: "Curry indien épicé et savoureux",
    ingredients: ["Poulet", "Yaourt", "Épices", "Tomates", "Crème"],
    calories: 480,
    protein: 32
  },
  {
    id: 6,
    title: "Tiramisu maison",
    difficulty: 2,
    time: 30,
    image: "🍰",
    category: "Dessert",
    unlocked: true,
    description: "Le dessert italien iconique",
    ingredients: ["Mascarpone", "Café", "Biscuits", "Cacao", "Œufs"],
    calories: 420,
    protein: 8
  },
  {
    id: 7,
    title: "Ratatouille provençale",
    difficulty: 2,
    time: 40,
    image: "🍆",
    category: "Plat principal",
    unlocked: true,
    description: "Légumes du soleil mijotés à la provençale",
    ingredients: ["Aubergines", "Courgettes", "Tomates", "Poivrons", "Ail", "Herbes"],
    calories: 180,
    protein: 5
  },
  {
    id: 8,
    title: "Sushi maison",
    difficulty: 4,
    time: 90,
    image: "🍣",
    category: "Poisson",
    unlocked: false,
    description: "Sushi frais préparé à la maison",
    ingredients: ["Riz à sushi", "Saumon", "Avocat", "Algues nori", "Vinaigre de riz"],
    calories: 320,
    protein: 15
  }
];

