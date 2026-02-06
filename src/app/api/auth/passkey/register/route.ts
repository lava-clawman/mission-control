import { NextRequest, NextResponse } from 'next/server'
import { verifyRegistrationResponse } from '@simplewebauthn/server'
import { AUTH_CONFIG } from '@/lib/auth-config'
import { getSession } from '@/lib/session'
import { getServiceSupabase } from '@/lib/supabase-service'

export async function POST(request: NextRequest) {
  try {
    const { credential, deviceName } = await request.json()
    
    const session = await getSession()
    const challenge = session.challenge
    
    if (!challenge) {
      return NextResponse.json({ error: 'No challenge found' }, { status: 400 })
    }
    
    const verification = await verifyRegistrationResponse({
      response: credential,
      expectedChallenge: challenge,
      expectedOrigin: AUTH_CONFIG.origin,
      expectedRPID: AUTH_CONFIG.rpID,
    })
    
    if (!verification.verified || !verification.registrationInfo) {
      return NextResponse.json({ error: 'Verification failed' }, { status: 400 })
    }
    
    const { credential: credentialInfo } = verification.registrationInfo
    
    // Store credential in database
    const supabase = getServiceSupabase()
    const { error } = await supabase
      .from('passkey_credentials')
      .insert({
        credential_id: Buffer.from(credentialInfo.id).toString('base64'),
        public_key: Buffer.from(credentialInfo.publicKey).toString('base64'),
        counter: credentialInfo.counter,
        device_name: deviceName || 'Unnamed Device',
      })
    
    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: 'Failed to save credential' }, { status: 500 })
    }
    
    // Clear challenge
    delete session.challenge
    await session.save()
    
    return NextResponse.json({ verified: true })
  } catch (error) {
    console.error('Register error:', error)
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 })
  }
}
