import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

// POST /api/tasks/[id]/comments - Add comment to task
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const agent = await requireAuth(request)
    const body = await request.json()
    const { content } = body

    if (!content) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      )
    }

    // Verify task exists
    const { data: task, error: taskError } = await supabase
      .from('tasks')
      .select('id, title')
      .eq('id', params.id)
      .single()

    if (taskError || !task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 })
    }

    const { data, error } = await supabase
      .from('task_comments')
      .insert({
        task_id: params.id,
        agent_id: agent.id,
        content,
      })
      .select('*, agent:agents(*)')
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Log activity
    await supabase.from('activities').insert({
      agent_id: agent.id,
      action: 'commented_on_task',
      target_type: 'task',
      target_id: params.id,
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
