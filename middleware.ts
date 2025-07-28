import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request })
  const { pathname } = request.nextUrl
  const lowerPathname = pathname.toLowerCase()

  // Define public routes that don't require authentication
  const publicRoutes = ['/auth/signin', '/auth/signup', '/', '/posts']
  const isPublicRoute = publicRoutes.some(route => lowerPathname.startsWith(route.toLowerCase()))

  // Redirect authenticated users away from auth pages
  if ((lowerPathname === '/auth/signin') && token) {
    const redirectPath = token.role === 'ADMIN' ? '/dashboard' : '/'
    return NextResponse.redirect(new URL(redirectPath, request.url))
  }
  if (lowerPathname === '/auth/signup' && request.method === 'POST' && !token) {
  // After successful registration
  return NextResponse.redirect(new URL('/auth/signin', request.url))
}

  // Handle unauthenticated users trying to access protected routes
  if (!token && !isPublicRoute) {
    const signInUrl = new URL('/auth/signin', request.url)
    signInUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(signInUrl)
  }

  // Role-based route protection
  if (token) {
    // Admin dashboard access
    if (lowerPathname.startsWith('/dashboard') && token.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/', request.url))
    }

    // Protected content management routes
    const protectedContentRoutes = ['/new', '/edit']
    const isContentRoute = protectedContentRoutes.some(route => lowerPathname.startsWith(route))
    
    if (isContentRoute && token.role === 'USER') {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/auth/signin',
    '/auth/signup',
    '/dashboard/:path*',
    '/new/:path*',
    '/edit/:path*',
    // Optional: Add other protected routes here instead of using the catch-all
  ]
}