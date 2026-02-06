"use client"

import { useState, useMemo } from "react"
import { Agent } from "@/types"
import { AgentCard } from "./agent-card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search, Filter } from "lucide-react"

interface AgentGridProps {
  agents: Agent[]
  onAgentClick?: (agent: Agent) => void
}

export function AgentGrid({ agents, onAgentClick }: AgentGridProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [roleFilter, setRoleFilter] = useState<string>("all")

  // Extract unique roles
  const uniqueRoles = useMemo(() => {
    const roles = agents.map((a) => a.role)
    return Array.from(new Set(roles))
  }, [agents])

  // Filter agents
  const filteredAgents = useMemo(() => {
    return agents.filter((agent) => {
      // Search filter
      const matchesSearch =
        searchQuery === "" ||
        agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        agent.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        agent.capabilities.some((c) =>
          c.toLowerCase().includes(searchQuery.toLowerCase())
        )

      // Status filter
      const matchesStatus =
        statusFilter === "all" || agent.status === statusFilter

      // Role filter
      const matchesRole = roleFilter === "all" || agent.role === roleFilter

      return matchesSearch && matchesStatus && matchesRole
    })
  }, [agents, searchQuery, statusFilter, roleFilter])

  // Count by status
  const statusCounts = useMemo(() => {
    return {
      online: agents.filter((a) => a.status === "online").length,
      offline: agents.filter((a) => a.status === "offline").length,
      busy: agents.filter((a) => a.status === "busy").length,
    }
  }, [agents])

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="搜索 Agent 名称、角色或能力..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex gap-3">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="状态" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部状态</SelectItem>
              <SelectItem value="online">
                在线 ({statusCounts.online})
              </SelectItem>
              <SelectItem value="busy">忙碌 ({statusCounts.busy})</SelectItem>
              <SelectItem value="offline">
                离线 ({statusCounts.offline})
              </SelectItem>
            </SelectContent>
          </Select>

          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="角色" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部角色</SelectItem>
              {uniqueRoles.map((role) => (
                <SelectItem key={role} value={role}>
                  {role}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {(searchQuery || statusFilter !== "all" || roleFilter !== "all") && (
            <Button
              variant="ghost"
              onClick={() => {
                setSearchQuery("")
                setStatusFilter("all")
                setRoleFilter("all")
              }}
            >
              清除筛选
            </Button>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="flex gap-4 text-sm text-muted-foreground">
        <span>
          共 {agents.length} 个 Agent
          {filteredAgents.length !== agents.length &&
            ` · 显示 ${filteredAgents.length} 个`}
        </span>
      </div>

      {/* Grid */}
      {filteredAgents.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            {searchQuery || statusFilter !== "all" || roleFilter !== "all"
              ? "没有找到匹配的 Agent"
              : "还没有注册的 Agent"}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredAgents.map((agent) => (
            <AgentCard
              key={agent.id}
              agent={agent}
              onClick={() => onAgentClick?.(agent)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
