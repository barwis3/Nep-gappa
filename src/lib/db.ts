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
    create: (data: any) => {
      initializeData()
      const menu = loadData('menu.json')
      if (!menu[data.category]) {
        menu[data.category] = []
      }
      const newItem = { ...data, id: Date.now().toString() }
      menu[data.category].push(newItem)
      saveData('menu.json', menu)
      return Promise.resolve(newItem)
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
    }
  }
}

initializeData()