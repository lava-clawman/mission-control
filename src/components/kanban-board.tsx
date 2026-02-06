"use client"

import { useState } from "react"
import { Task } from "@/types"
import { KanbanColumn } from "./kanban-column"
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import { arrayMove } from "@dnd-kit/sortable"
import { TaskCard } from "./task-card"

interface KanbanBoardProps {
  tasks: Task[]
  onTasksChange: (tasks: Task[]) => void
  onTaskClick?: (task: Task) => void
}

export function KanbanBoard({ tasks, onTasksChange, onTaskClick }: KanbanBoardProps) {
  const [activeTask, setActiveTask] = useState<Task | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  const todoTasks = tasks.filter((t) => t.status === "todo")
  const inProgressTasks = tasks.filter((t) => t.status === "in_progress")
  const doneTasks = tasks.filter((t) => t.status === "done")

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find((t) => t.id === event.active.id)
    setActiveTask(task || null)
  }

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event
    if (!over) return

    const activeId = active.id
    const overId = over.id

    const activeTask = tasks.find((t) => t.id === activeId)
    if (!activeTask) return

    // Check if dropping over a column
    const validStatuses: Task["status"][] = ["todo", "in_progress", "done"]
    if (validStatuses.includes(overId as Task["status"])) {
      const newStatus = overId as Task["status"]
      if (activeTask.status !== newStatus) {
        const updatedTasks = tasks.map((t) =>
          t.id === activeId ? { ...t, status: newStatus, updated_at: new Date().toISOString() } : t
        )
        onTasksChange(updatedTasks)
      }
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveTask(null)

    if (!over || active.id === over.id) return

    const activeTask = tasks.find((t) => t.id === active.id)
    const overTask = tasks.find((t) => t.id === over.id)

    if (!activeTask || !overTask) return

    // Reorder within the same column
    if (activeTask.status === overTask.status) {
      const columnTasks = tasks.filter((t) => t.status === activeTask.status)
      const activeIndex = columnTasks.findIndex((t) => t.id === active.id)
      const overIndex = columnTasks.findIndex((t) => t.id === over.id)

      const reorderedColumnTasks = arrayMove(columnTasks, activeIndex, overIndex).map(
        (task, index) => ({ ...task, position: index })
      )

      const otherTasks = tasks.filter((t) => t.status !== activeTask.status)
      const updatedTasks = [...otherTasks, ...reorderedColumnTasks].sort(
        (a, b) => a.status.localeCompare(b.status) || a.position - b.position
      )

      onTasksChange(updatedTasks)
    }
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 overflow-x-auto pb-4">
        <KanbanColumn
          title="To Do"
          status="todo"
          tasks={todoTasks}
          onTaskClick={onTaskClick}
        />
        <KanbanColumn
          title="In Progress"
          status="in_progress"
          tasks={inProgressTasks}
          onTaskClick={onTaskClick}
        />
        <KanbanColumn
          title="Done"
          status="done"
          tasks={doneTasks}
          onTaskClick={onTaskClick}
        />
      </div>

      <DragOverlay>
        {activeTask ? <TaskCard task={activeTask} /> : null}
      </DragOverlay>
    </DndContext>
  )
}
