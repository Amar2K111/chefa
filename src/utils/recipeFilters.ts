import { Recipe, RecipeCategory } from '@/types';

export function filterRecipesByCategory(recipes: Recipe[], category: RecipeCategory): Recipe[] {
  if (category === 'Tout') {
    return recipes;
  }
  return recipes.filter(recipe => recipe.category === category);
}

export function filterRecipesBySearch(recipes: Recipe[], searchQuery: string): Recipe[] {
  if (!searchQuery.trim()) {
    return recipes;
  }
  const query = searchQuery.toLowerCase();
  return recipes.filter(recipe =>
    recipe.title.toLowerCase().includes(query) ||
    recipe.description.toLowerCase().includes(query) ||
    recipe.ingredients.some(ing => ing.toLowerCase().includes(query)) ||
    recipe.category.toLowerCase().includes(query)
  );
}

export function filterRecipesByDifficulty(recipes: Recipe[], difficulty: number | null): Recipe[] {
  if (difficulty === null) {
    return recipes;
  }
  return recipes.filter(recipe => recipe.difficulty === difficulty);
}

export function filterRecipesByTime(recipes: Recipe[], maxTime: number | null): Recipe[] {
  if (maxTime === null) {
    return recipes;
  }
  return recipes.filter(recipe => recipe.time <= maxTime);
}

export function getAvailableCategories(recipes: Recipe[]): RecipeCategory[] {
  const categories = new Set<RecipeCategory>(['Tout']);
  recipes.forEach(recipe => {
    if (recipe.category === 'Plat principal') categories.add('Plat principal');
    if (recipe.category === 'Poisson') categories.add('Poisson');
    if (recipe.category === 'Dessert') categories.add('Dessert');
  });
  return Array.from(categories);
}

