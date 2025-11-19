import { useState, useEffect, useRef } from 'react';
import { storage } from '@/utils/storage';

export function useLocalStorage<T>(key: string, initialValue: T) {
  // Toujours utiliser initialValue côté serveur pour éviter les erreurs d'hydratation
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [isMounted, setIsMounted] = useState(false);
  const initialValueRef = useRef(initialValue);

  // Charger depuis localStorage uniquement côté client après le montage
  useEffect(() => {
    setIsMounted(true);
    const item = storage.get(key, initialValueRef.current);
    setStoredValue(item);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]); // Seulement key dans les dépendances pour éviter les boucles infinies

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      storage.set(key, valueToStore);
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  // Retourner initialValue pendant le SSR, storedValue après le montage
  return [isMounted ? storedValue : initialValueRef.current, setValue] as const;
}

