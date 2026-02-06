import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

// GET /api/messages - Get chat messages
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const limit = parseInt(searchParams.get('limit') || '50')

  const { data, error } = await supabase
    .from('chat_messages')
    .select('*, sender:agents(*)')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Reverse to show oldest first
  return NextResponse.json(data.reverse())
}

// POST /api/messages - Send chat message
export async function POST(request: NextRequest) {
  try {
    const agent = await requireAuth(request)
    const body = await request.json()
    const { content, mentions } = body

    if (!content) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('chat_messages')
      .insert({
        sender_id: agent.id,
        content,
        mentions: mentions || [],
      })
      .select('*, sender:agents(*)')
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Log activity
    await supabase.from('activities').insert({
      agent_id: agent.id,
      action: 'sent_message',
      target_type: 'chat',
      metadata: { content: content.substring(0, 100) },
    })

    return NextResponse.json(data, { status: 201 })
  } catch (err: any) {
    if (err instanceof Response) {
      return err
    }
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    )
  }
}
