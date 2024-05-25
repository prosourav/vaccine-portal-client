import { NextResponse, NextRequest } from "next/server";
import { routes } from "./constants/auth";

export function middleware(request: NextRequest) {
  const token = request.cookies.get('accessToken') as Record<string, string | undefined>;

  if (!token && routes.protected.includes(request.nextUrl.pathname)) {
    const absoluteUrl = new URL("/auth/login",request.nextUrl.origin);
      return NextResponse.redirect(absoluteUrl.toString());
  }

  if(token && routes.auth.includes(request.nextUrl.pathname)) {
    const absoluteUrl = new URL("/",request.nextUrl.origin);
      return NextResponse.redirect(absoluteUrl.toString());
  }
}

