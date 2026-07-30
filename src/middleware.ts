import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Standard Next.js Middleware (Bypassing NextAuth configuration errors)
export function middleware(req: NextRequest) {
  const isAuth = req.cookies.has("admin_session") || req.cookies.has("next-auth.session-token") || req.cookies.has("__Secure-next-auth.session-token")

  if (!isAuth) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/dashboard/:path*",
    "/crm/:path*",
    "/settings/:path*",
    "/payments/:path*"
  ],
}
