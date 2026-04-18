// middleware.ts
import { NextResponse } from "next/server"
import { withAuth } from "next-auth/middleware";

const superAdminRoutes = ["/admin/dashboard", "/admin/courses", "/admin/admins"]
const adminRoutes = ["/admin/dashboard", "/admin/courses", "/admin/funcoin"]
const counselorRoutes = ["/admin/dashboard", "/admin/profile"]
const mentorRoutes = ["/admin/dashboard", "/admin/profile"]

// Shared pages for all authenticated roles.
const sharedAdminRoutes = ["/admin/profile", "/admin/funcoin"]

export default withAuth(
  async function middleware(req) {
    const path = req.nextUrl.pathname
    const token = req.nextauth.token;
    const isAuthenticated = !!token;
    const role = token?.role;
    if (path.startsWith("/auth")) {
      if (isAuthenticated) {
        return NextResponse.redirect(new URL("/admin/dashboard", req.url))
      }
      return NextResponse.next()
    }

    if (path.startsWith("/admin")) {
      if (!isAuthenticated) {
        return NextResponse.redirect(new URL("/auth/login", req.url))
      }

      if (sharedAdminRoutes.some(r => path.startsWith(r))) {
        return NextResponse.next()
      }

      if (role === "superadmin" && !superAdminRoutes.some(r => path.startsWith(r))) {
        return NextResponse.redirect(new URL("/admin/dashboard", req.url))
      }
      if (role === "admin" && !adminRoutes.some(r => path.startsWith(r))) {
        return NextResponse.redirect(new URL("/admin/dashboard", req.url))
      }
      if (role === "counsilor" && !counselorRoutes.some(r => path.startsWith(r))) {
        return NextResponse.redirect(new URL("/admin/dashboard", req.url))
      }
      if (role === "mentor" && !mentorRoutes.some(r => path.startsWith(r))) {
        return NextResponse.redirect(new URL("/admin/dashboard", req.url))
      }
      return NextResponse.next()
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: () => true,
    },
  }
);

export const config = {
  matcher: [
    "/auth/:path*",
    "/admin/:path*",
    "/((?!api|_next/static|_next/image|favicon.ico).*)"
  ]
}