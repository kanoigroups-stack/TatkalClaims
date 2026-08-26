import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Header from "@/components/navigation/Header";
import Footer from "@/components/sections/Footer";
import WhatsAppFloat from "@/components/floating/WhatsAppFloat";
import StickyMobileCTA from "@/components/floating/StickyMobileCTA";
import GATracker from "@/components/analytics/GATracker";

const inter = Inter({ 
  subsets: ["latin"], 
  variable: "--font-inter", 
  display: "optional",
  preload: true,
});

export const metadata: Metadata = {
  title: {
    default: "Tatkal Claims | India's Most Trusted Insurance Dispute Resolution Platform",
    template: "%s | Tatkal Claims",
  },
  description: "Resolve your insurance claim disputes with expert legal professionals. 500+ cases assisted, ₹20+ Crores claims recovered. Claim rejection, delay, mis-selling & more.",
  keywords: ["insurance claim rejection","insurance dispute resolution","claim delay help","insurance ombudsman","mis-sold insurance","claim recovery","insurance grievance","health insurance dispute","motor insurance claim","insurance lawyer india","irdai complaint"],
  authors: [{ name: "Tatkal Claims", url: "https://tatkalclaims.com" }],
  creator: "Tatkal Claims",
  publisher: "Tatkal Claims",
  metadataBase: new URL("https://tatkalclaims.com"),
  alternates: {
    canonical: "/",
    languages: {
      "en-IN": "/",
    },
  },
  openGraph: {
    title: "Tatkal Claims | Resolve Insurance Claim Disputes",
    description: "Expert help for rejected, delayed, or disputed insurance claims. 500+ cases resolved.",
    siteName: "Tatkal Claims",
    locale: "en_IN",
    type: "website",
    url: "https://tatkalclaims.com",
    images: [{
      url: "https://tatkalclaims.com/og-image.jpg",
      width: 1200,
      height: 630,
      alt: "Tatkal Claims - Insurance Dispute Resolution Experts",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tatkal Claims | Insurance Dispute Experts",
    description: "Recover your rightful insurance claims with professional dispute resolution.",
    images: ["https://tatkalclaims.com/og-image.jpg"],
    creator: "@tatkalclaims",
  },
  robots: { 
    index: true, 
    follow: true, 
    googleBot: { 
      index: true, 
      follow: true, 
      "max-video-preview": -1, 
      "max-image-preview": "large", 
      "max-snippet": -1 
    } 
  },
  verification: {
    google: "E_8RoQ3KF2Dkbkvh6PxfvZmhi6w82v3NeynVcSRSY2c",
  },
  category: "legal services",
};

export const viewport: Viewport = { 
  width: "device-width", 
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#1E3A8A",
  colorScheme: "light",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={`${inter.variable} scroll-smooth`}>
      <head>
        {/* Favicon */}
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="48x48" href="/favicon-48x48.png" />
        
        {/* Apple Touch Icon */}
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        
        {/* Web Manifest */}
        <link rel="manifest" href="/site.webmanifest" />
        
        {/* Theme Color */}
        <meta name="theme-color" content="#1E3A8A" />
        <meta name="msapplication-TileColor" content="#1E3A8A" />
        
        {/* Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "LocalBusiness",
                "@id": "https://tatkalclaims.com/#localbusiness",
                name: "Tatkal Claims",
                url: "https://tatkalclaims.com",
                logo: {
                  "@type": "ImageObject",
                  url: "https://tatkalclaims.com/logo.png",
                  width: 512,
                  height: 512,
                },
                image: "https://tatkalclaims.com/logo.png",
                description: "India's most trusted platform for resolving insurance complaints and disputes. 500+ cases assisted, ₹20+ Crores recovered.",
                telephone: "+91-7207382073",
                email: "help@tatkalclaims.com",
                address: {
                  "@type": "PostalAddress",
                  streetAddress: "84, Bakol street, Laudin Villa, Bhayander West",
                  addressLocality: "Mumbai",
                  addressRegion: "Maharashtra",
                  postalCode: "401101",
                  addressCountry: "IN",
                },
                geo: {
                  "@type": "GeoCoordinates",
                  latitude: "19.2961",
                  longitude: "72.8503",
                },
                areaServed: {
                  "@type": "Country",
                  name: "India",
                },
                priceRange: "₹₹",
                openingHoursSpecification: {
                  "@type": "OpeningHoursSpecification",
                  dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
                  opens: "00:00",
                  closes: "23:59",
                },
                contactPoint: {
                  "@type": "ContactPoint",
                  telephone: "+91-7207382073",
                  contactType: "customer service",
                  areaServed: "IN",
                  availableLanguage: ["English", "Hindi"],
                },
                sameAs: [
                  "https://tatkalclaims.com/blog/",
                  "https://tatkalclaims.com/partner-with-us/",
                ],
              },
              {
                "@type": "WebSite",
                "@id": "https://tatkalclaims.com/#website",
                name: "Tatkal Claims",
                url: "https://tatkalclaims.com",
                potentialAction: {
                  "@type": "SearchAction",
                  target: "https://tatkalclaims.com/blog?q={search_term_string}",
                  "query-input": "required name=search_term_string",
                },
              },
            ],
          }) }}
        />
      </head>
      <body className="font-body text-slate-800 antialiased bg-white">
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-primary-800 focus:text-white focus:px-4 focus:py-2 focus:rounded-lg">
          Skip to main content
        </a>
        <Header />
        <main id="main-content">{children}</main>
        <Footer />
        <WhatsAppFloat />
        <StickyMobileCTA />
        <GATracker />
        
        {/* Google Analytics - deferred to reduce main-thread blocking */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-M3ZBJ1B7V8"
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-M3ZBJ1B7V8', { send_page_view: false });
          `}
        </Script>
      </body>
    </html>
  );
}
