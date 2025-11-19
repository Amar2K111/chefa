'use client';

import React from 'react';
import { onboardingScreens } from '@/data/onboarding';

interface OnboardingScreenProps {
  onboardingStep: number;
  setOnboardingStep: (step: number) => void;
  onComplete: () => void;
}

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({
  onboardingStep,
  setOnboardingStep,
  onComplete
}) => {
  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col" style={{ maxWidth: '430px', left: '50%', transform: 'translateX(-50%)' }}>
      <div className={`flex-1 bg-gradient-to-br ${onboardingScreens[onboardingStep].color} flex flex-col items-center justify-center p-8 text-white`}>
        <div className="text-8xl mb-8 animate-bounce">{onboardingScreens[onboardingStep].emoji}</div>
        <h1 className="text-3xl font-bold mb-4 text-center">{onboardingScreens[onboardingStep].title}</h1>
        <p className="text-lg text-center opacity-90">{onboardingScreens[onboardingStep].description}</p>
      </div>

      <div className="p-6 bg-white">
        <div className="flex gap-2 justify-center mb-6">
          {onboardingScreens.map((_, idx) => (
            <div
              key={idx}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === onboardingStep ? 'w-8 bg-orange-500' : 'w-2 bg-gray-300'
              }`}
            ></div>
          ))}
        </div>

        <div className="flex gap-3">
          {onboardingStep > 0 && (
            <button
              onClick={() => setOnboardingStep(onboardingStep - 1)}
              className="flex-1 py-4 border-2 border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-all"
            >
              Retour
            </button>
          )}
          <button
            onClick={() => {
              if (onboardingStep < onboardingScreens.length - 1) {
                setOnboardingStep(onboardingStep + 1);
              } else {
                onComplete();
              }
            }}
            className="flex-1 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-xl hover:from-orange-600 hover:to-red-600 transition-all shadow-lg"
          >
            {onboardingStep < onboardingScreens.length - 1 ? 'Suivant' : 'Commencer'}
          </button>
        </div>
      </div>
    </div>
  );
};

