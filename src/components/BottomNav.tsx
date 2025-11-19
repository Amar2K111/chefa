'use client';

import React from 'react';
import { Home, Book, BarChart3, User } from 'lucide-react';
import { TabId } from '@/types';

interface BottomNavProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'home' as TabId, icon: Home, label: 'Accueil' },
    { id: 'library' as TabId, icon: Book, label: 'Bibliothèque' },
    { id: 'stats' as TabId, icon: BarChart3, label: 'Portfolio' },
    { id: 'profile' as TabId, icon: User, label: 'Profil' }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40" style={{ maxWidth: '430px', left: '50%', transform: 'translateX(-50%)', width: '100%' }}>
      <div className="w-full bg-white border-t border-gray-200 py-3 flex justify-around items-center shadow-lg safe-area-inset-bottom">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className="flex flex-col items-center gap-1 relative transition-all flex-1"
          >
            <tab.icon
              size={24}
              className={`transition-all ${activeTab === tab.id ? 'text-orange-500 scale-110' : 'text-gray-400'}`}
            />
            <span className={`text-xs transition-all ${activeTab === tab.id ? 'text-orange-500 font-semibold' : 'text-gray-400'}`}>
              {tab.label}
            </span>
            {activeTab === tab.id && (
              <div className="absolute -bottom-3 w-1 h-1 bg-orange-500 rounded-full animate-pulse"></div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

