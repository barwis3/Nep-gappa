// Mock data for development/testing when Prisma is not available

export const mockMenuItems = [
  // Starters
  {
    id: '1',
    name: 'Żurek staropolski',
    description: 'Tradycyjny żurek z białą kiełbasą, jajkiem i marynowanymi ogórkami',
    priceCents: 1800, // 18 PLN
    category: 'starter',
    active: true,
  },
  {
    id: '2',
    name: 'Rosół z makaronem',
    description: 'Domowy rosół z kurczaka z makaronem i jarzynami',
    priceCents: 1500, // 15 PLN
    category: 'starter',
    active: true,
  },
  {
    id: '3',
    name: 'Krem z pieczarek',
    description: 'Delikatny krem z pieczarek podany z grzankami',
    priceCents: 1600, // 16 PLN
    category: 'starter',
    active: true,
  },

  // Main dishes
  {
    id: '4',
    name: 'Schabowy z kapustą i ziemniakami',
    description: 'Klasyczny schabowy z kapustą zasmażaną i ziemniakami',
    priceCents: 2800, // 28 PLN
    category: 'main',
    active: true,
  },
  {
    id: '5',
    name: 'Pierogi ruskie',
    description: 'Domowe pierogi z twarogiem i ziemniakami, podane ze skwarkami',
    priceCents: 2400, // 24 PLN
    category: 'main',
    active: true,
  },
  {
    id: '6',
    name: 'Gulasz węgierski z kluskami',
    description: 'Aromatyczny gulasz wołowy z papryką i kluskami śląskimi',
    priceCents: 3200, // 32 PLN
    category: 'main',
    active: true,
  },
  {
    id: '7',
    name: 'Kotlet de volaille',
    description: 'Kotlet z piersi kurczaka nadziewany masłem ziołowym',
    priceCents: 2900, // 29 PLN
    category: 'main',
    active: true,
  },
  {
    id: '8',
    name: 'Ryba w sosie koperkowym',
    description: 'Filet z dorsza w delikatnym sosie koperkowym z ziemniakami',
    priceCents: 2600, // 26 PLN
    category: 'main',
    active: true,
  },

  // Desserts
  {
    id: '9',
    name: 'Sernik na zimno',
    description: 'Kremowy sernik na zimno z owocami sezonowymi',
    priceCents: 1400, // 14 PLN
    category: 'dessert',
    active: true,
  },
  {
    id: '10',
    name: 'Szarlotka z lodami',
    description: 'Tradycyjna szarlotka podana z lodami waniliowymi',
    priceCents: 1300, // 13 PLN
    category: 'dessert',
    active: true,
  },
  {
    id: '11',
    name: 'Makowiec',
    description: 'Domowy makowiec z lukrem i orzechami',
    priceCents: 1200, // 12 PLN
    category: 'dessert',
    active: true,
  },

  // Drinks
  {
    id: '12',
    name: 'Kompot z owoców sezonowych',
    description: 'Domowy kompot z świeżych owoców sezonowych',
    priceCents: 800, // 8 PLN
    category: 'drink',
    active: true,
  },
  {
    id: '13',
    name: 'Sok jabłkowy',
    description: '100% naturalny sok jabłkowy',
    priceCents: 900, // 9 PLN
    category: 'drink',
    active: true,
  },
  {
    id: '14',
    name: 'Herbata/Kawa',
    description: 'Wybór herbat lub kawa świeżo parzona',
    priceCents: 600, // 6 PLN
    category: 'drink',
    active: true,
  },
  {
    id: '15',
    name: 'Woda mineralna',
    description: 'Woda mineralna niegazowana lub gazowana',
    priceCents: 500, // 5 PLN
    category: 'drink',
    active: true,
  },
];

export const mockAvailability = (() => {
  const dates = [];
  const today = new Date();
  for (let i = 0; i < 35; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    
    // Make some days unavailable (randomly)
    const isAvailable = Math.random() > 0.2; // 80% chance of being available
    
    if (isAvailable) {
      dates.push({
        date: date.toISOString().split('T')[0],
        note: undefined,
      });
    }
  }
  return dates;
})();

// In-memory storage for orders and messages
export const mockOrders: Record<string, any> = {};
export const mockMessages: Record<string, any[]> = {};
export const mockRatings: Record<string, any> = {};