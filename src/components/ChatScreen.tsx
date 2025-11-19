'use client';

import React from 'react';
import { X, Send, Mic } from 'lucide-react';
import { useChat } from '@/hooks/useChat';
import { ChefaMascot } from './ChefaMascot';

interface ChatScreenProps {
  onClose: () => void;
  context?: { step?: number; recipe?: string };
}

export const ChatScreen: React.FC<ChatScreenProps> = ({ onClose, context }) => {
  const { chatMessages, chatInput, setChatInput, sendMessage, isLoading } = useChat();

  const suggestions = [
    "Comment découper un oignon ?",
    "Mon risotto est trop sec",
    "C'est quoi une brunoise ?",
    "Comment assaisonner correctement ?"
  ];

  const handleSend = () => {
    sendMessage(undefined, context);
  };

  const handleSuggestionClick = (suggestion: string) => {
    sendMessage(suggestion, context);
  };

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col animate-slide-up w-full">
      <div className="p-4 bg-gradient-to-r from-orange-500 to-red-500 text-white flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <button onClick={onClose} className="hover:bg-white/20 p-1 rounded-lg transition-all">
            <X size={24} />
          </button>
          <ChefaMascot size="sm" />
          <div>
            <h2 className="font-bold">Chefa - Ton Chef Expert</h2>
            <p className="text-xs opacity-90">Toujours là pour t'aider</p>
          </div>
        </div>
        <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {chatMessages.length === 0 && (
          <div className="text-center py-12">
            <div className="flex justify-center mb-4">
              <ChefaMascot size="lg" animated />
            </div>
            <p className="text-gray-500 mb-2 font-semibold">Pose-moi n'importe quelle question</p>
            <div className="mt-6 space-y-2">
              {suggestions.map((suggestion, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="block w-full p-3 bg-white rounded-xl text-left text-sm text-gray-700 hover:bg-orange-50 hover:border-orange-300 border-2 border-transparent transition-all"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {chatMessages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
            <div className={`max-w-[80%] p-4 rounded-2xl ${
              msg.type === 'user'
                ? 'bg-orange-500 text-white rounded-br-none'
                : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none'
            } shadow-sm`}>
              <p className="text-sm leading-relaxed">{msg.text}</p>
              <p className={`text-xs mt-2 ${msg.type === 'user' ? 'text-orange-100' : 'text-gray-400'}`}>
                {msg.time}
              </p>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start animate-fade-in">
            <div className="bg-white border border-gray-200 text-gray-800 rounded-2xl rounded-bl-none p-4 shadow-sm">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-white border-t border-gray-200">
        <div className="flex gap-2">
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSend()}
            placeholder="Tape ton message..."
            className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 transition-all"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !chatInput.trim()}
            className="bg-orange-500 text-white p-3 rounded-xl hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <Send size={24} />
          </button>
          <button className="bg-gray-200 text-gray-700 p-3 rounded-xl hover:bg-gray-300 transition-all">
            <Mic size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};

