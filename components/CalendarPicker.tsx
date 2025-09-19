'use client';

import { useState, useEffect } from 'react';

interface AvailableDate {
  date: string; // YYYY-MM-DD
  note?: string;
}

interface Props {
  selectedDate: string | null;
  onDateSelect: (date: string) => void;
}

export default function CalendarPicker({ selectedDate, onDateSelect }: Props) {
  const [availableDates, setAvailableDates] = useState<AvailableDate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    fetchAvailability();
  }, []);

  const fetchAvailability = async () => {
    try {
      const response = await fetch('/api/availability');
      if (!response.ok) {
        throw new Error('Nie udało się pobrać dostępności');
      }
      const data = await response.json();
      setAvailableDates(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Wystąpił błąd');
    } finally {
      setLoading(false);
    }
  };

  const generateCalendarDays = () => {
    const today = new Date();
    const endDate = new Date(today.getTime() + 35 * 24 * 60 * 60 * 1000); // 35 days from now
    
    const days = [];
    const current = new Date(today);
    
    while (current <= endDate) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    
    return days;
  };

  const isDateAvailable = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    return availableDates.some(d => d.date === dateString);
  };

  const isDateSelected = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    return selectedDate === dateString;
  };

  const formatDateForDisplay = (date: Date) => {
    return date.toLocaleDateString('pl-PL', {
      weekday: 'short',
      day: 'numeric',
      month: 'short'
    });
  };

  const handleDateClick = (date: Date) => {
    if (isDateAvailable(date)) {
      const dateString = date.toISOString().split('T')[0];
      onDateSelect(dateString);
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

  const calendarDays = generateCalendarDays();

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        Wybierz dostępny termin
      </h3>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
        {calendarDays.map((date, index) => {
          const available = isDateAvailable(date);
          const selected = isDateSelected(date);
          
          return (
            <button
              key={index}
              type="button"
              onClick={() => handleDateClick(date)}
              disabled={!available}
              className={`
                p-2 text-sm rounded-md border transition-colors
                ${available
                  ? selected
                    ? 'bg-brand-500 text-white border-brand-500'
                    : 'border-gray-300 hover:border-brand-300 hover:bg-brand-50'
                  : 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                }
              `}
            >
              <div className="font-medium">
                {date.getDate()}
              </div>
              <div className="text-xs opacity-75">
                {date.toLocaleDateString('pl-PL', { month: 'short' })}
              </div>
            </button>
          );
        })}
      </div>
      
      <div className="mt-4 flex items-center space-x-4 text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-brand-500 rounded"></div>
          <span className="text-gray-600">Dostępny</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-gray-200 rounded"></div>
          <span className="text-gray-600">Niedostępny</span>
        </div>
      </div>
    </div>
  );
}