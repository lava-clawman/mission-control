import { NextRequest, NextResponse } from 'next/server'
import * as OTPAuth from 'otpauth'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function POST(request: NextRequest) {
  try {
    const { id, code } = await request.json()

    const { data: totpData } = await supabaseAdmin
      .from('totp_secrets')
      .select('*')
      .eq('id', id)
      .single()

    if (!totpData) {
      return NextResponse.json({ error: 'TOTP not found' }, { status: 404 })
    }

    const totp = new OTPAuth.TOTP({
      issuer: 'Mission Control',
      label: 'Flash',
      secret: OTPAuth.Secret.fromBase32(totpData.secret),
    })

    const delta = totp.validate({ token: code, window: 1 })

    if (delta === null) {
      return NextResponse.json({ error: 'Invalid code' }, { status: 400 })
    }

    await supabaseAdmin
      .from('totp_secrets')
      .update({ verified: true })
      .eq('id', id)

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
