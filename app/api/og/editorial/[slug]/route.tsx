import { ImageResponse } from "next/og";
import { SITE_URL } from "@/lib/content/seo";

export const runtime = "edge";

const SAFE_SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  if (!SAFE_SLUG.test(slug)) {
    return new Response("Invalid editorial image slug", { status: 400 });
  }

  const sourceUrl = SITE_URL + "/editorial/" + slug + ".svg";
  const source = await fetch(sourceUrl, { cache: "force-cache" });

  if (!source.ok) {
    return new Response("Editorial image not found", { status: 404 });
  }

  const svg = await source.text();
  const svgDataUri =
    "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f8fafc",
        }}
      >
        <img
          src={svgDataUri}
          alt=""
          width="1120"
          height="630"
          style={{ objectFit: "contain" }}
        />
      </div>
    ),
    {
      width: 1200,
      height: 630,
      headers: {
        "Cache-Control":
          "public, max-age=86400, s-maxage=31536000, stale-while-revalidate=86400",
      },
    }
  );
}
