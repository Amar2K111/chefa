'use client';

import React from 'react';
import { MessageCircle } from 'lucide-react';

interface FABProps {
  onClick: () => void;
}

export const FAB: React.FC<FABProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="fab-chat-button fixed bottom-20 z-40 w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-full shadow-lg flex items-center justify-center hover:scale-110 active:scale-95 transition-transform"
    >
      <MessageCircle size={28} className="text-white" />
    </button>
  );
};

