import { NextRequest, NextResponse } from 'next/server'
import * as OTPAuth from 'otpauth'
import { getIronSession } from 'iron-session'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { sessionOptions } from '@/lib/auth-config'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json()

    const { data: totpData } = await supabaseAdmin
      .from('totp_secrets')
      .select('*')
      .eq('verified', true)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (!totpData) {
      return NextResponse.json({ error: 'TOTP not configured' }, { status: 400 })
    }

    const totp = new OTPAuth.TOTP({
      issuer: 'Mission Control',
      label: 'Flash',
      secret: OTPAuth.Secret.fromBase32(totpData.secret),
    })

    const delta = totp.validate({ token: code, window: 1 })

    if (delta === null) {
      return NextResponse.json({ error: 'Invalid code' }, { status: 401 })
    }

    const cookieStore = await cookies()
    const session = await getIronSession<{ isLoggedIn: boolean }>(cookieStore, sessionOptions)
    session.isLoggedIn = true
    await session.save()

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
