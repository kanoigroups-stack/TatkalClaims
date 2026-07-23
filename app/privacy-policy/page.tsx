import type { Metadata } from "next";
import Link from "next/link";
import { Shield, Lock, Eye, Trash2, Mail, Phone } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy | Tatkal Claims",
  description: "Tatkal Claims Privacy Policy - How we collect, use, and protect your personal data in compliance with Indian data protection laws.",
  alternates: {
    canonical: "/privacy-policy/",
  },
  robots: { index: true, follow: true },
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-white pt-24 pb-20">
      <div className="container-main px-4 max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="flex items-center gap-2 text-sm text-slate-500">
            <li><Link href="/" className="hover:text-primary-700 transition-colors">Home</Link></li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-slate-900 font-medium">Privacy Policy</li>
          </ol>
        </nav>

        <div className="bg-gradient-to-r from-primary-800 to-primary-900 rounded-2xl p-8 md:p-12 text-white mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-8 h-8 text-accent-400" aria-hidden="true" />
            <span className="text-sm font-semibold uppercase tracking-wider text-accent-300">Legal</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Privacy Policy</h1>
          <p className="text-primary-100 text-lg">Last updated: June 22, 2026</p>
        </div>

        <div className="prose prose-lg max-w-none text-slate-700">
          <p className="text-lg leading-relaxed mb-8">
            At <strong>Tatkal Claims</strong> (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;), we are committed to protecting your personal information and respecting your privacy. This Privacy Policy explains how we collect, use, store, and safeguard your personal data when you use our website and services, in compliance with the <strong>Digital Personal Data Protection Act, 2023 (DPDP Act)</strong> and other applicable Indian laws.
          </p>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
              <Eye className="w-6 h-6 text-primary-700" aria-hidden="true" />
              1. Information We Collect
            </h2>
            <p className="mb-4">We collect the following categories of personal data:</p>
            <ul className="space-y-3 list-disc list-inside">
              <li><strong>Identity Information:</strong> Full name, email address, phone number</li>
              <li><strong>Case Information:</strong> Insurance policy details, claim rejection letters, correspondence with insurers, and documents related to your dispute</li>
              <li><strong>Technical Data:</strong> IP address, browser type, device information, and cookies</li>
              <li><strong>Communication Data:</strong> Records of your interactions with us via WhatsApp, email, phone, or our contact form</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
              <Lock className="w-6 h-6 text-primary-700" aria-hidden="true" />
              2. How We Use Your Information
            </h2>
            <p className="mb-4">We process your personal data for the following lawful purposes:</p>
            <ul className="space-y-3 list-disc list-inside">
              <li>To evaluate your insurance dispute and provide case assessment</li>
              <li>To communicate with you regarding your case status and updates</li>
              <li>To file complaints with insurers, IRDAI, Insurance Ombudsman, or courts on your behalf</li>
              <li>To comply with legal and regulatory obligations under IRDAI guidelines</li>
              <li>To improve our services and website functionality</li>
              <li>To send you informational updates about insurance rights (only with your consent)</li>
            </ul>
            <p className="mt-4">We do <strong>not</strong> sell, rent, or trade your personal data to third parties for marketing purposes.</p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">3. Legal Basis for Processing</h2>
            <p className="mb-4">Under the DPDP Act, 2023, we process your personal data based on:</p>
            <ul className="space-y-3 list-disc list-inside">
              <li><strong>Consent:</strong> When you submit our contact form or engage our services</li>
              <li><strong>Legitimate Interest:</strong> To pursue your insurance claim dispute and protect your rights</li>
              <li><strong>Legal Obligation:</strong> To comply with regulatory requirements and court orders</li>
              <li><strong>Contractual Necessity:</strong> To perform our service agreement with you</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">4. Data Sharing and Disclosure</h2>
            <p className="mb-4">We may share your information with:</p>
            <ul className="space-y-3 list-disc list-inside">
              <li><strong>Insurance Companies:</strong> When filing complaints or claims on your behalf</li>
              <li><strong>Regulatory Bodies:</strong> IRDAI, Insurance Ombudsman, and Consumer Courts as required</li>
              <li><strong>Legal Partners:</strong> Advocates and retired ombudsmen assisting with your case</li>
              <li><strong>Service Providers:</strong> Cloud hosting, email, and analytics providers under strict confidentiality agreements</li>
            </ul>
            <p className="mt-4">All third parties are contractually bound to protect your data and use it only for the specified purposes.</p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">5. Data Security</h2>
            <p className="mb-4">We implement appropriate technical and organizational measures to protect your personal data:</p>
            <ul className="space-y-3 list-disc list-inside">
              <li>SSL/TLS encryption for data transmission</li>
              <li>Secure cloud storage with access controls</li>
              <li>Regular security audits and vulnerability assessments</li>
              <li>Restricted access to personal data on a need-to-know basis</li>
              <li>Staff training on data protection and confidentiality</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
              <Trash2 className="w-6 h-6 text-primary-700" aria-hidden="true" />
              6. Data Retention
            </h2>
            <p className="mb-4">We retain your personal data for as long as necessary to:</p>
            <ul className="space-y-3 list-disc list-inside">
              <li>Provide our services and fulfill your case requirements</li>
              <li>Comply with legal and regulatory obligations (typically 7 years for insurance records)</li>
              <li>Resolve disputes and enforce our agreements</li>
            </ul>
            <p className="mt-4">Once the retention period expires, we securely delete or anonymize your data in accordance with the IRDAI (Maintenance of Insurance Records) Regulations, 2015.</p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">7. Your Rights Under DPDP Act, 2023</h2>
            <p className="mb-4">As a Data Principal, you have the following rights:</p>
            <ul className="space-y-3 list-disc list-inside">
              <li><strong>Right to Access:</strong> Request a copy of your personal data</li>
              <li><strong>Right to Correction:</strong> Request correction of inaccurate or incomplete data</li>
              <li><strong>Right to Erasure:</strong> Request deletion of your personal data (subject to legal obligations)</li>
              <li><strong>Right to Grievance Redressal:</strong> File a complaint with the Data Protection Board of India</li>
              <li><strong>Right to Withdraw Consent:</strong> Withdraw your consent at any time</li>
              <li><strong>Right to Nominate:</strong> Nominate another individual to exercise your rights in case of death or incapacity</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">8. Cookies and Tracking</h2>
            <p className="mb-4">We use cookies and similar technologies to:</p>
            <ul className="space-y-3 list-disc list-inside">
              <li>Ensure website functionality and security</li>
              <li>Analyze website traffic and user behavior (via Google Analytics)</li>
              <li>Remember your preferences</li>
            </ul>
            <p className="mt-4">You can manage cookie preferences through your browser settings. We do not use cookies for targeted advertising.</p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">9. Third-Party Links</h2>
            <p>Our website may contain links to third-party websites (e.g., IRDAI, Insurance Ombudsman). We are not responsible for the privacy practices of these websites. We encourage you to review their privacy policies before providing any personal information.</p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">10. Changes to This Policy</h2>
            <p>We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. We will notify you of significant changes by posting the updated policy on our website with a revised &quot;Last Updated&quot; date.</p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
              <Mail className="w-6 h-6 text-primary-700" aria-hidden="true" />
              11. Contact Us
            </h2>
            <p className="mb-4">If you have any questions, concerns, or requests regarding this Privacy Policy or your personal data, please contact our Data Protection Officer:</p>
            <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
              <p className="font-semibold text-slate-900 mb-2">Tatkal Claims</p>
              <div className="space-y-2 text-slate-600">
                <p className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-primary-600" aria-hidden="true" />
                  <a href="mailto:help@tatkalclaims.com" className="text-primary-700 hover:underline">help@tatkalclaims.com</a>
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-primary-600" aria-hidden="true" />
                  <a href="tel:+917207382073" className="text-primary-700 hover:underline">+91 7207382073</a>
                </p>
                <p>84, Bakol Street, Laudin Villa, Bhayander West, Mumbai - 401101</p>
              </div>
            </div>
          </section>

          <div className="bg-primary-50 rounded-xl p-6 border border-primary-100 mt-12">
            <p className="text-sm text-slate-600">
              <strong>Disclaimer:</strong> This Privacy Policy is provided for informational purposes and does not constitute legal advice. For specific legal guidance, please consult a qualified attorney.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
