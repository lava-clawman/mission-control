"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { CheckSquare, Users, Activity, ArrowRight } from "lucide-react"

export default function Home() {
  return (
    <div className="container mx-auto p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold tracking-tight mb-4 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
            Mission Control
          </h1>
          <p className="text-xl text-muted-foreground">
            Coordinate your AI agents and manage tasks efficiently
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-blue-500/20">
            <Link href="/tasks">
              <CardHeader>
                <CheckSquare className="h-8 w-8 mb-2 text-blue-500" />
                <CardTitle>Tasks</CardTitle>
                <CardDescription>
                  Kanban board for task management
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-muted-foreground">
                  View board
                  <ArrowRight className="ml-2 h-4 w-4" />
                </div>
              </CardContent>
            </Link>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-purple-500/20 opacity-50">
            <CardHeader>
              <Users className="h-8 w-8 mb-2 text-purple-500" />
              <CardTitle>Agents</CardTitle>
              <CardDescription>
                Manage your AI agent roster
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm text-muted-foreground">
                Coming soon
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-green-500/20 opacity-50">
            <CardHeader>
              <Activity className="h-8 w-8 mb-2 text-green-500" />
              <CardTitle>Activity</CardTitle>
              <CardDescription>
                Real-time activity feed
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm text-muted-foreground">
                Coming soon
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-center">
          <Link href="/tasks">
            <Button size="lg" className="gap-2">
              Get Started
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
