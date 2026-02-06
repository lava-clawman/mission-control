import { NextResponse } from 'next/server'
import { getIronSession } from 'iron-session'
import { sessionOptions } from '@/lib/auth-config'
import { cookies } from 'next/headers'

export async function GET() {
  try {
    const cookieStore = await cookies()
    const session = await getIronSession<{ isLoggedIn?: boolean }>(cookieStore, sessionOptions)
    
    return NextResponse.json({
      isLoggedIn: session.isLoggedIn || false,
    })
  } catch (err: any) {
    return NextResponse.json({ isLoggedIn: false })
  }
}
