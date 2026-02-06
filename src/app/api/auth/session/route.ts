import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/session'

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    
    return NextResponse.json({
      isLoggedIn: session.isLoggedIn || false,
      userId: session.userId,
    })
  } catch (error) {
    console.error('Session check error:', error)
    return NextResponse.json({ isLoggedIn: false }, { status: 500 })
  }
}
