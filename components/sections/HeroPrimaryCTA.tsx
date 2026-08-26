"use client";

import { ArrowRight } from "lucide-react";
import { scrollToForm } from "@/utils/scroll";

export default function HeroPrimaryCTA() {
  return (
    <button
      type="button"
      onClick={scrollToForm}
      className="btn-primary text-base group"
      aria-label="Submit your insurance complaint"
    >
      Submit Your Complaint
      <ArrowRight
        className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform"
        aria-hidden="true"
      />
    </button>
  );
}
