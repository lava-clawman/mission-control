"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Smartphone, Loader2, Check } from "lucide-react"

function SetupContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  
  const [step, setStep] = useState<"loading" | "setup" | "verify" | "done">("loading")
  const [qrCode, setQrCode] = useState("")
  const [totpId, setTotpId] = useState("")
  const [totpSecret, setTotpSecret] = useState("")
  const [verifyCode, setVerifyCode] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!token) {
      setError("Missing setup token")
      return
    }
    setupTotp()
  }, [token])

  const setupTotp = async () => {
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/auth/totp/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      })
      const data = await res.json()
      
      if (data.error) {
        setError(data.error)
        setStep("loading")
        return
      }

      setQrCode(data.qrCode)
      setTotpId(data.id)
      setTotpSecret(data.secret)
      setStep("setup")
    } catch (err: any) {
      setError(err.message || "Setup error")
    } finally {
      setLoading(false)
    }
  }

  const verifyTotp = async () => {
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/auth/totp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: totpId, code: verifyCode }),
      })
      const data = await res.json()
      
      if (data.success) {
        setStep("done")
      } else {
        setError(data.error || "Verification failed")
      }
    } catch (err: any) {
      setError(err.message || "Verification error")
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && verifyCode.length === 6) {
      verifyTotp()
    }
  }

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-900">
        <p className="text-red-400">Missing setup token</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 p-4">
      <Card className="w-full max-w-md bg-zinc-800/50 border-zinc-700">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-zinc-100">🔐 初始设置</CardTitle>
          <CardDescription className="text-zinc-400">设置 TOTP 验证</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {step === "loading" && !error && (
            <div className="flex justify-center py-8">
              <Loader2 className="animate-spin text-zinc-400 h-8 w-8" />
            </div>
          )}

          {step === "setup" && (
            <div className="space-y-4">
              <p className="text-sm text-zinc-400 text-center">
                用 Authenticator App 扫描二维码
              </p>
              {qrCode && (
                <div className="flex justify-center">
                  <img src={qrCode} alt="TOTP QR Code" className="rounded-lg" />
                </div>
              )}
              <p className="text-xs text-zinc-500 text-center break-all">
                手动输入: {totpSecret}
              </p>
              <Button 
                onClick={() => setStep("verify")}
                className="w-full bg-orange-600 hover:bg-orange-700"
              >
                下一步：验证
              </Button>
            </div>
          )}

          {step === "verify" && (
            <div className="space-y-4">
              <p className="text-sm text-zinc-400 text-center">
                输入 App 中显示的 6 位验证码
              </p>
              <Input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                placeholder="000000"
                value={verifyCode}
                onChange={(e) => setVerifyCode(e.target.value.replace(/\D/g, ""))}
                onKeyDown={handleKeyDown}
                className="text-center text-2xl tracking-widest bg-zinc-700 border-zinc-600 text-zinc-100"
                autoFocus
              />
              <Button 
                onClick={verifyTotp} 
                disabled={loading || verifyCode.length !== 6}
                className="w-full bg-orange-600 hover:bg-orange-700"
              >
                {loading ? <Loader2 className="animate-spin" /> : "验证并完成"}
              </Button>
            </div>
          )}

          {step === "done" && (
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
                  <Check className="h-8 w-8 text-green-400" />
                </div>
              </div>
              <p className="text-green-400 font-medium">设置完成！</p>
              <Button 
                onClick={() => router.push("/login")}
                className="w-full bg-orange-600 hover:bg-orange-700"
              >
                前往登录
              </Button>
            </div>
          )}
          
          {error && (
            <p className="text-red-400 text-sm text-center">{error}</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default function SetupPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-zinc-900">
        <Loader2 className="animate-spin text-zinc-400 h-8 w-8" />
      </div>
    }>
      <SetupContent />
    </Suspense>
  )
}
