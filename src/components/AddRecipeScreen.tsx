'use client';

import React, { useState, useRef } from 'react';
import { X, Sparkles, Loader2, Plus, Trash2, Image as ImageIcon, Edit3 } from 'lucide-react';
import { Recipe, CookingStep } from '@/types';
import { ChefaMascot } from './ChefaMascot';

interface AddRecipeScreenProps {
  onClose: () => void;
  onAddRecipe: (recipe: Recipe) => void;
}

export const AddRecipeScreen: React.FC<AddRecipeScreenProps> = ({
  onClose,
  onAddRecipe
}) => {
  const [mode, setMode] = useState<'ai' | 'manual'>('ai');
  const [description, setDescription] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [instructions, setInstructions] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedRecipe, setGeneratedRecipe] = useState<Recipe | null>(null);
  
  // Mode manuel
  const [manualTitle, setManualTitle] = useState('');
  const [manualDescription, setManualDescription] = useState('');
  const [manualCategory, setManualCategory] = useState<string>('Plat principal');
  const [manualDifficulty, setManualDifficulty] = useState(2);
  const [manualTime, setManualTime] = useState(30);
  const [manualIngredients, setManualIngredients] = useState<string[]>(['']);
  const [manualCalories, setManualCalories] = useState(300);
  const [manualProtein, setManualProtein] = useState(15);
  const [manualPhoto, setManualPhoto] = useState<string | null>(null);
  const [manualSteps, setManualSteps] = useState<Array<{title: string, description: string, time: number, tip: string}>>([
    { title: '', description: '', time: 5, tip: '' }
  ]);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  // Mode manuel - Gestion de la photo
  const handlePhotoSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Veuillez sélectionner une image');
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setError('L\'image est trop grande (max 10MB)');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setManualPhoto(reader.result as string);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setManualPhoto(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Mode manuel - Ajouter un ingrédient
  const handleAddIngredient = () => {
    setManualIngredients([...manualIngredients, '']);
  };

  const handleRemoveIngredient = (index: number) => {
    setManualIngredients(manualIngredients.filter((_, i) => i !== index));
  };

  const handleIngredientChange = (index: number, value: string) => {
    const newIngredients = [...manualIngredients];
    newIngredients[index] = value;
    setManualIngredients(newIngredients);
  };

  // Mode manuel - Gestion des étapes
  const handleAddStep = () => {
    setManualSteps([...manualSteps, { title: '', description: '', time: 5, tip: '' }]);
  };

  const handleRemoveStep = (index: number) => {
    if (manualSteps.length > 1) {
      setManualSteps(manualSteps.filter((_, i) => i !== index));
    }
  };

  const handleStepChange = (index: number, field: string, value: string | number) => {
    const newSteps = [...manualSteps];
    newSteps[index] = { ...newSteps[index], [field]: value };
    setManualSteps(newSteps);
  };

  // Mode manuel - Sauvegarder la recette
  const handleSaveManualRecipe = () => {
    if (!manualTitle.trim()) {
      setError('Le titre est requis');
      return;
    }

    const validIngredients = manualIngredients.filter(ing => ing.trim() !== '');

    if (validIngredients.length === 0) {
      setError('Ajoute au moins un ingrédient');
      return;
    }

    // Préparer les étapes de cuisson
    const validSteps = manualSteps
      .filter(step => step.title.trim() !== '' || step.description.trim() !== '')
      .map((step, idx) => ({
        step: idx + 1,
        title: step.title.trim() || `Étape ${idx + 1}`,
        description: step.description.trim() || '',
        time: step.time || 5,
        tip: step.tip.trim() || ''
      }));

    const recipe: Recipe = {
      id: Date.now(),
      title: manualTitle.trim(),
      description: manualDescription.trim() || `Ma recette : ${manualTitle.trim()}`,
      category: manualCategory,
      difficulty: manualDifficulty,
      time: manualTime,
      image: 'chefa',
      ingredients: validIngredients,
      calories: manualCalories,
      protein: manualProtein,
      unlocked: true,
      photo: manualPhoto || undefined, // Stocker la photo en base64
      steps: validSteps.length > 0 ? validSteps : undefined
    };

    onAddRecipe(recipe);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto animate-slide-up" style={{ maxWidth: '430px', left: '50%', transform: 'translateX(-50%)' }}>
      <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-white fixed top-0 left-0 right-0 z-10" style={{ maxWidth: '430px', left: '50%', transform: 'translateX(-50%)' }}>
        <div className="flex items-center gap-3">
          <ChefaMascot size="sm" />
          <h1 className="text-xl font-bold text-gray-800">Créer un plat</h1>
        </div>
        <button onClick={onClose} className="hover:bg-gray-100 p-1 rounded-lg transition-all">
          <X size={24} />
        </button>
      </div>
      <div className="pt-[73px]">

      {/* Toggle Mode IA / Manuel */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex gap-2">
          <button
            onClick={() => setMode('ai')}
            className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all ${
              mode === 'ai'
                ? 'bg-orange-500 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Sparkles size={16} className="inline mr-2" />
            Avec IA
          </button>
          <button
            onClick={() => setMode('manual')}
            className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all ${
              mode === 'manual'
                ? 'bg-orange-500 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Edit3 size={16} className="inline mr-2" />
            Manuel
          </button>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {mode === 'manual' ? (
          // MODE MANUEL
          <>
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Titre de la recette *
              </label>
              <input
                type="text"
                value={manualTitle}
                onChange={(e) => setManualTitle(e.target.value)}
                placeholder="Ex: Mon risotto aux champignons"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Photo de ton plat (optionnel)
              </label>
              {!manualPhoto ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-orange-500 hover:bg-orange-50 transition-all"
                >
                  <ImageIcon className="mx-auto mb-2 text-gray-400" size={32} />
                  <p className="text-sm font-semibold text-gray-700">Clique pour ajouter une photo</p>
                  <p className="text-xs text-gray-500 mt-1">JPG, PNG (max 10MB)</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoSelect}
                    className="hidden"
                  />
                </div>
              ) : (
                <div className="relative">
                  <div className="relative w-full h-48 bg-gray-100 rounded-xl overflow-hidden">
                    <img
                      src={manualPhoto}
                      alt="Photo du plat"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    onClick={handleRemovePhoto}
                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-all shadow-lg"
                  >
                    <X size={18} />
                  </button>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Description (optionnel)
              </label>
              <textarea
                value={manualDescription}
                onChange={(e) => setManualDescription(e.target.value)}
                placeholder="Décris ta recette..."
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 transition-all min-h-[80px] resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Catégorie
                </label>
                <select
                  value={manualCategory}
                  onChange={(e) => setManualCategory(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 transition-all"
                >
                  <option value="Plat principal">Plat principal</option>
                  <option value="Poisson">Poisson</option>
                  <option value="Dessert">Dessert</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Temps (min)
                </label>
                <input
                  type="number"
                  value={manualTime}
                  onChange={(e) => setManualTime(parseInt(e.target.value) || 0)}
                  min="1"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Difficulté
                </label>
                <select
                  value={manualDifficulty}
                  onChange={(e) => setManualDifficulty(parseInt(e.target.value))}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 transition-all"
                >
                  <option value={1}>⭐ Très facile</option>
                  <option value={2}>⭐⭐ Facile</option>
                  <option value={3}>⭐⭐⭐ Moyen</option>
                  <option value={4}>⭐⭐⭐⭐ Difficile</option>
                  <option value={5}>⭐⭐⭐⭐⭐ Très difficile</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Calories
                </label>
                <input
                  type="number"
                  value={manualCalories}
                  onChange={(e) => setManualCalories(parseInt(e.target.value) || 0)}
                  min="0"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Protéines (g)
              </label>
              <input
                type="number"
                value={manualProtein}
                onChange={(e) => setManualProtein(parseInt(e.target.value) || 0)}
                min="0"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 transition-all"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-semibold text-gray-800">
                  Ingrédients *
                </label>
                <button
                  onClick={handleAddIngredient}
                  className="text-orange-500 hover:text-orange-600 text-sm font-semibold flex items-center gap-1"
                >
                  <Plus size={16} />
                  Ajouter
                </button>
              </div>
              <div className="space-y-2">
                {manualIngredients.map((ing, idx) => (
                  <div key={idx} className="flex gap-2">
                    <input
                      type="text"
                      value={ing}
                      onChange={(e) => handleIngredientChange(idx, e.target.value)}
                      placeholder={`Ingrédient ${idx + 1}`}
                      className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 transition-all"
                    />
                    {manualIngredients.length > 1 && (
                      <button
                        onClick={() => handleRemoveIngredient(idx)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-semibold text-gray-800">
                  Instructions de cuisson (optionnel)
                </label>
                <button
                  onClick={handleAddStep}
                  className="text-orange-500 hover:text-orange-600 text-sm font-semibold flex items-center gap-1"
                >
                  <Plus size={16} />
                  Ajouter étape
                </button>
              </div>
              <div className="space-y-3">
                {manualSteps.map((step, idx) => (
                  <div key={idx} className="bg-gray-50 rounded-xl p-4 border-2 border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-gray-600">Étape {idx + 1}</span>
                      {manualSteps.length > 1 && (
                        <button
                          onClick={() => handleRemoveStep(idx)}
                          className="text-red-500 hover:text-red-600"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                    <input
                      type="text"
                      value={step.title}
                      onChange={(e) => handleStepChange(idx, 'title', e.target.value)}
                      placeholder="Titre de l'étape (ex: Préparer les ingrédients)"
                      className="w-full px-3 py-2 mb-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 text-sm"
                    />
                    <textarea
                      value={step.description}
                      onChange={(e) => handleStepChange(idx, 'description', e.target.value)}
                      placeholder="Description détaillée de l'étape..."
                      className="w-full px-3 py-2 mb-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 text-sm min-h-[60px] resize-none"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-xs text-gray-600">Temps (min)</label>
                        <input
                          type="number"
                          value={step.time}
                          onChange={(e) => handleStepChange(idx, 'time', parseInt(e.target.value) || 5)}
                          min="1"
                          className="w-full px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-600">Conseil (optionnel)</label>
                        <input
                          type="text"
                          value={step.tip}
                          onChange={(e) => handleStepChange(idx, 'tip', e.target.value)}
                          placeholder="💡 Astuce..."
                          className="w-full px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 text-sm"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <button
              onClick={handleSaveManualRecipe}
              disabled={!manualTitle.trim()}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold py-4 rounded-xl shadow-lg hover:from-orange-600 hover:to-red-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus size={20} />
              <span>Ajouter à la bibliothèque</span>
            </button>
          </>
        ) : !generatedRecipe ? (
          // MODE IA
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
                <div className="flex justify-center mb-2">
                  <ChefaMascot size="md" />
                </div>
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
    </div>
  );
};

