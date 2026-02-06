"use client"

import { Agent } from "@/types"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Bot } from "lucide-react"
import { cn } from "@/lib/utils"

interface AgentCardProps {
  agent: Agent
  onClick?: () => void
}

export function AgentCard({ agent, onClick }: AgentCardProps) {
  const statusColors = {
    online: "bg-green-500",
    offline: "bg-gray-500",
    busy: "bg-yellow-500",
  }

  const statusLabels = {
    online: "在线",
    offline: "离线",
    busy: "忙碌",
  }

  return (
    <Card
      className="group cursor-pointer transition-all hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-1"
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Avatar className="h-12 w-12 border-2 border-primary/20">
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600">
                  <Bot className="h-6 w-6 text-white" />
                </AvatarFallback>
              </Avatar>
              {/* Status indicator with pulse animation */}
              <div className="absolute -bottom-0.5 -right-0.5">
                <div className={cn(
                  "h-3.5 w-3.5 rounded-full border-2 border-background",
                  statusColors[agent.status]
                )}>
                  {agent.status === "online" && (
                    <div className={cn(
                      "absolute inset-0 rounded-full animate-ping opacity-75",
                      statusColors[agent.status]
                    )} />
                  )}
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                {agent.name}
              </h3>
              <p className="text-sm text-muted-foreground">{agent.role}</p>
            </div>
          </div>
          <Badge variant="outline" className="capitalize">
            {statusLabels[agent.status]}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {agent.description && (
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {agent.description}
          </p>
        )}
        <div className="flex flex-wrap gap-1.5">
          {agent.capabilities.slice(0, 3).map((capability) => (
            <Badge key={capability} variant="secondary" className="text-xs">
              {capability}
            </Badge>
          ))}
          {agent.capabilities.length > 3 && (
            <Badge variant="secondary" className="text-xs">
              +{agent.capabilities.length - 3}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
