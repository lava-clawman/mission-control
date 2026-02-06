"use client"

import { Task } from "@/types"
import { TaskCard } from "./task-card"
import { useDroppable } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"

interface KanbanColumnProps {
  title: string
  status: Task["status"]
  tasks: Task[]
  onTaskClick?: (task: Task) => void
}

const statusColors = {
  todo: "bg-slate-500/10 border-slate-500/20",
  in_progress: "bg-blue-500/10 border-blue-500/20",
  done: "bg-green-500/10 border-green-500/20",
}

const statusLabels = {
  todo: "To Do",
  in_progress: "In Progress",
  done: "Done",
}

export function KanbanColumn({ title, status, tasks, onTaskClick }: KanbanColumnProps) {
  const { setNodeRef } = useDroppable({
    id: status,
  })

  return (
    <div className="flex flex-col min-w-[320px] flex-1">
      <div className={`rounded-lg border p-3 mb-3 ${statusColors[status]}`}>
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm">
            {statusLabels[status]}
          </h3>
          <span className="text-xs text-muted-foreground bg-background/50 px-2 py-1 rounded-full">
            {tasks.length}
          </span>
        </div>
      </div>
      
      <div
        ref={setNodeRef}
        className="flex-1 bg-muted/30 rounded-lg p-3 min-h-[500px]"
      >
        <SortableContext
          items={tasks.map(t => t.id)}
          strategy={verticalListSortingStrategy}
        >
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onClick={() => onTaskClick?.(task)}
            />
          ))}
        </SortableContext>
      </div>
    </div>
  )
}
