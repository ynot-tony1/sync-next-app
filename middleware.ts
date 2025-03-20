// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  
  // Define the protected routes. In this example, home and upload routes are protected.
  const isProtectedRoute = pathname === "/" || pathname.startsWith("/upload");

  if (isProtectedRoute) {
    // Attempt to retrieve the token from the request
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    
    // If no token is found, redirect the user to the login page.
    if (!token) {
      const loginUrl = req.nextUrl.clone();
      loginUrl.pathname = "/login";
      return NextResponse.redirect(loginUrl);
    }
  }
  return NextResponse.next();
}

// Specify the paths where the middleware applies.
export const config = {
  matcher: ["/", "/upload/:path*"],
};
