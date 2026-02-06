"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Agent } from "@/types"
import { AgentGrid } from "@/components/agent-grid"
import { AgentDialog } from "@/components/agent-dialog"
import { Button } from "@/components/ui/button"
import { UserPlus } from "lucide-react"

// Mock data
const MOCK_AGENTS: Agent[] = [
  {
    id: "1",
    name: "Jarvis",
    role: "Squad Lead",
    description: "主控 AI，负责协调团队和任务分配，确保项目顺利进行",
    status: "online",
    capabilities: ["项目管理", "任务分配", "团队协调", "决策制定"],
    avatar_url: "",
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Vision",
    role: "Developer",
    description: "全栈开发专家，擅长 React、Next.js 和现代 Web 技术",
    status: "busy",
    capabilities: ["编码", "测试", "部署", "DevOps", "设计"],
    avatar_url: "",
    created_at: new Date().toISOString(),
  },
  {
    id: "3",
    name: "Shuri",
    role: "SEO Specialist",
    description: "SEO 和内容优化专家，提升网站在搜索引擎中的排名",
    status: "online",
    capabilities: ["SEO", "内容创作", "数据分析", "关键词研究"],
    avatar_url: "",
    created_at: new Date().toISOString(),
  },
  {
    id: "4",
    name: "Friday",
    role: "Content Writer",
    description: "创意内容创作者，专注于高质量的文案和营销材料",
    status: "offline",
    capabilities: ["内容创作", "文案撰写", "社交媒体", "品牌传播"],
    avatar_url: "",
    created_at: new Date().toISOString(),
  },
]

export default function AgentsPage() {
  const router = useRouter()
  const [agents] = useState<Agent[]>(MOCK_AGENTS)

  const handleAgentClick = (agent: Agent) => {
    router.push(`/agents/${agent.id}`)
  }

  const handleCreateAgent = (agentData: Partial<Agent>) => {
    console.log("Creating agent:", agentData)
    // TODO: Integrate with Supabase
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
        <AgentGrid agents={agents} onAgentClick={handleAgentClick} />
      </div>
    </div>
  )
}
