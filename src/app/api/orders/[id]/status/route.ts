import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { sendOrderStatusUpdate } from '@/lib/email'

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const { status, rejectionReason } = await request.json()
    
    const updateData: any = { 
      status,
      updatedAt: new Date().toISOString()
    }
    
    if (rejectionReason) {
      updateData.rejectionReason = rejectionReason
    }
    
    const updatedOrder = await db.order.update({
      where: { id: params.id },
      data: updateData
    })
    
    // Send status update email
    await sendOrderStatusUpdate(updatedOrder)
    
    return NextResponse.json(updatedOrder)
  } catch (error) {
    console.error('Error updating order status:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}