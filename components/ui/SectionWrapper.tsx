"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface SectionWrapperProps {
  children: ReactNode;
  className?: string;
  id?: string;
}

export default function SectionWrapper({ children, className = "", id }: SectionWrapperProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section id={id} className={`section-padding ${className}`}>
      {prefersReducedMotion ? (
        <div className="container-main">{children}</div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true, margin: "-100px" }} 
          transition={{ duration: 0.6, ease: "easeOut" }} 
          className="container-main"
        >
          {children}
        </motion.div>
      )}
    </section>
  );
}
