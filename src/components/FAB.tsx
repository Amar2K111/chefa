'use client';

import React from 'react';
import { MessageCircle } from 'lucide-react';

interface FABProps {
  onClick: () => void;
}

export const FAB: React.FC<FABProps> = ({ onClick }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 flex justify-center pointer-events-none" style={{ maxWidth: '430px', left: '50%', transform: 'translateX(-50%)' }}>
      <div className="w-full relative px-6 pb-24 pointer-events-none">
        <button
          onClick={onClick}
          className="absolute bottom-20 right-6 w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-full shadow-lg flex items-center justify-center hover:scale-110 active:scale-95 transition-transform pointer-events-auto animate-bounce-subtle"
        >
          <MessageCircle size={28} className="text-white" />
        </button>
      </div>
    </div>
  );
};

