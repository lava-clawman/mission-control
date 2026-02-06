export const AUTH_CONFIG = {
  adminId: 'flash',
  rpName: 'Mission Control',
  rpID: process.env.NODE_ENV === 'production' 
    ? 'mission-control-nine-ruddy.vercel.app' 
    : 'localhost',
  origin: process.env.NODE_ENV === 'production'
    ? 'https://mission-control-nine-ruddy.vercel.app'
    : 'http://localhost:3000',
}

export const sessionOptions = {
  password: process.env.SESSION_SECRET || 'this-is-a-secret-that-must-be-at-least-32-chars',
  cookieName: 'mc_session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
}
