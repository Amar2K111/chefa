'use client';

import React, { useState } from 'react';
import { X, CheckCircle, Circle, Trash2, Plus } from 'lucide-react';
import { Recipe } from '@/types';

interface ShoppingItem {
  id: string;
  name: string;
  checked: boolean;
  recipeId?: number;
}

interface ShoppingListScreenProps {
  recipes: Recipe[];
  onClose: () => void;
}

export const ShoppingListScreen: React.FC<ShoppingListScreenProps> = ({ recipes, onClose }) => {
  const [items, setItems] = useState<ShoppingItem[]>(() => {
    // Générer la liste depuis les recettes favorites ou sélectionnées
    const allIngredients = new Set<string>();
    recipes.forEach(recipe => {
      recipe.ingredients.forEach(ing => allIngredients.add(ing));
    });
    return Array.from(allIngredients).map((ing, idx) => ({
      id: `item-${idx}`,
      name: ing,
      checked: false
    }));
  });

  const [newItem, setNewItem] = useState('');

  const toggleItem = (id: string) => {
    setItems(items.map(item =>
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
  };

  const addItem = () => {
    if (newItem.trim()) {
      setItems([...items, {
        id: `item-${Date.now()}`,
        name: newItem.trim(),
        checked: false
      }]);
      setNewItem('');
    }
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const checkedCount = items.filter(item => item.checked).length;
  const totalCount = items.length;

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col animate-slide-up" style={{ maxWidth: '430px', left: '50%', transform: 'translateX(-50%)' }}>
      <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-white">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Liste de courses</h1>
          <p className="text-xs text-gray-500">{checkedCount}/{totalCount} articles</p>
        </div>
        <button onClick={onClose} className="hover:bg-gray-100 p-1 rounded-lg transition-all">
          <X size={24} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="mb-4 flex gap-2">
          <input
            type="text"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addItem()}
            placeholder="Ajouter un article..."
            className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500"
          />
          <button
            onClick={addItem}
            className="bg-orange-500 text-white px-4 py-2 rounded-xl hover:bg-orange-600 transition-all"
          >
            <Plus size={20} />
          </button>
        </div>

        <div className="space-y-2">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🛒</div>
              <p className="text-gray-500">Ta liste est vide</p>
            </div>
          ) : (
            items.map(item => (
              <div
                key={item.id}
                className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${
                  item.checked
                    ? 'bg-green-50 border-green-200'
                    : 'bg-white border-gray-200'
                }`}
              >
                <button
                  onClick={() => toggleItem(item.id)}
                  className="flex-shrink-0"
                >
                  {item.checked ? (
                    <CheckCircle size={24} className="text-green-500" />
                  ) : (
                    <Circle size={24} className="text-gray-400" />
                  )}
                </button>
                <span
                  className={`flex-1 ${item.checked ? 'line-through text-gray-500' : 'text-gray-800'}`}
                >
                  {item.name}
                </span>
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-red-500 hover:text-red-600 transition-all"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

