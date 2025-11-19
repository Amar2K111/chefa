'use client';

import React from 'react';
import { X, Heart, Clock, Zap, Target, BookOpen, CheckCircle } from 'lucide-react';
import { Recipe } from '@/types';
import { ChefaMascot } from './ChefaMascot';

interface RecipeDetailScreenProps {
  recipe: Recipe;
  isFavorite: boolean;
  onClose: () => void;
  onToggleFavorite: () => void;
  onStartCooking: () => void;
}

export const RecipeDetailScreen: React.FC<RecipeDetailScreenProps> = ({
  recipe,
  isFavorite,
  onClose,
  onToggleFavorite,
  onStartCooking
}) => {
  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto animate-slide-up w-full">
      <div className="relative">
        <div className="h-64 bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center overflow-hidden">
          {recipe.photo ? (
            <img src={recipe.photo} alt={recipe.title} className="w-full h-full object-cover" />
          ) : (
            <ChefaMascot size="xl" />
          )}
        </div>
        <button
          onClick={onClose}
          className="absolute top-4 left-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition-all"
        >
          <X size={24} />
        </button>
        <button
          onClick={onToggleFavorite}
          className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition-all"
        >
          <Heart
            size={24}
            className={isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}
          />
        </button>
      </div>

      <div className="p-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-semibold px-3 py-1 bg-orange-100 text-orange-600 rounded-full">
            {recipe.category}
          </span>
          <span className="text-xs text-gray-500">
            {'⭐'.repeat(recipe.difficulty)}{'☆'.repeat(5 - recipe.difficulty)}
          </span>
        </div>

        <h1 className="text-3xl font-bold text-gray-800 mb-2">{recipe.title}</h1>
        <p className="text-gray-600 mb-6">{recipe.description}</p>

        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-orange-50 rounded-xl p-4 text-center">
            <Clock className="mx-auto mb-2 text-orange-500" size={24} />
            <p className="text-sm font-semibold text-gray-800">{recipe.time} min</p>
          </div>
          <div className="bg-green-50 rounded-xl p-4 text-center">
            <Zap className="mx-auto mb-2 text-green-500" size={24} />
            <p className="text-sm font-semibold text-gray-800">{recipe.calories} cal</p>
          </div>
          <div className="bg-blue-50 rounded-xl p-4 text-center">
            <Target className="mx-auto mb-2 text-blue-500" size={24} />
            <p className="text-sm font-semibold text-gray-800">{recipe.protein}g protéines</p>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
            <BookOpen size={20} className="text-orange-500" />
            Ingrédients
          </h2>
          <div className="space-y-2">
            {recipe.ingredients.map((ingredient, idx) => (
              <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all">
                <CheckCircle size={18} className="text-green-500" />
                <span className="text-gray-700">{ingredient}</span>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={onStartCooking}
          className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold py-4 rounded-xl shadow-lg hover:from-orange-600 hover:to-red-600 transition-all transform hover:scale-105"
        >
          🍳 Commencer la recette
        </button>
      </div>
    </div>
  );
};

