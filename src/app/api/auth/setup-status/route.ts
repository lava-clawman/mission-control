import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function GET(request: NextRequest) {
  try {
    const supabase = supabaseAdmin
    
    // Check if any passkey or TOTP is configured
    const [passkeyResult, totpResult] = await Promise.all([
      supabase.from('passkey_credentials').select('id').limit(1),
      supabase.from('totp_secrets').select('id').eq('verified', true).limit(1),
    ])
    
    const hasPasskey = (passkeyResult.data?.length || 0) > 0
    const hasTotp = (totpResult.data?.length || 0) > 0
    
    return NextResponse.json({
      isSetupComplete: hasPasskey || hasTotp,
      hasPasskey,
      hasTotp,
    })
  } catch (error) {
    console.error('Setup status error:', error)
    return NextResponse.json({ error: 'Failed to check status' }, { status: 500 })
  }
}
