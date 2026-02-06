"use client"

import { useState, useRef, KeyboardEvent } from "react"
import { Agent } from "@/types"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Send } from "lucide-react"
import { MentionPopover } from "./mention-popover"

interface ChatInputProps {
  agents: Agent[]
  onSend: (message: string, mentions: string[]) => void
}

export function ChatInput({ agents, onSend }: ChatInputProps) {
  const [message, setMessage] = useState("")
  const [showMentions, setShowMentions] = useState(false)
  const [filteredAgents, setFilteredAgents] = useState<Agent[]>([])
  const [selectedMentionIndex, setSelectedMentionIndex] = useState(0)
  const [mentionStartPos, setMentionStartPos] = useState<number | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleInputChange = (value: string) => {
    setMessage(value)

    // Check for @ mentions
    const cursorPos = textareaRef.current?.selectionStart || 0
    const textBeforeCursor = value.slice(0, cursorPos)
    const lastAtIndex = textBeforeCursor.lastIndexOf("@")

    if (lastAtIndex !== -1) {
      const textAfterAt = textBeforeCursor.slice(lastAtIndex + 1)
      
      // Only show mentions if @ is at start or after a space, and no space after @
      const charBeforeAt = lastAtIndex > 0 ? textBeforeCursor[lastAtIndex - 1] : " "
      if ((charBeforeAt === " " || lastAtIndex === 0) && !textAfterAt.includes(" ")) {
        const query = textAfterAt.toLowerCase()
        const filtered = agents.filter(agent =>
          agent.name.toLowerCase().includes(query)
        )
        setFilteredAgents(filtered)
        setShowMentions(true)
        setMentionStartPos(lastAtIndex)
        setSelectedMentionIndex(0)
        return
      }
    }

    setShowMentions(false)
  }

  const insertMention = (agent: Agent) => {
    if (mentionStartPos === null) return

    const before = message.slice(0, mentionStartPos)
    const after = message.slice(textareaRef.current?.selectionStart || 0)
    const newMessage = `${before}@${agent.name} ${after}`
    
    setMessage(newMessage)
    setShowMentions(false)
    setMentionStartPos(null)
    
    // Focus back to textarea
    setTimeout(() => {
      textareaRef.current?.focus()
      const newCursorPos = mentionStartPos + agent.name.length + 2
      textareaRef.current?.setSelectionRange(newCursorPos, newCursorPos)
    }, 0)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (showMentions && filteredAgents.length > 0) {
      if (e.key === "ArrowDown") {
        e.preventDefault()
        setSelectedMentionIndex((prev) =>
          prev < filteredAgents.length - 1 ? prev + 1 : prev
        )
      } else if (e.key === "ArrowUp") {
        e.preventDefault()
        setSelectedMentionIndex((prev) => (prev > 0 ? prev - 1 : prev))
      } else if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault()
        insertMention(filteredAgents[selectedMentionIndex])
      } else if (e.key === "Escape") {
        setShowMentions(false)
      }
      return
    }

    // Ctrl+Enter or Cmd+Enter to send
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleSend = () => {
    if (!message.trim()) return

    // Extract mentions
    const mentionRegex = /@(\w+)/g
    const mentions: string[] = []
    let match

    while ((match = mentionRegex.exec(message)) !== null) {
      const agentName = match[1]
      const agent = agents.find(a => a.name === agentName)
      if (agent) {
        mentions.push(agent.id)
      }
    }

    onSend(message.trim(), mentions)
    setMessage("")
    setShowMentions(false)
  }

  return (
    <div className="relative border-t bg-card/50 backdrop-blur-sm p-4">
      {showMentions && (
        <MentionPopover
          agents={filteredAgents}
          onSelect={insertMention}
          selectedIndex={selectedMentionIndex}
        />
      )}
      
      <div className="flex gap-2">
        <Textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => handleInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="输入消息... (@ 提及 Agent, Ctrl+Enter 发送)"
          className="min-h-[60px] max-h-[200px] resize-none"
          rows={2}
        />
        <Button
          onClick={handleSend}
          disabled={!message.trim()}
          className="self-end"
          size="icon"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="mt-2 text-xs text-muted-foreground">
        提示: 使用 @ 提及 Agent，Ctrl+Enter 发送消息
      </div>
    </div>
  )
}
