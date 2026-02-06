export interface Agent {
  id: string
  name: string
  role: string
  description?: string
  avatar_url?: string
  status: 'online' | 'offline' | 'busy'
  capabilities: string[]
  created_at: string
}

export interface Task {
  id: string
  title: string
  description?: string
  status: 'todo' | 'in_progress' | 'done'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  assigned_to?: string
  created_by?: string
  due_date?: string
  position: number
  created_at: string
  updated_at: string
  agent?: Agent
}
