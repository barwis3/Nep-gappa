'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const EVENT_TYPES = [
  'Wesele',
  'Komunia',
  'Chrzciny',
  'Urodziny',
  'Spotkanie firmowe',
  'Inne'
]

const COMMUNITIES = [
  'Stare Miasto',
  'Mokotów',
  'Wola', 
  'Praga',
  'Ursynów',
  'Wilanów',
  'Inne'
]

const PARISHES = [
  'Parafia św. Jana',
  'Parafia św. Marii',
  'Parafia św. Pawła',
  'Parafia św. Anny',
  'Inne'
]

export function OrderForm() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    eventType: '',
    deliveryDate: '',
    deliveryTime: '',
    address: '',
    peopleCount: '',
    community: '',
    parish: '',
    notes: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const maxPeople = parseInt(process.env.NEXT_PUBLIC_MAX_PEOPLE_COUNT || '50')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const { orderId } = await response.json()
        router.push(`/order/${orderId}`)
      } else {
        alert('Błąd podczas składania zamówienia')
      }
    } catch (error) {
      console.error('Error submitting order:', error)
      alert('Błąd podczas składania zamówienia')
    } finally {
      setIsSubmitting(false)
    }
  }

  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const minDate = tomorrow.toISOString().split('T')[0]

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="card space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 mb-1">
              Imię i nazwisko *
            </label>
            <input
              type="text"
              id="customerName"
              name="customerName"
              required
              value={formData.customerName}
              onChange={handleChange}
              className="input"
              placeholder="Jan Kowalski"
            />
          </div>

          <div>
            <label htmlFor="customerEmail" className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              id="customerEmail"
              name="customerEmail"
              required
              value={formData.customerEmail}
              onChange={handleChange}
              className="input"
              placeholder="jan@example.com"
            />
          </div>

          <div>
            <label htmlFor="customerPhone" className="block text-sm font-medium text-gray-700 mb-1">
              Telefon *
            </label>
            <input
              type="tel"
              id="customerPhone"
              name="customerPhone"
              required
              value={formData.customerPhone}
              onChange={handleChange}
              className="input"
              placeholder="+48 123 456 789"
            />
          </div>

          <div>
            <label htmlFor="eventType" className="block text-sm font-medium text-gray-700 mb-1">
              Rodzaj wydarzenia *
            </label>
            <select
              id="eventType"
              name="eventType"
              required
              value={formData.eventType}
              onChange={handleChange}
              className="input"
            >
              <option value="">Wybierz rodzaj wydarzenia</option>
              {EVENT_TYPES.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="deliveryDate" className="block text-sm font-medium text-gray-700 mb-1">
              Data dostawy *
            </label>
            <input
              type="date"
              id="deliveryDate"
              name="deliveryDate"
              required
              min={minDate}
              value={formData.deliveryDate}
              onChange={handleChange}
              className="input"
            />
          </div>

          <div>
            <label htmlFor="deliveryTime" className="block text-sm font-medium text-gray-700 mb-1">
              Godzina dostawy *
            </label>
            <input
              type="time"
              id="deliveryTime"
              name="deliveryTime"
              required
              value={formData.deliveryTime}
              onChange={handleChange}
              className="input"
            />
          </div>

          <div>
            <label htmlFor="peopleCount" className="block text-sm font-medium text-gray-700 mb-1">
              Liczba osób * (max {maxPeople})
            </label>
            <input
              type="number"
              id="peopleCount"
              name="peopleCount"
              required
              min="1"
              max={maxPeople}
              value={formData.peopleCount}
              onChange={handleChange}
              className="input"
            />
          </div>

          <div>
            <label htmlFor="community" className="block text-sm font-medium text-gray-700 mb-1">
              Wspólnota
            </label>
            <select
              id="community"
              name="community"
              value={formData.community}
              onChange={handleChange}
              className="input"
            >
              <option value="">Wybierz wspólnotę</option>
              {COMMUNITIES.map((community) => (
                <option key={community} value={community}>{community}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="parish" className="block text-sm font-medium text-gray-700 mb-1">
              Parafia
            </label>
            <select
              id="parish"
              name="parish"
              value={formData.parish}
              onChange={handleChange}
              className="input"
            >
              <option value="">Wybierz parafię</option>
              {PARISHES.map((parish) => (
                <option key={parish} value={parish}>{parish}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
            Adres dostawy *
          </label>
          <textarea
            id="address"
            name="address"
            required
            rows={3}
            value={formData.address}
            onChange={handleChange}
            className="input"
            placeholder="ul. Przykładowa 123, 00-000 Warszawa"
          />
        </div>

        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
            Uwagi do zamówienia
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={3}
            value={formData.notes}
            onChange={handleChange}
            className="input"
            placeholder="Dodatkowe uwagi lub specjalne życzenia..."
          />
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full btn btn-primary py-3 text-lg font-semibold disabled:opacity-50"
          >
            {isSubmitting ? 'Składanie zamówienia...' : 'Złóż zamówienie'}
          </button>
        </div>
      </form>
    </div>
  )
}