// Utilitaires pour la persistance des données dans localStorage

export const storage = {
  get: <T>(key: string, defaultValue: T): T => {
    if (typeof window === 'undefined') return defaultValue;
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return defaultValue;
    }
  },

  set: <T>(key: string, value: T): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  },

  remove: (key: string): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  }
};

// Clés de stockage
export const STORAGE_KEYS = {
  FAVORITES: 'chefai_favorites',
  PROGRESS: 'chefai_progress',
  USER_DATA: 'chefai_user_data',
  CHAT_HISTORY: 'chefai_chat_history',
  PORTFOLIO: 'chefai_portfolio',
  NOTIFICATIONS: 'chefai_notifications',
  SETTINGS: 'chefai_settings',
  CUSTOM_RECIPES: 'chefai_custom_recipes'
} as const;

