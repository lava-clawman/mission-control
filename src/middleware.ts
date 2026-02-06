import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getIronSession } from 'iron-session'
import { sessionOptions } from '@/lib/auth-config'

const publicPaths = ['/login', '/setup', '/api/auth']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Allow public paths
  if (publicPaths.some(p => pathname.startsWith(p))) {
    return NextResponse.next()
  }

  // Allow static files
  if (pathname.startsWith('/_next') || pathname.includes('.')) {
    return NextResponse.next()
  }

  // Check session
  const response = NextResponse.next()
  const session = await getIronSession<{ isLoggedIn?: boolean }>(request, response, sessionOptions)

  if (!session.isLoggedIn) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/webhook|api/agents|api/tasks|api/messages|api/activities).*)'],
}
