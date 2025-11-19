'use client';

import React, { useState, useRef, useEffect } from 'react';
import { X, Upload, Sparkles, Loader2, Image as ImageIcon, Camera } from 'lucide-react';
import { Recipe } from '@/types';
import { ChefaMascot } from './ChefaMascot';

interface PhotoToRecipeScreenProps {
  onClose: () => void;
  onAddRecipe: (recipe: Recipe) => void;
  onUseTextDescription?: () => void;
}

export const PhotoToRecipeScreen: React.FC<PhotoToRecipeScreenProps> = ({
  onClose,
  onAddRecipe,
  onUseTextDescription
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedRecipe, setGeneratedRecipe] = useState<Recipe | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const processImageFile = (file: File) => {
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
  };

  const handleCameraClick = async () => {
    // Sur mobile, utiliser l'input avec capture pour ouvrir directement la caméra
    if (cameraInputRef.current) {
      cameraInputRef.current.click();
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } // Caméra arrière sur mobile
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setShowCamera(true);
      }
    } catch (err) {
      console.error('Erreur accès caméra:', err);
      // Fallback : utiliser l'input file avec capture
      cameraInputRef.current?.click();
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setShowCamera(false);
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        const dataUrl = canvas.toDataURL('image/jpeg');
        setSelectedImage(dataUrl);
        stopCamera();
      }
    }
  };

  const handleGalleryClick = () => {
    fileInputRef.current?.click();
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
      
      // Détecter le type MIME
      const mimeMatch = selectedImage.match(/data:([^;]+);/);
      const mimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg';

      const response = await fetch('/api/photo-to-recipe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: base64Image,
          mimeType: mimeType,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.details || 'Erreur lors de la génération de la recette');
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
    stopCamera();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (cameraInputRef.current) {
      cameraInputRef.current.value = '';
    }
  };

  // Nettoyer le stream quand le composant se démonte
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleSelectNewImage = () => {
    setGeneratedRecipe(null);
    setError(null);
    handleGalleryClick();
  };

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto animate-slide-up" style={{ maxWidth: '430px', left: '50%', transform: 'translateX(-50%)' }}>
      <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-white sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <ChefaMascot size="sm" />
          <h1 className="text-xl font-bold text-gray-800">Photo → Recette</h1>
        </div>
        <button onClick={onClose} className="hover:bg-gray-100 p-1 rounded-lg transition-all">
          <X size={24} />
        </button>
      </div>

      <div className="p-4 space-y-6">
        {!generatedRecipe ? (
          <>
            <div>
              <h2 className="text-lg font-bold text-gray-800 mb-3">Ajoute une photo de plat</h2>
              
              {/* Description principale */}
              <div className="bg-gradient-to-r from-orange-50 to-red-50 border-2 border-orange-200 rounded-xl p-4 mb-4">
                <p className="text-sm text-gray-700 font-medium leading-relaxed">
                  📸 Prends une photo d'un plat que tu veux cuisiner et l'IA génère la recette complète avec les ingrédients, les étapes de préparation, le temps de cuisson et tous les détails nécessaires !
                </p>
              </div>

              {/* Étapes d'utilisation */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
                <p className="text-xs font-semibold text-blue-800 mb-3 flex items-center gap-2">
                  <Sparkles size={16} />
                  Comment ça marche ?
                </p>
                <div className="space-y-2">
                  <div className="flex gap-3 items-start">
                    <div className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                      1
                    </div>
                    <p className="text-xs text-blue-700 flex-1">Prends une photo du plat avec ta caméra ou choisis une image depuis ta galerie</p>
                  </div>
                  <div className="flex gap-3 items-start">
                    <div className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                      2
                    </div>
                    <p className="text-xs text-blue-700 flex-1">L'IA analyse la photo et identifie les ingrédients et la préparation</p>
                  </div>
                  <div className="flex gap-3 items-start">
                    <div className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                      3
                    </div>
                    <p className="text-xs text-blue-700 flex-1">Une recette complète est générée avec toutes les étapes de cuisson</p>
                  </div>
                  <div className="flex gap-3 items-start">
                    <div className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                      4
                    </div>
                    <p className="text-xs text-blue-700 flex-1">Ajoute la recette à ta bibliothèque et commence à cuisiner !</p>
                  </div>
                </div>
              </div>

              {!selectedImage ? (
                showCamera ? (
                  <div className="space-y-4">
                    <div className="relative w-full bg-black rounded-xl overflow-hidden" style={{ aspectRatio: '4/3' }}>
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={stopCamera}
                        className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-all shadow-lg z-10"
                      >
                        <X size={18} />
                      </button>
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={stopCamera}
                        className="flex-1 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all"
                      >
                        Annuler
                      </button>
                      <button
                        onClick={capturePhoto}
                        className="flex-1 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-red-600 transition-all"
                      >
                        📸 Capturer
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={handleCameraClick}
                        className="border-2 border-dashed border-orange-300 rounded-xl p-6 text-center cursor-pointer hover:border-orange-500 hover:bg-orange-50 transition-all flex flex-col items-center justify-center"
                      >
                        <Camera className="mb-2 text-orange-500" size={40} />
                        <p className="font-semibold text-gray-700 text-sm">Prendre une photo</p>
                        <input
                          ref={cameraInputRef}
                          type="file"
                          accept="image/*"
                          capture="environment"
                          onChange={handleFileSelect}
                          className="hidden"
                        />
                      </button>
                    <button
                      onClick={handleGalleryClick}
                      className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-orange-500 hover:bg-orange-50 transition-all flex flex-col items-center justify-center"
                    >
                      <ImageIcon className="mb-2 text-gray-400" size={40} />
                      <p className="font-semibold text-gray-700 text-sm">Choisir depuis la galerie</p>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                    </button>
                    </div>
                    <p className="text-xs text-gray-500 text-center">JPG, PNG (max 10MB)</p>
                  </div>
                )
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
                <p className="text-sm font-semibold text-red-800 mb-1">Erreur</p>
                <p className="text-sm text-red-600 mb-2">{error}</p>
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mt-3">
                  <p className="text-xs font-semibold text-orange-800 mb-1">💡 Solution alternative :</p>
                  <p className="text-xs text-orange-700 mb-2">
                    Si l'analyse d'image ne fonctionne pas, tu peux utiliser la fonctionnalité "Ajouter une recette" et décrire le plat avec du texte.
                  </p>
                  {onUseTextDescription && (
                    <button
                      onClick={() => {
                        onClose();
                        onUseTextDescription();
                      }}
                      className="text-xs text-orange-600 font-semibold hover:text-orange-700 underline"
                    >
                      Utiliser la description textuelle →
                    </button>
                  )}
                </div>
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
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleCameraClick}
                  className="py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
                >
                  <Camera size={18} />
                  Reprendre une photo
                </button>
                <button
                  onClick={handleSelectNewImage}
                  className="py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
                >
                  <ImageIcon size={18} />
                  Changer la photo
                </button>
              </div>
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
                  onClick={() => {
                    setGeneratedRecipe(null);
                    setSelectedImage(null);
                    if (fileInputRef.current) {
                      fileInputRef.current.value = '';
                    }
                    if (cameraInputRef.current) {
                      cameraInputRef.current.value = '';
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

