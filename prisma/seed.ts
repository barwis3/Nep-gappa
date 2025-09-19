import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Clear existing data
  await prisma.availability.deleteMany()
  await prisma.orderItem.deleteMany()
  await prisma.message.deleteMany()
  await prisma.rating.deleteMany()
  await prisma.order.deleteMany()
  await prisma.menuItem.deleteMany()

  console.log('🧹 Cleared existing data')

  // Seed menu items
  const menuItems = await prisma.menuItem.createMany({
    data: [
      {
        name: 'Kotlet schabowy z ziemniakami',
        description: 'Klasyczny kotlet schabowy z gotowanymi ziemniakami i surówką',
        price: 28.50,
        category: 'dania-glowne',
        available: true
      },
      {
        name: 'Żurek w chlebku',
        description: 'Tradycyjny żurek podany w chlebku z kiełbasą i jajkiem',
        price: 18.90,
        category: 'przystawki',
        available: true
      },
      {
        name: 'Sernik na zimno',
        description: 'Delikatny sernik z owocami leśnymi',
        price: 12.50,
        category: 'desery',
        available: true
      },
      {
        name: 'Kompot z owoców',
        description: 'Domowy kompot z sezonowych owoców',
        price: 4.50,
        category: 'napoje',
        available: true
      }
    ]
  })

  console.log(`🍴 Created ${menuItems.count} menu items`)

  // Seed availability data with JSON.stringify for slots
  const today = new Date()
  const availabilities = []

  for (let i = 0; i < 7; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() + i)
    const dateString = date.toISOString().split('T')[0]

    // Define available time slots for each day
    const timeSlots = [
      '09:00', '10:00', '11:00', '12:00', '13:00', '14:00',
      '15:00', '16:00', '17:00', '18:00', '19:00'
    ]

    availabilities.push({
      date: dateString,
      slots: JSON.stringify(timeSlots) // Convert array to JSON string for SQLite
    })
  }

  const createdAvailabilities = await prisma.availability.createMany({
    data: availabilities
  })

  console.log(`📅 Created ${createdAvailabilities.count} availability records`)

  console.log('✅ Seeding completed!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })