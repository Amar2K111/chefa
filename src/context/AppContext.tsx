'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { TabId, Recipe, Notification, UserData } from '@/types';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { STORAGE_KEYS } from '@/utils/storage';
import { defaultUserData } from '@/data/userData';

interface AppContextType {
  // Navigation
  activeTab: TabId;
  setActiveTab: (tab: TabId) => void;
  
  // Onboarding
  showOnboarding: boolean;
  setShowOnboarding: (show: boolean) => void;
  onboardingStep: number;
  setOnboardingStep: (step: number) => void;
  
  // Chat
  showChat: boolean;
  setShowChat: (show: boolean) => void;
  
  // Recipe
  selectedRecipe: Recipe | null;
  setSelectedRecipe: (recipe: Recipe | null) => void;
  
  // Cooking
  activeCooking: boolean;
  setActiveCooking: (active: boolean) => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  
  // Search & Filters
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  
  // Favorites
  favoriteRecipes: number[];
  toggleFavorite: (recipeId: number) => void;
  
  // Progress
  progress: number;
  setProgress: (progress: number) => void;
  
  // User Data
  userData: UserData;
  updateUserData: (data: Partial<UserData>) => void;
  
  // Notifications
  notifications: Notification[];
  setNotifications: (notifications: Notification[]) => void;
  markNotificationAsRead: (id: number) => void;
  showNotifications: boolean;
  setShowNotifications: (show: boolean) => void;
  
  // Settings
  showSettings: boolean;
  setShowSettings: (show: boolean) => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  notificationsEnabled: boolean;
  setNotificationsEnabled: (enabled: boolean) => void;
  
  // Shopping List
  showShoppingList: boolean;
  setShowShoppingList: (show: boolean) => void;
  
  // Custom Recipes
  customRecipes: Recipe[];
  addCustomRecipe: (recipe: Recipe) => void;
  showAddRecipe: boolean;
  setShowAddRecipe: (show: boolean) => void;
  
  // Photo to Recipe
  showPhotoToRecipe: boolean;
  setShowPhotoToRecipe: (show: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<TabId>('home');
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [showChat, setShowChat] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [activeCooking, setActiveCooking] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showShoppingList, setShowShoppingList] = useState(false);
  
  const [favoriteRecipes, setFavoriteRecipes] = useLocalStorage<number[]>(
    STORAGE_KEYS.FAVORITES,
    []
  );
  
  const [progress, setProgress] = useLocalStorage<number>(
    STORAGE_KEYS.PROGRESS,
    78
  );
  
  const [userData, setUserData] = useLocalStorage<UserData>(
    STORAGE_KEYS.USER_DATA,
    defaultUserData
  );
  
  const [notifications, setNotifications] = useLocalStorage<Notification[]>(
    STORAGE_KEYS.NOTIFICATIONS,
    [
      { id: 1, title: "Nouveau défi disponible", message: "Tarte tatin débloquée !", time: "Il y a 2h", read: false },
      { id: 2, title: "Félicitations !", message: "Badge 'Sans Brûler' obtenu", time: "Hier", read: false },
      { id: 3, title: "Rappel", message: "Ton streak de 7 jours continue !", time: "Hier", read: true },
    ]
  );
  
  const [soundEnabled, setSoundEnabled] = useLocalStorage<boolean>(
    STORAGE_KEYS.SETTINGS + '_sound',
    true
  );
  
  const [notificationsEnabled, setNotificationsEnabled] = useLocalStorage<boolean>(
    STORAGE_KEYS.SETTINGS + '_notifications',
    true
  );
  
  const [customRecipes, setCustomRecipes] = useLocalStorage<Recipe[]>(
    STORAGE_KEYS.CUSTOM_RECIPES,
    []
  );
  
  const [showAddRecipe, setShowAddRecipe] = useState(false);
  const [showPhotoToRecipe, setShowPhotoToRecipe] = useState(false);

  const toggleFavorite = useCallback((recipeId: number) => {
    setFavoriteRecipes(prev =>
      prev.includes(recipeId)
        ? prev.filter(id => id !== recipeId)
        : [...prev, recipeId]
    );
  }, [setFavoriteRecipes]);

  const updateUserData = useCallback((data: Partial<UserData>) => {
    setUserData(prev => ({ ...prev, ...data }));
  }, [setUserData]);

  const markNotificationAsRead = useCallback((id: number) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  }, [setNotifications]);

  const addCustomRecipe = useCallback((recipe: Recipe) => {
    setCustomRecipes(prev => [...prev, recipe]);
  }, [setCustomRecipes]);

  const value: AppContextType = {
    activeTab,
    setActiveTab,
    showOnboarding,
    setShowOnboarding,
    onboardingStep,
    setOnboardingStep,
    showChat,
    setShowChat,
    selectedRecipe,
    setSelectedRecipe,
    activeCooking,
    setActiveCooking,
    currentStep,
    setCurrentStep,
    searchQuery,
    setSearchQuery,
    favoriteRecipes,
    toggleFavorite,
    progress,
    setProgress,
    userData,
    updateUserData,
    notifications,
    setNotifications,
    markNotificationAsRead,
    showNotifications,
    setShowNotifications,
    showSettings,
    setShowSettings,
    soundEnabled,
    setSoundEnabled,
    notificationsEnabled,
    setNotificationsEnabled,
    showShoppingList,
    setShowShoppingList,
    customRecipes,
    addCustomRecipe,
    showAddRecipe,
    setShowAddRecipe,
    showPhotoToRecipe,
    setShowPhotoToRecipe
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

