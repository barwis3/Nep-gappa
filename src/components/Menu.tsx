'use client'

import { useEffect, useState } from 'react'

interface MenuItem {
  id: string
  name: string
  description?: string
  price: number
  category: string
  available: boolean
}

export function Menu() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [cart, setCart] = useState<Record<string, number>>({})

  useEffect(() => {
    fetchMenu()
  }, [])

  const fetchMenu = async () => {
    try {
      const response = await fetch('/api/menu')
      const items = await response.json()
      setMenuItems(items)
    } catch (error) {
      console.error('Error fetching menu:', error)
    }
  }

  const addToCart = (itemId: string) => {
    setCart(prev => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1
    }))
  }

  const removeFromCart = (itemId: string) => {
    setCart(prev => {
      const newCart = { ...prev }
      if (newCart[itemId] > 1) {
        newCart[itemId]--
      } else {
        delete newCart[itemId]
      }
      return newCart
    })
  }

  // Group items by category
  const groupedItems = menuItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = []
    }
    acc[item.category].push(item)
    return acc
  }, {} as Record<string, MenuItem[]>)

  const categoryNames: Record<string, string> = {
    'dania-glowne': 'Dania główne',
    'przystawki': 'Przystawki',
    'desery': 'Desery',
    'napoje': 'Napoje'
  }

  if (menuItems.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Ładowanie menu...</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {Object.entries(groupedItems).map(([category, items]) => (
        <div key={category}>
          <h3 className="text-xl font-semibold text-brand mb-4">
            {categoryNames[category] || category}
          </h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <div key={item.id} className="card">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-semibold text-gray-800">{item.name}</h4>
                  <span className="text-brand font-bold">{item.price.toFixed(2)} zł</span>
                </div>
                {item.description && (
                  <p className="text-gray-600 text-sm mb-4">{item.description}</p>
                )}
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => removeFromCart(item.id)}
                      disabled={!cart[item.id]}
                      className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      −
                    </button>
                    <span className="w-8 text-center font-medium">
                      {cart[item.id] || 0}
                    </span>
                    <button
                      onClick={() => addToCart(item.id)}
                      className="w-8 h-8 rounded-full bg-brand hover:bg-brand-700 text-white flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                  
                  {cart[item.id] && (
                    <span className="text-sm font-medium text-gray-700">
                      {(item.price * cart[item.id]).toFixed(2)} zł
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
      
      {/* Cart Summary */}
      {Object.keys(cart).length > 0 && (
        <div className="sticky bottom-4 bg-white rounded-lg shadow-lg border p-4">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="font-semibold">Twój koszyk</h4>
              <p className="text-sm text-gray-600">
                {Object.values(cart).reduce((sum, qty) => sum + qty, 0)} pozycji
              </p>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-brand">
                {Object.entries(cart).reduce((total, [itemId, qty]) => {
                  const item = menuItems.find(i => i.id === itemId)
                  return total + (item?.price || 0) * qty
                }, 0).toFixed(2)} zł
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}