import { notFound } from "next/navigation";
import { getServiceBySlug } from "@/lib/services";

const SITE_URL = "https://tatkalclaims.com";

export default function ServiceLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { slug: string };
}) {
  const service = getServiceBySlug(params.slug);

  if (!service) notFound();

  const serviceUrl = `${SITE_URL}/services/${service.slug}/`;

  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: service.title,
      description: service.shortDesc,
      url: serviceUrl,
      provider: {
        "@type": "Organization",
        name: "Tatkal Claims",
        url: SITE_URL,
      },
      areaServed: {
        "@type": "Country",
        name: "India",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: `${SITE_URL}/`,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Services",
          item: `${SITE_URL}/services/`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: service.title,
          item: serviceUrl,
        },
      ],
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      {children}
    </>
  );
}
