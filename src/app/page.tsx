'use client';

import React, { useEffect } from 'react';
import { AppProvider, useApp } from '@/context/AppContext';
import { OnboardingScreen } from '@/components/OnboardingScreen';
import { ChatScreen } from '@/components/ChatScreen';
import { RecipeDetailScreen } from '@/components/RecipeDetailScreen';
import { CookingMode } from '@/components/CookingMode';
import { HomeScreen } from '@/components/HomeScreen';
import { LibraryScreen } from '@/components/LibraryScreen';
import { StatsScreen } from '@/components/StatsScreen';
import { ProfileScreen } from '@/components/ProfileScreen';
import { NotificationsScreen } from '@/components/NotificationsScreen';
import { SettingsScreen } from '@/components/SettingsScreen';
import { ShoppingListScreen } from '@/components/ShoppingListScreen';
import { AddRecipeScreen } from '@/components/AddRecipeScreen';
import { PhotoToRecipeScreen } from '@/components/PhotoToRecipeScreen';
import { BottomNav } from '@/components/BottomNav';
import { FAB } from '@/components/FAB';
import { recipes } from '@/data/recipes';
import { badges } from '@/data/badges';
import { techniques } from '@/data/techniques';
import { cookingSteps } from '@/data/cookingSteps';
import { Recipe } from '@/types';
import { portfolio } from '@/data/portfolio';

const ChefAIApp = () => {
  const {
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
  } = useApp();

  // Vérifier si c'est la première visite
  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('chefai_onboarding_seen');
    if (!hasSeenOnboarding) {
      setShowOnboarding(true);
      localStorage.setItem('chefai_onboarding_seen', 'true');
    }
  }, [setShowOnboarding]);

  const handleStartCooking = () => {
    if (selectedRecipe) {
      setActiveCooking(true);
      setCurrentStep(0);
    } else {
      // Utiliser la recette du défi du jour
      const challengeRecipe = recipes[0];
      setSelectedRecipe(challengeRecipe);
      setActiveCooking(true);
      setCurrentStep(0);
    }
  };

  const handleCompleteCooking = () => {
    setActiveCooking(false);
    setCurrentStep(0);
    setSelectedRecipe(null);
    const newProgress = Math.min(100, progress + 5);
    setProgress(newProgress);
    
    // Mettre à jour les statistiques utilisateur
    updateUserData({
      dishesCompleted: userData.dishesCompleted + 1
    });

    // Ajouter une notification
    const newNotification = {
      id: Date.now(),
      title: '🎉 Félicitations !',
      message: `Tu as terminé ${selectedRecipe?.title || 'la recette'} ! +5% XP`,
      time: 'Maintenant',
      read: false
    };
    // Les notifications sont gérées par le contexte

    alert('🎉 Bravo ! Plat terminé ! +5% XP');
  };

  const handleRecipeClick = (recipe: Recipe) => {
    if (recipe.unlocked) {
      setSelectedRecipe(recipe);
    }
  };

  const handleLogout = () => {
    if (confirm('Voulez-vous vraiment vous déconnecter ?')) {
      // Réinitialiser les données (optionnel)
      localStorage.clear();
      window.location.reload();
    }
  };

  const chatContext = selectedRecipe && activeCooking
    ? { step: currentStep, recipe: selectedRecipe.title }
    : undefined;

  return (
    <div className="w-full max-w-[430px] mx-auto bg-white min-h-screen relative safe-area-inset">
      {showOnboarding && (
        <OnboardingScreen
          onboardingStep={onboardingStep}
          setOnboardingStep={setOnboardingStep}
          onComplete={() => setShowOnboarding(false)}
        />
      )}

      {showChat && (
        <ChatScreen
          onClose={() => setShowChat(false)}
          context={chatContext}
        />
      )}

      {selectedRecipe && !activeCooking && (
        <RecipeDetailScreen
          recipe={selectedRecipe}
          isFavorite={favoriteRecipes.includes(selectedRecipe.id)}
          onClose={() => setSelectedRecipe(null)}
          onToggleFavorite={() => toggleFavorite(selectedRecipe.id)}
          onStartCooking={handleStartCooking}
        />
      )}

      {showNotifications && (
        <NotificationsScreen
          notifications={notifications}
          onClose={() => setShowNotifications(false)}
          onMarkAsRead={markNotificationAsRead}
        />
      )}

      {showSettings && (
        <SettingsScreen
          userData={userData}
          soundEnabled={soundEnabled}
          notificationsEnabled={notificationsEnabled}
          onClose={() => setShowSettings(false)}
          onSoundToggle={() => setSoundEnabled(!soundEnabled)}
          onNotificationsToggle={() => setNotificationsEnabled(!notificationsEnabled)}
          onLogout={handleLogout}
        />
      )}

      {showShoppingList && (
        <ShoppingListScreen
          recipes={recipes.filter(r => favoriteRecipes.includes(r.id))}
          onClose={() => setShowShoppingList(false)}
        />
      )}

      {showAddRecipe && (
        <AddRecipeScreen
          onClose={() => setShowAddRecipe(false)}
          onAddRecipe={(recipe) => {
            addCustomRecipe(recipe);
            setShowAddRecipe(false);
            // Ajouter une notification
            const newNotification = {
              id: Date.now(),
              title: '🎉 Nouvelle recette ajoutée !',
              message: `${recipe.title} a été ajouté à ta bibliothèque`,
              time: 'Maintenant',
              read: false
            };
            setNotifications([...notifications, newNotification]);
          }}
        />
      )}

      {showPhotoToRecipe && (
        <PhotoToRecipeScreen
          onClose={() => setShowPhotoToRecipe(false)}
          onAddRecipe={(recipe) => {
            addCustomRecipe(recipe);
            setShowPhotoToRecipe(false);
            // Ajouter une notification
            const newNotification = {
              id: Date.now(),
              title: '📸✨ Recette générée !',
              message: `${recipe.title} a été créé à partir de ta photo`,
              time: 'Maintenant',
              read: false
            };
            setNotifications([...notifications, newNotification]);
          }}
        />
      )}

      {activeCooking && selectedRecipe && (
        <CookingMode
          steps={cookingSteps}
          currentStep={currentStep}
          recipeTitle={selectedRecipe.title}
          onClose={() => {
                setActiveCooking(false);
                setCurrentStep(0);
          }}
          onNext={() => setCurrentStep(Math.min(cookingSteps.length - 1, currentStep + 1))}
          onPrevious={() => setCurrentStep(Math.max(0, currentStep - 1))}
          onComplete={handleCompleteCooking}
          onOpenChat={() => setShowChat(true)}
        />
      )}

      {!activeCooking && !showOnboarding && !showChat && !selectedRecipe && !showNotifications && !showSettings && !showShoppingList && !showAddRecipe && !showPhotoToRecipe && (
        <>
          {activeTab === 'home' && (
            <HomeScreen
              userData={userData}
              progress={progress}
              notifications={notifications}
              recipes={recipes}
              onNotificationClick={() => setShowNotifications(true)}
              onStartCooking={handleStartCooking}
              onRecipeClick={handleRecipeClick}
              onTabChange={setActiveTab}
              onPhotoToRecipeClick={() => setShowPhotoToRecipe(true)}
            />
          )}

          {activeTab === 'library' && (
            <LibraryScreen
              recipes={recipes}
              customRecipes={customRecipes}
              techniques={techniques}
              favoriteRecipes={favoriteRecipes}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onRecipeClick={handleRecipeClick}
              onToggleFavorite={toggleFavorite}
              onAddRecipeClick={() => setShowAddRecipe(true)}
              onPhotoToRecipeClick={() => setShowPhotoToRecipe(true)}
            />
          )}

          {activeTab === 'stats' && (
            <StatsScreen
              userData={userData}
              badges={badges}
              portfolio={portfolio}
            />
          )}

          {activeTab === 'profile' && (
            <ProfileScreen
              userData={userData}
              favoriteCount={favoriteRecipes.length}
              onSettingsClick={() => setShowSettings(true)}
              onTabChange={setActiveTab}
              onShowOnboarding={() => {
                setShowOnboarding(true);
                setOnboardingStep(0);
              }}
            />
          )}

          <FAB onClick={() => setShowChat(true)} />
          <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
        </>
      )}
    </div>
  );
};

const ChefAI = () => {
  return (
    <AppProvider>
      <ChefAIApp />
    </AppProvider>
  );
};

export default ChefAI;
