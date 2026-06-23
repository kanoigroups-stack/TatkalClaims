import type { Metadata, Viewport } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import Header from "@/components/navigation/Header";
import Footer from "@/components/sections/Footer";
import WhatsAppFloat from "@/components/floating/WhatsAppFloat";
import StickyMobileCTA from "@/components/floating/StickyMobileCTA";
import GATracker from "@/components/analytics/GATracker";

const inter = Inter({ 
  subsets: ["latin"], 
  variable: "--font-inter", 
  display: "swap",
  preload: true,
});

const poppins = Poppins({ 
  subsets: ["latin"], 
  weight: ["400","500","600","700","800"], 
  variable: "--font-poppins", 
  display: "swap",
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
      "hi-IN": "/",
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
    google: "G-M3ZBJ1B7V8",
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
    <html lang="en-IN" className={`${inter.variable} ${poppins.variable} scroll-smooth`}>
      <head>
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        
        {/* Google Translate */}
        <script type="text/javascript">
          {`
            function googleTranslateElementInit() {
              new google.translate.TranslateElement({
                pageLanguage: 'en',
                includedLanguages: 'en,hi,mr,gu,ta,te,bn,kn,ml,pa',
                layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
                autoDisplay: false
              }, 'google_translate_element');
            }
          `}
        </script>
        <script 
          type="text/javascript" 
          src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
          async
        />
        
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-M3ZBJ1B7V8" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-M3ZBJ1B7V8', { send_page_view: false });
            `,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Organization",
                  name: "Tatkal Claims",
                  url: "https://tatkalclaims.com",
                  logo: {
                    "@type": "ImageObject",
                    url: "https://tatkalclaims.com/logo.png",
                    width: 512,
                    height: 512,
                  },
                  description: "India's most trusted platform for resolving insurance complaints and disputes.",
                  contactPoint: {
                    "@type": "ContactPoint",
                    telephone: "+91-9321152524",
                    contactType: "customer service",
                    areaServed: "IN",
                    availableLanguage: ["English", "Hindi"],
                  },
                },
                {
                  "@type": "WebSite",
                  name: "Tatkal Claims",
                  url: "https://tatkalclaims.com",
                  potentialAction: {
                    "@type": "SearchAction",
                    target: "https://tatkalclaims.com/blog?q={search_term_string}",
                    "query-input": "required name=search_term_string",
                  },
                },
              ],
            }),
          }}
        />
      </head>
      <body className="font-body text-slate-800 antialiased bg-white">
        {/* Hidden Google Translate container */}
        <div id="google_translate_element" style={{ display: "none" }}></div>
        
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-primary-800 focus:text-white focus:px-4 focus:py-2 focus:rounded-lg">
          Skip to main content
        </a>
        <Header />
        <main id="main-content">{children}</main>
        <Footer />
        <WhatsAppFloat />
        <StickyMobileCTA />
        <GATracker />
      </body>
    </html>
  );
}
