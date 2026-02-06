import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

// PUT /api/tasks/[id] - Update task
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const agent = await requireAuth(request)
    const body = await request.json()

    const { title, description, status, priority, assigned_to, due_date, position } = body

    const updateData: any = {}
    if (title !== undefined) updateData.title = title
    if (description !== undefined) updateData.description = description
    if (status !== undefined) updateData.status = status
    if (priority !== undefined) updateData.priority = priority
    if (assigned_to !== undefined) updateData.assigned_to = assigned_to
    if (due_date !== undefined) updateData.due_date = due_date
    if (position !== undefined) updateData.position = position

    const { data, error } = await supabase
      .from('tasks')
      .update(updateData)
      .eq('id', params.id)
      .select('*, agent:agents(*)')
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Log activity
    if (status !== undefined) {
      await supabase.from('activities').insert({
        agent_id: agent.id,
        action: 'updated_task_status',
        target_type: 'task',
        target_id: params.id,
        metadata: { status },
      })
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
