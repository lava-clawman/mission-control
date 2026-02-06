"use client"

import { Agent } from "@/types"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Bot } from "lucide-react"
import { cn } from "@/lib/utils"

interface MentionPopoverProps {
  agents: Agent[]
  onSelect: (agent: Agent) => void
  selectedIndex: number
}

export function MentionPopover({ agents, onSelect, selectedIndex }: MentionPopoverProps) {
  if (agents.length === 0) return null

  return (
    <div className="absolute bottom-full left-0 mb-2 w-64 rounded-lg border bg-popover shadow-lg overflow-hidden">
      <div className="p-2 text-xs text-muted-foreground border-b">
        选择 Agent
      </div>
      <div className="max-h-64 overflow-y-auto">
        {agents.map((agent, index) => (
          <button
            key={agent.id}
            onClick={() => onSelect(agent)}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2 hover:bg-accent transition-colors",
              index === selectedIndex && "bg-accent"
            )}
          >
            <Avatar className="h-8 w-8 border border-primary/20">
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600">
                <Bot className="h-4 w-4 text-white" />
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 text-left">
              <div className="font-medium text-sm">{agent.name}</div>
              <div className="text-xs text-muted-foreground">{agent.role}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
