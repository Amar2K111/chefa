'use client';

import React, { useRef, useState } from 'react';
import { Camera, X, Check, Upload } from 'lucide-react';

interface PhotoCaptureProps {
  onCapture: (photo: string) => void;
  onClose: () => void;
}

export const PhotoCapture: React.FC<PhotoCaptureProps> = ({ onCapture, onClose }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCapture = () => {
    if (preview) {
      onCapture(preview);
      onClose();
    }
  };

  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4" style={{ maxWidth: '430px', left: '50%', transform: 'translateX(-50%)' }}>
      <div className="bg-white rounded-2xl p-6 max-w-md w-full">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">Prendre une photo</h2>
          <button onClick={onClose} className="hover:bg-gray-100 p-1 rounded-lg transition-all">
            <X size={24} />
          </button>
        </div>

        {preview ? (
          <div className="space-y-4">
            <div className="relative w-full h-64 bg-gray-100 rounded-xl overflow-hidden">
              <img
                src={preview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setPreview(null)}
                className="flex-1 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all"
              >
                Annuler
              </button>
              <button
                onClick={handleCapture}
                className="flex-1 py-3 bg-orange-500 text-white font-semibold rounded-xl hover:bg-orange-600 transition-all flex items-center justify-center gap-2"
              >
                <Check size={20} />
                Utiliser
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="w-full h-64 bg-gray-100 rounded-xl flex items-center justify-center">
              <Camera size={64} className="text-gray-400" />
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileSelect}
              className="hidden"
            />
            <button
              onClick={handleCameraClick}
              className="w-full py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-xl hover:from-orange-600 hover:to-red-600 transition-all flex items-center justify-center gap-2"
            >
              <Camera size={24} />
              Prendre une photo
            </button>
            <button
              onClick={handleCameraClick}
              className="w-full py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
            >
              <Upload size={20} />
              Choisir depuis la galerie
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

