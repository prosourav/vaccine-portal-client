import { NextResponse, NextRequest } from "next/server";
import { routes } from "./constants/auth";

export function middleware(request: NextRequest) {
  const token = request.cookies.get('accessToken') as Record<string, string | undefined>;

  // if (!token) {
  //   return NextResponse.redirect(new URL("/auth/login", request.url));
  // }

  if (!token && routes.protected.includes(request.nextUrl.pathname)) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  if (token && routes.auth.includes(request.nextUrl.pathname)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();

}

