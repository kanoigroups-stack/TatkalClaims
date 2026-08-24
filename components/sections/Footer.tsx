"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";
import Image from "next/image";

export default function Footer() {
  const [year, setYear] = useState(2026);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="container-main px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-flex items-center mb-6" aria-label="Tatkal Claims Home">
              <Image
                src="/logo.png"
                alt="Tatkal Claims"
                width={200}
                height={50}
                className="h-11 w-auto object-contain"
              />
            </Link>
            <p className="text-slate-400 leading-relaxed mb-6 max-w-md">
              India&apos;s most trusted platform for resolving insurance complaints. We help policyholders recover rightful claims through expert dispute resolution.
            </p>
            <div className="space-y-3">
              <a href="tel:+917207382073" className="flex items-center gap-3 text-sm hover:text-white transition-colors" aria-label="Call us">
                <Phone className="w-4 h-4 text-accent-500 flex-shrink-0" aria-hidden="true" />
                +91 7207382073
              </a>
              <a href="mailto:help@tatkalclaims.com" className="flex items-center gap-3 text-sm hover:text-white transition-colors" aria-label="Email us">
                <Mail className="w-4 h-4 text-accent-500 flex-shrink-0" aria-hidden="true" />
                help@tatkalclaims.com
              </a>
              <div className="flex items-start gap-3 text-sm">
                <MapPin className="w-4 h-4 text-accent-500 mt-0.5 flex-shrink-0" aria-hidden="true" />
                <span>84, Bakol street, Laudin Villa, Bhayander West, Mumbai - 401101</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-slate-400 hover:text-white transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/blog/" className="text-slate-400 hover:text-white transition-colors text-sm">
                  Knowledge Center
                </Link>
              </li>
              <li>
                <Link href="/partner-with-us/" className="text-slate-400 hover:text-white transition-colors text-sm">
                  Partner With Us
                </Link>
              </li>
              <li>
                <a href="/#contact-form" className="text-slate-400 hover:text-white transition-colors text-sm">
                  Get Free Evaluation
                </a>
              </li>
            </ul>
          </div>

          {/* Services, How it Works, Why Us, FAQs */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/services/" className="text-slate-400 hover:text-white transition-colors text-sm">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/how-it-works/" className="text-slate-400 hover:text-white transition-colors text-sm">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/why-us/" className="text-slate-400 hover:text-white transition-colors text-sm">
                  Why Us
                </Link>
              </li>
              <li>
                <Link href="/faqs/" className="text-slate-400 hover:text-white transition-colors text-sm">
                  FAQs
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800">
        <div className="container-main px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <p className="text-sm text-slate-500">&copy; {year} Tatkal Claims. All rights reserved.</p>
            <div className="flex items-center gap-6 text-sm">
              <Link 
                href="/privacy-policy/" 
                className="text-slate-400 hover:text-white transition-colors"
                aria-label="Read our Privacy Policy"
              >
                Privacy Policy
              </Link>
              <Link 
                href="/terms-and-conditions/" 
                className="text-slate-400 hover:text-white transition-colors"
                aria-label="Read our Terms and Conditions"
              >
                Terms & Conditions
              </Link>
              <Link 
                href="/partner-with-us/" 
                className="text-slate-400 hover:text-white transition-colors"
                aria-label="Partner With Us"
              >
                Partner With Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
