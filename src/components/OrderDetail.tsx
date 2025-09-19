'use client'

import { useState, useEffect } from 'react'

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

interface Message {
  id: string
  content: string
  isAdmin: boolean
  createdAt: string
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

export function OrderDetail({ order: initialOrder }: { order: Order }) {
  const [order, setOrder] = useState(initialOrder)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [showRatingForm, setShowRatingForm] = useState(false)

  useEffect(() => {
    fetchMessages()
    
    // Show rating form if order is delivered and no rating exists
    if (order.status === 'delivered') {
      setShowRatingForm(true)
    }
  }, [order.id, order.status])

  const fetchMessages = async () => {
    try {
      const response = await fetch(`/api/orders/${order.id}/messages`)
      if (response.ok) {
        const data = await response.json()
        setMessages(data)
      }
    } catch (error) {
      console.error('Error fetching messages:', error)
    }
  }

  const sendMessage = async () => {
    if (!newMessage.trim()) return

    try {
      const response = await fetch(`/api/orders/${order.id}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: newMessage }),
      })

      if (response.ok) {
        setNewMessage('')
        fetchMessages()
      }
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }

  const submitRating = async () => {
    if (rating === 0) return

    try {
      const response = await fetch(`/api/orders/${order.id}/rating`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rating, comment }),
      })

      if (response.ok) {
        setShowRatingForm(false)
        alert('Dziękujemy za ocenę!')
      }
    } catch (error) {
      console.error('Error submitting rating:', error)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Order Header */}
      <div className="card">
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-2xl font-bold text-gray-800">
            Zamówienie #{order.id.slice(-8)}
          </h1>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[order.status]}`}>
            {statusNames[order.status]}
          </span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p><strong>Klient:</strong> {order.customerName}</p>
            <p><strong>Email:</strong> {order.customerEmail}</p>
            <p><strong>Telefon:</strong> {order.customerPhone}</p>
            <p><strong>Wydarzenie:</strong> {order.eventType}</p>
          </div>
          <div>
            <p><strong>Data dostawy:</strong> {order.deliveryDate} o {order.deliveryTime}</p>
            <p><strong>Liczba osób:</strong> {order.peopleCount}</p>
            {order.community && <p><strong>Wspólnota:</strong> {order.community}</p>}
            {order.parish && <p><strong>Parafia:</strong> {order.parish}</p>}
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t">
          <p><strong>Adres dostawy:</strong></p>
          <p className="text-gray-700">{order.address}</p>
        </div>
        
        {order.notes && (
          <div className="mt-4 pt-4 border-t">
            <p><strong>Uwagi:</strong></p>
            <p className="text-gray-700">{order.notes}</p>
          </div>
        )}
        
        {order.rejectionReason && (
          <div className="mt-4 pt-4 border-t border-red-200 bg-red-50 p-4 rounded">
            <p className="text-red-800"><strong>Powód odrzucenia:</strong></p>
            <p className="text-red-700">{order.rejectionReason}</p>
          </div>
        )}
        
        <div className="mt-4 pt-4 border-t flex justify-between items-center">
          <span className="text-sm text-gray-500">
            Zamówiono: {new Date(order.createdAt).toLocaleString('pl-PL')}
          </span>
          <span className="text-xl font-bold text-brand">
            Razem: {order.total.toFixed(2)} zł
          </span>
        </div>
      </div>

      {/* Chat Section */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Czat z obsługą</h2>
        
        <div className="space-y-3 mb-4 max-h-96 overflow-y-auto">
          {messages.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Brak wiadomości</p>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isAdmin ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg ${
                    message.isAdmin
                      ? 'bg-gray-100 text-gray-800'
                      : 'bg-brand text-white'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <p className={`text-xs mt-1 ${message.isAdmin ? 'text-gray-500' : 'text-brand-100'}`}>
                    {new Date(message.createdAt).toLocaleString('pl-PL')}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
        
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Napisz wiadomość..."
            className="flex-1 input"
          />
          <button onClick={sendMessage} className="btn btn-primary">
            Wyślij
          </button>
        </div>
      </div>

      {/* Rating Section */}
      {showRatingForm && (
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Oceń nasze usługi</h2>
          
          <div className="space-y-4">
            <div>
              <p className="mb-2">Ocena:</p>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className={`text-2xl ${
                      star <= rating ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                  >
                    ⭐
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Opcjonalny komentarz..."
                rows={3}
                className="input"
              />
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={submitRating}
                disabled={rating === 0}
                className="btn btn-primary disabled:opacity-50"
              >
                Wyślij ocenę
              </button>
              <button
                onClick={() => setShowRatingForm(false)}
                className="btn btn-secondary"
              >
                Później
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}