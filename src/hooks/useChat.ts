import { useState, useCallback } from 'react';
import { ChatMessage } from '@/types';
import { useLocalStorage } from './useLocalStorage';
import { STORAGE_KEYS } from '@/utils/storage';

// Réponses intelligentes basées sur le contexte
const getAIResponse = (userMessage: string, context?: { step?: number; recipe?: string }): string => {
  const lowerMessage = userMessage.toLowerCase();

  // Réponses contextuelles pour le risotto
  if (context?.recipe?.toLowerCase().includes('risotto')) {
    if (lowerMessage.includes('sec') || lowerMessage.includes('trop') || lowerMessage.includes('sèche')) {
      return "Si ton risotto est trop sec, ajoute une louche de bouillon chaud et remue vigoureusement. Le risotto doit être crémeux mais pas liquide.";
    }
    if (lowerMessage.includes('riz') || lowerMessage.includes('cuire')) {
      return "Le riz doit être translucide sur les bords avant d'ajouter le bouillon. Remue constamment pour éviter qu'il colle.";
    }
    if (lowerMessage.includes('bouillon')) {
      return "Le bouillon doit être chaud (pas bouillant) et ajouté louche par louche. Attends l'absorption complète avant d'ajouter la suivante.";
    }
  }

  // Réponses générales
  if (lowerMessage.includes('découper') || lowerMessage.includes('couper') || lowerMessage.includes('oignon')) {
    return "Pour découper un oignon : coupe-le en deux, retire la peau, puis fais des incisions horizontales et verticales avant de couper perpendiculairement. Cela donne des dés réguliers.";
  }
  
  if (lowerMessage.includes('brunoise')) {
    return "La brunoise est une découpe en très petits dés (2-3mm). Commence par des bâtonnets (julienne), puis coupe perpendiculairement pour obtenir des cubes.";
  }
  
  if (lowerMessage.includes('sauce') || lowerMessage.includes('trop liquide')) {
    return "Si ta sauce est trop liquide, laisse-la réduire à feu moyen en remuant régulièrement. Tu peux aussi ajouter un peu de fécule de maïs diluée dans de l'eau froide.";
  }
  
  if (lowerMessage.includes('assaisonner') || lowerMessage.includes('sel') || lowerMessage.includes('poivre')) {
    return "Goûte régulièrement et assaisonne progressivement. Il est plus facile d'ajouter que de retirer ! Commence par une pincée, goûte, puis ajuste.";
  }
  
  if (lowerMessage.includes('brûler') || lowerMessage.includes('brûlé')) {
    return "Si quelque chose brûle, retire immédiatement la casserole du feu. Ne gratte pas le fond brûlé, cela donnerait un goût amer. Transfère le contenu dans une autre casserole si nécessaire.";
  }
  
  if (lowerMessage.includes('température') || lowerMessage.includes('feu')) {
    return "Pour la plupart des plats, commence à feu moyen-vif pour saisir, puis réduis à feu moyen pour cuire. Écoute les bruits de cuisson : un grésillement régulier est bon signe.";
  }

  // Réponses par défaut
  const defaultResponses = [
    "Excellente question ! Pour cette étape, assure-toi que le feu soit à température moyenne.",
    "Je te conseille de goûter régulièrement pour ajuster l'assaisonnement.",
    "Continue comme ça, tu te débrouilles très bien 👍",
    "N'hésite pas à me poser d'autres questions si tu as besoin d'aide !",
    "C'est une bonne question ! Prends ton temps et suis les étapes une par une."
  ];

  return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
};

export function useChat() {
  const [chatMessages, setChatMessages] = useLocalStorage<ChatMessage[]>(STORAGE_KEYS.CHAT_HISTORY, []);
  const [chatInput, setChatInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = useCallback(async (message?: string, context?: { step?: number; recipe?: string }) => {
    const text = message || chatInput.trim();
    if (!text) return;

    const userMessage: ChatMessage = {
      type: 'user',
      text,
      time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');

    // Appel à l'API réelle
    setIsLoading(true);
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: text,
          context: context
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        const aiMessage: ChatMessage = {
          type: 'ai',
          text: data.message,
          time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
        };
        setChatMessages(prev => [...prev, aiMessage]);
      } else {
        // Fallback vers les réponses locales si l'API échoue
        const aiMessage: ChatMessage = {
          type: 'ai',
          text: getAIResponse(text, context),
          time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
        };
        setChatMessages(prev => [...prev, aiMessage]);
      }
    } catch (error) {
      console.error('Erreur chat API:', error);
      // Fallback vers les réponses locales en cas d'erreur
      const aiMessage: ChatMessage = {
        type: 'ai',
        text: getAIResponse(text, context),
        time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages(prev => [...prev, aiMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [chatInput, setChatMessages]);

  const clearHistory = useCallback(() => {
    setChatMessages([]);
  }, [setChatMessages]);

  return {
    chatMessages,
    chatInput,
    setChatInput,
    sendMessage,
    clearHistory,
    isLoading
  };
}

