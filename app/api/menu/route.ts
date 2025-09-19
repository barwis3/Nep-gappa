import { NextResponse } from 'next/server';
import { mockMenuItems } from '@/lib/mockData';

export async function GET() {
  try {
    // Try using Prisma first
    try {
      const { prisma } = await import('@/lib/prisma');
      const menuItems = await prisma.menuItem.findMany({
        where: { active: true },
        orderBy: [
          { category: 'asc' },
          { name: 'asc' }
        ]
      });
      return NextResponse.json(menuItems);
    } catch (prismaError) {
      // Fall back to mock data if Prisma fails
      console.log('Using mock data for menu items');
      return NextResponse.json(mockMenuItems.filter(item => item.active));
    }
  } catch (error) {
    console.error('Error fetching menu items:', error);
    return NextResponse.json(
      { error: 'Nie udało się pobrać menu' },
      { status: 500 }
    );
  }
}