import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CMS Published Parity",
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

export default function CmsStagingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
