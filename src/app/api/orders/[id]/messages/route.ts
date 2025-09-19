import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const messages = await db.message.findMany({ where: { orderId: params.id } })
    return NextResponse.json(messages)
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const { content } = await request.json()
    
    const newMessage = await db.message.create({
      data: {
        orderId: params.id,
        content,
        isAdmin: false
      }
    })
    
    return NextResponse.json(newMessage)
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}