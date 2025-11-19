'use client';

import React, { useState } from 'react';
import { X, Sparkles, Loader2, Plus, Trash2 } from 'lucide-react';
import { Recipe } from '@/types';

interface AddRecipeScreenProps {
  onClose: () => void;
  onAddRecipe: (recipe: Recipe) => void;
}

export const AddRecipeScreen: React.FC<AddRecipeScreenProps> = ({
  onClose,
  onAddRecipe
}) => {
  const [description, setDescription] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [instructions, setInstructions] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedRecipe, setGeneratedRecipe] = useState<Recipe | null>(null);

  const handleGenerate = async () => {
    if (!description.trim()) {
      setError('Veuillez décrire le plat que vous voulez créer');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setGeneratedRecipe(null);

    try {
      const response = await fetch('/api/generate-recipe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description: description.trim(),
          ingredients: ingredients.trim() || undefined,
          instructions: instructions.trim() || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la génération');
      }

      if (data.success && data.recipe) {
        // Générer un ID unique pour la recette personnalisée
        const customRecipe: Recipe = {
          ...data.recipe,
          id: Date.now(), // ID basé sur le timestamp
          unlocked: true, // Les recettes personnalisées sont toujours débloquées
        };
        setGeneratedRecipe(customRecipe);
      }
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la génération de la recette');
      console.error('Erreur:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAddRecipe = () => {
    if (generatedRecipe) {
      onAddRecipe(generatedRecipe);
      onClose();
    }
  };

  const handleEditGenerated = () => {
    setGeneratedRecipe(null);
  };

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto animate-slide-up" style={{ maxWidth: '430px', left: '50%', transform: 'translateX(-50%)' }}>
      <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-white sticky top-0 z-10">
        <h1 className="text-xl font-bold text-gray-800">Créer un plat</h1>
        <button onClick={onClose} className="hover:bg-gray-100 p-1 rounded-lg transition-all">
          <X size={24} />
        </button>
      </div>

      <div className="p-4 space-y-6">
        {!generatedRecipe ? (
          <>
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Décris le plat que tu veux créer *
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ex: Un risotto aux champignons crémeux avec du parmesan..."
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 transition-all min-h-[100px] resize-none"
                disabled={isGenerating}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Ingrédients (optionnel)
              </label>
              <textarea
                value={ingredients}
                onChange={(e) => setIngredients(e.target.value)}
                placeholder="Ex: Riz, champignons, bouillon, parmesan..."
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 transition-all min-h-[80px] resize-none"
                disabled={isGenerating}
              />
              <p className="text-xs text-gray-500 mt-1">Sépare les ingrédients par des virgules</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Instructions (optionnel)
              </label>
              <textarea
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder="Ex: Faire revenir les champignons, ajouter le riz..."
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 transition-all min-h-[100px] resize-none"
                disabled={isGenerating}
              />
            </div>

            {error && (
              <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <button
              onClick={handleGenerate}
              disabled={isGenerating || !description.trim()}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold py-4 rounded-xl shadow-lg hover:from-orange-600 hover:to-red-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  <span>Génération en cours...</span>
                </>
              ) : (
                <>
                  <Sparkles size={20} />
                  <span>Générer la recette avec l'IA</span>
                </>
              )}
            </button>
          </>
        ) : (
          <div className="space-y-4">
            <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="text-green-600" size={20} />
                <p className="text-sm font-semibold text-green-800">Recette générée avec succès !</p>
              </div>
              <p className="text-xs text-green-600">Vérifie les détails ci-dessous avant d'ajouter</p>
            </div>

            <div className="bg-white border-2 border-gray-200 rounded-xl p-4 space-y-3">
              <div className="text-center">
                <div className="text-6xl mb-2">{generatedRecipe.image}</div>
                <h2 className="text-2xl font-bold text-gray-800">{generatedRecipe.title}</h2>
                <p className="text-sm text-gray-600 mt-1">{generatedRecipe.description}</p>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="bg-orange-50 rounded-lg p-2 text-center">
                  <p className="text-xs text-gray-600">Temps</p>
                  <p className="font-bold text-orange-600">{generatedRecipe.time} min</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-2 text-center">
                  <p className="text-xs text-gray-600">Difficulté</p>
                  <p className="font-bold text-blue-600">{'⭐'.repeat(generatedRecipe.difficulty)}</p>
                </div>
                <div className="bg-green-50 rounded-lg p-2 text-center">
                  <p className="text-xs text-gray-600">Calories</p>
                  <p className="font-bold text-green-600">{generatedRecipe.calories}</p>
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-800 mb-2">Ingrédients :</p>
                <div className="space-y-1">
                  {generatedRecipe.ingredients.map((ing, idx) => (
                    <div key={idx} className="text-sm text-gray-700 bg-gray-50 rounded-lg px-3 py-2">
                      • {ing}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleEditGenerated}
                  className="flex-1 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all"
                >
                  Modifier
                </button>
                <button
                  onClick={handleAddRecipe}
                  className="flex-1 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-red-600 transition-all"
                >
                  Ajouter à la bibliothèque
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

