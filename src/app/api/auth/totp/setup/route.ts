import { NextRequest, NextResponse } from 'next/server'
import { authenticator } from 'otplib'
import QRCode from 'qrcode'
import { getServiceSupabase } from '@/lib/supabase-service'
import { AUTH_CONFIG } from '@/lib/auth-config'

export async function POST(request: NextRequest) {
  try {
    const { setupToken } = await request.json()
    
    // Verify setup token
    if (setupToken !== process.env.SETUP_TOKEN) {
      return NextResponse.json({ error: 'Invalid setup token' }, { status: 401 })
    }
    
    // Generate secret
    const secret = authenticator.generateSecret()
    
    // Create otpauth URL
    const otpauth = authenticator.keyuri(
      AUTH_CONFIG.adminId,
      AUTH_CONFIG.rpName,
      secret
    )
    
    // Generate QR code
    const qrCode = await QRCode.toDataURL(otpauth)
    
    // Store secret in database (unverified)
    const supabase = getServiceSupabase()
    
    // Delete any existing unverified secrets
    await supabase
      .from('totp_secrets')
      .delete()
      .eq('verified', false)
    
    const { error } = await supabase
      .from('totp_secrets')
      .insert({
        secret,
        verified: false,
      })
    
    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: 'Failed to save secret' }, { status: 500 })
    }
    
    return NextResponse.json({ 
      secret,
      qrCode,
    })
  } catch (error) {
    console.error('TOTP setup error:', error)
    return NextResponse.json({ error: 'Setup failed' }, { status: 500 })
  }
}
