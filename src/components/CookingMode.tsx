'use client';

import React from 'react';
import { X, MessageCircle, Clock, Timer, Play, Pause } from 'lucide-react';
import { CookingStep } from '@/types';
import { useTimer } from '@/hooks/useTimer';

interface CookingModeProps {
  steps: CookingStep[];
  currentStep: number;
  recipeTitle: string;
  onClose: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onComplete: () => void;
  onOpenChat: () => void;
}

export const CookingMode: React.FC<CookingModeProps> = ({
  steps,
  currentStep,
  recipeTitle,
  onClose,
  onNext,
  onPrevious,
  onComplete,
  onOpenChat
}) => {
  const step = steps[currentStep];
  const {
    timerActive,
    timerSeconds,
    startTimer,
    pauseTimer,
    resumeTimer,
    formatTime
  } = useTimer();

  const handleQuit = () => {
    if (confirm('Voulez-vous vraiment quitter la recette ? Votre progression sera sauvegardée.')) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900 text-white z-50 flex flex-col" style={{ maxWidth: '430px', left: '50%', transform: 'translateX(-50%)' }}>
      <div className="p-4 bg-gray-800 flex items-center justify-between">
        <button
          onClick={handleQuit}
          className="text-white flex items-center gap-2 hover:text-orange-400 transition-all"
        >
          <X size={20} />
          <span className="font-semibold">Quitter</span>
        </button>
        <span className="font-bold">Étape {currentStep + 1}/{steps.length}</span>
        <button onClick={onOpenChat} className="hover:text-orange-400 transition-all">
          <MessageCircle size={24} className="text-orange-400" />
        </button>
      </div>

      <div className="w-full bg-gray-800 h-2">
        <div
          className="bg-orange-500 h-full transition-all duration-300"
          style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
        ></div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">{step.title}</h2>

          <div className="bg-orange-500 bg-opacity-20 border-2 border-orange-500 rounded-xl p-4 mb-6 flex items-center gap-3">
            <Clock size={32} className="text-orange-400" />
            <div>
              <p className="text-sm text-orange-300">Temps estimé</p>
              <p className="text-2xl font-bold">{step.time} min</p>
            </div>
            {!timerActive && timerSeconds === 0 ? (
              <button
                onClick={() => startTimer(step.time)}
                className="ml-auto bg-orange-500 px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-2 hover:bg-orange-600 transition-all"
              >
                <Timer size={18} />
                Démarrer
              </button>
            ) : (
              <div className="ml-auto text-center">
                <p className="text-2xl font-bold text-orange-400">{formatTime(timerSeconds)}</p>
                <div className="flex gap-2 mt-1">
                  {timerActive ? (
                    <button
                      onClick={pauseTimer}
                      className="text-xs text-orange-300 hover:text-orange-200 flex items-center gap-1"
                    >
                      <Pause size={14} />
                      Pause
                    </button>
                  ) : (
                    <button
                      onClick={resumeTimer}
                      className="text-xs text-orange-300 hover:text-orange-200 flex items-center gap-1"
                    >
                      <Play size={14} />
                      Reprendre
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          <p className="text-xl leading-relaxed mb-6 text-gray-200">
            {step.description}
          </p>

          <div className="bg-blue-500 bg-opacity-20 border-2 border-blue-400 rounded-xl p-4 mb-6">
            <p className="text-lg">{step.tip}</p>
          </div>

          <button className="w-full bg-gray-800 border-2 border-gray-700 rounded-xl p-4 flex items-center justify-center gap-3 mb-4 hover:bg-gray-750 transition-all">
            <Play size={24} className="text-orange-400" />
            <span className="font-semibold">Voir la vidéo de cette étape</span>
          </button>

          <button
            onClick={onOpenChat}
            className="w-full bg-orange-500 bg-opacity-20 border-2 border-orange-500 rounded-xl p-4 flex items-center justify-center gap-3 hover:bg-orange-500 hover:bg-opacity-30 transition-all"
          >
            <MessageCircle size={24} className="text-orange-400" />
            <span className="font-semibold">Demander de l'aide à Chef AI</span>
          </button>
        </div>
      </div>

      <div className="p-4 bg-gray-800 border-t border-gray-700">
        <div className="flex gap-3">
          {currentStep > 0 && (
            <button
              onClick={onPrevious}
              className="flex-1 py-4 bg-gray-700 rounded-xl font-bold hover:bg-gray-600 transition-all"
            >
              ← Précédent
            </button>
          )}
          {currentStep < steps.length - 1 ? (
            <button
              onClick={onNext}
              className="flex-1 py-4 bg-orange-500 rounded-xl font-bold hover:bg-orange-600 transition-all"
            >
              Suivant →
            </button>
          ) : (
            <button
              onClick={onComplete}
              className="flex-1 py-4 bg-green-500 rounded-xl font-bold hover:bg-green-600 transition-all"
            >
              ✓ Terminer
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

