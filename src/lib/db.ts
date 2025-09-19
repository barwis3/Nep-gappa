// Mock database functions
import fs from 'fs'
import path from 'path'

const dataDir = path.join(process.cwd(), 'data')

function ensureDataDir() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }
}

function loadData(filename: string) {
  try {
    ensureDataDir()
    const filePath = path.join(dataDir, filename)
    if (!fs.existsSync(filePath)) {
      return {}
    }
    const data = fs.readFileSync(filePath, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    return {}
  }
}

function saveData(filename: string, data: any) {
  try {
    ensureDataDir()
    const filePath = path.join(dataDir, filename)
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2))
  } catch (error) {
    console.error('Error saving data:', error)
  }
}

// Initialize default data
function initializeData() {
  // Menu items
  const menuItems = loadData('menu.json')
  if (Object.keys(menuItems).length === 0) {
    const defaultMenu = {
      "dania-glowne": [
        {
          id: "kotlet-schabowy",
          name: "Kotlet schabowy z ziemniakami",
          description: "Klasyczny kotlet schabowy z gotowanymi ziemniakami i surówką",
          price: 28.50,
          category: "dania-glowne",
          available: true
        }
      ],
      "przystawki": [
        {
          id: "zurek-chlebku",
          name: "Żurek w chlebku",
          description: "Tradycyjny żurek podany w chlebku z kiełbasą i jajkiem",
          price: 18.90,
          category: "przystawki",
          available: true
        }
      ]
    }
    saveData('menu.json', defaultMenu)
  }

  // Orders
  const orders = loadData('orders.json')
  if (Object.keys(orders).length === 0) {
    saveData('orders.json', {})
  }

  // Availability
  const availability = loadData('availability.json')
  if (Object.keys(availability).length === 0) {
    // Initialize with some default availability data
    const today = new Date()
    const defaultAvailability: any = {}
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      const dateString = date.toISOString().split('T')[0]
      
      const timeSlots = [
        '09:00', '10:00', '11:00', '12:00', '13:00', '14:00',
        '15:00', '16:00', '17:00', '18:00', '19:00'
      ]
      
      defaultAvailability[dateString] = {
        id: `avail-${i}`,
        date: dateString,
        slots: JSON.stringify(timeSlots) // Store as JSON string for SQLite compatibility
      }
    }
    
    saveData('availability.json', defaultAvailability)
  }
}

export const db = {
  menuItem: {
    findMany: () => {
      initializeData()
      const menu = loadData('menu.json')
      const items: any[] = []
      Object.keys(menu).forEach(category => {
        if (Array.isArray(menu[category])) {
          items.push(...menu[category])
        }
      })
      return Promise.resolve(items)
    },
    create: ({ data }: any) => {
      initializeData()
      const menu = loadData('menu.json')
      if (!menu[data.category]) {
        menu[data.category] = []
      }
      const newItem = { ...data, id: Date.now().toString() }
      menu[data.category].push(newItem)
      saveData('menu.json', menu)
      return Promise.resolve(newItem)
    },
    createMany: ({ data }: any) => {
      initializeData()
      const menu = loadData('menu.json')
      let count = 0
      data.forEach((item: any) => {
        if (!menu[item.category]) {
          menu[item.category] = []
        }
        const newItem = { ...item, id: Date.now().toString() + count }
        menu[item.category].push(newItem)
        count++
      })
      saveData('menu.json', menu)
      return Promise.resolve({ count })
    },
    deleteMany: () => {
      initializeData()
      saveData('menu.json', {})
      return Promise.resolve({ count: 0 })
    }
  },
  order: {
    findMany: () => {
      initializeData()
      const orders = loadData('orders.json')
      return Promise.resolve(Object.values(orders))
    },
    findUnique: ({ where }: any) => {
      initializeData()
      const orders = loadData('orders.json')
      return Promise.resolve(orders[where.id])
    },
    create: ({ data }: any) => {
      initializeData()
      const orders = loadData('orders.json')
      const newOrder = { 
        ...data, 
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      orders[newOrder.id] = newOrder
      saveData('orders.json', orders)
      return Promise.resolve(newOrder)
    },
    update: ({ where, data }: any) => {
      initializeData()
      const orders = loadData('orders.json')
      if (orders[where.id]) {
        orders[where.id] = { ...orders[where.id], ...data, updatedAt: new Date().toISOString() }
        saveData('orders.json', orders)
        return Promise.resolve(orders[where.id])
      }
      throw new Error('Order not found')
    },
    deleteMany: () => {
      initializeData()
      saveData('orders.json', {})
      return Promise.resolve({ count: 0 })
    }
  },
  message: {
    findMany: ({ where }: any) => {
      const messages = loadData('messages.json')
      return Promise.resolve(messages[where.orderId] || [])
    },
    create: ({ data }: any) => {
      const messages = loadData('messages.json')
      if (!messages[data.orderId]) {
        messages[data.orderId] = []
      }
      const newMessage = { 
        ...data, 
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
      }
      messages[data.orderId].push(newMessage)
      saveData('messages.json', messages)
      return Promise.resolve(newMessage)
    },
    deleteMany: () => {
      saveData('messages.json', {})
      return Promise.resolve({ count: 0 })
    }
  },
  orderItem: {
    deleteMany: () => {
      saveData('orderitems.json', {})
      return Promise.resolve({ count: 0 })
    }
  },
  rating: {
    deleteMany: () => {
      saveData('ratings.json', {})
      return Promise.resolve({ count: 0 })
    }
  },
  availability: {
    findMany: () => {
      initializeData()
      const availability = loadData('availability.json')
      return Promise.resolve(Object.values(availability))
    },
    findUnique: ({ where }: any) => {
      initializeData()
      const availability = loadData('availability.json')
      return Promise.resolve(availability[where.date] || null)
    },
    create: ({ data }: any) => {
      initializeData()
      const availability = loadData('availability.json')
      const newAvailability = { 
        ...data, 
        id: Date.now().toString()
      }
      availability[data.date] = newAvailability
      saveData('availability.json', availability)
      return Promise.resolve(newAvailability)
    },
    update: ({ where, data }: any) => {
      initializeData()
      const availability = loadData('availability.json')
      const key = where.date || where.id
      if (availability[key]) {
        availability[key] = { ...availability[key], ...data }
        saveData('availability.json', availability)
        return Promise.resolve(availability[key])
      }
      throw new Error('Availability not found')
    },
    deleteMany: () => {
      initializeData()
      saveData('availability.json', {})
      return Promise.resolve({ count: 0 })
    }
  }
}

initializeData()