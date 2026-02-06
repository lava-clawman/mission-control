'use client'

import { useState } from 'react'
import { startAuthentication } from '@simplewebauthn/browser'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'passkey' | 'totp'>('passkey')
  const [totpCode, setTotpCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handlePasskeyLogin = async () => {
    setLoading(true)
    setError('')
    
    try {
      // Get authentication options
      const optionsRes = await fetch('/api/auth/passkey/login-options', {
        method: 'POST',
      })
      
      if (!optionsRes.ok) {
        const data = await optionsRes.json()
        throw new Error(data.error || 'Failed to get login options')
      }
      
      const options = await optionsRes.json()
      
      // Start authentication
      const credential = await startAuthentication(options)
      
      // Verify authentication
      const verifyRes = await fetch('/api/auth/passkey/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential }),
      })
      
      if (!verifyRes.ok) {
        const data = await verifyRes.json()
        throw new Error(data.error || 'Login failed')
      }
      
      // Redirect to dashboard
      router.push('/')
    } catch (err: any) {
      console.error('Passkey login error:', err)
      setError(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  const handleTotpLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      const res = await fetch('/api/auth/totp/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: totpCode }),
      })
      
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Login failed')
      }
      
      // Redirect to dashboard
      router.push('/')
    } catch (err: any) {
      console.error('TOTP login error:', err)
      setError(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 mb-4">
            <span className="text-3xl">🎯</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Mission Control</h1>
          <p className="text-purple-300">Secure Authentication</p>
        </div>

        {/* Login Card */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-white/10">
            <button
              onClick={() => setActiveTab('passkey')}
              className={`flex-1 py-4 px-6 font-medium transition-all ${
                activeTab === 'passkey'
                  ? 'bg-white/10 text-white border-b-2 border-purple-400'
                  : 'text-purple-300 hover:bg-white/5'
              }`}
            >
              🔐 Passkey
            </button>
            <button
              onClick={() => setActiveTab('totp')}
              className={`flex-1 py-4 px-6 font-medium transition-all ${
                activeTab === 'totp'
                  ? 'bg-white/10 text-white border-b-2 border-purple-400'
                  : 'text-purple-300 hover:bg-white/5'
              }`}
            >
              📱 TOTP
            </button>
          </div>

          {/* Content */}
          <div className="p-8">
            {error && (
              <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm">
                {error}
              </div>
            )}

            {activeTab === 'passkey' ? (
              <div className="space-y-6">
                <p className="text-purple-200 text-center">
                  Use your device&apos;s biometric authentication (Face ID, Touch ID, or Windows Hello)
                </p>
                <button
                  onClick={handlePasskeyLogin}
                  disabled={loading}
                  className="w-full py-4 px-6 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-gray-500 disabled:to-gray-600 text-white font-semibold rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg disabled:cursor-not-allowed"
                >
                  {loading ? 'Authenticating...' : '🔓 Login with Passkey'}
                </button>
              </div>
            ) : (
              <form onSubmit={handleTotpLogin} className="space-y-6">
                <div>
                  <label className="block text-purple-200 font-medium mb-2">
                    Enter 6-digit code
                  </label>
                  <input
                    type="text"
                    value={totpCode}
                    onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="000000"
                    maxLength={6}
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-purple-400 text-center text-2xl font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-purple-400"
                    autoComplete="off"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading || totpCode.length !== 6}
                  className="w-full py-4 px-6 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-gray-500 disabled:to-gray-600 text-white font-semibold rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg disabled:cursor-not-allowed"
                >
                  {loading ? 'Verifying...' : '✓ Verify & Login'}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-purple-300 text-sm">
            Secured by WebAuthn & TOTP
          </p>
        </div>
      </div>
    </div>
  )
}
