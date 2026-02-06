import { NextRequest, NextResponse } from 'next/server'
import { generateAuthenticationOptions } from '@simplewebauthn/server'
import { AUTH_CONFIG } from '@/lib/auth-config'
import { getSession } from '@/lib/session'
import { getServiceSupabase } from '@/lib/supabase-service'

export async function POST(request: NextRequest) {
  try {
    const supabase = getServiceSupabase()
    const { data: credentials, error } = await supabase
      .from('passkey_credentials')
      .select('credential_id')
    
    if (error || !credentials || credentials.length === 0) {
      return NextResponse.json({ error: 'No credentials found' }, { status: 404 })
    }
    
    const options = await generateAuthenticationOptions({
      rpID: AUTH_CONFIG.rpID,
      allowCredentials: credentials.map(c => ({
        id: Buffer.from(c.credential_id, 'base64'),
        type: 'public-key',
      })),
      userVerification: 'preferred',
    })
    
    // Store challenge in session
    const session = await getSession()
    session.challenge = options.challenge
    await session.save()
    
    return NextResponse.json(options)
  } catch (error) {
    console.error('Login options error:', error)
    return NextResponse.json({ error: 'Failed to generate options' }, { status: 500 })
  }
}
