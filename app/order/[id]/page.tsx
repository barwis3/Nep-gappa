'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import ChatBox from '@/components/ChatBox';

interface OrderItem {
  id: string;
  quantity: number;
  unitCents: number;
  totalCents: number;
  menuItem: {
    id: string;
    name: string;
    description: string;
  };
}

interface Rating {
  id: string;
  stars: number;
  comment?: string;
  adminReply?: string;
}

interface Order {
  id: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'IN_DELIVERY' | 'DELIVERED';
  statusReason?: string;
  eventType: 'AGAPA' | 'IMPREZA_OKOLICZNOSCIOWA';
  dateTime: string;
  address: string;
  peopleCount: number;
  subtotalCents: number;
  community: string;
  parish: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  items: OrderItem[];
  rating?: Rating;
}

const statusLabels = {
  PENDING: 'Oczekuje na potwierdzenie',
  ACCEPTED: 'Zaakceptowane',
  REJECTED: 'Odrzucone',
  IN_DELIVERY: 'W drodze',
  DELIVERED: 'Dostarczone'
};

const statusColors = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  ACCEPTED: 'bg-green-100 text-green-800',
  REJECTED: 'bg-red-100 text-red-800',
  IN_DELIVERY: 'bg-blue-100 text-blue-800',
  DELIVERED: 'bg-green-100 text-green-800'
};

const eventTypeLabels = {
  AGAPA: 'Agapa',
  IMPREZA_OKOLICZNOSCIOWA: 'Impreza okolicznościowa'
};

export default function OrderDetailPage() {
  const params = useParams();
  const orderId = params?.id as string;
  
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rating, setRating] = useState({ stars: 5, comment: '' });
  const [submittingRating, setSubmittingRating] = useState(false);

  useEffect(() => {
    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      const response = await fetch(`/api/orders/${orderId}`);
      if (response.ok) {
        const data = await response.json();
        setOrder(data);
        if (data.rating) {
          setRating({ 
            stars: data.rating.stars, 
            comment: data.rating.comment || '' 
          });
        }
      } else {
        const error = await response.json();
        setError(error.error || 'Nie udało się pobrać zamówienia');
      }
    } catch (err) {
      setError('Wystąpił błąd podczas pobierania zamówienia');
    } finally {
      setLoading(false);
    }
  };

  const submitRating = async () => {
    if (!order || order.status !== 'DELIVERED') return;
    
    setSubmittingRating(true);
    
    try {
      const response = await fetch('/api/ratings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId: order.id,
          stars: rating.stars,
          comment: rating.comment.trim() || undefined
        })
      });

      if (response.ok) {
        fetchOrder(); // Refresh to get updated rating
      } else {
        const error = await response.json();
        alert(error.error || 'Nie udało się zapisać oceny');
      }
    } catch (error) {
      console.error('Error submitting rating:', error);
      alert('Nie udało się zapisać oceny');
    } finally {
      setSubmittingRating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Ładowanie zamówienia...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Błąd</h1>
          <p className="text-gray-600">{error || 'Zamówienie nie zostało znalezione'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Zamówienie #{order.id.slice(-8)}
          </h1>
          <div className="mt-2 flex items-center space-x-4">
            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${statusColors[order.status]}`}>
              {statusLabels[order.status]}
            </span>
            <span className="text-sm text-gray-600">
              {eventTypeLabels[order.eventType]}
            </span>
          </div>
        </div>

        {order.status === 'REJECTED' && order.statusReason && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <h3 className="text-sm font-medium text-red-800 mb-1">
              Powód odrzucenia:
            </h3>
            <p className="text-sm text-red-700">{order.statusReason}</p>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Order details */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Szczegóły zamówienia
              </h3>
              
              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-gray-500">Termin:</span>
                  <p className="text-sm text-gray-900">
                    {new Date(order.dateTime).toLocaleString('pl-PL', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                
                <div>
                  <span className="text-sm font-medium text-gray-500">Adres:</span>
                  <p className="text-sm text-gray-900">{order.address}</p>
                </div>
                
                <div>
                  <span className="text-sm font-medium text-gray-500">Liczba osób:</span>
                  <p className="text-sm text-gray-900">{order.peopleCount}</p>
                </div>
                
                <div>
                  <span className="text-sm font-medium text-gray-500">Wspólnota:</span>
                  <p className="text-sm text-gray-900">{order.community}</p>
                </div>
                
                <div>
                  <span className="text-sm font-medium text-gray-500">Parafia:</span>
                  <p className="text-sm text-gray-900">{order.parish}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Pozycje zamówienia
              </h3>
              
              <div className="space-y-3">
                {order.items.map(item => (
                  <div key={item.id} className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{item.menuItem.name}</h4>
                      <p className="text-sm text-gray-600">
                        {item.quantity} × {(item.unitCents / 100).toFixed(2)} PLN
                      </p>
                    </div>
                    <div className="font-medium text-gray-900">
                      {(item.totalCents / 100).toFixed(2)} PLN
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-gray-200 pt-4 mt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-medium text-gray-900">Łącznie:</span>
                  <span className="text-xl font-bold text-brand-600">
                    {(order.subtotalCents / 100).toFixed(2)} PLN
                  </span>
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  Cena na osobę: {((order.subtotalCents / order.peopleCount) / 100).toFixed(2)} PLN
                </div>
              </div>
            </div>

            {/* Rating section */}
            {order.status === 'DELIVERED' && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Oceń nasze usługi
                </h3>
                
                {order.rating ? (
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center space-x-1 mb-2">
                        {[1, 2, 3, 4, 5].map(star => (
                          <span
                            key={star}
                            className={`text-xl ${
                              star <= order.rating!.stars ? 'text-yellow-400' : 'text-gray-300'
                            }`}
                          >
                            ★
                          </span>
                        ))}
                        <span className="text-sm text-gray-600 ml-2">
                          {order.rating.stars}/5
                        </span>
                      </div>
                      {order.rating.comment && (
                        <p className="text-sm text-gray-700">{order.rating.comment}</p>
                      )}
                    </div>
                    
                    {order.rating.adminReply && (
                      <div className="bg-gray-50 rounded-md p-3">
                        <h4 className="text-sm font-medium text-gray-900 mb-1">
                          Odpowiedź od obsługi:
                        </h4>
                        <p className="text-sm text-gray-700">{order.rating.adminReply}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ocena (1-5 gwiazdek)
                      </label>
                      <div className="flex items-center space-x-1">
                        {[1, 2, 3, 4, 5].map(star => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setRating(prev => ({ ...prev, stars: star }))}
                            className={`text-2xl transition-colors ${
                              star <= rating.stars ? 'text-yellow-400' : 'text-gray-300'
                            } hover:text-yellow-400`}
                          >
                            ★
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Komentarz (opcjonalnie)
                      </label>
                      <textarea
                        value={rating.comment}
                        onChange={(e) => setRating(prev => ({ ...prev, comment: e.target.value }))}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                        placeholder="Podziel się swoją opinią..."
                      />
                    </div>
                    
                    <button
                      type="button"
                      onClick={submitRating}
                      disabled={submittingRating}
                      className="w-full px-4 py-2 bg-brand-500 text-white rounded-md hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {submittingRating ? 'Zapisywanie...' : 'Wyślij ocenę'}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Chat */}
          <div className="lg:sticky lg:top-8">
            <ChatBox orderId={order.id} />
          </div>
        </div>
      </div>
    </div>
  );
}