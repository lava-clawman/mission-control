import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

// POST /api/activities - Log activity
export async function POST(request: NextRequest) {
  try {
    const agent = await requireAuth(request)
    const body = await request.json()
    const { action, target_type, target_id, metadata } = body

    if (!action) {
      return NextResponse.json(
        { error: 'Action is required' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('activities')
      .insert({
        agent_id: agent.id,
        action,
        target_type,
        target_id,
        metadata: metadata || {},
      })
      .select('*, agent:agents(*)')
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

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
