import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/admin/", "/_next/"],
    },
    sitemap: "https://www.tatkalclaims.com/sitemap.xml",
    host: "https://www.tatkalclaims.com",
  };
}
