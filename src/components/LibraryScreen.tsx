'use client';

import React, { useState, useMemo } from 'react';
import { Search, Clock, Lock, Heart, BookOpen, CheckCircle } from 'lucide-react';
import { Recipe, RecipeCategory, Technique } from '@/types';
import { filterRecipesByCategory, filterRecipesBySearch, getAvailableCategories } from '@/utils/recipeFilters';

interface LibraryScreenProps {
  recipes: Recipe[];
  techniques: Technique[];
  favoriteRecipes: number[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onRecipeClick: (recipe: Recipe) => void;
  onToggleFavorite: (recipeId: number) => void;
}

export const LibraryScreen: React.FC<LibraryScreenProps> = ({
  recipes,
  techniques,
  favoriteRecipes,
  searchQuery,
  onSearchChange,
  onRecipeClick,
  onToggleFavorite
}) => {
  const [selectedCategory, setSelectedCategory] = useState<RecipeCategory>('Tout');

  const availableCategories = useMemo(() => getAvailableCategories(recipes), [recipes]);

  const filteredRecipes = useMemo(() => {
    let filtered = filterRecipesByCategory(recipes, selectedCategory);
    filtered = filterRecipesBySearch(filtered, searchQuery);
    return filtered;
  }, [recipes, selectedCategory, searchQuery]);

  return (
    <div className="p-4 pb-24 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Bibliothèque</h1>

      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Rechercher une recette..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 transition-all"
          />
        </div>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
        {availableCategories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap border-2 transition-all ${
              selectedCategory === category
                ? 'bg-orange-500 text-white border-orange-500'
                : 'bg-white border-orange-200 text-orange-500 hover:bg-orange-50'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {filteredRecipes.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <p className="text-gray-500">Aucune recette trouvée</p>
          <p className="text-sm text-gray-400 mt-2">Essaie de modifier tes critères de recherche</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 mb-6">
          {filteredRecipes.map(recipe => (
            <div
              key={recipe.id}
              onClick={() => recipe.unlocked && onRecipeClick(recipe)}
              className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 relative cursor-pointer hover:shadow-md transition-all"
            >
              {!recipe.unlocked && (
                <div className="absolute inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-10 rounded-xl">
                  <div className="text-center">
                    <Lock className="text-white mx-auto mb-2" size={32} />
                    <p className="text-white text-xs font-semibold">Niveau {recipe.difficulty + 1}</p>
                  </div>
                </div>
              )}
              <div className="text-6xl text-center py-8 bg-gradient-to-br from-orange-50 to-red-50">
                {recipe.image}
              </div>
              <div className="p-3">
                <h3 className="font-semibold text-sm text-gray-800 mb-2">{recipe.title}</h3>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Clock size={12} /> {recipe.time}min
                  </span>
                  <span>{'⭐'.repeat(recipe.difficulty)}</span>
                </div>
              </div>
              {recipe.unlocked && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite(recipe.id);
                  }}
                  className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-md hover:bg-gray-50 transition-all"
                >
                  <Heart
                    size={16}
                    className={favoriteRecipes.includes(recipe.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'}
                  />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="mt-6">
        <h2 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
          <BookOpen size={20} className="text-orange-500" />
          Techniques à maîtriser
        </h2>
        <div className="space-y-2">
          {techniques.slice(0, 4).map(tech => (
            <div
              key={tech.id}
              className={`p-4 rounded-xl border-2 flex items-center justify-between transition-all ${
                tech.learned
                  ? 'bg-green-50 border-green-200'
                  : 'bg-gray-50 border-gray-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{tech.icon}</span>
                <div>
                  <h4 className="font-semibold text-gray-800 text-sm">{tech.name}</h4>
                  <p className="text-xs text-gray-500">{tech.category} • {'⭐'.repeat(tech.difficulty)}</p>
                </div>
              </div>
              {tech.learned ? (
                <CheckCircle size={20} className="text-green-500" />
              ) : (
                <Lock size={20} className="text-gray-400" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

