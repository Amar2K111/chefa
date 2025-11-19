'use client';

import React from 'react';
import { X } from 'lucide-react';
import { Notification } from '@/types';

interface NotificationsScreenProps {
  notifications: Notification[];
  onClose: () => void;
  onMarkAsRead: (id: number) => void;
}

export const NotificationsScreen: React.FC<NotificationsScreenProps> = ({
  notifications,
  onClose,
  onMarkAsRead
}) => {
  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto animate-slide-up" style={{ maxWidth: '430px', left: '50%', transform: 'translateX(-50%)' }}>
      <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-white sticky top-0 z-10">
        <h1 className="text-xl font-bold text-gray-800">Notifications</h1>
        <button onClick={onClose} className="hover:bg-gray-100 p-1 rounded-lg transition-all">
          <X size={24} />
        </button>
      </div>

      <div className="p-4 space-y-3">
        {notifications.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔔</div>
            <p className="text-gray-500">Aucune notification</p>
          </div>
        ) : (
          notifications.map(notif => (
            <div
              key={notif.id}
              onClick={() => !notif.read && onMarkAsRead(notif.id)}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                notif.read ? 'bg-gray-50 border-gray-200' : 'bg-orange-50 border-orange-200 hover:bg-orange-100'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">{notif.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{notif.message}</p>
                  <p className="text-xs text-gray-400 mt-2">{notif.time}</p>
                </div>
                {!notif.read && (
                  <div className="w-2 h-2 bg-orange-500 rounded-full ml-2"></div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

