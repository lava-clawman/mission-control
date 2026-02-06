"use client"

import { use, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Agent } from "@/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Bot, ArrowLeft, Activity, CheckCircle2, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

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
  const [agent, setAgent] = useState<Agent | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/agents/${id}`)
      .then(res => {
        if (!res.ok) throw new Error("Agent not found")
        return res.json()
      })
      .then(data => {
        setAgent(data)
        setLoading(false)
      })
      .catch(err => {
        console.error("Error loading agent:", err)
        setLoading(false)
      })
  }, [id])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    )
  }

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
                {agent.capabilities?.map((capability) => (
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
          {/* Recent Tasks - Placeholder */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5" />
                最近任务
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <p>暂无任务数据</p>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity - Placeholder */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                最近活动
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <p>暂无活动数据</p>
              </div>
            </CardContent>
          </Card>

          {/* Stats Card - Placeholder */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>统计信息</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-4">
                <div className="text-center p-4 rounded-lg border">
                  <p className="text-2xl font-bold">-</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    已完成任务
                  </p>
                </div>
                <div className="text-center p-4 rounded-lg border">
                  <p className="text-2xl font-bold">-</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    进行中任务
                  </p>
                </div>
                <div className="text-center p-4 rounded-lg border">
                  <p className="text-2xl font-bold">-</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    任务完成率
                  </p>
                </div>
                <div className="text-center p-4 rounded-lg border">
                  <p className="text-2xl font-bold">-</p>
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
