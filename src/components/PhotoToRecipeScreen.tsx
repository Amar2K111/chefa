'use client';

import React, { useState, useRef } from 'react';
import { X, Upload, Sparkles, Loader2, Image as ImageIcon } from 'lucide-react';
import { Recipe } from '@/types';

interface PhotoToRecipeScreenProps {
  onClose: () => void;
  onAddRecipe: (recipe: Recipe) => void;
}

export const PhotoToRecipeScreen: React.FC<PhotoToRecipeScreenProps> = ({
  onClose,
  onAddRecipe
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedRecipe, setGeneratedRecipe] = useState<Recipe | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Vérifier le type de fichier
      if (!file.type.startsWith('image/')) {
        setError('Veuillez sélectionner une image');
        return;
      }
      
      // Vérifier la taille (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError('L\'image est trop grande (max 10MB)');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setError(null);
        setGeneratedRecipe(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateRecipe = async () => {
    if (!selectedImage) {
      setError('Veuillez sélectionner une image');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setGeneratedRecipe(null);

    try {
      // Convertir l'image en base64
      const base64Image = selectedImage.split(',')[1]; // Enlever le préfixe data:image/...

      const response = await fetch('/api/photo-to-recipe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: base64Image,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la génération de la recette');
      }

      if (data.success && data.recipe) {
        // Générer un ID unique pour la recette
        const customRecipe: Recipe = {
          ...data.recipe,
          id: Date.now(),
          unlocked: true,
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

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setGeneratedRecipe(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSelectNewImage = () => {
    setGeneratedRecipe(null);
    setError(null);
    fileInputRef.current?.click();
  };

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto animate-slide-up" style={{ maxWidth: '430px', left: '50%', transform: 'translateX(-50%)' }}>
      <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-white sticky top-0 z-10">
        <h1 className="text-xl font-bold text-gray-800">Photo → Recette</h1>
        <button onClick={onClose} className="hover:bg-gray-100 p-1 rounded-lg transition-all">
          <X size={24} />
        </button>
      </div>

      <div className="p-4 space-y-6">
        {!generatedRecipe ? (
          <>
            <div>
              <h2 className="text-lg font-bold text-gray-800 mb-3">Ajoute une photo de plat</h2>
              <p className="text-sm text-gray-600 mb-4">
                Prends une photo d'un plat que tu veux cuisiner et l'IA génère la recette complète !
              </p>

              {!selectedImage ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-orange-500 hover:bg-orange-50 transition-all"
                >
                  <ImageIcon className="mx-auto mb-3 text-gray-400" size={48} />
                  <p className="font-semibold text-gray-700 mb-1">Clique pour ajouter une photo</p>
                  <p className="text-xs text-gray-500">JPG, PNG (max 10MB)</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </div>
              ) : (
                <div className="relative">
                  <div className="relative w-full h-64 bg-gray-100 rounded-xl overflow-hidden">
                    <img
                      src={selectedImage}
                      alt="Plat sélectionné"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-all shadow-lg"
                  >
                    <X size={18} />
                  </button>
                </div>
              )}
            </div>

            {error && (
              <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {selectedImage && (
              <button
                onClick={handleGenerateRecipe}
                disabled={isGenerating}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold py-4 rounded-xl shadow-lg hover:from-orange-600 hover:to-red-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    <span>Analyse de la photo...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={20} />
                    <span>Générer la recette avec l'IA</span>
                  </>
                )}
              </button>
            )}

            {selectedImage && !isGenerating && (
              <button
                onClick={handleSelectNewImage}
                className="w-full py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all"
              >
                Choisir une autre photo
              </button>
            )}
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
                  onClick={() => {
                    setGeneratedRecipe(null);
                    setSelectedImage(null);
                    if (fileInputRef.current) {
                      fileInputRef.current.value = '';
                    }
                  }}
                  className="flex-1 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all"
                >
                  Recommencer
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

