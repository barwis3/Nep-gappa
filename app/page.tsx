'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import MenuSelector from '@/components/MenuSelector';
import CalendarPicker from '@/components/CalendarPicker';
import OrderSummary from '@/components/OrderSummary';

interface SelectedItem {
  menuItemId: string;
  quantity: number;
}

interface OrderFormData {
  eventType: 'AGAPA' | 'IMPREZA_OKOLICZNOSCIOWA' | null;
  selectedDate: string | null;
  selectedTime: string;
  address: string;
  peopleCount: number;
  community: string;
  parish: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  selectedItems: SelectedItem[];
}

export default function HomePage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<OrderFormData>({
    eventType: null,
    selectedDate: null,
    selectedTime: '',
    address: '',
    peopleCount: 10,
    community: '',
    parish: '',
    userName: '',
    userEmail: '',
    userPhone: '',
    selectedItems: []
  });

  const updateFormData = (updates: Partial<OrderFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const canProceedToStep = (step: number): boolean => {
    switch (step) {
      case 2:
        return formData.eventType !== null;
      case 3:
        return formData.selectedDate !== null && formData.selectedTime !== '';
      case 4:
        return formData.address !== '' && formData.peopleCount >= 10 && 
               formData.community !== '' && formData.parish !== '';
      case 5:
        return formData.selectedItems.length > 0;
      default:
        return true;
    }
  };

  const submitOrder = async () => {
    if (!formData.userName || !formData.userEmail || !formData.userPhone) {
      alert('Wszystkie dane kontaktowe są wymagane');
      return;
    }

    if (formData.selectedItems.length === 0) {
      alert('Wybierz przynajmniej jedną pozycję z menu');
      return;
    }

    setLoading(true);

    try {
      const dateTime = new Date(`${formData.selectedDate}T${formData.selectedTime}`);
      
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventType: formData.eventType,
          dateTime: dateTime.toISOString(),
          address: formData.address,
          peopleCount: formData.peopleCount,
          community: formData.community,
          parish: formData.parish,
          userName: formData.userName,
          userEmail: formData.userEmail,
          userPhone: formData.userPhone,
          items: formData.selectedItems
        })
      });

      if (response.ok) {
        const { id } = await response.json();
        router.push(`/order/${id}`);
      } else {
        const error = await response.json();
        alert(error.error || 'Nie udało się złożyć zamówienia');
      }
    } catch (error) {
      console.error('Error submitting order:', error);
      alert('Nie udało się złożyć zamówienia');
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Wybierz rodzaj wydarzenia
              </h2>
              <p className="text-gray-600">
                Jakiego typu wydarzenie planujesz?
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto">
              <button
                type="button"
                onClick={() => updateFormData({ eventType: 'AGAPA' })}
                className={`p-6 rounded-lg border-2 transition-colors ${
                  formData.eventType === 'AGAPA'
                    ? 'border-brand-500 bg-brand-50'
                    : 'border-gray-200 hover:border-brand-300'
                }`}
              >
                <h3 className="text-lg font-medium text-gray-900 mb-2">Agapa</h3>
                <p className="text-sm text-gray-600">
                  Uroczyste posiłki wspólnotowe związane z życiem religijnym
                </p>
              </button>
              
              <button
                type="button"
                onClick={() => updateFormData({ eventType: 'IMPREZA_OKOLICZNOSCIOWA' })}
                className={`p-6 rounded-lg border-2 transition-colors ${
                  formData.eventType === 'IMPREZA_OKOLICZNOSCIOWA'
                    ? 'border-brand-500 bg-brand-50'
                    : 'border-gray-200 hover:border-brand-300'
                }`}
              >
                <h3 className="text-lg font-medium text-gray-900 mb-2">Impreza okolicznościowa</h3>
                <p className="text-sm text-gray-600">
                  Uroczystości rodzinne, firmowe i inne wydarzenia specjalne
                </p>
              </button>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Wybierz termin
              </h2>
              <p className="text-gray-600">
                Kiedy ma odbyć się wydarzenie?
              </p>
            </div>
            
            <CalendarPicker
              selectedDate={formData.selectedDate}
              onDateSelect={(date) => updateFormData({ selectedDate: date })}
            />
            
            {formData.selectedDate && (
              <div className="max-w-md mx-auto">
                <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-2">
                  Godzina
                </label>
                <input
                  type="time"
                  id="time"
                  value={formData.selectedTime}
                  onChange={(e) => updateFormData({ selectedTime: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                  required
                />
              </div>
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Szczegóły wydarzenia
              </h2>
              <p className="text-gray-600">
                Podaj informacje o miejscu i liczbie osób
              </p>
            </div>
            
            <div className="max-w-2xl mx-auto space-y-4">
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                  Adres *
                </label>
                <textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => updateFormData({ address: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                  placeholder="Ulica, miasto, kod pocztowy..."
                  required
                />
              </div>
              
              <div>
                <label htmlFor="peopleCount" className="block text-sm font-medium text-gray-700 mb-2">
                  Liczba osób * (minimum 10)
                </label>
                <input
                  type="number"
                  id="peopleCount"
                  min="10"
                  value={formData.peopleCount}
                  onChange={(e) => updateFormData({ peopleCount: parseInt(e.target.value) || 10 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="community" className="block text-sm font-medium text-gray-700 mb-2">
                    Wspólnota *
                  </label>
                  <input
                    type="text"
                    id="community"
                    value={formData.community}
                    onChange={(e) => updateFormData({ community: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="parish" className="block text-sm font-medium text-gray-700 mb-2">
                    Parafia *
                  </label>
                  <input
                    type="text"
                    id="parish"
                    value={formData.parish}
                    onChange={(e) => updateFormData({ parish: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Wybór menu
              </h2>
              <p className="text-gray-600">
                Wybierz pozycje z naszego menu
              </p>
            </div>
            
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <MenuSelector
                  selectedItems={formData.selectedItems}
                  onSelectionChange={(items) => updateFormData({ selectedItems: items })}
                />
              </div>
              <div>
                <OrderSummary 
                  selectedItems={formData.selectedItems}
                  peopleCount={formData.peopleCount}
                />
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Dane kontaktowe
              </h2>
              <p className="text-gray-600">
                Ostatni krok - podaj swoje dane kontaktowe
              </p>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div>
                  <label htmlFor="userName" className="block text-sm font-medium text-gray-700 mb-2">
                    Imię i nazwisko *
                  </label>
                  <input
                    type="text"
                    id="userName"
                    value={formData.userName}
                    onChange={(e) => updateFormData({ userName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="userEmail" className="block text-sm font-medium text-gray-700 mb-2">
                    Adres e-mail *
                  </label>
                  <input
                    type="email"
                    id="userEmail"
                    value={formData.userEmail}
                    onChange={(e) => updateFormData({ userEmail: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="userPhone" className="block text-sm font-medium text-gray-700 mb-2">
                    Numer telefonu *
                  </label>
                  <input
                    type="tel"
                    id="userPhone"
                    value={formData.userPhone}
                    onChange={(e) => updateFormData({ userPhone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                    placeholder="+48 123 456 789"
                    required
                  />
                </div>
              </div>
              
              <div>
                <OrderSummary 
                  selectedItems={formData.selectedItems}
                  peopleCount={formData.peopleCount}
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            {[1, 2, 3, 4, 5].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step <= currentStep
                      ? 'bg-brand-500 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {step}
                </div>
                {step < 5 && (
                  <div
                    className={`w-8 h-1 mx-2 ${
                      step < currentStep ? 'bg-brand-500' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              Krok {currentStep} z 5
            </p>
          </div>
        </div>

        {/* Step content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          {renderStep()}
        </div>

        {/* Navigation buttons */}
        <div className="mt-8 flex justify-between">
          <button
            type="button"
            onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
            disabled={currentStep === 1}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Wstecz
          </button>
          
          {currentStep < 5 ? (
            <button
              type="button"
              onClick={() => setCurrentStep(prev => prev + 1)}
              disabled={!canProceedToStep(currentStep + 1)}
              className="px-6 py-2 bg-brand-500 text-white rounded-md hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Dalej
            </button>
          ) : (
            <button
              type="button"
              onClick={submitOrder}
              disabled={loading || !formData.userName || !formData.userEmail || !formData.userPhone}
              className="px-6 py-2 bg-brand-500 text-white rounded-md hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  <span>Składanie zamówienia...</span>
                </div>
              ) : (
                'Złóż zamówienie'
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}