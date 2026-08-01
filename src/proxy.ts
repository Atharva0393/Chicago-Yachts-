import { withAuth } from "next-auth/middleware"

export default withAuth({
  callbacks: {
    authorized({ req, token }) {
      const path = req.nextUrl.pathname;
      if (path.startsWith("/admin")) {
        return !!token && !!token.role && ["SUPER_ADMIN", "ADMIN", "MANAGER"].includes(token.role as string);
      }
      return !!token;
    },
  },
  pages: {
    signIn: "/login",
  },
})

export const config = {
  matcher: [
    "/admin/:path*",
    "/dashboard/:path*",
    "/crm/:path*",
    "/settings/:path*",
    "/payments/:path*"
  ],
}
