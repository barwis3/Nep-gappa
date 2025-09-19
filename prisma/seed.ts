import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create menu items
  await prisma.menuItem.createMany({
    data: [
      // Starters
      {
        name: 'Żurek staropolski',
        description: 'Tradycyjny żurek z białą kiełbasą, jajkiem i marynowanymi ogórkami',
        priceCents: 1800, // 18 PLN
        category: 'starter',
      },
      {
        name: 'Rosół z makaronem',
        description: 'Domowy rosół z kurczaka z makaronem i jarzynami',
        priceCents: 1500, // 15 PLN
        category: 'starter',
      },
      {
        name: 'Krem z pieczarek',
        description: 'Delikatny krem z pieczarek podany z grzankami',
        priceCents: 1600, // 16 PLN
        category: 'starter',
      },

      // Main dishes
      {
        name: 'Schabowy z kapustą i ziemniakami',
        description: 'Klasyczny schabowy z kapustą zasmażaną i ziemniakami',
        priceCents: 2800, // 28 PLN
        category: 'main',
      },
      {
        name: 'Pierogi ruskie',
        description: 'Domowe pierogi z twarogiem i ziemniakami, podane ze skwarkami',
        priceCents: 2400, // 24 PLN
        category: 'main',
      },
      {
        name: 'Gulasz węgierski z kluskami',
        description: 'Aromatyczny gulasz wołowy z papryką i kluskami śląskimi',
        priceCents: 3200, // 32 PLN
        category: 'main',
      },
      {
        name: 'Kotlet de volaille',
        description: 'Kotlet z piersi kurczaka nadziewany masłem ziołowym',
        priceCents: 2900, // 29 PLN
        category: 'main',
      },
      {
        name: 'Ryba w sosie koperkowym',
        description: 'Filet z dorsza w delikatnym sosie koperkowym z ziemniakami',
        priceCents: 2600, // 26 PLN
        category: 'main',
      },

      // Desserts
      {
        name: 'Sernik na zimno',
        description: 'Kremowy sernik na zimno z owocami sezonowymi',
        priceCents: 1400, // 14 PLN
        category: 'dessert',
      },
      {
        name: 'Szarlotka z lodami',
        description: 'Tradycyjna szarlotka podana z lodami waniliowymi',
        priceCents: 1300, // 13 PLN
        category: 'dessert',
      },
      {
        name: 'Makowiec',
        description: 'Domowy makowiec z lukrem i orzechami',
        priceCents: 1200, // 12 PLN
        category: 'dessert',
      },

      // Drinks
      {
        name: 'Kompot z owoców sezonowych',
        description: 'Domowy kompot z świeżych owoców sezonowych',
        priceCents: 800, // 8 PLN
        category: 'drink',
      },
      {
        name: 'Sok jabłkowy',
        description: '100% naturalny sok jabłkowy',
        priceCents: 900, // 9 PLN
        category: 'drink',
      },
      {
        name: 'Herbata/Kawa',
        description: 'Wybór herbat lub kawa świeżo parzona',
        priceCents: 600, // 6 PLN
        category: 'drink',
      },
      {
        name: 'Woda mineralna',
        description: 'Woda mineralna niegazowana lub gazowana',
        priceCents: 500, // 5 PLN
        category: 'drink',
      },
    ],
  });

  // Create some availability dates (next 35 days with some unavailable days)
  const today = new Date();
  for (let i = 0; i < 35; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    
    // Make some days unavailable (randomly)
    const isAvailable = Math.random() > 0.2; // 80% chance of being available
    
    await prisma.availability.create({
      data: {
        date: date,
        isAvailable: isAvailable,
        note: !isAvailable ? 'Dzień niedostępny' : undefined,
      },
    });
  }

  console.log('Database seeded successfully!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });