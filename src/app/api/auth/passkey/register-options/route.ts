import { NextRequest, NextResponse } from 'next/server'
import { generateRegistrationOptions } from '@simplewebauthn/server'
import { AUTH_CONFIG } from '@/lib/auth-config'
import { getSession } from '@/lib/session'

export async function POST(request: NextRequest) {
  try {
    const { setupToken } = await request.json()
    
    // Verify setup token
    if (setupToken !== process.env.SETUP_TOKEN) {
      return NextResponse.json({ error: 'Invalid setup token' }, { status: 401 })
    }
    
    const options = await generateRegistrationOptions({
      rpName: AUTH_CONFIG.rpName,
      rpID: AUTH_CONFIG.rpID,
      userName: AUTH_CONFIG.adminId,
      userDisplayName: 'Flash',
      attestationType: 'none',
      authenticatorSelection: {
        residentKey: 'preferred',
        userVerification: 'preferred',
      },
    })
    
    // Store challenge in session
    const session = await getSession()
    session.challenge = options.challenge
    await session.save()
    
    return NextResponse.json(options)
  } catch (error) {
    console.error('Register options error:', error)
    return NextResponse.json({ error: 'Failed to generate options' }, { status: 500 })
  }
}
