import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/admin/"],
    },
    sitemap: "https://tatkalclaims.com/sitemap.xml",
    host: "https://tatkalclaims.com",
  };
}
