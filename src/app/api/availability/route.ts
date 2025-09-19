import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const availabilities = await db.availability.findMany()
    
    // Parse JSON strings back to arrays for API response
    const parsedAvailabilities = availabilities.map((availability: any) => ({
      ...availability,
      slots: JSON.parse(availability.slots)
    }))
    
    return NextResponse.json(parsedAvailabilities)
  } catch (error) {
    console.error('Error fetching availability:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    
    // Serialize slots array to JSON string for storage
    const availabilityData = {
      ...data,
      slots: JSON.stringify(data.slots)
    }
    
    const newAvailability = await db.availability.create({ data: availabilityData })
    
    // Parse back to array for response
    const response = {
      ...newAvailability,
      slots: JSON.parse((newAvailability as any).slots)
    }
    
    return NextResponse.json(response)
  } catch (error) {
    console.error('Error creating availability:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}