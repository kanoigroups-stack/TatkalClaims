"use client";

import { motion } from "framer-motion";
import { ArrowRight, Clock, User } from "lucide-react";
import Link from "next/link";
import SectionWrapper from "../ui/SectionWrapper";
import blogsData from "@/data/blogs.json";
import { formatDate } from "@/utils/date";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export default function KnowledgeSection() {
  const articles = blogsData.posts.slice(0, 3);
  const prefersReducedMotion = useReducedMotion();

  return (
    <SectionWrapper id="blog">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 md:mb-16">
        <div className="max-w-3xl">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-slate-900">Knowledge Center</h2>
          <p className="text-lg md:text-xl text-slate-600">Expert insights to help you understand your rights and navigate insurance disputes</p>
        </div>
        <Link 
          href="/blog/" 
          className="btn-secondary mt-4 md:mt-0 group"
          aria-label="View all articles in knowledge center"
        >
          View All Articles
          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
        </Link>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {articles.map((article, index) => (
          <motion.article
            key={article.slug}
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.5, delay: prefersReducedMotion ? 0 : index * 0.1 }}
            whileHover={prefersReducedMotion ? undefined : { y: -8 }}
            className="group bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 border border-slate-100"
          >
            <Link href={`/blog/${article.slug}/`} className="block">
              <div className="relative h-48 overflow-hidden bg-slate-100">
                <img
                  src={article.image}
                  alt={article.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-primary-800 text-white text-xs font-semibold px-3 py-1 rounded-full">
                  {article.category}
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center gap-4 text-xs text-slate-500 mb-3">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" aria-hidden="true" /> {article.readTime}
                  </span>
                  <span className="flex items-center gap-1">
                    <User className="w-3 h-3" aria-hidden="true" /> {article.author}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 mb-3 group-hover:text-primary-700 transition-colors line-clamp-2">
                  {article.title}
                </h3>

                <p className="text-slate-600 text-sm leading-relaxed mb-4 line-clamp-3">
                  {article.excerpt}
                </p>

                <div className="flex items-center text-primary-700 font-semibold text-sm group-hover:gap-3 gap-2 transition-all">
                  Read Article <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </div>
              </div>
            </Link>
          </motion.article>
        ))}
      </div>
    </SectionWrapper>
  );
}
