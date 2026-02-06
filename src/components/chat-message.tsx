"use client"

import { ChatMessage as ChatMessageType } from "@/types"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Bot } from "lucide-react"
import { format } from "date-fns"
import ReactMarkdown from "react-markdown"
import { cn } from "@/lib/utils"

interface ChatMessageProps {
  message: ChatMessageType
  isOwnMessage?: boolean
}

export function ChatMessage({ message, isOwnMessage = false }: ChatMessageProps) {
  // Highlight @mentions in the message
  const highlightMentions = (content: string) => {
    const parts = content.split(/(@\w+)/g)
    return parts.map((part, index) => {
      if (part.startsWith("@")) {
        return (
          <span
            key={index}
            className="text-blue-500 font-semibold hover:underline cursor-pointer"
          >
            {part}
          </span>
        )
      }
      return part
    })
  }

  return (
    <div
      className={cn(
        "flex gap-3 mb-4 animate-in slide-in-from-bottom-2 duration-300",
        isOwnMessage && "flex-row-reverse"
      )}
    >
      {/* Avatar */}
      <div className="flex-shrink-0">
        <Avatar className="h-10 w-10 border-2 border-primary/20">
          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600">
            <Bot className="h-5 w-5 text-white" />
          </AvatarFallback>
        </Avatar>
      </div>

      {/* Message bubble */}
      <div className={cn("flex-1 max-w-[70%]", isOwnMessage && "flex flex-col items-end")}>
        {/* Sender name and timestamp */}
        <div className={cn("flex items-baseline gap-2 mb-1", isOwnMessage && "flex-row-reverse")}>
          <span className="font-semibold text-sm">{message.sender.name}</span>
          <span className="text-xs text-muted-foreground">
            {format(new Date(message.timestamp), "HH:mm")}
          </span>
        </div>

        {/* Message content */}
        <div
          className={cn(
            "rounded-2xl px-4 py-2.5 shadow-sm",
            isOwnMessage
              ? "bg-primary text-primary-foreground rounded-tr-sm"
              : "bg-muted rounded-tl-sm"
          )}
        >
          <div className="text-sm prose prose-sm dark:prose-invert max-w-none prose-p:my-1 prose-p:leading-relaxed">
            {message.content.includes("@") ? (
              <div>{highlightMentions(message.content)}</div>
            ) : (
              <ReactMarkdown
                components={{
                  p: ({ children }) => <p className="mb-0">{children}</p>,
                  a: ({ href, children }) => (
                    <a href={href} className="text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">
                      {children}
                    </a>
                  ),
                }}
              >
                {message.content}
              </ReactMarkdown>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
