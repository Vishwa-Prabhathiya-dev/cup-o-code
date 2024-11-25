import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })

  const { pathname } = request.nextUrl

  // Allow requests to /api/auth/* to pass through
  if (pathname.startsWith('/api/auth')) {
    return NextResponse.next()
  }

  // Redirect to dashboard if user is authenticated and trying to access login or signup
  if (token && (pathname === '/login' || pathname === '/signup' || pathname === '/')) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Redirect to login if user is not authenticated and trying to access protected routes
  if (!token && pathname !== '/login' && pathname !== '/signup') {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}