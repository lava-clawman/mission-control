import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Link from "next/link"
import { CheckSquare, Users, Activity, LayoutDashboard, MessageSquare } from "lucide-react"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Mission Control - AI Agent Coordination",
  description: "Coordinate your AI agents and manage tasks efficiently",
}

const navItems = [
  { href: "/", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/tasks", icon: CheckSquare, label: "Tasks" },
  { href: "/agents", icon: Users, label: "Agents" },
  { href: "/chat", icon: MessageSquare, label: "Chat" },
  { href: "/activity", icon: Activity, label: "Activity", disabled: true },
]

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <div className="flex min-h-screen">
          {/* Sidebar */}
          <aside className="w-64 border-r bg-card/50 backdrop-blur-sm">
            <div className="flex h-full flex-col gap-2">
              <div className="flex h-14 items-center border-b px-6">
                <Link href="/" className="flex items-center gap-2 font-semibold">
                  <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <span className="text-white text-sm font-bold">MC</span>
                  </div>
                  <span className="text-lg">Mission Control</span>
                </Link>
              </div>
              <nav className="flex-1 px-3 py-4">
                <ul className="space-y-1">
                  {navItems.map((item) => (
                    <li key={item.href}>
                      {item.disabled ? (
                        <div className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground opacity-50 cursor-not-allowed">
                          <item.icon className="h-4 w-4" />
                          {item.label}
                        </div>
                      ) : (
                        <Link
                          href={item.href}
                          className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:bg-accent hover:text-accent-foreground"
                        >
                          <item.icon className="h-4 w-4" />
                          {item.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </nav>
              <div className="border-t p-4">
                <p className="text-xs text-muted-foreground text-center">
                  Built with ❤️ by Lava
                </p>
              </div>
            </div>
          </aside>

          {/* Main content */}
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}
