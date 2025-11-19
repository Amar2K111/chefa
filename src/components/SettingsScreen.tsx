'use client';

import React from 'react';
import { X, Mail, Phone, Edit2, Bell, Volume2, VolumeX, LogOut } from 'lucide-react';
import { UserData } from '@/types';

interface SettingsScreenProps {
  userData: UserData;
  soundEnabled: boolean;
  notificationsEnabled: boolean;
  onClose: () => void;
  onSoundToggle: () => void;
  onNotificationsToggle: () => void;
  onLogout: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  userData,
  soundEnabled,
  notificationsEnabled,
  onClose,
  onSoundToggle,
  onNotificationsToggle,
  onLogout
}) => {
  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto pb-24 animate-slide-up w-full">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-white sticky top-0 z-10">
        <h1 className="text-xl font-bold text-gray-800">Paramètres</h1>
        <button onClick={onClose} className="hover:bg-gray-100 p-1 rounded-lg transition-all">
          <X size={24} />
        </button>
      </div>

      <div className="p-4 space-y-6">
        <div>
          <h2 className="font-bold text-gray-800 mb-3">Compte</h2>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all cursor-pointer">
              <div className="flex items-center gap-3">
                <Mail size={20} className="text-gray-500" />
                <div>
                  <p className="text-sm font-semibold text-gray-800">Email</p>
                  <p className="text-xs text-gray-500">{userData.email}</p>
                </div>
              </div>
              <Edit2 size={18} className="text-orange-500" />
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all cursor-pointer">
              <div className="flex items-center gap-3">
                <Phone size={20} className="text-gray-500" />
                <div>
                  <p className="text-sm font-semibold text-gray-800">Téléphone</p>
                  <p className="text-xs text-gray-500">{userData.phone}</p>
                </div>
              </div>
              <Edit2 size={18} className="text-orange-500" />
            </div>
          </div>
        </div>

        <div>
          <h2 className="font-bold text-gray-800 mb-3">Préférences</h2>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <Bell size={20} className="text-gray-500" />
                <span className="text-sm font-semibold text-gray-800">Notifications</span>
              </div>
              <input
                type="checkbox"
                checked={notificationsEnabled}
                onChange={onNotificationsToggle}
                className="w-5 h-5 accent-orange-500 cursor-pointer"
              />
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                {soundEnabled ? (
                  <Volume2 size={20} className="text-gray-500" />
                ) : (
                  <VolumeX size={20} className="text-gray-500" />
                )}
                <span className="text-sm font-semibold text-gray-800">Sons</span>
              </div>
              <input
                type="checkbox"
                checked={soundEnabled}
                onChange={onSoundToggle}
                className="w-5 h-5 accent-orange-500 cursor-pointer"
              />
            </div>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 p-4 bg-red-50 text-red-500 font-semibold rounded-xl hover:bg-red-100 transition-all"
        >
          <LogOut size={20} />
          Se déconnecter
        </button>
      </div>
    </div>
  );
};

