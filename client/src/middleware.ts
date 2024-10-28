import { NextRequest, NextResponse } from 'next/server';
import { updateSession } from './actions/auth.actions';
const protectedRoutes = ['/dashboard', '/profile'];
const publicRoutes = ['/login', '/signup', '/signup/verify'];

export default async function middleware(req: NextRequest) {
	const path = req.nextUrl.pathname;

	const isProtectedRoute = protectedRoutes.includes(path);
	const isPublicRoute = publicRoutes.includes(path);

	const { isAuthenticated } = await updateSession();

	if (isProtectedRoute && !isAuthenticated)
		return NextResponse.redirect(new URL('/login', req.nextUrl));
	if (isPublicRoute && isAuthenticated)
		return NextResponse.redirect(new URL('/dashboard', req.nextUrl));

	return NextResponse.next();
}

export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - api (API routes)
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico, sitemap.xml, robots.txt (metadata files)
		 */
		'/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
	],
};
