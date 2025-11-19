'use client';

import React from 'react';
import { Target, Flame, Settings, ChefHat, Heart, Play, Share2, ArrowRight } from 'lucide-react';
import { UserData, TabId } from '@/types';

interface ProfileScreenProps {
  userData: UserData;
  favoriteCount: number;
  onSettingsClick: () => void;
  onTabChange: (tab: TabId) => void;
  onShowOnboarding: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  userData,
  favoriteCount,
  onSettingsClick,
  onTabChange,
  onShowOnboarding
}) => {
  const goals = [
    {
      icon: Target,
      iconColor: 'text-orange-500',
      bgColor: 'bg-orange-100',
      title: "Maîtriser les sauces",
      progress: 60,
      current: 3,
      total: 5
    },
    {
      icon: Flame,
      iconColor: 'text-green-500',
      bgColor: 'bg-green-100',
      title: "Streak de 30 jours",
      progress: 23,
      current: 7,
      total: 30
    }
  ];

  return (
    <div className="p-4 pb-24 bg-gray-50 min-h-screen">
      <div className="text-center mb-6">
        <div className="w-24 h-24 bg-gradient-to-br from-orange-400 to-red-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-4xl shadow-lg">
          {userData.avatar}
        </div>
        <h1 className="text-2xl font-bold text-gray-800">{userData.name}</h1>
        <p className="text-gray-500">Niveau {userData.level} - {userData.levelName}</p>
        <p className="text-xs text-gray-400 mt-1">Membre depuis {userData.joinDate}</p>
      </div>

      <div className="bg-white rounded-xl p-5 mb-4 shadow-sm">
        <h3 className="font-semibold text-gray-800 mb-3">Objectifs personnels</h3>
        <div className="space-y-3">
          {goals.map((goal, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <div className={`w-10 h-10 ${goal.bgColor} rounded-lg flex items-center justify-center`}>
                <goal.icon size={20} className={goal.iconColor} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-800">{goal.title}</p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                  <div
                    className={`${goal.bgColor.replace('bg-', 'bg-').replace('-100', '-500')} h-full rounded-full transition-all duration-500`}
                    style={{ width: `${goal.progress}%` }}
                  ></div>
                </div>
              </div>
              <span className="text-xs font-bold text-gray-500">{goal.current}/{goal.total}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <div
          onClick={onSettingsClick}
          className="bg-white rounded-xl p-4 shadow-sm flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-all"
        >
          <div className="flex items-center gap-3">
            <Settings size={20} className="text-gray-500" />
            <span className="font-semibold text-gray-800">Paramètres</span>
          </div>
          <ArrowRight size={20} className="text-gray-400" />
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-all">
          <div className="flex items-center gap-3">
            <ChefHat size={20} className="text-gray-500" />
            <span className="font-semibold text-gray-800">Préférences alimentaires</span>
          </div>
          <ArrowRight size={20} className="text-gray-400" />
        </div>

        <div
          onClick={() => onTabChange('stats')}
          className="bg-white rounded-xl p-4 shadow-sm flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-all"
        >
          <div className="flex items-center gap-3">
            <Heart size={20} className="text-gray-500" />
            <span className="font-semibold text-gray-800">Recettes favorites</span>
          </div>
          <span className="text-orange-500 text-sm font-semibold">{favoriteCount}</span>
        </div>

        <div
          onClick={onShowOnboarding}
          className="bg-white rounded-xl p-4 shadow-sm flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-all"
        >
          <div className="flex items-center gap-3">
            <Play size={20} className="text-gray-500" />
            <span className="font-semibold text-gray-800">Revoir le tutoriel</span>
          </div>
          <ArrowRight size={20} className="text-gray-400" />
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-all">
          <div className="flex items-center gap-3">
            <Share2 size={20} className="text-gray-500" />
            <span className="font-semibold text-gray-800">Partager l'app</span>
          </div>
          <ArrowRight size={20} className="text-gray-400" />
        </div>
      </div>
    </div>
  );
};

