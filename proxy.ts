import { NextRequest, NextResponse } from "next/server";
import { parse } from "cookie";
import { checkSession } from "./lib/api/serverApi";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;
  const isPrivateRoute = pathname.startsWith("/profile") || pathname.startsWith("/notes");
  const isAuthRoute = pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up");

  if (!accessToken && !refreshToken) {
    if (isPrivateRoute) return NextResponse.redirect(new URL("/sign-in", request.url));
    return NextResponse.next();
  }

  if (!accessToken && refreshToken) {
    try {
      const cookieHeader = request.headers.get("cookie") ?? "";
      const sessionResult = await checkSession(cookieHeader);

      const response = isAuthRoute
        ? NextResponse.redirect(new URL("/profile", request.url))
        : NextResponse.next();

      const setCookieHeader = sessionResult.headers["set-cookie"];
      if (setCookieHeader) {
        const cookieArray = Array.isArray(setCookieHeader) ? setCookieHeader : [setCookieHeader];
        for (const cookieStr of cookieArray) {
          const parsed = parse(cookieStr);
          if (parsed.accessToken) {
            response.cookies.set("accessToken", parsed.accessToken, {
              expires: parsed.Expires ? new Date(parsed.Expires) : undefined,
              path: parsed.Path || "/",
              maxAge: parsed["Max-Age"] ? Number(parsed["Max-Age"]) : undefined,
            });
          }
          if (parsed.refreshToken) {
            response.cookies.set("refreshToken", parsed.refreshToken, {
              expires: parsed.Expires ? new Date(parsed.Expires) : undefined,
              path: parsed.Path || "/",
              maxAge: parsed["Max-Age"] ? Number(parsed["Max-Age"]) : undefined,
            });
          }
        }
      }

      return response;
    } catch {
      if (isPrivateRoute) return NextResponse.redirect(new URL("/sign-in", request.url));
      return NextResponse.next();
    }
  }

  // Has accessToken — user is authenticated
  if (isAuthRoute) return NextResponse.redirect(new URL("/profile", request.url));
  return NextResponse.next();
}

export const config = {
  matcher: ["/profile/:path*", "/notes/:path*", "/sign-in", "/sign-up"],
};
