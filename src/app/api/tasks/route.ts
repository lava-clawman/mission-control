import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

// GET /api/tasks - List tasks with filters
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status')
  const assignedTo = searchParams.get('assigned_to')

  let query = supabase.from('tasks').select('*, assigned_agent:agents!tasks_assigned_to_fkey(*), created_agent:agents!tasks_created_by_fkey(*)')

  // Filter by status (comma-separated)
  if (status) {
    const statuses = status.split(',')
    query = query.in('status', statuses)
  }

  // Filter by assigned_to
  if (assignedTo) {
    query = query.eq('assigned_to', assignedTo)
  }

  query = query.order('position', { ascending: true })

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

// POST /api/tasks - Create new task
export async function POST(request: NextRequest) {
  try {
    const agent = await requireAuth(request)
    const body = await request.json()
    const { title, description, status, priority, assigned_to, due_date } = body

    if (!title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      )
    }

    // Get max position
    const { data: maxData } = await supabase
      .from('tasks')
      .select('position')
      .order('position', { ascending: false })
      .limit(1)

    const maxPosition = maxData && maxData.length > 0 ? maxData[0].position : 0

    const { data, error } = await supabase
      .from('tasks')
      .insert({
        title,
        description,
        status: status || 'todo',
        priority: priority || 'medium',
        assigned_to,
        created_by: agent.id,
        due_date,
        position: maxPosition + 1,
      })
      .select('*, assigned_agent:agents!tasks_assigned_to_fkey(*), created_agent:agents!tasks_created_by_fkey(*)')
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Log activity
    await supabase.from('activities').insert({
      agent_id: agent.id,
      action: 'created_task',
      target_type: 'task',
      target_id: data.id,
      metadata: { title },
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
