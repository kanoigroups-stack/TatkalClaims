"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, CheckCircle, Loader2, AlertCircle } from "lucide-react";

const issueTypes = ["Claim Rejection", "Claim Delay", "Short Settlement", "Mis-selling", "Policy Dispute", "Other"];

const GOOGLE_FORM_ID = "1FAIpQLSeTkodT19oTHy2ZJeKm_uG1imDMRr_CTrPnlyuVNkYsOD9zFA";
const GOOGLE_FORM_ENTRIES = {
  name: "entry.280581221",
  email: "entry.577275878",
  phone: "entry.1741549894",
  issueType: "entry.1897162496",
  message: "entry.1257999619",
};

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  issueType?: string;
}

export default function LeadCaptureForm() {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", issueType: "", message: "" });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validate = useCallback((): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    if (!formData.name.trim()) {
      newErrors.name = "Full name is required";
      isValid = false;
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
      isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "Email address is required";
      isValid = false;
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    }

    const phoneRegex = /^[5-9][0-9]{9}$/;
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
      isValid = false;
    } else if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = "Enter a valid 10-digit Indian mobile number";
      isValid = false;
    }

    if (!formData.issueType) {
      newErrors.issueType = "Please select an issue type";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  }, [formData]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (touched[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validate();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);

    const formUrl = `https://docs.google.com/forms/d/e/${GOOGLE_FORM_ID}/formResponse`;
    const hiddenForm = document.createElement("form");
    hiddenForm.method = "POST";
    hiddenForm.action = formUrl;
    hiddenForm.target = "hidden-iframe";
    hiddenForm.style.display = "none";

    Object.entries(GOOGLE_FORM_ENTRIES).forEach(([key, entryId]) => {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = entryId;
      input.value = formData[key as keyof typeof formData];
      hiddenForm.appendChild(input);
    });

    let iframe = document.getElementById("hidden-iframe") as HTMLIFrameElement | null;
    if (!iframe) {
      iframe = document.createElement("iframe");
      iframe.id = "hidden-iframe";
      iframe.name = "hidden-iframe";
      iframe.style.display = "none";
      document.body.appendChild(iframe);
    }

    document.body.appendChild(hiddenForm);
    hiddenForm.submit();

    setTimeout(() => {
      document.body.removeChild(hiddenForm);
    }, 1000);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setErrors({});
      setTouched({});
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({ name: "", email: "", phone: "", issueType: "", message: "" });
      }, 3000);
    }, 1500);
  };

  if (isSubmitted) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }} 
        animate={{ opacity: 1, scale: 1 }} 
        className="bg-white rounded-2xl p-8 shadow-float border border-slate-100 text-center"
        role="alert"
        aria-live="polite"
      >
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" aria-hidden="true" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">Thank You!</h3>
        <p className="text-slate-600">Our experts will contact you within 24 hours to discuss your case.</p>
      </motion.div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 md:p-8 shadow-float border border-slate-100 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-800 via-primary-600 to-accent-500" />
      <div className="mb-6">
        <h3 className="text-xl font-bold text-slate-900 mb-1">Get Free Case Evaluation</h3>
        <p className="text-sm text-slate-500">Fill in your details and our experts will reach out</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div>
          <label htmlFor="name" className="sr-only">Full Name</label>
          <input 
            id="name"
            type="text" 
            placeholder="Full Name *" 
            value={formData.name} 
            onChange={(e) => handleChange("name", e.target.value)} 
            onBlur={() => handleBlur("name")}
            className={`w-full px-4 py-3 rounded-xl border ${errors.name ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200" : "border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200"} outline-none transition-all text-sm`}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "name-error" : undefined}
          />
          <AnimatePresence>
            {errors.name && (
              <motion.div 
                initial={{ opacity: 0, y: -5 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, y: -5 }}
                id="name-error" 
                className="flex items-center gap-1.5 mt-1.5 text-red-500 text-xs"
                role="alert"
              >
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />
                <span>{errors.name}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="email" className="sr-only">Email Address</label>
            <input 
              id="email"
              type="email" 
              placeholder="Email Address *" 
              value={formData.email} 
              onChange={(e) => handleChange("email", e.target.value)} 
              onBlur={() => handleBlur("email")}
              className={`w-full px-4 py-3 rounded-xl border ${errors.email ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200" : "border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200"} outline-none transition-all text-sm`}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
            />
            <AnimatePresence>
              {errors.email && (
                <motion.div 
                  initial={{ opacity: 0, y: -5 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  exit={{ opacity: 0, y: -5 }}
                  id="email-error" 
                  className="flex items-center gap-1.5 mt-1.5 text-red-500 text-xs"
                  role="alert"
                >
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />
                  <span>{errors.email}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div>
            <label htmlFor="phone" className="sr-only">Phone Number</label>
            <input 
              id="phone"
              type="tel" 
              placeholder="Phone Number *" 
              maxLength={10}
              value={formData.phone} 
              onChange={(e) => handleChange("phone", e.target.value.replace(/\D/g, ""))} 
              onBlur={() => handleBlur("phone")}
              className={`w-full px-4 py-3 rounded-xl border ${errors.phone ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200" : "border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200"} outline-none transition-all text-sm`}
              aria-invalid={!!errors.phone}
              aria-describedby={errors.phone ? "phone-error" : undefined}
            />
            <AnimatePresence>
              {errors.phone && (
                <motion.div 
                  initial={{ opacity: 0, y: -5 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  exit={{ opacity: 0, y: -5 }}
                  id="phone-error" 
                  className="flex items-center gap-1.5 mt-1.5 text-red-500 text-xs"
                  role="alert"
                >
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />
                  <span>{errors.phone}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div>
          <label htmlFor="issueType" className="sr-only">Issue Type</label>
          <select 
            id="issueType"
            value={formData.issueType} 
            onChange={(e) => handleChange("issueType", e.target.value)} 
            onBlur={() => handleBlur("issueType")}
            className={`w-full px-4 py-3 rounded-xl border ${errors.issueType ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200" : "border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200"} outline-none transition-all text-sm bg-white`}
            aria-invalid={!!errors.issueType}
            aria-describedby={errors.issueType ? "issue-error" : undefined}
          >
            <option value="">Select Issue Type *</option>
            {issueTypes.map((type) => <option key={type} value={type}>{type}</option>)}
          </select>
          <AnimatePresence>
            {errors.issueType && (
              <motion.div 
                initial={{ opacity: 0, y: -5 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, y: -5 }}
                id="issue-error" 
                className="flex items-center gap-1.5 mt-1.5 text-red-500 text-xs"
                role="alert"
              >
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />
                <span>{errors.issueType}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <label htmlFor="message" className="sr-only">Briefly describe your issue</label>
        <textarea 
          id="message"
          placeholder="Briefly describe your issue (optional)" 
          rows={3} 
          value={formData.message} 
          onChange={(e) => handleChange("message", e.target.value)} 
          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all text-sm resize-none"
        />

        <button 
          type="submit" 
          disabled={isSubmitting} 
          className="w-full btn-primary py-4 text-base disabled:opacity-70 disabled:cursor-not-allowed"
          aria-label={isSubmitting ? "Submitting your form" : "Get expert help now"}
        >
          {isSubmitting ? (
            <><Loader2 className="w-5 h-5 mr-2 animate-spin" aria-hidden="true" />Submitting...</>
          ) : (
            <><Send className="w-5 h-5 mr-2" aria-hidden="true" />Get Expert Help Now</>
          )}
        </button>

        <p className="text-xs text-center text-slate-400 mt-4">
          By submitting, you agree to our privacy policy. We respect your data.
        </p>
      </form>
    </div>
  );
}
