'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface Order {
  id: string
  customerName: string
  customerEmail: string
  customerPhone: string
  eventType: string
  deliveryDate: string
  deliveryTime: string
  address: string
  peopleCount: number
  community?: string
  parish?: string
  notes?: string
  status: string
  rejectionReason?: string
  total: number
  createdAt: string
  updatedAt: string
}

const statusNames: Record<string, string> = {
  pending: 'Oczekuje na potwierdzenie',
  accepted: 'Potwierdzone',
  in_progress: 'W przygotowaniu',
  delivered: 'Dostarczone',
  cancelled: 'Anulowane'
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  accepted: 'bg-blue-100 text-blue-800',
  in_progress: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800'
}

export default function AdminDashboard() {
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [activeTab, setActiveTab] = useState('orders')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [newStatus, setNewStatus] = useState('')
  const [rejectionReason, setRejectionReason] = useState('')

  useEffect(() => {
    // Check authentication
    const isAuthenticated = sessionStorage.getItem('admin_authenticated')
    if (isAuthenticated !== 'true') {
      router.push('/admin')
      return
    }

    fetchOrders()
  }, [router])

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders')
      if (response.ok) {
        const data = await response.json()
        setOrders(data)
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
    }
  }

  const updateOrderStatus = async (orderId: string, status: string, reason?: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status, rejectionReason: reason }),
      })

      if (response.ok) {
        fetchOrders()
        setSelectedOrder(null)
        setNewStatus('')
        setRejectionReason('')
      }
    } catch (error) {
      console.error('Error updating order status:', error)
    }
  }

  const logout = () => {
    sessionStorage.removeItem('admin_authenticated')
    router.push('/admin')
  }

  const handleStatusUpdate = () => {
    if (!selectedOrder || !newStatus) return
    
    const reason = newStatus === 'cancelled' ? rejectionReason : undefined
    updateOrderStatus(selectedOrder.id, newStatus, reason)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-brand">
              🍜 Panel Administratora
            </h1>
            <div className="flex items-center space-x-4">
              <a 
                href="/" 
                className="btn btn-secondary text-sm"
                target="_blank"
              >
                Podgląd strony
              </a>
              <button onClick={logout} className="btn btn-danger text-sm">
                Wyloguj
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="mb-6">
          <nav className="flex space-x-8 border-b">
            <button
              onClick={() => setActiveTab('orders')}
              className={`py-2 px-1 font-medium text-sm border-b-2 ${
                activeTab === 'orders'
                  ? 'border-brand text-brand'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Zamówienia ({orders.length})
            </button>
            <button
              onClick={() => setActiveTab('menu')}
              className={`py-2 px-1 font-medium text-sm border-b-2 ${
                activeTab === 'menu'
                  ? 'border-brand text-brand'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Menu
            </button>
          </nav>
        </div>

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Zarządzaj zamówieniami</h2>
              <div className="text-sm text-gray-600">
                {orders.filter(o => o.status === 'pending').length} oczekujących
              </div>
            </div>

            {orders.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Brak zamówień
              </div>
            ) : (
              <div className="grid gap-4">
                {orders.map((order) => (
                  <div key={order.id} className="card">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-semibold text-lg">
                          Zamówienie #{order.id.slice(-8)}
                        </h3>
                        <p className="text-gray-600">{order.customerName}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[order.status]}`}>
                        {statusNames[order.status]}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-4">
                      <div>
                        <p><strong>Email:</strong> {order.customerEmail}</p>
                        <p><strong>Telefon:</strong> {order.customerPhone}</p>
                        <p><strong>Wydarzenie:</strong> {order.eventType}</p>
                        <p><strong>Liczba osób:</strong> {order.peopleCount}</p>
                      </div>
                      <div>
                        <p><strong>Data dostawy:</strong> {order.deliveryDate} o {order.deliveryTime}</p>
                        <p><strong>Wspólnota:</strong> {order.community || 'Nie podano'}</p>
                        <p><strong>Parafia:</strong> {order.parish || 'Nie podano'}</p>
                        <p><strong>Zamówiono:</strong> {new Date(order.createdAt).toLocaleString('pl-PL')}</p>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <p className="text-sm"><strong>Adres:</strong></p>
                      <p className="text-gray-700">{order.address}</p>
                    </div>
                    
                    {order.notes && (
                      <div className="mb-4">
                        <p className="text-sm"><strong>Uwagi:</strong></p>
                        <p className="text-gray-700">{order.notes}</p>
                      </div>
                    )}
                    
                    <div className="flex justify-between items-center pt-4 border-t">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setSelectedOrder(order)
                            setNewStatus('accepted')
                          }}
                          disabled={order.status !== 'pending'}
                          className="btn btn-primary text-sm disabled:opacity-50"
                        >
                          Akceptuj
                        </button>
                        <button
                          onClick={() => {
                            setSelectedOrder(order)
                            setNewStatus('cancelled')
                          }}
                          disabled={order.status === 'cancelled' || order.status === 'delivered'}
                          className="btn btn-danger text-sm disabled:opacity-50"
                        >
                          Odrzuć
                        </button>
                        <button
                          onClick={() => {
                            setSelectedOrder(order)
                            setNewStatus('delivered')
                          }}
                          disabled={order.status !== 'in_progress'}
                          className="btn btn-secondary text-sm disabled:opacity-50"
                        >
                          Dostarczone
                        </button>
                      </div>
                      
                      <a 
                        href={`/order/${order.id}`}
                        target="_blank"
                        className="text-brand hover:underline text-sm"
                      >
                        Zobacz szczegóły →
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Menu Tab */}
        {activeTab === 'menu' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Zarządzaj menu</h2>
            
            <div className="card">
              <h3 className="text-lg font-medium mb-4">Dodaj nową pozycję</h3>
              <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nazwa
                  </label>
                  <input type="text" className="input" placeholder="Nazwa potrawy" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cena (zł)
                  </label>
                  <input type="number" step="0.01" className="input" placeholder="0.00" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Kategoria
                  </label>
                  <select className="input">
                    <option>dania-glowne</option>
                    <option>przystawki</option>
                    <option>desery</option>
                    <option>napoje</option>
                  </select>
                </div>
                
                <div className="flex items-end">
                  <button type="submit" className="btn btn-primary">
                    Dodaj pozycję
                  </button>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Opis
                  </label>
                  <textarea rows={2} className="input" placeholder="Opis potrawy..."></textarea>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* Status Update Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">
              Zmiana statusu zamówienia #{selectedOrder.id.slice(-8)}
            </h3>
            
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">
                Klient: {selectedOrder.customerName}
              </p>
              <p className="text-sm text-gray-600 mb-4">
                Obecny status: <span className="font-medium">{statusNames[selectedOrder.status]}</span>
              </p>
            </div>

            {newStatus === 'cancelled' && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Powód odrzucenia:
                </label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  rows={3}
                  className="input"
                  placeholder="Podaj powód odrzucenia zamówienia..."
                />
              </div>
            )}

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setSelectedOrder(null)
                  setNewStatus('')
                  setRejectionReason('')
                }}
                className="btn btn-secondary"
              >
                Anuluj
              </button>
              <button
                onClick={handleStatusUpdate}
                disabled={newStatus === 'cancelled' && !rejectionReason}
                className="btn btn-primary disabled:opacity-50"
              >
                Potwierdź
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}