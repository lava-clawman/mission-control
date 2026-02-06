"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Agent } from "@/types"
import { AgentGrid } from "@/components/agent-grid"
import { AgentDialog } from "@/components/agent-dialog"
import { Button } from "@/components/ui/button"
import { UserPlus } from "lucide-react"

export default function AgentsPage() {
  const router = useRouter()
  const [agents, setAgents] = useState<Agent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/agents")
      .then(res => res.json())
      .then(data => {
        setAgents(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch(err => {
        console.error("Error loading agents:", err)
        setAgents([])
        setLoading(false)
      })
  }, [])

  const handleAgentClick = (agent: Agent) => {
    router.push(`/agents/${agent.id}`)
  }

  const handleCreateAgent = (agentData: Partial<Agent>) => {
    console.log("Creating agent:", agentData)
    // TODO: Integrate with Supabase
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <div className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container py-6 px-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Agent 花名册</h1>
              <p className="text-muted-foreground mt-1">
                管理和监控你的 AI Agent 团队
              </p>
            </div>
            <AgentDialog
              trigger={
                <Button size="lg" className="gap-2">
                  <UserPlus className="h-4 w-4" />
                  注册新 Agent
                </Button>
              }
              onSave={handleCreateAgent}
            />
          </div>

          {/* Quick stats */}
          <div className="grid gap-4 md:grid-cols-3 mt-6">
            <div className="rounded-lg border bg-card p-4">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-sm font-medium">在线</span>
              </div>
              <p className="text-2xl font-bold mt-2">
                {agents.filter((a) => a.status === "online").length}
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-yellow-500" />
                <span className="text-sm font-medium">忙碌</span>
              </div>
              <p className="text-2xl font-bold mt-2">
                {agents.filter((a) => a.status === "busy").length}
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-gray-500" />
                <span className="text-sm font-medium">离线</span>
              </div>
              <p className="text-2xl font-bold mt-2">
                {agents.filter((a) => a.status === "offline").length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 container py-6 px-6">
        {agents.length > 0 ? (
          <AgentGrid agents={agents} onAgentClick={handleAgentClick} />
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-muted-foreground text-lg">暂无 Agents</p>
            <p className="text-sm text-muted-foreground mt-2">点击上方按钮创建第一个 Agent</p>
          </div>
        )}
      </div>
    </div>
  )
}
