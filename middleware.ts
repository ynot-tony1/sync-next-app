import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isProtectedRoute = pathname === "/" || pathname.startsWith("/upload");
  if (isProtectedRoute) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      const loginUrl = req.nextUrl.clone();
      loginUrl.pathname = "/login";
      return NextResponse.redirect(loginUrl);
    }
  }
  return NextResponse.next();
}
export const config = {
  matcher: ["/", "/upload/:path*"],
};
