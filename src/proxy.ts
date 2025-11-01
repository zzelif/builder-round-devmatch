// src/proxy.ts
import { NextResponse } from "next/server";
import { auth } from "./auth";
import { authRoutes, publicRoutes } from "./routes";

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const profileComplete = req.auth?.user.profileComplete;

  const isPublic = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  if (isPublic) {
    return NextResponse.next();
  }
  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL("/networks", nextUrl));
    }
    return NextResponse.next();
  }

  if (!isLoggedIn) {
    return Response.redirect(new URL("/login", nextUrl));
  }

  if (
    isLoggedIn &&
    !profileComplete &&
    nextUrl.pathname !== "/complete-profile"
  ) {
    return Response.redirect(new URL("/complete-profile", nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
