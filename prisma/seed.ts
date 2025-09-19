import fs from 'fs'
import path from 'path'

const dataDir = path.join(process.cwd(), 'data')

function ensureDataDir() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }
}

function saveData(filename: string, data: any) {
  ensureDataDir()
  const filePath = path.join(dataDir, filename)
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2))
}

async function main() {
  console.log('🌱 Seeding database...')
  
  // Seed menu items
  const menuData = {
    "dania-glowne": [
      {
        id: "kotlet-schabowy",
        name: "Kotlet schabowy z ziemniakami",
        description: "Klasyczny kotlet schabowy z gotowanymi ziemniakami i surówką",
        price: 28.50,
        category: "dania-glowne",
        available: true
      },
      {
        id: "pierogi-ruskie",
        name: "Pierogi ruskie",
        description: "Domowe pierogi z ziemniakami i serem",
        price: 22.00,
        category: "dania-glowne",
        available: true
      },
      {
        id: "gulasz-wieprzowy",
        name: "Gulasz wieprzowy",
        description: "Gulasz z wieprzowiny z kluskami śląskimi",
        price: 26.90,
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
      },
      {
        id: "rosol-kurczak",
        name: "Rosół z kurczaka",
        description: "Domowy rosół z makaronem i warzywami",
        price: 15.50,
        category: "przystawki",
        available: true
      }
    ],
    "desery": [
      {
        id: "sernik-jagody",
        name: "Sernik z jagodami",
        description: "Domowy sernik na kruchym spodzie z jagodami",
        price: 12.90,
        category: "desery",
        available: true
      },
      {
        id: "szarlotka",
        name: "Szarlotka",
        description: "Tradycyjna szarlotka z bitą śmietaną",
        price: 11.50,
        category: "desery",
        available: true
      }
    ],
    "napoje": [
      {
        id: "kompot-owocowy",
        name: "Kompot owocowy",
        description: "Domowy kompot z owoców sezonowych",
        price: 8.00,
        category: "napoje",
        available: true
      },
      {
        id: "herbata-kawa",
        name: "Herbata lub kawa",
        description: "Wybór herbaty lub kawy",
        price: 6.50,
        category: "napoje",
        available: true
      }
    ]
  }
  
  saveData('menu.json', menuData)
  console.log('✅ Menu seeded')
  
  // Seed sample orders
  const ordersData = {
    "sample-order-1": {
      id: "sample-order-1",
      customerName: "Jan Kowalski",
      customerEmail: "jan.kowalski@example.com",
      customerPhone: "+48 123 456 789",
      eventType: "Wesele",
      deliveryDate: "2024-10-15",
      deliveryTime: "14:00",
      address: "ul. Testowa 123, 00-000 Warszawa",
      peopleCount: 25,
      community: "Stare Miasto",
      parish: "Parafia św. Jana",
      notes: "Proszę o dostawę punktualnie o 14:00",
      status: "pending",
      total: 428.50,
      createdAt: "2024-09-19T10:30:00.000Z",
      updatedAt: "2024-09-19T10:30:00.000Z"
    },
    "sample-order-2": {
      id: "sample-order-2",
      customerName: "Anna Nowak",
      customerEmail: "anna.nowak@example.com",
      customerPhone: "+48 987 654 321",
      eventType: "Komunia",
      deliveryDate: "2024-10-20",
      deliveryTime: "12:30",
      address: "ul. Przykładowa 456, 00-000 Warszawa",
      peopleCount: 15,
      community: "Mokotów",
      parish: "Parafia św. Marii",
      notes: "",
      status: "accepted",
      total: 342.50,
      createdAt: "2024-09-18T15:20:00.000Z",
      updatedAt: "2024-09-19T09:15:00.000Z"
    }
  }
  
  saveData('orders.json', ordersData)
  console.log('✅ Sample orders seeded')
  
  // Initialize empty messages
  saveData('messages.json', {})
  console.log('✅ Messages storage initialized')
  
  console.log('🎉 Database seeding completed!')
}

main().catch(console.error)