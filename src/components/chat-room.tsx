"use client"

import { useEffect, useRef, useState } from "react"
import { ChatMessage as ChatMessageType, Agent } from "@/types"
import { ChatMessage } from "./chat-message"
import { ChatInput } from "./chat-input"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface ChatRoomProps {
  messages: ChatMessageType[]
  agents: Agent[]
  currentUserId?: string
  onSendMessage: (content: string, mentions: string[]) => void
  onLoadMore?: () => void
  hasMore?: boolean
  isLoading?: boolean
  typingUsers?: Agent[]
}

export function ChatRoom({
  messages,
  agents,
  currentUserId,
  onSendMessage,
  onLoadMore,
  hasMore = false,
  isLoading = false,
  typingUsers = [],
}: ChatRoomProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (shouldAutoScroll) {
      scrollToBottom()
    }
  }, [messages, shouldAutoScroll])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  // Check if user is near bottom
  const handleScroll = () => {
    if (!messagesContainerRef.current) return

    const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight
    
    // If user is within 100px of bottom, enable auto-scroll
    setShouldAutoScroll(distanceFromBottom < 100)
  }

  return (
    <div className="flex flex-col h-full">
      {/* Messages container */}
      <div
        ref={messagesContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-4 space-y-1"
      >
        {/* Load more button */}
        {hasMore && (
          <div className="flex justify-center mb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={onLoadMore}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  加载中...
                </>
              ) : (
                "加载更多消息"
              )}
            </Button>
          </div>
        )}

        {/* Messages */}
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <div className="text-center">
              <p className="text-lg mb-2">还没有消息</p>
              <p className="text-sm">开始对话吧！</p>
            </div>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message}
                isOwnMessage={message.sender.id === currentUserId}
              />
            ))}
          </>
        )}

        {/* Typing indicator */}
        {typingUsers.length > 0 && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground animate-in fade-in duration-200">
            <div className="flex gap-1">
              <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
            <span>
              {typingUsers.map(u => u.name).join(", ")} 正在输入...
            </span>
          </div>
        )}

        {/* Scroll anchor */}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <ChatInput agents={agents} onSend={onSendMessage} />
    </div>
  )
}
