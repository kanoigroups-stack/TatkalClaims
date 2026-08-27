import { NextRequest, NextResponse } from "next/server";

function unauthorized() {
  return new NextResponse("Authentication required for CMS preview.", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Tatkal Claims CMS Preview", charset="UTF-8"',
      "Cache-Control": "no-store",
    },
  });
}

export function middleware(request: NextRequest) {
  const expectedUsername = process.env.CMS_PREVIEW_USERNAME;
  const expectedPassword = process.env.CMS_PREVIEW_PASSWORD;

  if (!expectedUsername || !expectedPassword) {
    return new NextResponse("CMS preview authentication is not configured.", {
      status: 503,
      headers: {
        "Cache-Control": "no-store",
      },
    });
  }

  const authorization = request.headers.get("authorization");

  if (!authorization?.startsWith("Basic ")) {
    return unauthorized();
  }

  try {
    const decoded = atob(authorization.slice("Basic ".length));
    const separator = decoded.indexOf(":");

    if (separator < 0) {
      return unauthorized();
    }

    const username = decoded.slice(0, separator);
    const password = decoded.slice(separator + 1);

    if (username !== expectedUsername || password !== expectedPassword) {
      return unauthorized();
    }
  } catch {
    return unauthorized();
  }

  const response = NextResponse.next();
  response.headers.set("Cache-Control", "private, no-store");
  return response;
}

export const config = {
  matcher: ["/cms-preview/:path*"],
};
