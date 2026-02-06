"use client"

import { useEffect, useState } from "react"
import { Task, Agent } from "@/types"
import { KanbanBoard } from "@/components/kanban-board"
import { TaskDialog } from "@/components/task-dialog"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [agents, setAgents] = useState<Agent[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)

  useEffect(() => {
    // Load both tasks and agents
    Promise.all([
      fetch("/api/tasks").then(res => res.json()),
      fetch("/api/agents").then(res => res.json())
    ])
      .then(([tasksData, agentsData]) => {
        setTasks(Array.isArray(tasksData) ? tasksData : [])
        setAgents(Array.isArray(agentsData) ? agentsData : [])
        setLoading(false)
      })
      .catch(err => {
        console.error("Error loading data:", err)
        setTasks([])
        setAgents([])
        setLoading(false)
      })
  }, [])

  const handleTasksChange = (newTasks: Task[]) => {
    setTasks(newTasks)
    // TODO: Sync with Supabase
  }

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task)
    setDialogOpen(true)
  }

  const handleSaveTask = (taskData: Partial<Task>) => {
    if (taskData.id) {
      // Update existing task
      setTasks((prev) =>
        prev.map((t) =>
          t.id === taskData.id
            ? {
                ...t,
                ...taskData,
                agent: taskData.assigned_to
                  ? agents.find((a) => a.id === taskData.assigned_to)
                  : undefined,
              }
            : t
        )
      )
    } else {
      // Create new task
      const newTask: Task = {
        id: Date.now().toString(),
        title: taskData.title || "",
        description: taskData.description,
        status: taskData.status || "todo",
        priority: taskData.priority || "medium",
        assigned_to: taskData.assigned_to,
        position: tasks.filter((t) => t.status === taskData.status).length,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        agent: taskData.assigned_to
          ? agents.find((a) => a.id === taskData.assigned_to)
          : undefined,
      }
      setTasks((prev) => [...prev, newTask])
    }
    setSelectedTask(null)
    // TODO: Sync with Supabase
  }

  const handleCreateTask = () => {
    setSelectedTask(null)
    setDialogOpen(true)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
          <p className="text-muted-foreground mt-1">
            Manage and track all your tasks
          </p>
        </div>
        <Button onClick={handleCreateTask} size="lg">
          <Plus className="mr-2 h-4 w-4" />
          New Task
        </Button>
      </div>

      <KanbanBoard
        tasks={tasks}
        onTasksChange={handleTasksChange}
        onTaskClick={handleTaskClick}
      />

      <TaskDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open)
          if (!open) setSelectedTask(null)
        }}
        task={selectedTask}
        agents={agents}
        onSave={handleSaveTask}
      />
    </div>
  )
}
