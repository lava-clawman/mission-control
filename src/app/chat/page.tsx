"use client"

import { useEffect, useState } from "react"
import { ChatRoom } from "@/components/chat-room"
import { Agent, ChatMessage } from "@/types"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Bot } from "lucide-react"
import { cn } from "@/lib/utils"

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [agents, setAgents] = useState<Agent[]>([])
  const [loading, setLoading] = useState(true)
  const currentUserId = "vision" // Simulate current user as Vision

  useEffect(() => {
    // Load both messages and agents
    Promise.all([
      fetch("/api/messages").then(res => res.json()),
      fetch("/api/agents").then(res => res.json())
    ])
      .then(([messagesData, agentsData]) => {
        setMessages(Array.isArray(messagesData) ? messagesData : [])
        setAgents(Array.isArray(agentsData) ? agentsData : [])
        setLoading(false)
      })
      .catch(err => {
        console.error("Error loading data:", err)
        setMessages([])
        setAgents([])
        setLoading(false)
      })
  }, [])

  const handleSendMessage = async (content: string, mentions: string[]) => {
    const currentAgent = agents.find(a => a.id === currentUserId) || agents[0]
    
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: currentAgent,
      content,
      timestamp: new Date().toISOString(),
      mentions: mentions.length > 0 ? mentions : undefined,
    }

    // Optimistically add to UI
    setMessages([...messages, newMessage])

    // Send to API
    try {
      await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sender_id: currentAgent.id,
          content,
          mentions: mentions.length > 0 ? mentions : undefined,
        })
      })
    } catch (err) {
      console.error("Error sending message:", err)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    )
  }

  const onlineAgents = agents.filter(a => a.status === "online")
  const busyAgents = agents.filter(a => a.status === "busy")

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
            agents={agents}
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
