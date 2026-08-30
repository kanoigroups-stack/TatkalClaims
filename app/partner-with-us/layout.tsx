import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Partner With Us",
  description:
    "Partner with Tatkal Claims to refer policyholders who need help with rejected, delayed, or disputed insurance claims and learn about our referral programme.",
  alternates: {
    canonical: "/partner-with-us/",
  },
  openGraph: {
    title: "Partner With Us | Tatkal Claims",
    description:
      "Partner with Tatkal Claims to refer policyholders who need help with rejected, delayed, or disputed insurance claims and learn about our referral programme.",
    url: "https://tatkalclaims.com/partner-with-us/",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Partner With Us | Tatkal Claims",
    description:
      "Partner with Tatkal Claims to refer policyholders who need help with rejected, delayed, or disputed insurance claims and learn about our referral programme.",
  },
};

export default function PartnerWithUsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
