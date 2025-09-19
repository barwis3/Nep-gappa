'use client';

import { useState, useEffect } from 'react';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  priceCents: number;
  category: string;
}

interface SelectedItem {
  menuItemId: string;
  quantity: number;
}

interface Props {
  selectedItems: SelectedItem[];
  onSelectionChange: (items: SelectedItem[]) => void;
}

const categoryNames = {
  starter: 'Przystawki',
  main: 'Dania główne',
  dessert: 'Desery',
  drink: 'Napoje'
};

export default function MenuSelector({ selectedItems, onSelectionChange }: Props) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    try {
      const response = await fetch('/api/menu');
      if (!response.ok) {
        throw new Error('Nie udało się pobrać menu');
      }
      const data = await response.json();
      setMenuItems(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Wystąpił błąd');
    } finally {
      setLoading(false);
    }
  };

  const groupedItems = menuItems.reduce((groups, item) => {
    if (!groups[item.category]) {
      groups[item.category] = [];
    }
    groups[item.category].push(item);
    return groups;
  }, {} as Record<string, MenuItem[]>);

  const getItemQuantity = (itemId: string) => {
    return selectedItems.find(item => item.menuItemId === itemId)?.quantity || 0;
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      onSelectionChange(selectedItems.filter(item => item.menuItemId !== itemId));
    } else {
      const existingIndex = selectedItems.findIndex(item => item.menuItemId === itemId);
      if (existingIndex >= 0) {
        const updatedItems = [...selectedItems];
        updatedItems[existingIndex] = { menuItemId: itemId, quantity };
        onSelectionChange(updatedItems);
      } else {
        onSelectionChange([...selectedItems, { menuItemId: itemId, quantity }]);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <p className="text-red-800">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {Object.entries(groupedItems).map(([category, items]) => (
        <div key={category} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              {categoryNames[category as keyof typeof categoryNames] || category}
            </h3>
          </div>
          <div className="p-6 space-y-4">
            {items.map(item => {
              const quantity = getItemQuantity(item.id);
              return (
                <div key={item.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{item.name}</h4>
                    <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                    <p className="text-sm font-medium text-brand-600 mt-1">
                      {(item.priceCents / 100).toFixed(2)} PLN
                    </p>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, Math.max(0, quantity - 1))}
                      className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50"
                      disabled={quantity <= 0}
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-medium">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, quantity + 1)}
                      className="w-8 h-8 rounded-full border border-brand-500 bg-brand-500 text-white flex items-center justify-center hover:bg-brand-600"
                    >
                      +
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}