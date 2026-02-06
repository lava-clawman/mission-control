import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

// GET /api/agents/[id] - Get single agent
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { data, error } = await supabase
    .from('agents')
    .select('*')
    .eq('id', params.id)
    .single()

  if (error || !data) {
    return NextResponse.json({ error: 'Agent not found' }, { status: 404 })
  }

  return NextResponse.json(data)
}

// PUT /api/agents/[id] - Update agent
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const agent = await requireAuth(request)
    const body = await request.json()

    // Agents can only update themselves
    if (agent.id !== params.id) {
      return NextResponse.json(
        { error: 'Forbidden: can only update your own profile' },
        { status: 403 }
      )
    }

    const { name, role, description, avatar_url, status, capabilities } = body

    const updateData: any = {}
    if (name !== undefined) updateData.name = name
    if (role !== undefined) updateData.role = role
    if (description !== undefined) updateData.description = description
    if (avatar_url !== undefined) updateData.avatar_url = avatar_url
    if (status !== undefined) updateData.status = status
    if (capabilities !== undefined) updateData.capabilities = capabilities

    const { data, error } = await supabase
      .from('agents')
      .update(updateData)
      .eq('id', params.id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
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
