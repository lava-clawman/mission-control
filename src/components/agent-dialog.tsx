"use client"

import { useState } from "react"
import { Agent } from "@/types"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { X } from "lucide-react"

interface AgentDialogProps {
  agent?: Agent
  trigger: React.ReactNode
  onSave?: (agent: Partial<Agent>) => void
}

const AVAILABLE_CAPABILITIES = [
  "编码",
  "测试",
  "部署",
  "SEO",
  "内容创作",
  "数据分析",
  "设计",
  "项目管理",
  "DevOps",
  "安全审计",
]

export function AgentDialog({ agent, trigger, onSave }: AgentDialogProps) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: agent?.name || "",
    role: agent?.role || "",
    description: agent?.description || "",
    status: agent?.status || "offline",
    capabilities: agent?.capabilities || [],
    avatar_url: agent?.avatar_url || "",
  })

  const handleSave = () => {
    onSave?.(formData)
    setOpen(false)
  }

  const toggleCapability = (capability: string) => {
    setFormData((prev) => ({
      ...prev,
      capabilities: prev.capabilities.includes(capability)
        ? prev.capabilities.filter((c) => c !== capability)
        : [...prev.capabilities, capability],
    }))
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {agent ? "编辑 Agent" : "注册新 Agent"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">名称</Label>
            <Input
              id="name"
              placeholder="输入 Agent 名称"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">角色</Label>
            <Input
              id="role"
              placeholder="例如: Developer, SEO Specialist"
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">描述</Label>
            <Textarea
              id="description"
              placeholder="描述这个 Agent 的职责和特点"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">状态</Label>
            <Select
              value={formData.status}
              onValueChange={(value: any) =>
                setFormData({ ...formData, status: value })
              }
            >
              <SelectTrigger id="status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="online">在线</SelectItem>
                <SelectItem value="offline">离线</SelectItem>
                <SelectItem value="busy">忙碌</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="avatar_url">头像 URL (可选)</Label>
            <Input
              id="avatar_url"
              placeholder="https://example.com/avatar.png"
              value={formData.avatar_url}
              onChange={(e) =>
                setFormData({ ...formData, avatar_url: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label>能力标签</Label>
            <div className="border rounded-lg p-3 space-y-2">
              <div className="flex flex-wrap gap-2">
                {AVAILABLE_CAPABILITIES.map((capability) => (
                  <Badge
                    key={capability}
                    variant={
                      formData.capabilities.includes(capability)
                        ? "default"
                        : "outline"
                    }
                    className="cursor-pointer hover:scale-105 transition-transform"
                    onClick={() => toggleCapability(capability)}
                  >
                    {capability}
                    {formData.capabilities.includes(capability) && (
                      <X className="ml-1 h-3 w-3" />
                    )}
                  </Badge>
                ))}
              </div>
              {formData.capabilities.length > 0 && (
                <p className="text-xs text-muted-foreground">
                  已选择 {formData.capabilities.length} 个能力
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => setOpen(false)}>
            取消
          </Button>
          <Button onClick={handleSave}>保存</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
