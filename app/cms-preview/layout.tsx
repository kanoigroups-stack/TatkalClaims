import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CMS Migration Preview",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

export default function CmsPreviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
