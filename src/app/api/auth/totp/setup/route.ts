import { NextRequest, NextResponse } from 'next/server'
import * as OTPAuth from 'otpauth'
import QRCode from 'qrcode'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json()
    
    if (token !== process.env.SETUP_TOKEN) {
      return NextResponse.json({ error: 'Invalid setup token' }, { status: 401 })
    }

    // Generate TOTP
    const secret = new OTPAuth.Secret()
    const totp = new OTPAuth.TOTP({
      issuer: 'Mission Control',
      label: 'Flash',
      algorithm: 'SHA1',
      digits: 6,
      period: 30,
      secret: secret,
    })

    const uri = totp.toString()
    const qrCode = await QRCode.toDataURL(uri)

    // Store secret
    const { data, error } = await supabaseAdmin
      .from('totp_secrets')
      .insert({ secret: secret.base32, verified: false })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      id: data.id,
      qrCode,
      secret: secret.base32,
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
