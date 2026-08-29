import { getAdsTxtLine } from "@/lib/adsense/config";

export const dynamic = "force-dynamic";

export function GET() {
  const line = getAdsTxtLine();

  if (!line) {
    return new Response("AdSense publisher ID is not configured.\n", {
      status: 404,
      headers: {
        "content-type": "text/plain; charset=utf-8",
        "cache-control": "no-store",
      },
    });
  }

  return new Response(line + "\n", {
    status: 200,
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=300, s-maxage=300",
    },
  });
}
