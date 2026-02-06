'use client'

import { useState, useEffect, Suspense } from 'react'
import { startRegistration } from '@simplewebauthn/browser'
import { useRouter, useSearchParams } from 'next/navigation'

function SetupContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const setupToken = searchParams.get('token')
  
  const [activeTab, setActiveTab] = useState<'passkey' | 'totp'>('passkey')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [isSetupComplete, setIsSetupComplete] = useState(false)
  const [checkingStatus, setCheckingStatus] = useState(true)
  
  // TOTP setup state
  const [totpSecret, setTotpSecret] = useState('')
  const [totpQrCode, setTotpQrCode] = useState('')
  const [totpVerifyCode, setTotpVerifyCode] = useState('')
  const [totpSetupComplete, setTotpSetupComplete] = useState(false)
  
  // Passkey setup state
  const [passkeySetupComplete, setPasskeySetupComplete] = useState(false)
  const [deviceName, setDeviceName] = useState('')

  useEffect(() => {
    checkSetupStatus()
  }, [])

  const checkSetupStatus = async () => {
    try {
      const res = await fetch('/api/auth/setup-status')
      const data = await res.json()
      
      if (data.isSetupComplete) {
        setIsSetupComplete(true)
      }
    } catch (err) {
      console.error('Failed to check setup status:', err)
    } finally {
      setCheckingStatus(false)
    }
  }

  const handlePasskeySetup = async () => {
    if (!setupToken) {
      setError('Setup token is required')
      return
    }
    
    setLoading(true)
    setError('')
    
    try {
      // Get registration options
      const optionsRes = await fetch('/api/auth/passkey/register-options', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ setupToken }),
      })
      
      if (!optionsRes.ok) {
        const data = await optionsRes.json()
        throw new Error(data.error || 'Failed to get registration options')
      }
      
      const options = await optionsRes.json()
      
      // Start registration
      const credential = await startRegistration(options)
      
      // Complete registration
      const registerRes = await fetch('/api/auth/passkey/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential, deviceName: deviceName || 'My Device' }),
      })
      
      if (!registerRes.ok) {
        const data = await registerRes.json()
        throw new Error(data.error || 'Registration failed')
      }
      
      setPasskeySetupComplete(true)
    } catch (err: any) {
      console.error('Passkey setup error:', err)
      setError(err.message || 'Setup failed')
    } finally {
      setLoading(false)
    }
  }

  const handleTotpSetup = async () => {
    if (!setupToken) {
      setError('Setup token is required')
      return
    }
    
    setLoading(true)
    setError('')
    
    try {
      const res = await fetch('/api/auth/totp/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ setupToken }),
      })
      
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Setup failed')
      }
      
      const data = await res.json()
      setTotpSecret(data.secret)
      setTotpQrCode(data.qrCode)
    } catch (err: any) {
      console.error('TOTP setup error:', err)
      setError(err.message || 'Setup failed')
    } finally {
      setLoading(false)
    }
  }

  const handleTotpVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      const res = await fetch('/api/auth/totp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: totpVerifyCode }),
      })
      
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Verification failed')
      }
      
      setTotpSetupComplete(true)
    } catch (err: any) {
      console.error('TOTP verify error:', err)
      setError(err.message || 'Verification failed')
    } finally {
      setLoading(false)
    }
  }

  const handleComplete = () => {
    router.push('/login')
  }

  if (checkingStatus) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Checking setup status...</div>
      </div>
    )
  }

  if (isSetupComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <div className="max-w-md bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl p-8 text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h1 className="text-2xl font-bold text-white mb-4">Setup Already Complete</h1>
          <p className="text-purple-200 mb-6">
            Authentication has already been configured. Please use the login page.
          </p>
          <button
            onClick={() => router.push('/login')}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold rounded-xl transition-all"
          >
            Go to Login
          </button>
        </div>
      </div>
    )
  }

  if (!setupToken) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <div className="max-w-md bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl p-8 text-center">
          <div className="text-6xl mb-4">🚫</div>
          <h1 className="text-2xl font-bold text-white mb-4">Setup Token Required</h1>
          <p className="text-purple-200">
            Please provide a valid setup token in the URL.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 mb-4">
            <span className="text-3xl">🎯</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">First-Time Setup</h1>
          <p className="text-purple-300">Configure your authentication method</p>
        </div>

        {/* Setup Card */}
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
              🔐 Passkey {passkeySetupComplete && '✓'}
            </button>
            <button
              onClick={() => setActiveTab('totp')}
              className={`flex-1 py-4 px-6 font-medium transition-all ${
                activeTab === 'totp'
                  ? 'bg-white/10 text-white border-b-2 border-purple-400'
                  : 'text-purple-300 hover:bg-white/5'
              }`}
            >
              📱 TOTP {totpSetupComplete && '✓'}
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
                {!passkeySetupComplete ? (
                  <>
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-2">Setup Passkey</h3>
                      <p className="text-purple-200 mb-4">
                        Register your device for biometric authentication (Face ID, Touch ID, or Windows Hello)
                      </p>
                      <input
                        type="text"
                        value={deviceName}
                        onChange={(e) => setDeviceName(e.target.value)}
                        placeholder="Device name (optional)"
                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400 mb-4"
                      />
                    </div>
                    <button
                      onClick={handlePasskeySetup}
                      disabled={loading}
                      className="w-full py-4 px-6 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-gray-500 disabled:to-gray-600 text-white font-semibold rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg disabled:cursor-not-allowed"
                    >
                      {loading ? 'Setting up...' : '🔐 Register Passkey'}
                    </button>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-6xl mb-4">✅</div>
                    <h3 className="text-2xl font-bold text-white mb-2">Passkey Registered!</h3>
                    <p className="text-purple-200">
                      You can now login using your device&apos;s biometric authentication.
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                {!totpSecret ? (
                  <>
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-2">Setup TOTP</h3>
                      <p className="text-purple-200">
                        Use Google Authenticator or any TOTP-compatible app
                      </p>
                    </div>
                    <button
                      onClick={handleTotpSetup}
                      disabled={loading}
                      className="w-full py-4 px-6 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-gray-500 disabled:to-gray-600 text-white font-semibold rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg disabled:cursor-not-allowed"
                    >
                      {loading ? 'Generating...' : '📱 Generate TOTP Secret'}
                    </button>
                  </>
                ) : !totpSetupComplete ? (
                  <>
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-4">Scan QR Code</h3>
                      <div className="bg-white p-4 rounded-xl inline-block">
                        <img src={totpQrCode} alt="TOTP QR Code" className="w-64 h-64" />
                      </div>
                      <p className="text-purple-200 text-sm mt-4">
                        Or enter this secret manually: <code className="bg-white/10 px-2 py-1 rounded">{totpSecret}</code>
                      </p>
                    </div>
                    <form onSubmit={handleTotpVerify} className="space-y-4">
                      <div>
                        <label className="block text-purple-200 font-medium mb-2">
                          Enter verification code
                        </label>
                        <input
                          type="text"
                          value={totpVerifyCode}
                          onChange={(e) => setTotpVerifyCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                          placeholder="000000"
                          maxLength={6}
                          className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-purple-400 text-center text-2xl font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-purple-400"
                          autoComplete="off"
                          required
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={loading || totpVerifyCode.length !== 6}
                        className="w-full py-4 px-6 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-gray-500 disabled:to-gray-600 text-white font-semibold rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg disabled:cursor-not-allowed"
                      >
                        {loading ? 'Verifying...' : '✓ Verify & Complete'}
                      </button>
                    </form>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-6xl mb-4">✅</div>
                    <h3 className="text-2xl font-bold text-white mb-2">TOTP Configured!</h3>
                    <p className="text-purple-200">
                      You can now login using your authenticator app.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Complete Button */}
        {(passkeySetupComplete || totpSetupComplete) && (
          <div className="mt-6 text-center">
            <button
              onClick={handleComplete}
              className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
            >
              ✓ Complete Setup & Go to Login
            </button>
            <p className="text-purple-300 text-sm mt-4">
              You can set up additional methods later from settings
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default function SetupPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    }>
      <SetupContent />
    </Suspense>
  )
}
