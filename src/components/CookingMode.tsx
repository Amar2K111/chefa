'use client';

import React, { useState } from 'react';
import { X, MessageCircle, Clock, Timer, Play, Pause, Send, Minimize2 } from 'lucide-react';
import { CookingStep } from '@/types';
import { useTimer } from '@/hooks/useTimer';
import { useChat } from '@/hooks/useChat';
import { ChefaMascot } from './ChefaMascot';

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
  const [showChat, setShowChat] = useState(false);
  const step = steps[currentStep];
  const {
    timerActive,
    timerSeconds,
    startTimer,
    pauseTimer,
    resumeTimer,
    formatTime
  } = useTimer();
  
  // Chat contextuel avec la recette et l'étape actuelle
  const { chatMessages, chatInput, setChatInput, sendMessage, isLoading } = useChat();
  
  const chatContext = {
    recipe: recipeTitle,
    step: currentStep
  };

  const handleQuit = () => {
    if (confirm('Voulez-vous vraiment quitter la recette ? Votre progression sera sauvegardée.')) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900 text-white z-50 flex flex-col w-full">
      <div className="p-4 bg-gray-800 flex items-center justify-between">
        <button
          onClick={handleQuit}
          className="text-white flex items-center gap-2 hover:text-orange-400 transition-all"
        >
          <X size={20} />
          <span className="font-semibold">Quitter</span>
        </button>
        <div className="flex items-center gap-2">
          <ChefaMascot size="sm" />
          <span className="font-bold">Étape {currentStep + 1}/{steps.length}</span>
        </div>
        <button 
          onClick={() => setShowChat(!showChat)} 
          className="hover:text-orange-400 transition-all relative"
        >
          <MessageCircle size={24} className="text-orange-400" />
          {chatMessages.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {chatMessages.length}
            </span>
          )}
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
            onClick={() => setShowChat(!showChat)}
            className="w-full bg-orange-500 bg-opacity-20 border-2 border-orange-500 rounded-xl p-4 flex items-center justify-center gap-3 hover:bg-orange-500 hover:bg-opacity-30 transition-all"
          >
            <MessageCircle size={24} className="text-orange-400" />
            <span className="font-semibold">Demander de l'aide à Chefa</span>
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

      {/* Chat intégré en overlay */}
      {showChat && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-end">
          <div className="w-full bg-gray-800 rounded-t-3xl flex flex-col" style={{ maxHeight: '70%' }}>
            {/* Header du chat */}
            <div className="p-4 bg-gray-900 border-b border-gray-700 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                  <MessageCircle size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-white">Chefa</h3>
                  <p className="text-xs text-gray-400">Étape {currentStep + 1} : {step.title}</p>
                </div>
              </div>
              <button
                onClick={() => setShowChat(false)}
                className="text-gray-400 hover:text-white transition-all"
              >
                <Minimize2 size={20} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {chatMessages.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-400 text-sm mb-4">💬 Pose-moi une question sur cette étape !</p>
                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        setChatInput(`J'ai besoin d'aide pour : ${step.title}`);
                        sendMessage(`J'ai besoin d'aide pour : ${step.title}`, chatContext);
                      }}
                      className="w-full text-left px-4 py-2 bg-gray-700 rounded-lg text-sm hover:bg-gray-600 transition-all"
                    >
                      💡 J'ai besoin d'aide pour cette étape
                    </button>
                    <button
                      onClick={() => {
                        setChatInput("Comment faire cette étape ?");
                        sendMessage("Comment faire cette étape ?", chatContext);
                      }}
                      className="w-full text-left px-4 py-2 bg-gray-700 rounded-lg text-sm hover:bg-gray-600 transition-all"
                    >
                      ❓ Comment faire cette étape ?
                    </button>
                    <button
                      onClick={() => {
                        setChatInput("Qu'est-ce que ça veut dire ?");
                        sendMessage("Qu'est-ce que ça veut dire ?", chatContext);
                      }}
                      className="w-full text-left px-4 py-2 bg-gray-700 rounded-lg text-sm hover:bg-gray-600 transition-all"
                    >
                      🤔 Qu'est-ce que ça veut dire ?
                    </button>
                  </div>
                </div>
              )}
              
              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      msg.type === 'user'
                        ? 'bg-orange-500 text-white'
                        : 'bg-gray-700 text-gray-100'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                    <p className="text-xs opacity-70 mt-1">{msg.time}</p>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-700 rounded-2xl px-4 py-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 bg-gray-900 border-t border-gray-700">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey && chatInput.trim()) {
                      e.preventDefault();
                      sendMessage(undefined, chatContext);
                    }
                  }}
                  placeholder="Pose ta question..."
                  className="flex-1 bg-gray-800 text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                  disabled={isLoading}
                />
                <button
                  onClick={() => sendMessage(undefined, chatContext)}
                  disabled={!chatInput.trim() || isLoading}
                  className="bg-orange-500 text-white p-3 rounded-xl hover:bg-orange-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

