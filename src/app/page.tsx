'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CheckSquare, Users, Activity, ArrowRight, Clock } from "lucide-react"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

export default function Home() {
  const [stats, setStats] = useState({
    totalAgents: 0,
    onlineAgents: 0,
    todoTasks: 0,
    inProgressTasks: 0,
    doneTasks: 0,
  })
  const [recentActivities, setRecentActivities] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  async function loadDashboardData() {
    // Load stats
    const [agentsRes, tasksRes, activitiesRes] = await Promise.all([
      supabase.from('agents').select('status'),
      supabase.from('tasks').select('status'),
      supabase.from('activities').select('*, agent:agents(*)').order('created_at', { ascending: false }).limit(5),
    ])

    if (agentsRes.data) {
      setStats(prev => ({
        ...prev,
        totalAgents: agentsRes.data.length,
        onlineAgents: agentsRes.data.filter(a => a.status === 'online').length,
      }))
    }

    if (tasksRes.data) {
      setStats(prev => ({
        ...prev,
        todoTasks: tasksRes.data.filter(t => t.status === 'todo').length,
        inProgressTasks: tasksRes.data.filter(t => t.status === 'in_progress').length,
        doneTasks: tasksRes.data.filter(t => t.status === 'done').length,
      }))
    }

    if (activitiesRes.data) {
      setRecentActivities(activitiesRes.data)
    }

    setLoading(false)
  }

  function formatTime(timestamp: string) {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    if (minutes < 1) return 'just now'
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    return date.toLocaleDateString()
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold tracking-tight mb-4 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
            Mission Control
          </h1>
          <p className="text-xl text-muted-foreground">
            Coordinate your AI agents and manage tasks efficiently
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Agents</CardDescription>
              <CardTitle className="text-3xl">{loading ? '...' : stats.totalAgents}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                {stats.onlineAgents} online
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>To Do</CardDescription>
              <CardTitle className="text-3xl">{loading ? '...' : stats.todoTasks}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                tasks pending
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>In Progress</CardDescription>
              <CardTitle className="text-3xl">{loading ? '...' : stats.inProgressTasks}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                tasks active
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Done</CardDescription>
              <CardTitle className="text-3xl">{loading ? '...' : stats.doneTasks}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                tasks completed
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-blue-500/20">
            <Link href="/tasks">
              <CardHeader>
                <CheckSquare className="h-8 w-8 mb-2 text-blue-500" />
                <CardTitle>Tasks</CardTitle>
                <CardDescription>
                  Kanban board for task management
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-muted-foreground">
                  View board
                  <ArrowRight className="ml-2 h-4 w-4" />
                </div>
              </CardContent>
            </Link>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-purple-500/20">
            <Link href="/agents">
              <CardHeader>
                <Users className="h-8 w-8 mb-2 text-purple-500" />
                <CardTitle>Agents</CardTitle>
                <CardDescription>
                  Manage your AI agent roster
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-muted-foreground">
                  View agents
                  <ArrowRight className="ml-2 h-4 w-4" />
                </div>
              </CardContent>
            </Link>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-green-500/20">
            <Link href="/activity">
              <CardHeader>
                <Activity className="h-8 w-8 mb-2 text-green-500" />
                <CardTitle>Activity</CardTitle>
                <CardDescription>
                  Real-time activity feed
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-muted-foreground">
                  View activity
                  <ArrowRight className="ml-2 h-4 w-4" />
                </div>
              </CardContent>
            </Link>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Activity</CardTitle>
              <Link href="/activity">
                <Button variant="ghost" size="sm">
                  View all
                  <ArrowRight className="ml-2 h-3 w-3" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Clock className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : recentActivities.length > 0 ? (
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={activity.agent?.avatar_url} />
                      <AvatarFallback>
                        {activity.agent?.name?.charAt(0) || 'A'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm">
                        <span className="font-medium">{activity.agent?.name}</span>
                        {' '}
                        <span className="text-muted-foreground">
                          {activity.action.replace(/_/g, ' ')}
                        </span>
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatTime(activity.created_at)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">
                No recent activity
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
