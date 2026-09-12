import { NextRequest, NextResponse } from "next/server";
import { env } from "@/shared/utils/envs";

export function proxy(request: NextRequest) {
  if (env.APP_ENV !== "development") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/playground", "/playground/:path*"],
};
