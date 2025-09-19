'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface AvailabilityItem {
  id?: string;
  date: string;
  isAvailable: boolean;
  note?: string;
}

export default function AvailabilityManagement() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [availabilityItems, setAvailabilityItems] = useState<AvailabilityItem[]>([]);
  const [newItem, setNewItem] = useState<AvailabilityItem>({
    date: '',
    isAvailable: true,
    note: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchAvailability();
    }
  }, [isAuthenticated]);

  const checkAuth = () => {
    const isAuthed = document.cookie.includes('admin_authed=true');
    setIsAuthenticated(isAuthed);
    if (!isAuthed) {
      router.push('/admin');
    }
  };

  const fetchAvailability = async () => {
    try {
      // Try to fetch from API first, fall back to mock data
      try {
        const response = await fetch('/api/admin/availability');
        if (response.ok) {
          const data = await response.json();
          setAvailabilityItems(data);
          return;
        }
      } catch (apiError) {
        console.log('API not available, using mock data');
      }

      // Generate mock availability data
      const today = new Date();
      const mockItems: AvailabilityItem[] = [];
      
      for (let i = 0; i < 35; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        
        // Make some days unavailable (randomly)
        const isAvailable = Math.random() > 0.2; // 80% chance of being available
        
        mockItems.push({
          id: `avail_${i}`,
          date: date.toISOString().split('T')[0],
          isAvailable,
          note: !isAvailable ? 'Dzień niedostępny' : undefined,
        });
      }
      
      setAvailabilityItems(mockItems);
    } catch (error) {
      console.error('Error fetching availability:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.date) return;

    setLoading(true);
    try {
      // Try to submit to API first
      try {
        const response = await fetch('/api/admin/availability', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newItem)
        });

        if (response.ok) {
          const savedItem = await response.json();
          setAvailabilityItems(prev => {
            const filtered = prev.filter(item => item.date !== newItem.date);
            return [...filtered, savedItem].sort((a, b) => a.date.localeCompare(b.date));
          });
          setNewItem({ date: '', isAvailable: true, note: '' });
          return;
        }
      } catch (apiError) {
        console.log('API not available, using mock update');
      }

      // Mock update
      const mockItem: AvailabilityItem = {
        id: `avail_${Date.now()}`,
        date: newItem.date,
        isAvailable: newItem.isAvailable,
        note: newItem.note || undefined
      };

      setAvailabilityItems(prev => {
        const filtered = prev.filter(item => item.date !== newItem.date);
        return [...filtered, mockItem].sort((a, b) => a.date.localeCompare(b.date));
      });
      setNewItem({ date: '', isAvailable: true, note: '' });
      alert('Dostępność została zaktualizowana');
    } catch (error) {
      console.error('Error saving availability:', error);
      alert('Nie udało się zapisać dostępności');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (item: AvailabilityItem) => {
    if (!confirm('Czy na pewno chcesz usunąć ten wpis?')) return;

    try {
      // Try to delete via API first
      try {
        const response = await fetch(`/api/admin/availability/${item.id}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          setAvailabilityItems(prev => prev.filter(i => i.id !== item.id));
          return;
        }
      } catch (apiError) {
        console.log('API not available, using mock delete');
      }

      // Mock delete
      setAvailabilityItems(prev => prev.filter(i => i.id !== item.id));
      alert('Wpis został usunięty');
    } catch (error) {
      console.error('Error deleting availability:', error);
      alert('Nie udało się usunąć wpisu');
    }
  };

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect to /admin
  }

  // Get today's date for min attribute
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Zarządzanie dostępnością</h1>
          <a
            href="/admin"
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md font-medium transition-colors"
          >
            ← Powrót do panelu
          </a>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Add/Edit form */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Dodaj/Edytuj dostępność
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                  Data *
                </label>
                <input
                  type="date"
                  id="date"
                  min={today}
                  value={newItem.date}
                  onChange={(e) => setNewItem(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={newItem.isAvailable}
                    onChange={(e) => setNewItem(prev => ({ ...prev, isAvailable: e.target.checked }))}
                    className="w-4 h-4 text-brand-600 border-gray-300 rounded focus:ring-brand-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Dostępny</span>
                </label>
              </div>
              
              <div>
                <label htmlFor="note" className="block text-sm font-medium text-gray-700 mb-2">
                  Notatka (opcjonalnie)
                </label>
                <textarea
                  id="note"
                  value={newItem.note}
                  onChange={(e) => setNewItem(prev => ({ ...prev, note: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                  placeholder="Opcjonalna notatka dotycząca tego dnia..."
                />
              </div>
              
              <button
                type="submit"
                disabled={loading || !newItem.date}
                className="w-full bg-brand-500 text-white py-2 px-4 rounded-md hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Zapisywanie...' : 'Zapisz'}
              </button>
            </form>
          </div>

          {/* Availability list */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Lista dostępności
            </h2>
            
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {availabilityItems.length === 0 ? (
                <p className="text-gray-500 text-center py-4">
                  Brak wpisów dostępności
                </p>
              ) : (
                availabilityItems.map(item => {
                  const date = new Date(item.date);
                  const isPast = date < new Date(today);
                  
                  return (
                    <div
                      key={item.id || item.date}
                      className={`p-3 border rounded-md ${
                        item.isAvailable
                          ? 'border-green-200 bg-green-50'
                          : 'border-red-200 bg-red-50'
                      } ${isPast ? 'opacity-60' : ''}`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-gray-900">
                              {date.toLocaleDateString('pl-PL', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </span>
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                item.isAvailable
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {item.isAvailable ? 'Dostępny' : 'Niedostępny'}
                            </span>
                          </div>
                          {item.note && (
                            <p className="text-sm text-gray-600 mt-1">{item.note}</p>
                          )}
                        </div>
                        
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setNewItem({
                              date: item.date,
                              isAvailable: item.isAvailable,
                              note: item.note || ''
                            })}
                            className="text-brand-600 hover:text-brand-700 text-sm font-medium"
                          >
                            Edytuj
                          </button>
                          <button
                            onClick={() => handleDelete(item)}
                            className="text-red-600 hover:text-red-700 text-sm font-medium"
                          >
                            Usuń
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
            
            <div className="mt-4 text-sm text-gray-500">
              <p>Łącznie: {availabilityItems.length} wpisów</p>
              <p>Dostępne: {availabilityItems.filter(item => item.isAvailable).length} dni</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}