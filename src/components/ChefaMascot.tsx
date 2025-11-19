'use client';

import React, { useState } from 'react';

interface ChefaMascotProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animated?: boolean;
  className?: string;
}

export const ChefaMascot: React.FC<ChefaMascotProps> = ({ 
  size = 'md', 
  animated = false,
  className = '' 
}) => {
  const [imageError, setImageError] = useState(false);

  const sizeClasses = {
    sm: 'w-24 h-24',
    md: 'w-32 h-32',
    lg: 'w-48 h-48',
    xl: 'w-64 h-64'
  };

  const emojiSizes = {
    sm: 'text-2xl',
    md: 'text-4xl',
    lg: 'text-5xl',
    xl: 'text-7xl'
  };

  const animationClass = animated ? 'animate-bounce-subtle' : '';

  if (imageError) {
    return (
      <div className={`${sizeClasses[size]} ${animationClass} ${className} relative flex items-center justify-center bg-gradient-to-br from-orange-100 to-orange-200 rounded-full drop-shadow-lg`}>
        <span className={emojiSizes[size]}>🦉👨‍🍳</span>
      </div>
    );
  }

  return (
    <div className={`${sizeClasses[size]} ${animationClass} ${className} relative`}>
      <img 
        src="/chefa-mascot.png" 
        alt="Chefa - La mascotte chouette chef"
        className="w-full h-full object-contain drop-shadow-lg"
        onError={() => setImageError(true)}
      />
    </div>
  );
};

