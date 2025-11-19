export interface ChatMessage {
  type: 'user' | 'ai';
  text: string;
  time: string;
}

export interface Recipe {
  id: number;
  title: string;
  difficulty: number;
  time: number;
  image: string;
  category: string;
  unlocked: boolean;
  description: string;
  ingredients: string[];
  calories: number;
  protein: number;
}

export interface Badge {
  id: number;
  name: string;
  icon: string;
  earned: boolean;
  description: string;
}

export interface Technique {
  id: number;
  name: string;
  category: string;
  difficulty: number;
  learned: boolean;
  icon: string;
}

export interface CookingStep {
  step: number;
  title: string;
  description: string;
  time: number;
  tip: string;
}

export interface PortfolioItem {
  id: number;
  dish: string;
  date: string;
  rating: number;
  image: string;
  photo: string | null;
}

export interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

export interface UserData {
  name: string;
  email: string;
  phone: string;
  dishesCompleted: number;
  techniquesLearned: number;
  totalTechniques: number;
  level: number;
  levelName: string;
  streak: number;
  joinDate: string;
  avatar: string;
}

export interface OnboardingScreen {
  title: string;
  description: string;
  emoji: string;
  color: string;
}

export type TabId = 'home' | 'library' | 'stats' | 'profile';
export type RecipeCategory = 'Tout' | 'Plat principal' | 'Poisson' | 'Dessert';

