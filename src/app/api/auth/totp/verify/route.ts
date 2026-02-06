import { NextRequest, NextResponse } from 'next/server'
import { authenticator } from 'otplib'
import { getServiceSupabase } from '@/lib/supabase-service'

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json()
    
    if (!token || !/^\d{6}$/.test(token)) {
      return NextResponse.json({ error: 'Invalid token format' }, { status: 400 })
    }
    
    const supabase = getServiceSupabase()
    
    // Get unverified secret
    const { data: secretData, error } = await supabase
      .from('totp_secrets')
      .select('*')
      .eq('verified', false)
      .single()
    
    if (error || !secretData) {
      return NextResponse.json({ error: 'No setup in progress' }, { status: 404 })
    }
    
    // Verify token
    const isValid = authenticator.verify({
      token,
      secret: secretData.secret,
    })
    
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 400 })
    }
    
    // Mark as verified
    await supabase
      .from('totp_secrets')
      .update({ verified: true })
      .eq('id', secretData.id)
    
    return NextResponse.json({ verified: true })
  } catch (error) {
    console.error('TOTP verify error:', error)
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 })
  }
}
