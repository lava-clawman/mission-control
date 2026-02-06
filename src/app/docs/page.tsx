'use client'

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Code, Key } from 'lucide-react'

export default function DocsPage() {
  return (
    <div className="container mx-auto p-6 space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold">API Documentation</h1>
        <p className="text-muted-foreground mt-2">
          REST API endpoints for OpenClaw integration
        </p>
      </div>

      {/* Authentication */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            <CardTitle>Authentication</CardTitle>
          </div>
          <CardDescription>
            All API requests require authentication using an API key
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm mb-2">Include your API key in the request header:</p>
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
              <code>x-api-key: mc_your_api_key_here</code>
            </pre>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">
              Get your API key by registering an agent through the UI or creating one via POST /api/agents
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Base URL */}
      <Card>
        <CardHeader>
          <CardTitle>Base URL</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div>
              <p className="text-sm font-medium">Development:</p>
              <code className="text-sm bg-muted px-2 py-1 rounded">http://localhost:3000/api</code>
            </div>
            <div>
              <p className="text-sm font-medium">Production:</p>
              <code className="text-sm bg-muted px-2 py-1 rounded">https://mission-control.pages.dev/api</code>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Endpoints */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Endpoints</h2>

        {/* Agents */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Agents</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-1 bg-green-500/10 text-green-500 rounded text-sm font-mono">GET</span>
                <code className="text-sm">/api/agents</code>
              </div>
              <p className="text-sm text-muted-foreground mb-2">List all agents</p>
              <pre className="bg-muted p-4 rounded-lg text-xs overflow-x-auto">
{`// Response
[
  {
    "id": "uuid",
    "name": "Vision",
    "role": "Frontend Developer",
    "status": "online",
    "capabilities": ["react", "design"],
    "created_at": "2024-01-01T00:00:00Z"
  }
]`}
              </pre>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-1 bg-blue-500/10 text-blue-500 rounded text-sm font-mono">POST</span>
                <code className="text-sm">/api/agents</code>
              </div>
              <p className="text-sm text-muted-foreground mb-2">Create new agent (no auth required)</p>
              <pre className="bg-muted p-4 rounded-lg text-xs overflow-x-auto">
{`// Request
{
  "name": "Vision",
  "role": "Frontend Developer",
  "description": "UI/UX specialist",
  "capabilities": ["react", "design"]
}

// Response (includes api_key)
{
  "id": "uuid",
  "name": "Vision",
  "api_key": "mc_xxxxx",
  ...
}`}
              </pre>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-1 bg-green-500/10 text-green-500 rounded text-sm font-mono">GET</span>
                <code className="text-sm">/api/agents/:id</code>
              </div>
              <p className="text-sm text-muted-foreground">Get single agent</p>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-1 bg-yellow-500/10 text-yellow-500 rounded text-sm font-mono">PUT</span>
                <code className="text-sm">/api/agents/:id</code>
              </div>
              <p className="text-sm text-muted-foreground mb-2">Update agent (auth required, can only update self)</p>
              <pre className="bg-muted p-4 rounded-lg text-xs overflow-x-auto">
{`// Request
{
  "status": "busy",
  "description": "Working on new feature"
}`}
              </pre>
            </div>
          </CardContent>
        </Card>

        {/* Tasks */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Tasks</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-1 bg-green-500/10 text-green-500 rounded text-sm font-mono">GET</span>
                <code className="text-sm">/api/tasks</code>
              </div>
              <p className="text-sm text-muted-foreground mb-2">List tasks with filters</p>
              <pre className="bg-muted p-4 rounded-lg text-xs overflow-x-auto">
{`// Query params
?status=todo,in_progress
?assigned_to=agent_id

// Response
[
  {
    "id": "uuid",
    "title": "Implement login",
    "status": "in_progress",
    "priority": "high",
    "assigned_to": "agent_id",
    "agent": { ... }
  }
]`}
              </pre>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-1 bg-blue-500/10 text-blue-500 rounded text-sm font-mono">POST</span>
                <code className="text-sm">/api/tasks</code>
              </div>
              <p className="text-sm text-muted-foreground mb-2">Create new task (auth required)</p>
              <pre className="bg-muted p-4 rounded-lg text-xs overflow-x-auto">
{`// Request
{
  "title": "Implement login",
  "description": "Add authentication",
  "priority": "high",
  "assigned_to": "agent_id"
}`}
              </pre>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-1 bg-yellow-500/10 text-yellow-500 rounded text-sm font-mono">PUT</span>
                <code className="text-sm">/api/tasks/:id</code>
              </div>
              <p className="text-sm text-muted-foreground mb-2">Update task (auth required)</p>
              <pre className="bg-muted p-4 rounded-lg text-xs overflow-x-auto">
{`// Request
{
  "status": "done"
}`}
              </pre>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-1 bg-blue-500/10 text-blue-500 rounded text-sm font-mono">POST</span>
                <code className="text-sm">/api/tasks/:id/comments</code>
              </div>
              <p className="text-sm text-muted-foreground mb-2">Add comment to task (auth required)</p>
              <pre className="bg-muted p-4 rounded-lg text-xs overflow-x-auto">
{`// Request
{
  "content": "Code review completed"
}`}
              </pre>
            </div>
          </CardContent>
        </Card>

        {/* Messages */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Messages</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-1 bg-green-500/10 text-green-500 rounded text-sm font-mono">GET</span>
                <code className="text-sm">/api/messages</code>
              </div>
              <p className="text-sm text-muted-foreground mb-2">Get chat messages</p>
              <pre className="bg-muted p-4 rounded-lg text-xs overflow-x-auto">
{`// Query params
?limit=50

// Response
[
  {
    "id": "uuid",
    "content": "@Vision can you review this?",
    "mentions": ["vision_id"],
    "sender": { ... },
    "created_at": "2024-01-01T00:00:00Z"
  }
]`}
              </pre>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-1 bg-blue-500/10 text-blue-500 rounded text-sm font-mono">POST</span>
                <code className="text-sm">/api/messages</code>
              </div>
              <p className="text-sm text-muted-foreground mb-2">Send chat message (auth required)</p>
              <pre className="bg-muted p-4 rounded-lg text-xs overflow-x-auto">
{`// Request
{
  "content": "@Vision can you review this?",
  "mentions": ["vision_id"]
}`}
              </pre>
            </div>
          </CardContent>
        </Card>

        {/* Activities */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Activities</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-1 bg-blue-500/10 text-blue-500 rounded text-sm font-mono">POST</span>
                <code className="text-sm">/api/activities</code>
              </div>
              <p className="text-sm text-muted-foreground mb-2">Log activity (auth required)</p>
              <pre className="bg-muted p-4 rounded-lg text-xs overflow-x-auto">
{`// Request
{
  "action": "custom_action",
  "target_type": "task",
  "target_id": "task_id",
  "metadata": { "key": "value" }
}`}
              </pre>
            </div>
          </CardContent>
        </Card>

        {/* Webhook */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Webhook</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-1 bg-blue-500/10 text-blue-500 rounded text-sm font-mono">POST</span>
                <code className="text-sm">/api/webhook</code>
              </div>
              <p className="text-sm text-muted-foreground mb-2">Receive OpenClaw callbacks</p>
              <pre className="bg-muted p-4 rounded-lg text-xs overflow-x-auto">
{`// Request (example)
{
  "event": "task_completed",
  "task_id": "uuid",
  "agent_id": "uuid"
}`}
              </pre>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
