import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

const ratingSchema = z.object({
  orderId: z.string(),
  stars: z.number().int().min(1, 'Ocena musi być co najmniej 1').max(5, 'Ocena może być maksymalnie 5'),
  comment: z.string().optional()
});

const adminReplySchema = z.object({
  orderId: z.string(),
  adminReply: z.string().min(1, 'Odpowiedź nie może być pusta')
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Check if this is an admin reply
    if ('adminReply' in body) {
      const { orderId, adminReply } = adminReplySchema.parse(body);
      
      // Update existing rating with admin reply
      const updatedRating = await prisma.rating.update({
        where: { orderId },
        data: { adminReply }
      });
      
      return NextResponse.json(updatedRating);
    } else {
      // Create or update rating
      const { orderId, stars, comment } = ratingSchema.parse(body);

      // Verify that the order exists and is delivered
      const order = await prisma.order.findUnique({
        where: { id: orderId }
      });

      if (!order) {
        return NextResponse.json(
          { error: 'Zamówienie nie zostało znalezione' },
          { status: 404 }
        );
      }

      if (order.status !== 'DELIVERED') {
        return NextResponse.json(
          { error: 'Można ocenić tylko dostarczone zamówienia' },
          { status: 400 }
        );
      }

      // Create or update rating
      const rating = await prisma.rating.upsert({
        where: { orderId },
        update: { stars, comment },
        create: {
          orderId,
          stars,
          comment
        }
      });

      return NextResponse.json(rating);
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Nieprawidłowe dane', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error handling rating:', error);
    return NextResponse.json(
      { error: 'Nie udało się zapisać oceny' },
      { status: 500 }
    );
  }
}