import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { mockOrders } from '@/lib/mockData';
import { 
  sendOrderAcceptedEmail, 
  sendOrderRejectedEmail, 
  sendOrderInDeliveryEmail, 
  sendOrderDeliveredEmail 
} from '@/lib/email';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Try using Prisma first
    try {
      const { prisma } = await import('@/lib/prisma');
      const order = await prisma.order.findUnique({
        where: { id: params.id },
        include: {
          items: {
            include: {
              menuItem: true
            }
          },
          messages: {
            orderBy: { createdAt: 'asc' }
          },
          rating: true
        }
      });

      if (!order) {
        return NextResponse.json(
          { error: 'Zamówienie nie zostało znalezione' },
          { status: 404 }
        );
      }

      return NextResponse.json(order);
    } catch (prismaError) {
      // Fall back to mock data if Prisma fails
      console.log('Using mock data for order detail');
      const order = mockOrders[params.id];
      
      if (!order) {
        return NextResponse.json(
          { error: 'Zamówienie nie zostało znalezione' },
          { status: 404 }
        );
      }

      return NextResponse.json(order);
    }
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { error: 'Nie udało się pobrać zamówienia' },
      { status: 500 }
    );
  }
}

const updateOrderSchema = z.object({
  status: z.enum(['PENDING', 'ACCEPTED', 'REJECTED', 'IN_DELIVERY', 'DELIVERED']),
  statusReason: z.string().optional()
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { status, statusReason } = updateOrderSchema.parse(body);

    // Try using Prisma first
    try {
      const { prisma } = await import('@/lib/prisma');
      
      // Find the existing order
      const existingOrder = await prisma.order.findUnique({
        where: { id: params.id }
      });

      if (!existingOrder) {
        return NextResponse.json(
          { error: 'Zamówienie nie zostało znalezione' },
          { status: 404 }
        );
      }

      // Update the order
      const updatedOrder = await prisma.order.update({
        where: { id: params.id },
        data: {
          status,
          statusReason: status === 'REJECTED' ? statusReason : undefined,
          updatedAt: new Date()
        }
      });

      // Send appropriate email based on status
      switch (status) {
        case 'ACCEPTED':
          await sendOrderAcceptedEmail(existingOrder.userEmail, existingOrder.id);
          break;
        case 'REJECTED':
          if (statusReason) {
            await sendOrderRejectedEmail(existingOrder.userEmail, existingOrder.id, statusReason);
          }
          break;
        case 'IN_DELIVERY':
          await sendOrderInDeliveryEmail(existingOrder.userEmail, existingOrder.id);
          break;
        case 'DELIVERED':
          await sendOrderDeliveredEmail(existingOrder.userEmail, existingOrder.id);
          break;
      }

      return NextResponse.json(updatedOrder);
    } catch (prismaError) {
      // Fall back to mock data if Prisma fails
      console.log('Using mock data for order update');
      const existingOrder = mockOrders[params.id];
      
      if (!existingOrder) {
        return NextResponse.json(
          { error: 'Zamówienie nie zostało znalezione' },
          { status: 404 }
        );
      }

      // Update the mock order
      existingOrder.status = status;
      existingOrder.statusReason = status === 'REJECTED' ? statusReason : undefined;
      existingOrder.updatedAt = new Date();

      // Send appropriate email based on status
      switch (status) {
        case 'ACCEPTED':
          await sendOrderAcceptedEmail(existingOrder.userEmail, existingOrder.id);
          break;
        case 'REJECTED':
          if (statusReason) {
            await sendOrderRejectedEmail(existingOrder.userEmail, existingOrder.id, statusReason);
          }
          break;
        case 'IN_DELIVERY':
          await sendOrderInDeliveryEmail(existingOrder.userEmail, existingOrder.id);
          break;
        case 'DELIVERED':
          await sendOrderDeliveredEmail(existingOrder.userEmail, existingOrder.id);
          break;
      }

      return NextResponse.json(existingOrder);
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Nieprawidłowe dane', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error updating order:', error);
    return NextResponse.json(
      { error: 'Nie udało się zaktualizować zamówienia' },
      { status: 500 }
    );
  }
}