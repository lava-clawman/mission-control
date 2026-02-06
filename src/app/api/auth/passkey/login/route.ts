import { NextRequest, NextResponse } from 'next/server'
import { verifyAuthenticationResponse } from '@simplewebauthn/server'
import { AUTH_CONFIG } from '@/lib/auth-config'
import { getSession } from '@/lib/session'
import { getServiceSupabase } from '@/lib/supabase-service'

export async function POST(request: NextRequest) {
  try {
    const { credential } = await request.json()
    
    const session = await getSession()
    const challenge = session.challenge
    
    if (!challenge) {
      return NextResponse.json({ error: 'No challenge found' }, { status: 400 })
    }
    
    // Get stored credential
    const supabase = getServiceSupabase()
    const credentialId = Buffer.from(credential.id, 'base64').toString('base64')
    
    const { data: storedCred, error } = await supabase
      .from('passkey_credentials')
      .select('*')
      .eq('credential_id', credentialId)
      .single()
    
    if (error || !storedCred) {
      return NextResponse.json({ error: 'Credential not found' }, { status: 404 })
    }
    
    const verification = await verifyAuthenticationResponse({
      response: credential,
      expectedChallenge: challenge,
      expectedOrigin: AUTH_CONFIG.origin,
      expectedRPID: AUTH_CONFIG.rpID,
      credential: {
        id: Buffer.from(storedCred.credential_id, 'base64'),
        publicKey: Buffer.from(storedCred.public_key, 'base64'),
        counter: storedCred.counter,
      },
    })
    
    if (!verification.verified) {
      return NextResponse.json({ error: 'Verification failed' }, { status: 400 })
    }
    
    // Update counter
    await supabase
      .from('passkey_credentials')
      .update({ counter: verification.authenticationInfo.newCounter })
      .eq('credential_id', credentialId)
    
    // Set session
    session.isLoggedIn = true
    session.userId = AUTH_CONFIG.adminId
    delete session.challenge
    await session.save()
    
    return NextResponse.json({ verified: true })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 })
  }
}
