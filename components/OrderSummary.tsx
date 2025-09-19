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
  peopleCount?: number;
}

export default function OrderSummary({ selectedItems, peopleCount }: Props) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    try {
      const response = await fetch('/api/menu');
      if (response.ok) {
        const data = await response.json();
        setMenuItems(data);
      }
    } catch (error) {
      console.error('Error fetching menu:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Podsumowanie zamówienia
        </h3>
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-brand-500"></div>
        </div>
      </div>
    );
  }

  const getItemsWithDetails = () => {
    return selectedItems.map(selectedItem => {
      const menuItem = menuItems.find(item => item.id === selectedItem.menuItemId);
      return {
        ...selectedItem,
        menuItem
      };
    }).filter(item => item.menuItem);
  };

  const itemsWithDetails = getItemsWithDetails();
  const totalCents = itemsWithDetails.reduce((sum, item) => {
    return sum + (item.menuItem!.priceCents * item.quantity);
  }, 0);

  if (selectedItems.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Podsumowanie zamówienia
        </h3>
        <p className="text-gray-500 text-center py-4">
          Nie wybrano jeszcze żadnych pozycji z menu
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        Podsumowanie zamówienia
      </h3>
      
      {peopleCount && (
        <div className="mb-4 p-3 bg-gray-50 rounded-md">
          <p className="text-sm text-gray-600">
            Liczba osób: <span className="font-medium text-gray-900">{peopleCount}</span>
          </p>
        </div>
      )}

      <div className="space-y-3 mb-4">
        {itemsWithDetails.map(item => {
          const itemTotal = item.menuItem!.priceCents * item.quantity;
          return (
            <div key={item.menuItemId} className="flex justify-between items-center py-2 border-b border-gray-100">
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{item.menuItem!.name}</h4>
                <p className="text-sm text-gray-600">
                  {item.quantity} × {(item.menuItem!.priceCents / 100).toFixed(2)} PLN
                </p>
              </div>
              <div className="font-medium text-gray-900">
                {(itemTotal / 100).toFixed(2)} PLN
              </div>
            </div>
          );
        })}
      </div>

      <div className="border-t border-gray-200 pt-4">
        <div className="flex justify-between items-center">
          <span className="text-lg font-medium text-gray-900">Łącznie:</span>
          <span className="text-xl font-bold text-brand-600">
            {(totalCents / 100).toFixed(2)} PLN
          </span>
        </div>
        
        {peopleCount && totalCents > 0 && (
          <div className="mt-2 text-sm text-gray-600">
            Cena na osobę: {((totalCents / peopleCount) / 100).toFixed(2)} PLN
          </div>
        )}
      </div>
    </div>
  );
}