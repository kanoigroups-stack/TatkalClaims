"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  const [year, setYear] = useState(2026);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="container-main px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-2xl">
          <Link href="/" className="flex items-center mb-6" aria-label="Tatkal Claims Home">
            <div className="bg-white rounded-xl px-4 py-2">
              <img
                src="/logo.png"
                alt="Tatkal Claims"
                className="h-12 w-auto object-contain"
                width="216"
                height="48"
              />
            </div>
          </Link>
          <p className="text-slate-400 leading-relaxed mb-6">
            India&apos;s most trusted platform for resolving insurance complaints. We help policyholders recover rightful claims through expert dispute resolution.
          </p>
          <div className="space-y-3">
            <a href="tel:+919321152524" className="flex items-center gap-3 text-sm hover:text-white transition-colors" aria-label="Call us">
              <Phone className="w-4 h-4 text-accent-500 flex-shrink-0" aria-hidden="true" />
              +91 9321152524
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
      </div>
      <div className="border-t border-slate-800">
        <div className="container-main px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-sm text-slate-500">© {year} Tatkal Claims. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
