'use client';

import React, { useState } from 'react';
import { TrendingUp, Award, Calendar, Camera } from 'lucide-react';
import { UserData, Badge, PortfolioItem } from '@/types';
import { PhotoCapture } from './PhotoCapture';

interface StatsScreenProps {
  userData: UserData;
  badges: Badge[];
  portfolio: PortfolioItem[];
}

export const StatsScreen: React.FC<StatsScreenProps> = ({
  userData,
  badges,
  portfolio
}) => {
  const [showPhotoCapture, setShowPhotoCapture] = useState(false);
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);

  const handlePhotoCapture = (photo: string) => {
    if (selectedItem) {
      // Ici, on pourrait sauvegarder la photo dans le portfolio
      // Pour l'instant, on simule juste
      console.log('Photo capturée pour:', selectedItem.dish, photo);
    }
  };
  const stats = [
    { label: 'Découpe', value: 85, color: 'bg-blue-500' },
    { label: 'Sauces', value: 70, color: 'bg-green-500' },
    { label: 'Cuisson', value: 92, color: 'bg-orange-500' },
    { label: 'Pâtisserie', value: 45, color: 'bg-purple-500' }
  ];

  return (
    <div className="p-4 pb-24 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Mon Portfolio</h1>

      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-white rounded-xl p-4 text-center shadow-sm">
          <p className="text-2xl font-bold text-orange-500">{userData.dishesCompleted}</p>
          <p className="text-xs text-gray-600 mt-1">Plats</p>
        </div>
        <div className="bg-white rounded-xl p-4 text-center shadow-sm">
          <p className="text-2xl font-bold text-green-500">{userData.techniquesLearned}</p>
          <p className="text-xs text-gray-600 mt-1">Techniques</p>
        </div>
        <div className="bg-white rounded-xl p-4 text-center shadow-sm">
          <p className="text-2xl font-bold text-purple-500">{badges.filter(b => b.earned).length}</p>
          <p className="text-xs text-gray-600 mt-1">Badges</p>
        </div>
      </div>

      <div className="bg-white rounded-xl p-5 mb-6 shadow-sm">
        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
          <TrendingUp className="text-orange-500" size={20} />
          Statistiques
        </h3>
        <div className="space-y-4">
          {stats.map((stat, idx) => (
            <div key={idx}>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">{stat.label}</span>
                <span className="font-semibold text-gray-800">{stat.value}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`${stat.color} h-full rounded-full transition-all duration-500`}
                  style={{ width: `${stat.value}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h2 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
          <Award className="text-orange-500" size={20} />
          Badges obtenus
        </h2>
        <div className="grid grid-cols-4 gap-3">
          {badges.map(badge => (
            <div
              key={badge.id}
              className={`bg-white rounded-xl p-3 text-center shadow-sm transition-all ${
                !badge.earned ? 'opacity-40 grayscale' : 'hover:scale-105'
              }`}
              title={badge.description}
            >
              <div className="text-3xl mb-1">{badge.icon}</div>
              <p className="text-xs font-semibold text-gray-700 leading-tight">{badge.name}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
          <Calendar className="text-orange-500" size={20} />
          Mes derniers plats
        </h2>
        <div className="space-y-3">
          {portfolio.map(item => (
            <div key={item.id} className="bg-white rounded-xl p-4 shadow-sm flex items-center gap-4 hover:shadow-md transition-all">
              <div className="relative w-16 h-16 bg-gradient-to-br from-orange-100 to-red-100 rounded-xl flex items-center justify-center text-3xl overflow-hidden">
                {item.photo ? (
                  <img src={item.photo} alt={item.dish} className="w-full h-full object-cover" />
                ) : (
                  item.image
                )}
                <button
                  onClick={() => {
                    setSelectedItem(item);
                    setShowPhotoCapture(true);
                  }}
                  className="absolute bottom-0 right-0 bg-orange-500 text-white p-1 rounded-tl-lg hover:bg-orange-600 transition-all"
                  title="Ajouter une photo"
                >
                  <Camera size={12} />
                </button>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800">{item.dish}</h3>
                <p className="text-xs text-gray-500">{item.date}</p>
              </div>
              <div className="text-right">
                <div className="text-yellow-500 text-sm mb-1">
                  {'⭐'.repeat(item.rating)}
                </div>
                <button className="text-xs text-orange-500 font-semibold hover:text-orange-600">Voir</button>
              </div>
            </div>
          ))}
        </div>

        {showPhotoCapture && (
          <PhotoCapture
            onCapture={handlePhotoCapture}
            onClose={() => {
              setShowPhotoCapture(false);
              setSelectedItem(null);
            }}
          />
        )}
      </div>
    </div>
  );
};

