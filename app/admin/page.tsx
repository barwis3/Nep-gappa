'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
  rating?: {
    id: string;
    stars: number;
    comment?: string;
    adminReply?: string;
  };
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

export default function AdminDashboard() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [statusUpdate, setStatusUpdate] = useState({ status: '', reason: '' });
  const [updating, setUpdating] = useState(false);
  const [adminReply, setAdminReply] = useState('');
  const [updatingReply, setUpdatingReply] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      // Mock orders data since we don't have a proper API for listing all orders
      const mockOrders: Order[] = [
        {
          id: 'order_1234567',
          status: 'PENDING',
          eventType: 'AGAPA',
          dateTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          address: 'ul. Kościelna 15, 00-001 Warszawa',
          peopleCount: 25,
          subtotalCents: 62500, // 625 PLN
          community: 'Wspólnota św. Jana',
          parish: 'Parafia św. Marka',
          userName: 'Jan Kowalski',
          userEmail: 'jan.kowalski@example.com',
          userPhone: '+48 123 456 789',
          items: [
            {
              id: 'item1',
              quantity: 25,
              unitCents: 1800,
              totalCents: 45000,
              menuItem: { id: '1', name: 'Żurek staropolski', description: 'Tradycyjny żurek' }
            },
            {
              id: 'item2',
              quantity: 25,
              unitCents: 700,
              totalCents: 17500,
              menuItem: { id: '12', name: 'Kompot z owoców sezonowych', description: 'Domowy kompot' }
            }
          ]
        },
        {
          id: 'order_7654321',
          status: 'DELIVERED',
          eventType: 'IMPREZA_OKOLICZNOSCIOWA',
          dateTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          address: 'ul. Świętokrzyska 20, 00-002 Kraków',
          peopleCount: 15,
          subtotalCents: 42000, // 420 PLN
          community: 'Rodzina Nowak',
          parish: 'Parafia Matki Boskiej',
          userName: 'Anna Nowak',
          userEmail: 'anna.nowak@example.com',
          userPhone: '+48 987 654 321',
          items: [
            {
              id: 'item3',
              quantity: 15,
              unitCents: 2800,
              totalCents: 42000,
              menuItem: { id: '4', name: 'Schabowy z kapustą i ziemniakami', description: 'Klasyczny schabowy' }
            }
          ],
          rating: {
            id: 'rating1',
            stars: 5,
            comment: 'Wszystko było bardzo smaczne, gorąco polecamy!',
          }
        }
      ];
      setOrders(mockOrders);
    }
  }, [isAuthenticated]);

  const checkAuth = () => {
    const isAuthed = document.cookie.includes('admin_authed=true');
    setIsAuthenticated(isAuthed);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });

      if (response.ok) {
        document.cookie = 'admin_authed=true; path=/';
        setIsAuthenticated(true);
      } else {
        setLoginError('Nieprawidłowe hasło');
      }
    } catch (error) {
      // Fallback for mock authentication
      if (password === 'zmien-mnie') {
        document.cookie = 'admin_authed=true; path=/';
        setIsAuthenticated(true);
      } else {
        setLoginError('Nieprawidłowe hasło');
      }
    }
  };

  const handleStatusUpdate = async () => {
    if (!selectedOrder || !statusUpdate.status) return;

    setUpdating(true);
    try {
      const response = await fetch(`/api/orders/${selectedOrder.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: statusUpdate.status,
          statusReason: statusUpdate.reason || undefined
        })
      });

      if (response.ok) {
        // Update local order
        const updatedOrder = { ...selectedOrder, status: statusUpdate.status as any, statusReason: statusUpdate.reason || undefined };
        setSelectedOrder(updatedOrder);
        setOrders(prev => prev.map(o => o.id === selectedOrder.id ? updatedOrder : o));
        setStatusUpdate({ status: '', reason: '' });
        alert('Status zamówienia został zaktualizowany');
      } else {
        const error = await response.json();
        alert(error.error || 'Nie udało się zaktualizować statusu');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Nie udało się zaktualizować statusu');
    } finally {
      setUpdating(false);
    }
  };

  const handleAdminReply = async () => {
    if (!selectedOrder?.rating || !adminReply.trim()) return;

    setUpdatingReply(true);
    try {
      const response = await fetch('/api/ratings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: selectedOrder.id,
          adminReply: adminReply.trim()
        })
      });

      if (response.ok) {
        // Update local order
        const updatedOrder = { 
          ...selectedOrder, 
          rating: { ...selectedOrder.rating, adminReply: adminReply.trim() }
        };
        setSelectedOrder(updatedOrder);
        setOrders(prev => prev.map(o => o.id === selectedOrder.id ? updatedOrder : o));
        setAdminReply('');
        alert('Odpowiedź została zapisana');
      } else {
        const error = await response.json();
        alert(error.error || 'Nie udało się zapisać odpowiedzi');
      }
    } catch (error) {
      console.error('Error saving admin reply:', error);
      alert('Nie udało się zapisać odpowiedzi');
    } finally {
      setUpdatingReply(false);
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
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Panel administracyjny
          </h1>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Hasło
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                required
              />
            </div>
            
            {loginError && (
              <div className="text-red-600 text-sm">{loginError}</div>
            )}
            
            <button
              type="submit"
              className="w-full bg-brand-500 text-white py-2 px-4 rounded-md hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
            >
              Zaloguj się
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Panel administracyjny</h1>
          <div className="flex space-x-4">
            <a
              href="/admin/availability"
              className="bg-brand-500 hover:bg-brand-600 text-white px-4 py-2 rounded-md font-medium transition-colors"
            >
              Dostępność (kalendarz)
            </a>
            <button
              onClick={() => {
                document.cookie = 'admin_authed=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
                setIsAuthenticated(false);
              }}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md font-medium transition-colors"
            >
              Wyloguj się
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Orders list */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Zamówienia</h2>
            
            <div className="space-y-4">
              {orders.map(order => (
                <div
                  key={order.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedOrder?.id === order.id
                      ? 'border-brand-500 bg-brand-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedOrder(order)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-medium text-gray-900">
                        #{order.id.slice(-8)} - {order.userName}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {eventTypeLabels[order.eventType]} • {order.peopleCount} osób
                      </p>
                    </div>
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${statusColors[order.status]}`}>
                      {statusLabels[order.status]}
                    </span>
                  </div>
                  
                  <div className="text-sm text-gray-600">
                    <p>{new Date(order.dateTime).toLocaleString('pl-PL')}</p>
                    <p>{order.address}</p>
                    <p className="font-medium text-brand-600">
                      {(order.subtotalCents / 100).toFixed(2)} PLN
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order details */}
          <div className="space-y-6">
            {selectedOrder ? (
              <>
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-xl font-bold text-gray-900">
                      Zamówienie #{selectedOrder.id.slice(-8)}
                    </h2>
                    <a
                      href={`/order/${selectedOrder.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand-600 hover:text-brand-700 text-sm font-medium"
                    >
                      Zobacz jak klient →
                    </a>
                  </div>
                  
                  <div className="space-y-3 text-sm">
                    <div><strong>Klient:</strong> {selectedOrder.userName}</div>
                    <div><strong>Email:</strong> {selectedOrder.userEmail}</div>
                    <div><strong>Telefon:</strong> {selectedOrder.userPhone}</div>
                    <div><strong>Termin:</strong> {new Date(selectedOrder.dateTime).toLocaleString('pl-PL')}</div>
                    <div><strong>Adres:</strong> {selectedOrder.address}</div>
                    <div><strong>Wspólnota:</strong> {selectedOrder.community}</div>
                    <div><strong>Parafia:</strong> {selectedOrder.parish}</div>
                  </div>

                  <div className="mt-6">
                    <h3 className="font-medium text-gray-900 mb-3">Pozycje zamówienia</h3>
                    <div className="space-y-2">
                      {selectedOrder.items.map(item => (
                        <div key={item.id} className="flex justify-between text-sm">
                          <span>{item.quantity}× {item.menuItem.name}</span>
                          <span>{(item.totalCents / 100).toFixed(2)} PLN</span>
                        </div>
                      ))}
                      <div className="border-t pt-2 font-medium flex justify-between">
                        <span>Łącznie:</span>
                        <span>{(selectedOrder.subtotalCents / 100).toFixed(2)} PLN</span>
                      </div>
                    </div>
                  </div>

                  {/* Status update */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h3 className="font-medium text-gray-900 mb-3">Aktualizuj status</h3>
                    <div className="space-y-3">
                      <select
                        value={statusUpdate.status}
                        onChange={(e) => setStatusUpdate(prev => ({ ...prev, status: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                      >
                        <option value="">Wybierz status</option>
                        <option value="PENDING">Oczekuje na potwierdzenie</option>
                        <option value="ACCEPTED">Zaakceptowane</option>
                        <option value="REJECTED">Odrzucone</option>
                        <option value="IN_DELIVERY">W drodze</option>
                        <option value="DELIVERED">Dostarczone</option>
                      </select>
                      
                      {statusUpdate.status === 'REJECTED' && (
                        <textarea
                          value={statusUpdate.reason}
                          onChange={(e) => setStatusUpdate(prev => ({ ...prev, reason: e.target.value }))}
                          placeholder="Powód odrzucenia (wymagany dla odrzuconych zamówień)"
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                        />
                      )}
                      
                      <button
                        onClick={handleStatusUpdate}
                        disabled={!statusUpdate.status || updating || (statusUpdate.status === 'REJECTED' && !statusUpdate.reason)}
                        className="w-full bg-brand-500 text-white py-2 px-4 rounded-md hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {updating ? 'Aktualizowanie...' : 'Zaktualizuj status'}
                      </button>
                    </div>
                  </div>

                  {/* Rating and admin reply */}
                  {selectedOrder.status === 'DELIVERED' && selectedOrder.rating && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <h3 className="font-medium text-gray-900 mb-3">Ocena klienta</h3>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-1">
                          {[1, 2, 3, 4, 5].map(star => (
                            <span
                              key={star}
                              className={`text-xl ${
                                star <= selectedOrder.rating!.stars ? 'text-yellow-400' : 'text-gray-300'
                              }`}
                            >
                              ★
                            </span>
                          ))}
                          <span className="text-sm text-gray-600 ml-2">
                            {selectedOrder.rating.stars}/5
                          </span>
                        </div>
                        {selectedOrder.rating.comment && (
                          <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-md">
                            {selectedOrder.rating.comment}
                          </p>
                        )}
                        
                        {selectedOrder.rating.adminReply ? (
                          <div className="bg-brand-50 p-3 rounded-md">
                            <h4 className="text-sm font-medium text-brand-900 mb-1">Twoja odpowiedź:</h4>
                            <p className="text-sm text-brand-800">{selectedOrder.rating.adminReply}</p>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <textarea
                              value={adminReply}
                              onChange={(e) => setAdminReply(e.target.value)}
                              placeholder="Odpowiedz na ocenę klienta..."
                              rows={3}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                            />
                            <button
                              onClick={handleAdminReply}
                              disabled={!adminReply.trim() || updatingReply}
                              className="w-full bg-brand-500 text-white py-2 px-4 rounded-md hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {updatingReply ? 'Zapisywanie...' : 'Wyślij odpowiedź'}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Chat */}
                <ChatBox orderId={selectedOrder.id} userRole="ADMIN" />
              </>
            ) : (
              <div className="bg-white rounded-lg border border-gray-200 p-6 text-center text-gray-500">
                Wybierz zamówienie z listy, aby zobaczyć szczegóły
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}