import { NextRequest, NextResponse } from 'next/server'

// POST /api/webhook - Receive OpenClaw callbacks
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Log webhook payload for debugging
    console.log('Webhook received:', JSON.stringify(body, null, 2))

    // TODO: Handle different webhook events
    // - Task completion notifications
    // - Agent status updates
    // - Scheduled task triggers

    return NextResponse.json({ 
      success: true, 
      message: 'Webhook received' 
    })
  } catch (err) {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    )
  }
}
