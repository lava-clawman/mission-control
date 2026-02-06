"use client"

import { useState } from "react"
import { Task, Agent } from "@/types"
import { KanbanBoard } from "@/components/kanban-board"
import { TaskDialog } from "@/components/task-dialog"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

// Mock data
const mockAgents: Agent[] = [
  {
    id: "1",
    name: "Lava",
    role: "Main Agent",
    description: "Primary AI assistant",
    avatar_url: "https://api.dicebear.com/7.x/bottts/svg?seed=lava",
    status: "online",
    capabilities: ["coding", "research", "automation"],
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Flash",
    role: "User",
    description: "Product Manager",
    avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=flash",
    status: "online",
    capabilities: ["product", "design", "strategy"],
    created_at: new Date().toISOString(),
  },
]

const mockTasks: Task[] = [
  {
    id: "1",
    title: "Set up Supabase database schema",
    description: "Create tables for agents, tasks, and relationships",
    status: "done",
    priority: "high",
    assigned_to: "1",
    position: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    agent: mockAgents[0],
  },
  {
    id: "2",
    title: "Build Kanban board UI",
    description: "Create task cards, columns, and drag-and-drop functionality",
    status: "in_progress",
    priority: "urgent",
    assigned_to: "1",
    position: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    agent: mockAgents[0],
  },
  {
    id: "3",
    title: "Design agent roster interface",
    description: "Create a beautiful interface to showcase all agents",
    status: "todo",
    priority: "high",
    position: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "4",
    title: "Implement real-time updates",
    description: "Use Supabase subscriptions for live task updates",
    status: "todo",
    priority: "medium",
    position: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "5",
    title: "Add task comments and attachments",
    description: "Allow rich collaboration on tasks",
    status: "todo",
    priority: "low",
    position: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>(mockTasks)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)

  const handleTasksChange = (newTasks: Task[]) => {
    setTasks(newTasks)
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
                  ? mockAgents.find((a) => a.id === taskData.assigned_to)
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
          ? mockAgents.find((a) => a.id === taskData.assigned_to)
          : undefined,
      }
      setTasks((prev) => [...prev, newTask])
    }
    setSelectedTask(null)
  }

  const handleCreateTask = () => {
    setSelectedTask(null)
    setDialogOpen(true)
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
        agents={mockAgents}
        onSave={handleSaveTask}
      />
    </div>
  )
}
