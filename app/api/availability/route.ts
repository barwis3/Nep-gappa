import { NextResponse } from 'next/server';
import { mockAvailability } from '@/lib/mockData';

export async function GET() {
  try {
    // Try using Prisma first
    try {
      const { prisma } = await import('@/lib/prisma');
      const availability = await prisma.availability.findMany({
        where: { isAvailable: true },
        orderBy: { date: 'asc' }
      });

      // Format dates as YYYY-MM-DD
      const formattedAvailability = availability.map(item => ({
        date: item.date.toISOString().split('T')[0],
        note: item.note
      }));

      return NextResponse.json(formattedAvailability);
    } catch (prismaError) {
      // Fall back to mock data if Prisma fails
      console.log('Using mock data for availability');
      return NextResponse.json(mockAvailability);
    }
  } catch (error) {
    console.error('Error fetching availability:', error);
    return NextResponse.json(
      { error: 'Nie udało się pobrać dostępności' },
      { status: 500 }
    );
  }
}