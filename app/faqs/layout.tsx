import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Insurance Claim FAQs",
  description:
    "Answers to common questions about insurance claim disputes, rejected and delayed claims, fees, documents, timelines, and the Tatkal Claims resolution process.",
  alternates: {
    canonical: "/faqs/",
  },
  openGraph: {
    title: "Insurance Claim FAQs | Tatkal Claims",
    description:
      "Answers to common questions about insurance claim disputes, rejected and delayed claims, fees, documents, timelines, and the Tatkal Claims resolution process.",
    url: "https://tatkalclaims.com/faqs/",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Insurance Claim FAQs | Tatkal Claims",
    description:
      "Answers to common questions about insurance claim disputes, rejected and delayed claims, fees, documents, timelines, and the Tatkal Claims resolution process.",
  },
};

export default function FAQsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
