import { NextRequest, NextResponse } from "next/server";

const VIDEO_EXT = /\.(mp4|mov|webm)$/i;
const VIDEO_PATH = /^\/(videos|templates)\//;

/**
 * Anti-hotlink guard for video assets served from /public.
 * Static files bypass React entirely, so any client-side protection is
 * useless against a direct request — this only lets the request through
 * when it's a sub-resource fetch (<video>/<source>) from our own pages.
 * Blocks: direct URL paste in a browser tab, curl/wget, and embedding
 * these videos on another site.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!VIDEO_PATH.test(pathname) || !VIDEO_EXT.test(pathname)) {
    return NextResponse.next();
  }

  const referer = request.headers.get("referer");
  const secFetchSite = request.headers.get("sec-fetch-site");

  if (secFetchSite === "same-origin" || secFetchSite === "same-site") {
    return NextResponse.next();
  }

  if (referer) {
    try {
      if (new URL(referer).origin === request.nextUrl.origin) {
        return NextResponse.next();
      }
    } catch {
      // malformed referer falls through to deny
    }
  }

  return new NextResponse("Forbidden", { status: 403 });
}

export const config = {
  matcher: ["/videos/:path*", "/templates/:path*"],
};
