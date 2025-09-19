import { NextResponse } from 'next/server'

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const { rating, comment } = await request.json()
    
    // Mock rating storage for now
    console.log(`📊 Rating received for order ${params.id}:`)
    console.log(`Rating: ${rating}/5 stars`)
    if (comment) {
      console.log(`Comment: ${comment}`)
    }
    console.log('---')
    
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}