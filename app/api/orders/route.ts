import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { config } from '@/lib/config';
import { mockMenuItems, mockOrders, mockAvailability } from '@/lib/mockData';

const orderSchema = z.object({
  eventType: z.enum(['AGAPA', 'IMPREZA_OKOLICZNOSCIOWA']),
  dateTime: z.string().transform(str => new Date(str)),
  address: z.string().min(5, 'Adres jest wymagany'),
  peopleCount: z.number().int().min(1, 'Liczba osób musi być większa od 0'),
  community: z.string().min(2, 'Wspólnota jest wymagana'),
  parish: z.string().min(2, 'Parafia jest wymagana'),
  userName: z.string().min(2, 'Imię i nazwisko jest wymagane'),
  userEmail: z.string().email('Nieprawidłowy adres email'),
  userPhone: z.string().min(9, 'Nieprawidłowy numer telefonu'),
  items: z.array(z.object({
    menuItemId: z.string(),
    quantity: z.number().int().min(1, 'Ilość musi być większa od 0')
  })).min(1, 'Wybierz przynajmniej jedną pozycję z menu')
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = orderSchema.parse(body);

    // Validate minimum people count
    if (validatedData.peopleCount < config.minPeople) {
      return NextResponse.json(
        { error: `Minimalna liczba osób to ${config.minPeople}` },
        { status: 400 }
      );
    }

    // Try using Prisma first
    try {
      const { prisma } = await import('@/lib/prisma');
      
      // Validate date availability
      const dateOnly = validatedData.dateTime.toISOString().split('T')[0];
      const availability = await prisma.availability.findUnique({
        where: { date: new Date(dateOnly) }
      });

      if (!availability || !availability.isAvailable) {
        return NextResponse.json(
          { error: 'Wybrany termin nie jest dostępny' },
          { status: 400 }
        );
      }

      // Get menu items and calculate costs
      const menuItems = await prisma.menuItem.findMany({
        where: {
          id: { in: validatedData.items.map(item => item.menuItemId) },
          active: true
        }
      });

      if (menuItems.length !== validatedData.items.length) {
        return NextResponse.json(
          { error: 'Niektóre pozycje menu są niedostępne' },
          { status: 400 }
        );
      }

      // Calculate total cost
      let subtotalCents = 0;
      const orderItems = validatedData.items.map(item => {
        const menuItem = menuItems.find(mi => mi.id === item.menuItemId)!;
        const totalCents = menuItem.priceCents * item.quantity;
        subtotalCents += totalCents;

        return {
          menuItemId: item.menuItemId,
          quantity: item.quantity,
          unitCents: menuItem.priceCents,
          totalCents
        };
      });

      // Create order with items in a transaction
      const order = await prisma.order.create({
        data: {
          eventType: validatedData.eventType,
          dateTime: validatedData.dateTime,
          address: validatedData.address,
          peopleCount: validatedData.peopleCount,
          minPeople: config.minPeople,
          subtotalCents,
          community: validatedData.community,
          parish: validatedData.parish,
          userName: validatedData.userName,
          userEmail: validatedData.userEmail,
          userPhone: validatedData.userPhone,
          items: {
            create: orderItems
          }
        },
        include: {
          items: {
            include: {
              menuItem: true
            }
          }
        }
      });

      return NextResponse.json({ id: order.id });
    } catch (prismaError) {
      // Fall back to mock data if Prisma fails
      console.log('Using mock data for order creation');
      
      // Validate date availability with mock data
      const dateOnly = validatedData.dateTime.toISOString().split('T')[0];
      const isDateAvailable = mockAvailability.some(d => d.date === dateOnly);
      
      if (!isDateAvailable) {
        return NextResponse.json(
          { error: 'Wybrany termin nie jest dostępny' },
          { status: 400 }
        );
      }

      // Get menu items and calculate costs with mock data
      const menuItems = mockMenuItems.filter(item => 
        validatedData.items.some(orderItem => orderItem.menuItemId === item.id) && item.active
      );

      if (menuItems.length !== validatedData.items.length) {
        return NextResponse.json(
          { error: 'Niektóre pozycje menu są niedostępne' },
          { status: 400 }
        );
      }

      // Calculate total cost
      let subtotalCents = 0;
      const orderItems = validatedData.items.map(item => {
        const menuItem = menuItems.find(mi => mi.id === item.menuItemId)!;
        const totalCents = menuItem.priceCents * item.quantity;
        subtotalCents += totalCents;

        return {
          id: `item_${Date.now()}_${Math.random()}`,
          menuItemId: item.menuItemId,
          quantity: item.quantity,
          unitCents: menuItem.priceCents,
          totalCents,
          menuItem
        };
      });

      // Create mock order
      const orderId = `order_${Date.now()}`;
      const order = {
        id: orderId,
        createdAt: new Date(),
        updatedAt: new Date(),
        status: 'PENDING',
        statusReason: null,
        eventType: validatedData.eventType,
        dateTime: validatedData.dateTime,
        address: validatedData.address,
        peopleCount: validatedData.peopleCount,
        minPeople: config.minPeople,
        subtotalCents,
        community: validatedData.community,
        parish: validatedData.parish,
        userName: validatedData.userName,
        userEmail: validatedData.userEmail,
        userPhone: validatedData.userPhone,
        items: orderItems,
        messages: [],
        rating: null
      };

      // Store in mock storage
      mockOrders[orderId] = order;

      return NextResponse.json({ id: orderId });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Nieprawidłowe dane', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Nie udało się złożyć zamówienia' },
      { status: 500 }
    );
  }
}