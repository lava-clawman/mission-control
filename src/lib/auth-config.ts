export const AUTH_CONFIG = {
  // 只有一个管理员用户
  adminId: 'flash',
  
  // WebAuthn 配置
  rpName: 'Mission Control',
  rpID: process.env.NODE_ENV === 'production' 
    ? 'mission-control-nine-ruddy.vercel.app' 
    : 'localhost',
  origin: process.env.NODE_ENV === 'production'
    ? 'https://mission-control-nine-ruddy.vercel.app'
    : 'http://localhost:3000',
}

// iron-session 配置
export const sessionOptions = {
  password: process.env.SESSION_SECRET || 'complex_password_at_least_32_characters_long_for_development',
  cookieName: 'mc_session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
}

// Session 类型
export interface SessionData {
  isLoggedIn: boolean
  userId?: string
  challenge?: string
}
