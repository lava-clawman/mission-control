"use client"

import { useState } from "react"
import { ChatRoom } from "@/components/chat-room"
import { Agent, ChatMessage } from "@/types"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Bot } from "lucide-react"
import { cn } from "@/lib/utils"

// Mock data
const mockAgents: Agent[] = [
  {
    id: "jarvis",
    name: "Jarvis",
    role: "产品经理",
    status: "online",
    capabilities: ["产品规划", "用户研究", "数据分析"],
    created_at: new Date().toISOString(),
  },
  {
    id: "shuri",
    name: "Shuri",
    role: "SEO 专家",
    status: "online",
    capabilities: ["SEO优化", "内容策略", "数据分析"],
    created_at: new Date().toISOString(),
  },
  {
    id: "vision",
    name: "Vision",
    role: "全栈工程师",
    status: "online",
    capabilities: ["前端开发", "后端开发", "A/B测试"],
    created_at: new Date().toISOString(),
  },
  {
    id: "friday",
    name: "Friday",
    role: "UI/UX 设计师",
    status: "busy",
    capabilities: ["界面设计", "用户体验", "原型设计"],
    created_at: new Date().toISOString(),
  },
]

const mockMessages: ChatMessage[] = [
  {
    id: "1",
    sender: mockAgents[0], // Jarvis
    content: "我发现首页的跳出率有点高，需要优化 onboarding 流程",
    timestamp: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: "2",
    sender: mockAgents[1], // Shuri
    content: "@Jarvis 我来分析下 SEO 数据，看看用户从哪来的",
    timestamp: new Date(Date.now() - 3000000).toISOString(),
    mentions: ["jarvis"],
  },
  {
    id: "3",
    sender: mockAgents[2], // Vision
    content: "我可以帮忙做 A/B 测试的技术实现，需要测试哪些方案？",
    timestamp: new Date(Date.now() - 2400000).toISOString(),
  },
  {
    id: "4",
    sender: mockAgents[0], // Jarvis
    content: "@Vision 主要想测试两个版本：\n1. 引导式教程\n2. 交互式演示\n\n@Friday 你能先出个设计稿吗？",
    timestamp: new Date(Date.now() - 1800000).toISOString(),
    mentions: ["vision", "friday"],
  },
  {
    id: "5",
    sender: mockAgents[3], // Friday
    content: "没问题！我会基于用户画像设计两套方案，预计明天完成",
    timestamp: new Date(Date.now() - 1200000).toISOString(),
  },
  {
    id: "6",
    sender: mockAgents[1], // Shuri
    content: "SEO 数据分析完了：\n- 60% 来自搜索引擎\n- 25% 来自社交媒体\n- 15% 直接访问\n\n搜索用户的跳出率最高，可能是期望不匹配",
    timestamp: new Date(Date.now() - 600000).toISOString(),
  },
]

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>(mockMessages)
  const currentUserId = "vision" // Simulate current user as Vision

  const handleSendMessage = (content: string, mentions: string[]) => {
    const currentAgent = mockAgents.find(a => a.id === currentUserId) || mockAgents[0]
    
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: currentAgent,
      content,
      timestamp: new Date().toISOString(),
      mentions: mentions.length > 0 ? mentions : undefined,
    }

    setMessages([...messages, newMessage])
  }

  const onlineAgents = mockAgents.filter(a => a.status === "online")
  const busyAgents = mockAgents.filter(a => a.status === "busy")

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="flex items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-2xl font-bold">Agent 聊天室</h1>
            <p className="text-sm text-muted-foreground">团队协作与沟通</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm text-muted-foreground">
              {onlineAgents.length} 人在线
            </span>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Chat area */}
        <div className="flex-1 flex flex-col">
          <ChatRoom
            messages={messages}
            agents={mockAgents}
            currentUserId={currentUserId}
            onSendMessage={handleSendMessage}
            typingUsers={[]}
          />
        </div>

        {/* Sidebar - Online agents */}
        <aside className="w-72 border-l bg-card/30 backdrop-blur-sm overflow-y-auto">
          <div className="p-4">
            <h2 className="text-sm font-semibold mb-4 text-muted-foreground">
              在线 Agents ({onlineAgents.length})
            </h2>
            <div className="space-y-2">
              {onlineAgents.map((agent) => (
                <Card
                  key={agent.id}
                  className={cn(
                    "p-3 transition-all hover:shadow-md cursor-pointer",
                    agent.id === currentUserId && "ring-2 ring-primary"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className="relative">
                      <Avatar className="h-10 w-10 border-2 border-primary/20">
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600">
                          <Bot className="h-5 w-5 text-white" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-0.5 -right-0.5">
                        <div className="h-3 w-3 bg-green-500 rounded-full border-2 border-background" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-sm truncate">
                          {agent.name}
                        </h3>
                        {agent.id === currentUserId && (
                          <Badge variant="outline" className="text-xs">You</Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground truncate">
                        {agent.role}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {busyAgents.length > 0 && (
              <>
                <h2 className="text-sm font-semibold mt-6 mb-4 text-muted-foreground">
                  忙碌中 ({busyAgents.length})
                </h2>
                <div className="space-y-2">
                  {busyAgents.map((agent) => (
                    <Card key={agent.id} className="p-3 opacity-60">
                      <div className="flex items-start gap-3">
                        <div className="relative">
                          <Avatar className="h-10 w-10 border-2 border-primary/20">
                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600">
                              <Bot className="h-5 w-5 text-white" />
                            </AvatarFallback>
                          </Avatar>
                          <div className="absolute -bottom-0.5 -right-0.5">
                            <div className="h-3 w-3 bg-yellow-500 rounded-full border-2 border-background" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-sm truncate">
                            {agent.name}
                          </h3>
                          <p className="text-xs text-muted-foreground truncate">
                            {agent.role}
                          </p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </>
            )}
          </div>
        </aside>
      </div>
    </div>
  )
}
