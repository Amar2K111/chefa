'use client';

import React from 'react';
import { ChefHat, Bell, Flame, Trophy, Clock, BarChart3, Book, ArrowRight } from 'lucide-react';
import { UserData, Recipe, TabId } from '@/types';

interface HomeScreenProps {
  userData: UserData;
  progress: number;
  notifications: { id: number; read: boolean }[];
  recipes: Recipe[];
  onNotificationClick: () => void;
  onStartCooking: () => void;
  onRecipeClick: (recipe: Recipe) => void;
  onTabChange: (tab: TabId) => void;
  onPhotoToRecipeClick: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  userData,
  progress,
  notifications,
  recipes,
  onNotificationClick,
  onStartCooking,
  onRecipeClick,
  onTabChange,
  onPhotoToRecipeClick
}) => {
  const challengeRecipe = recipes[0]; // Risotto crémeux

  return (
    <div className="p-4 pb-24 bg-gradient-to-b from-orange-50 to-white min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Bonjour {userData.name} 👋</h1>
          <p className="text-sm text-gray-500">Prêt à cuisiner aujourd'hui ?</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onNotificationClick}
            className="relative bg-white p-3 rounded-full shadow-sm hover:bg-gray-50 transition-all"
          >
            <Bell size={20} className="text-gray-700" />
            {notifications.filter(n => !n.read).length > 0 && (
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold animate-pulse">
                {notifications.filter(n => !n.read).length}
              </div>
            )}
          </button>
          <button className="bg-orange-500 text-white px-4 py-2 rounded-full flex items-center gap-2 hover:bg-orange-600 transition-all shadow-md">
            <Flame size={18} />
            <span className="font-bold">{userData.streak}</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-5 mb-6 shadow-sm border border-orange-100">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <ChefHat className="text-orange-500" size={24} />
            <div>
              <h3 className="font-bold text-gray-800">Niveau {userData.level}</h3>
              <p className="text-xs text-gray-500">{userData.levelName}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-orange-500">{progress}%</p>
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            className="bg-gradient-to-r from-orange-400 to-red-500 h-full rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="text-xs text-gray-500 mt-2">Plus que {100 - progress}% pour passer Niveau {userData.level + 1}</p>
      </div>

      {/* WOW Feature - Photo → Recette */}
      <div className="mb-6">
        <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-10 rounded-full -ml-12 -mb-12"></div>
          <div className="relative z-10">
            <div className="text-5xl mb-3 text-center">📸✨</div>
            <h2 className="text-xl font-bold mb-2 text-center">Photo → Recette</h2>
            <p className="text-sm text-center opacity-90 mb-4">
              Ajoute une photo de n'importe quel plat et l'IA génère la recette complète !
            </p>
            <button
              onClick={onPhotoToRecipeClick}
              className="w-full bg-white text-orange-500 font-bold py-3 rounded-xl hover:bg-orange-50 transition-all shadow-lg"
            >
              🚀 Essayer maintenant
            </button>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Trophy className="text-yellow-500" size={20} />
          <h2 className="text-lg font-bold text-gray-800">Défi du jour</h2>
        </div>
        <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl p-6 text-white shadow-lg">
          <div className="text-6xl mb-3 text-center">{challengeRecipe?.image}</div>
          <h3 className="text-xl font-bold mb-2 text-center">{challengeRecipe?.title}</h3>
          <div className="flex items-center justify-center gap-4 mb-4 text-sm">
            <div className="flex items-center gap-1">
              <Clock size={16} />
              <span>{challengeRecipe?.time} min</span>
            </div>
            <div className="flex items-center gap-1">
              {'⭐'.repeat(challengeRecipe?.difficulty || 0)}{'☆'.repeat(5 - (challengeRecipe?.difficulty || 0))}
            </div>
          </div>
          <button
            onClick={onStartCooking}
            className="w-full bg-white text-orange-500 font-bold py-3 rounded-xl hover:bg-orange-50 transition-all shadow-md"
          >
            Commencer maintenant
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-5 mb-6 shadow-sm">
        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
          <BarChart3 className="text-orange-500" size={20} />
          Ma progression
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-orange-50 rounded-xl">
            <p className="text-3xl font-bold text-orange-500">{userData.dishesCompleted}</p>
            <p className="text-xs text-gray-600">Plats réalisés</p>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-xl">
            <p className="text-3xl font-bold text-green-500">{userData.techniquesLearned}/{userData.totalTechniques}</p>
            <p className="text-xs text-gray-600">Techniques</p>
          </div>
        </div>
        <button
          onClick={() => onTabChange('stats')}
          className="w-full mt-4 py-2 border-2 border-orange-200 text-orange-500 font-semibold rounded-xl hover:bg-orange-50 transition-all"
        >
          Voir mon portfolio
        </button>
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-gray-800 flex items-center gap-2">
            <Book className="text-orange-500" size={20} />
            Apprendre à cuisiner
          </h3>
          <button
            onClick={() => onTabChange('library')}
            className="text-sm text-orange-500 font-semibold hover:text-orange-600 transition-all"
          >
            Voir tout →
          </button>
        </div>
        <div className="space-y-3">
          {recipes.slice(1, 3).map(recipe => (
            <div
              key={recipe.id}
              onClick={() => onRecipeClick(recipe)}
              className="bg-white rounded-xl p-4 shadow-sm flex items-center gap-4 border border-gray-100 cursor-pointer hover:border-orange-300 hover:shadow-md transition-all"
            >
              <div className="text-4xl">{recipe.image}</div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-800">{recipe.title}</h4>
                <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Clock size={12} /> {recipe.time} min
                  </span>
                  <span>{'⭐'.repeat(recipe.difficulty)}</span>
                </div>
              </div>
              <ArrowRight size={20} className="text-orange-500" />
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-5 border-2 border-blue-200">
        <div className="flex items-start gap-3">
          <div className="text-4xl">📚</div>
          <div className="flex-1">
            <h3 className="font-bold text-gray-800 mb-1">Ma bibliothèque de recettes</h3>
            <p className="text-sm text-gray-600 mb-3">Enregistre et organise toutes tes recettes préférées</p>
            <button
              onClick={() => onTabChange('library')}
              className="w-full bg-blue-500 text-white font-semibold py-3 rounded-xl hover:bg-blue-600 transition-all shadow-md"
            >
              Ouvrir ma bibliothèque
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

