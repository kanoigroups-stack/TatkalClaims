"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Users, IndianRupee, Star, Shield, GraduationCap, TrendingUp, Scale, FileCheck } from "lucide-react";
import SectionWrapper from "../ui/SectionWrapper";
import SectionHeader from "../ui/SectionHeader";
import { useReducedMotion } from "@/hooks/useReducedMotion";

function AnimatedCounter({ target, suffix = "", prefix = "", isDecimal = false }: { target: number; suffix?: string; prefix?: string; isDecimal?: boolean }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const hasAnimated = useRef(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (!isInView || hasAnimated.current) return;
    hasAnimated.current = true;

    if (prefersReducedMotion) {
      setCount(target);
      return;
    }

    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const current = increment * step;

      if (step >= steps) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(isDecimal ? parseFloat(current.toFixed(1)) : Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [isInView, target, isDecimal, prefersReducedMotion]);

  // SSR/Hydration fallback: show target value immediately on mount if not animating
  useEffect(() => {
    const fallbackTimer = setTimeout(() => {
      if (!hasAnimated.current) {
        hasAnimated.current = true;
        setCount(target);
      }
    }, 500);
    return () => clearTimeout(fallbackTimer);
  }, [target]);

  const displayValue = isDecimal ? count.toFixed(1) : count.toLocaleString();

  return <span ref={ref}>{prefix}{displayValue}{suffix}</span>;
}

const stats = [
  { icon: Users, value: 500, suffix: "+", label: "Cases Assisted", color: "text-primary-700" },
  { icon: IndianRupee, value: 20, suffix: "+ Crores", prefix: "₹", label: "Claims Recovered", color: "text-accent-600" },
  { icon: Star, value: 4.6, suffix: "", label: "Client Rating", color: "text-amber-500", isDecimal: true },
];

const credentials = [
  { icon: GraduationCap, title: "Legal Experts", desc: "Advocates & retired insurance ombudsmen" },
  { icon: Shield, title: "Insurance Specialists", desc: "Former insurance company professionals" },
  { icon: TrendingUp, title: "82% Success Rate", desc: "Cases resolved in client's favor" },
  { icon: Scale, title: "Regulatory Knowledge", desc: "IRDAI, Ombudsman & Consumer Court expertise" },
  { icon: FileCheck, title: "Documentation Pros", desc: "Perfect paperwork for maximum impact" },
  { icon: Users, title: "Dedicated Team", desc: "Personal case manager for every client" },
];

export default function TrustSection() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <SectionWrapper id="trust" className="bg-gradient-to-b from-primary-900 to-primary-950 text-white">
      <SectionHeader title="Why Thousands of Policyholders Trust Us" subtitle="A track record built on expertise, transparency, and relentless advocacy for policyholders" light />
      <div className="grid md:grid-cols-3 gap-8 mb-20">
        {stats.map((stat, index) => (
          <motion.div 
            key={stat.label} 
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.5, delay: prefersReducedMotion ? 0 : index * 0.1 }}
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center border border-white/10"
          >
            <stat.icon className={`w-10 h-10 mx-auto mb-4 ${stat.color}`} aria-hidden="true" />
            <div className="text-4xl md:text-5xl font-bold mb-2 text-white">
              <AnimatedCounter target={stat.value} prefix={stat.prefix} suffix={stat.suffix} isDecimal={stat.isDecimal || false} />
            </div>
            <div className="text-white/70 font-medium">{stat.label}</div>
          </motion.div>
        ))}
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {credentials.map((cred, index) => (
          <motion.div 
            key={cred.title} 
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.4, delay: prefersReducedMotion ? 0 : index * 0.08 }}
            className="flex items-start gap-4 bg-white/5 backdrop-blur-sm rounded-xl p-5 border border-white/10 hover:bg-white/10 transition-colors"
          >
            <div className="w-12 h-12 bg-accent-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <cred.icon className="w-6 h-6 text-accent-400" aria-hidden="true" />
            </div>
            <div>
              <h4 className="font-semibold text-white mb-1">{cred.title}</h4>
              <p className="text-sm text-white/60">{cred.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  );
}
