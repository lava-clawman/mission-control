import { NextRequest, NextResponse } from 'next/server'
import { authenticator } from 'otplib'
import { getServiceSupabase } from '@/lib/supabase-service'
import { getSession } from '@/lib/session'
import { AUTH_CONFIG } from '@/lib/auth-config'

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json()
    
    if (!token || !/^\d{6}$/.test(token)) {
      return NextResponse.json({ error: 'Invalid token format' }, { status: 400 })
    }
    
    const supabase = getServiceSupabase()
    
    // Get verified secret
    const { data: secretData, error } = await supabase
      .from('totp_secrets')
      .select('*')
      .eq('verified', true)
      .single()
    
    if (error || !secretData) {
      return NextResponse.json({ error: 'TOTP not configured' }, { status: 404 })
    }
    
    // Verify token
    const isValid = authenticator.verify({
      token,
      secret: secretData.secret,
    })
    
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }
    
    // Set session
    const session = await getSession()
    session.isLoggedIn = true
    session.userId = AUTH_CONFIG.adminId
    await session.save()
    
    return NextResponse.json({ verified: true })
  } catch (error) {
    console.error('TOTP login error:', error)
    return NextResponse.json({ error: 'Login failed' }, { status: 500 })
  }
}
