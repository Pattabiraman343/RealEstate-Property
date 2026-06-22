import { NextResponse } from 'next/server';

export function middleware(request) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  console.log(' Middleware - Path:', pathname);
  console.log(' Middleware - Token exists:', token ? 'Yes' : ' No');

  const isLoginPage = pathname === '/login';
  const isRegisterPage = pathname === '/register';
  const isDashboardPage = pathname === '/dashboard';
  const isPropertiesPage = pathname.startsWith('/properties');
  const isCreateProperty = pathname === '/properties/create';
  const isMyProperties = pathname === '/properties/my';

  const isProtectedRoute = 
    isDashboardPage || 
    isCreateProperty || 
    isMyProperties ||
    pathname.includes('/properties/') && pathname.includes('/edit');

  // Public routes (no authentication needed)
  const isPublicRoute = 
    pathname === '/' || 
    isLoginPage || 
    isRegisterPage || 
    (isPropertiesPage && !isCreateProperty && !isMyProperties);

  if (isProtectedRoute && !token) {
    console.log(' Protected route, no token -> Redirecting to login');
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if ((isLoginPage || isRegisterPage) && token) {
    console.log(' Token exists, on login/register -> Redirecting to dashboard');
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  console.log('Allowing access to:', pathname);
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/dashboard',
    '/login',
    '/register',
    '/properties/:path*',
  ],
};