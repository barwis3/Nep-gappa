import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { mockOrders, mockMessages } from '@/lib/mockData';

const messageSchema = z.object({
  orderId: z.string(),
  sender: z.enum(['USER', 'ADMIN']),
  body: z.string().min(1, 'Wiadomość nie może być pusta').max(500, 'Wiadomość jest za długa')
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, sender, body: messageBody } = messageSchema.parse(body);

    // Try using Prisma first
    try {
      const { prisma } = await import('@/lib/prisma');
      
      // Verify that the order exists
      const order = await prisma.order.findUnique({
        where: { id: orderId }
      });

      if (!order) {
        return NextResponse.json(
          { error: 'Zamówienie nie zostało znalezione' },
          { status: 404 }
        );
      }

      const message = await prisma.message.create({
        data: {
          orderId,
          sender,
          body: messageBody
        }
      });

      return NextResponse.json(message);
    } catch (prismaError) {
      // Fall back to mock data if Prisma fails
      console.log('Using mock data for message creation');
      
      // Verify that the order exists in mock data
      const order = mockOrders[orderId];
      if (!order) {
        return NextResponse.json(
          { error: 'Zamówienie nie zostało znalezione' },
          { status: 404 }
        );
      }

      const message = {
        id: `message_${Date.now()}_${Math.random()}`,
        orderId,
        sender,
        body: messageBody,
        createdAt: new Date().toISOString()
      };

      // Initialize messages array if it doesn't exist
      if (!mockMessages[orderId]) {
        mockMessages[orderId] = [];
      }
      
      // Add message to mock storage
      mockMessages[orderId].push(message);
      
      // Also add to order's messages array
      if (!order.messages) {
        order.messages = [];
      }
      order.messages.push(message);

      return NextResponse.json(message);
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Nieprawidłowe dane', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error creating message:', error);
    return NextResponse.json(
      { error: 'Nie udało się wysłać wiadomości' },
      { status: 500 }
    );
  }
}