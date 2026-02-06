'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { Card } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  CheckSquare, 
  MessageSquare, 
  UserPlus, 
  Edit, 
  Clock 
} from 'lucide-react'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

interface Activity {
  id: string
  agent_id: string
  action: string
  target_type?: string
  target_id?: string
  metadata?: any
  created_at: string
  agent?: {
    id: string
    name: string
    role: string
    avatar_url?: string
  }
}

const actionIcons: Record<string, any> = {
  created_task: CheckSquare,
  updated_task_status: Edit,
  commented_on_task: MessageSquare,
  sent_message: MessageSquare,
  joined: UserPlus,
}

const actionLabels: Record<string, string> = {
  created_task: 'created a task',
  updated_task_status: 'updated task status',
  commented_on_task: 'commented on task',
  sent_message: 'sent a message',
  joined: 'joined the team',
}

export default function ActivityPage() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadActivities()
  }, [])

  async function loadActivities() {
    const { data, error } = await supabase
      .from('activities')
      .select('*, agent:agents(*)')
      .order('created_at', { ascending: false })
      .limit(50)

    if (!error && data) {
      setActivities(data)
    }
    setLoading(false)
  }

  function formatTime(timestamp: string) {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (minutes < 1) return 'just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`
    return date.toLocaleDateString()
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Activity Feed</h1>
          <p className="text-muted-foreground mt-2">
            Real-time updates from your AI agent team
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Clock className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <Card className="p-6">
          <div className="space-y-6">
            {activities.map((activity) => {
              const Icon = actionIcons[activity.action] || Clock
              const label = actionLabels[activity.action] || activity.action

              return (
                <div key={activity.id} className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-accent flex items-center justify-center">
                      <Icon className="h-5 w-5 text-accent-foreground" />
                    </div>
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={activity.agent?.avatar_url} />
                        <AvatarFallback>
                          {activity.agent?.name?.charAt(0) || 'A'}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{activity.agent?.name}</span>
                      <span className="text-muted-foreground">{label}</span>
                      <span className="text-xs text-muted-foreground ml-auto">
                        {formatTime(activity.created_at)}
                      </span>
                    </div>
                    {activity.metadata && Object.keys(activity.metadata).length > 0 && (
                      <div className="text-sm text-muted-foreground pl-8">
                        {activity.metadata.title && (
                          <span className="font-medium">"{activity.metadata.title}"</span>
                        )}
                        {activity.metadata.status && (
                          <span> → {activity.metadata.status}</span>
                        )}
                        {activity.metadata.content && (
                          <p className="mt-1 italic">"{activity.metadata.content}"</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}

            {activities.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No activities yet</p>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  )
}
