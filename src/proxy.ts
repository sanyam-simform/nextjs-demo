import { NextResponse, type NextRequest } from "next/server";
import { AUTH_COOKIE, AUTH_VALUE } from "@/lib/auth";

// proxy.ts (Next.js 16) replaces middleware.ts. Exported function must be named
// `proxy` and runs on the Node.js runtime.
//
// Responsibilities for this blog:
//   1. Gate every /admin route behind the admin-auth cookie → /login otherwise
//   2. Redirect legacy /blog/:slug URLs to /posts/:slug
//   3. Stamp a header so it's observable that the proxy ran
export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 2. Legacy redirect: /blog/<slug> -> /posts/<slug>
  if (pathname.startsWith("/blog/")) {
    const slug = pathname.slice("/blog/".length);
    return NextResponse.redirect(new URL(`/posts/${slug}`, request.url));
  }

  // 1. Admin auth gate
  if (pathname.startsWith("/admin")) {
    const authed = request.cookies.get(AUTH_COOKIE)?.value === AUTH_VALUE;
    if (!authed) {
      const url = new URL("/login", request.url);
      url.searchParams.set("from", pathname);
      return NextResponse.redirect(url);
    }
  }

  // 3. Header injection (visible proof the proxy intercepted the request)
  const response = NextResponse.next();
  response.headers.set("x-blog-proxy", "intercepted");
  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/blog/:path*", "/posts/:path*"],
};
