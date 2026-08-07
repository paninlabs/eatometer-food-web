import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  url.pathname = "/home";
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: "/",
};
