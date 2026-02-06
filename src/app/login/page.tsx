"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Smartphone, Loader2, Check } from "lucide-react"

export default function LoginPage() {
  const [totpCode, setTotpCode] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const handleTotpLogin = async () => {
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/auth/totp/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: totpCode }),
      })
      const data = await res.json()
      if (data.success) {
        setSuccess(true)
        // 使用 window.location 强制刷新跳转
        setTimeout(() => {
          window.location.href = "/"
        }, 500)
      } else {
        setError(data.error || "Login failed")
      }
    } catch (err) {
      setError("Network error")
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && totpCode.length === 6) {
      handleTotpLogin()
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900">
      <Card className="w-full max-w-md bg-zinc-800/50 border-zinc-700">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-zinc-100">🌋 Mission Control</CardTitle>
          <CardDescription className="text-zinc-400">输入验证码登录</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {success ? (
            <div className="text-center py-4 space-y-3">
              <div className="flex justify-center">
                <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                  <Check className="h-6 w-6 text-green-400" />
                </div>
              </div>
              <p className="text-green-400 font-medium">登录成功！正在跳转...</p>
            </div>
          ) : (
            <>
              <p className="text-sm text-zinc-400 text-center">
                输入 Authenticator App 中的 6 位验证码
              </p>
              <Input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                placeholder="000000"
                value={totpCode}
                onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, ""))}
                onKeyDown={handleKeyDown}
                className="text-center text-2xl tracking-widest bg-zinc-700 border-zinc-600 text-zinc-100"
                autoFocus
              />
              <Button 
                onClick={handleTotpLogin} 
                disabled={loading || totpCode.length !== 6}
                className="w-full bg-orange-600 hover:bg-orange-700"
              >
                {loading ? <Loader2 className="animate-spin mr-2" /> : <Smartphone className="mr-2" />}
                验证
              </Button>
              
              {error && (
                <p className="text-red-400 text-sm text-center">{error}</p>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
