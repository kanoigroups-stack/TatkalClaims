import type { Metadata } from "next";
import Link from "next/link";
import { Scale, FileText, AlertTriangle, Gavel } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms & Conditions | Tatkal Claims",
  description: "Terms and Conditions for using Tatkal Claims services. Understand your rights, our obligations, and the legal framework governing our insurance dispute resolution platform.",
  alternates: {
    canonical: "/terms-and-conditions/",
  },
  robots: { index: true, follow: true },
};

export default function TermsAndConditionsPage() {
  return (
    <main className="min-h-screen bg-white pt-24 pb-20">
      <div className="container-main px-4 max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="flex items-center gap-2 text-sm text-slate-500">
            <li><Link href="/" className="hover:text-primary-700 transition-colors">Home</Link></li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-slate-900 font-medium">Terms & Conditions</li>
          </ol>
        </nav>

        <div className="bg-gradient-to-r from-primary-800 to-primary-900 rounded-2xl p-8 md:p-12 text-white mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Scale className="w-8 h-8 text-accent-400" aria-hidden="true" />
            <span className="text-sm font-semibold uppercase tracking-wider text-accent-300">Legal</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Terms & Conditions</h1>
          <p className="text-primary-100 text-lg">Last updated: June 22, 2026</p>
        </div>

        <div className="prose prose-lg max-w-none text-slate-700">
          <p className="text-lg leading-relaxed mb-8">
            Welcome to <strong>Tatkal Claims</strong>. These Terms and Conditions (&quot;Terms&quot;) govern your access to and use of our website, services, and platform. By using our services, you agree to be bound by these Terms. If you do not agree, please do not use our services.
          </p>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-10">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <h3 className="font-bold text-amber-900 mb-2">Important Notice</h3>
                <p className="text-amber-800 text-sm">
                  Tatkal Claims is an insurance dispute resolution platform. We are not a law firm, and our services do not constitute legal advice. We connect you with legal and insurance experts who assist with your dispute. For specific legal advice, please consult a licensed attorney.
                </p>
              </div>
            </div>
          </div>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
              <FileText className="w-6 h-6 text-primary-700" aria-hidden="true" />
              1. Definitions
            </h2>
            <ul className="space-y-3 list-disc list-inside">
              <li><strong>&quot;Platform&quot;</strong> refers to the Tatkal Claims website and all associated services.</li>
              <li><strong>&quot;User&quot;</strong> or <strong>&quot;You&quot;</strong> refers to any individual or entity accessing or using our Platform.</li>
              <li><strong>&quot;Services&quot;</strong> refers to insurance dispute resolution assistance, case evaluation, complaint filing, and related support services.</li>
              <li><strong>&quot;Expert&quot;</strong> refers to legal professionals, retired insurance ombudsmen, and insurance specialists associated with Tatkal Claims.</li>
              <li><strong>&quot;Insurer&quot;</strong> refers to insurance companies, their agents, and intermediaries.</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">2. Nature of Services</h2>
            <p className="mb-4">Tatkal Claims provides the following services:</p>
            <ul className="space-y-3 list-disc list-inside">
              <li>Free initial case evaluation and assessment</li>
              <li>Documentation review and preparation</li>
              <li>Complaint filing with insurers, IRDAI, Insurance Ombudsman, and Consumer Courts</li>
              <li>Negotiation and settlement assistance</li>
              <li>Legal representation coordination (where applicable)</li>
            </ul>
            <p className="mt-4"><strong>Disclaimer:</strong> We do not guarantee any specific outcome, settlement amount, or timeline. Success depends on the merits of your case, insurer cooperation, and regulatory processes.</p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">3. Eligibility</h2>
            <p className="mb-4">By using our Platform, you represent and warrant that:</p>
            <ul className="space-y-3 list-disc list-inside">
              <li>You are at least 18 years of age or have parental/guardian consent</li>
              <li>You are the policyholder, nominee, or legally authorized representative</li>
              <li>The information you provide is true, accurate, and complete</li>
              <li>You have the legal right to dispute the insurance claim in question</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">4. User Obligations</h2>
            <p className="mb-4">You agree to:</p>
            <ul className="space-y-3 list-disc list-inside">
              <li>Provide accurate and complete information about your insurance dispute</li>
              <li>Submit all relevant documents including policy documents, rejection letters, and correspondence</li>
              <li>Respond promptly to requests for additional information or documentation</li>
              <li>Not use our Platform for any fraudulent, illegal, or unauthorized purpose</li>
              <li>Not interfere with the operation of our Platform or attempt to gain unauthorized access</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">5. Fees and Payment</h2>
            <ul className="space-y-3 list-disc list-inside">
              <li><strong>Initial Consultation:</strong> Free case evaluation with no obligation</li>
              <li><strong>Service Fees:</strong> If you choose to proceed, fees are based on case complexity and communicated transparently before engagement</li>
              <li><strong>No Hidden Charges:</strong> All fees are disclosed upfront in writing</li>
              <li><strong>Refund Policy:</strong> Fees are non-refundable once services have commenced, except as required by law</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">6. Intellectual Property</h2>
            <p className="mb-4">All content on our Platform, including text, graphics, logos, images, and software, is the property of Tatkal Claims or its licensors and is protected by Indian and international copyright laws. You may not:</p>
            <ul className="space-y-3 list-disc list-inside">
              <li>Copy, reproduce, or distribute our content without written permission</li>
              <li>Use our trademarks or branding without authorization</li>
              <li>Create derivative works from our content</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">7. Limitation of Liability</h2>
            <p className="mb-4">To the maximum extent permitted by law:</p>
            <ul className="space-y-3 list-disc list-inside">
              <li>Tatkal Claims shall not be liable for any indirect, incidental, special, or consequential damages</li>
              <li>Our total liability shall not exceed the fees paid by you for the specific service giving rise to the claim</li>
              <li>We are not liable for delays caused by insurers, regulatory bodies, or courts</li>
              <li>We are not liable for decisions made by Insurance Ombudsman, IRDAI, or courts</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">8. Indemnification</h2>
            <p>You agree to indemnify and hold harmless Tatkal Claims, its directors, employees, and agents from any claims, damages, or expenses arising from:</p>
            <ul className="space-y-3 list-disc list-inside mt-4">
              <li>Your breach of these Terms</li>
              <li>Your violation of any law or third-party rights</li>
              <li>Any misrepresentation or false information provided by you</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">9. Dispute Resolution</h2>
            <p className="mb-4">Any dispute arising from these Terms shall be resolved as follows:</p>
            <ul className="space-y-3 list-disc list-inside">
              <li><strong>Negotiation:</strong> Parties shall first attempt to resolve the dispute through good faith negotiation</li>
              <li><strong>Mediation:</strong> If negotiation fails, parties may agree to mediation under the Mediation Act, 2023</li>
              <li><strong>Arbitration:</strong> If mediation fails, disputes shall be resolved through arbitration under the Arbitration and Conciliation Act, 1996</li>
              <li><strong>Jurisdiction:</strong> The courts of Mumbai, Maharashtra shall have exclusive jurisdiction over any unresolved disputes</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">10. Governing Law</h2>
            <p>These Terms shall be governed by and construed in accordance with the laws of India, including the Insurance Act, 1938, IRDAI Act, 1999, Consumer Protection Act, 2019, and Digital Personal Data Protection Act, 2023.</p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">11. Termination</h2>
            <p className="mb-4">We reserve the right to:</p>
            <ul className="space-y-3 list-disc list-inside">
              <li>Suspend or terminate your access to our Platform for violation of these Terms</li>
              <li>Refuse service to anyone for any reason at our discretion</li>
              <li>Modify or discontinue any part of our services without notice</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">12. Third-Party Services</h2>
            <p>Our Platform may integrate with third-party services (e.g., Google Forms, WhatsApp, payment gateways). Your use of these services is subject to their respective terms and conditions. We are not responsible for the content, privacy practices, or availability of third-party services.</p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">13. Changes to Terms</h2>
            <p>We may update these Terms from time to time. We will notify you of significant changes by posting the updated Terms on our website with a revised &quot;Last Updated&quot; date. Continued use of our Platform after changes constitutes acceptance of the revised Terms.</p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
              <Gavel className="w-6 h-6 text-primary-700" aria-hidden="true" />
              14. Contact Information
            </h2>
            <p className="mb-4">For questions about these Terms, please contact us:</p>
            <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
              <p className="font-semibold text-slate-900 mb-2">Tatkal Claims</p>
              <div className="space-y-2 text-slate-600">
                <p>Email: <a href="mailto:help@tatkalclaims.com" className="text-primary-700 hover:underline">help@tatkalclaims.com</a></p>
                <p>Phone: <a href="tel:+917207382073" className="text-primary-700 hover:underline">+91 7207382073</a></p>
                <p>Address: 84, Bakol Street, Laudin Villa, Bhayander West, Mumbai - 401101</p>
              </div>
            </div>
          </section>

          <div className="bg-primary-50 rounded-xl p-6 border border-primary-100 mt-12">
            <p className="text-sm text-slate-600">
              <strong>Disclaimer:</strong> These Terms & Conditions are provided for informational purposes. They do not constitute legal advice. For specific legal guidance, please consult a qualified attorney. Tatkal Claims reserves the right to modify these Terms at any time.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
