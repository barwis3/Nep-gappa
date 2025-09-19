import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { sendOrderConfirmation, sendAdminNotification } from '@/lib/email'

export async function GET() {
  try {
    const orders = await db.order.findMany()
    return NextResponse.json(orders)
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.json()
    
    const orderData = {
      ...formData,
      peopleCount: parseInt(formData.peopleCount),
      status: 'pending',
      total: 0 // Will be calculated based on menu items
    }
    
    const newOrder = await db.order.create({ data: orderData })
    
    // Send confirmation emails
    await sendOrderConfirmation(newOrder)
    await sendAdminNotification(newOrder)
    
    return NextResponse.json({ orderId: newOrder.id })
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}