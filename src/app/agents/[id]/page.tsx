"use client"

import { use } from "react"
import { useRouter } from "next/navigation"
import { Agent } from "@/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Bot, ArrowLeft, Activity, CheckCircle2, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

// Mock data (same as agents page)
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

// Mock recent tasks
const MOCK_RECENT_TASKS = [
  {
    id: "1",
    title: "优化首页 SEO",
    status: "done" as const,
    completedAt: "2 小时前",
  },
  {
    id: "2",
    title: "编写产品文档",
    status: "in_progress" as const,
    startedAt: "进行中",
  },
  {
    id: "3",
    title: "重构登录组件",
    status: "done" as const,
    completedAt: "1 天前",
  },
]

// Mock recent activities
const MOCK_ACTIVITIES = [
  {
    id: "1",
    action: "完成任务",
    detail: "优化首页 SEO",
    timestamp: "2 小时前",
  },
  {
    id: "2",
    action: "状态变更",
    detail: "从离线变为在线",
    timestamp: "3 小时前",
  },
  {
    id: "3",
    action: "接受任务",
    detail: "编写产品文档",
    timestamp: "5 小时前",
  },
]

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

export default function AgentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const router = useRouter()
  const { id } = use(params)
  const agent = MOCK_AGENTS.find((a) => a.id === id)

  if (!agent) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-2xl font-semibold">Agent 未找到</p>
          <Button className="mt-4" onClick={() => router.push("/agents")}>
            返回列表
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container py-6 px-6">
          <Button
            variant="ghost"
            className="mb-4"
            onClick={() => router.push("/agents")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            返回列表
          </Button>

          <div className="flex items-start gap-6">
            <div className="relative">
              <Avatar className="h-20 w-20 border-2 border-primary/20">
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600">
                  <Bot className="h-10 w-10 text-white" />
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1">
                <div
                  className={cn(
                    "h-5 w-5 rounded-full border-2 border-background",
                    statusColors[agent.status]
                  )}
                >
                  {agent.status === "online" && (
                    <div
                      className={cn(
                        "absolute inset-0 rounded-full animate-ping opacity-75",
                        statusColors[agent.status]
                      )}
                    />
                  )}
                </div>
              </div>
            </div>

            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-3xl font-bold">{agent.name}</h1>
                  <p className="text-xl text-muted-foreground mt-1">
                    {agent.role}
                  </p>
                </div>
                <Badge variant="outline" className="text-sm capitalize">
                  {statusLabels[agent.status]}
                </Badge>
              </div>

              {agent.description && (
                <p className="text-muted-foreground mt-4 max-w-2xl">
                  {agent.description}
                </p>
              )}

              <div className="flex flex-wrap gap-2 mt-4">
                {agent.capabilities.map((capability) => (
                  <Badge key={capability} variant="secondary">
                    {capability}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container py-6 px-6">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Recent Tasks */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5" />
                最近任务
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {MOCK_RECENT_TASKS.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-start justify-between p-3 rounded-lg border bg-card/50 hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="font-medium">{task.title}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {task.status === "done"
                          ? `完成于 ${task.completedAt}`
                          : task.startedAt}
                      </p>
                    </div>
                    <Badge
                      variant={
                        task.status === "done" ? "default" : "secondary"
                      }
                    >
                      {task.status === "done" ? "已完成" : "进行中"}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                最近活动
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {MOCK_ACTIVITIES.map((activity, index) => (
                  <div key={activity.id} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                      {index < MOCK_ACTIVITIES.length - 1 && (
                        <div className="w-px h-full bg-border mt-1" />
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <p className="font-medium">{activity.action}</p>
                      <p className="text-sm text-muted-foreground">
                        {activity.detail}
                      </p>
                      <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {activity.timestamp}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Stats Card */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>统计信息</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-4">
                <div className="text-center p-4 rounded-lg border">
                  <p className="text-2xl font-bold">12</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    已完成任务
                  </p>
                </div>
                <div className="text-center p-4 rounded-lg border">
                  <p className="text-2xl font-bold">3</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    进行中任务
                  </p>
                </div>
                <div className="text-center p-4 rounded-lg border">
                  <p className="text-2xl font-bold">98%</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    任务完成率
                  </p>
                </div>
                <div className="text-center p-4 rounded-lg border">
                  <p className="text-2xl font-bold">24h</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    平均响应时间
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
