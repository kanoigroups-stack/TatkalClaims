"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Shield, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  const [year, setYear] = useState(2026);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="container-main px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-2xl">
          <Link href="/" className="flex items-center gap-2.5 mb-6" aria-label="Tatkal Claims Home">
            <div className="w-10 h-10 bg-primary-700 rounded-xl flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" aria-hidden="true" />
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-bold text-xl text-white leading-none">Tatkal Claims</span>
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
