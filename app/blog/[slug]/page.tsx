import { notFound } from "next/navigation";
import { Clock, User, Calendar } from "lucide-react";
import Link from "next/link";
import blogsData from "@/data/blogs.json";
import ReadingProgress from "@/components/blog/ReadingProgress";
import { formatDate } from "@/utils/date";

export function generateStaticParams() {
  return blogsData.posts.map((post) => ({
    slug: post.slug,
  }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const post = blogsData.posts.find((p) => p.slug === params.slug);
  if (!post) return { 
    title: "Article Not Found",
    robots: { index: false, follow: false },
  };

  return {
    title: post.title,
    description: post.excerpt,
    alternates: {
      canonical: `/blog/${post.slug}/`,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [{
        url: post.image,
        width: 800,
        height: 400,
        alt: post.title,
      }],
      type: "article",
      publishedTime: post.date,
      modifiedTime: post.date,
      authors: [post.author],
      tags: [post.category, "insurance", "claim dispute", "india"],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [post.image],
    },
  };
}

function renderContent(content: string) {
  const lines = content.split("\n");
  const elements: JSX.Element[] = [];
  let key = 0;
  let inList = false;
  let listItems: JSX.Element[] = [];

  const flushList = () => {
    if (inList && listItems.length > 0) {
      elements.push(
        <ul key={`list-${key++}`} className="list-disc list-inside space-y-2 mb-4 text-slate-700">
          {listItems}
        </ul>
      );
      listItems = [];
      inList = false;
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (!line) {
      flushList();
      continue;
    }

    if (line.startsWith("## ")) {
      flushList();
      elements.push(
        <h2 key={key++} className="text-2xl font-bold text-slate-900 mt-10 mb-4 scroll-mt-24">
          {line.replace("## ", "")}
        </h2>
      );
    }
    else if (line.startsWith("### ")) {
      flushList();
      elements.push(
        <h3 key={key++} className="text-xl font-semibold text-slate-900 mt-8 mb-3 scroll-mt-24">
          {line.replace("### ", "")}
        </h3>
      );
    }
    else if (line.startsWith("- ")) {
      inList = true;
      listItems.push(
        <li key={key++} className="leading-relaxed ml-2">
          {line.replace("- ", "")}
        </li>
      );
    }
    else if (/^\*\*(.+)\*\*$/.test(line)) {
      flushList();
      const text = line.replace(/^\*\*|\*\*$/g, "");
      elements.push(
        <p key={key++} className="text-slate-900 font-bold leading-relaxed mb-4">
          {text}
        </p>
      );
    }
    else {
      flushList();
      elements.push(
        <p key={key++} className="text-slate-700 leading-relaxed mb-4">
          {line}
        </p>
      );
    }
  }

  flushList();
  return elements;
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = blogsData.posts.find((p) => p.slug === params.slug);

  if (!post) {
    notFound();
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://www.tatkalclaims.com/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Knowledge Center",
        item: "https://www.tatkalclaims.com/blog/",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: `https://www.tatkalclaims.com/blog/${post.slug}/`,
      },
    ],
  };

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: {
      "@type": "ImageObject",
      url: post.image,
      width: 800,
      height: 400,
    },
    author: {
      "@type": "Organization",
      name: post.author,
      url: "https://www.tatkalclaims.com",
    },
    publisher: {
      "@type": "Organization",
      name: "Tatkal Claims",
      logo: {
        "@type": "ImageObject",
        url: "https://www.tatkalclaims.com/logo.png",
        width: 512,
        height: 512,
      },
    },
    datePublished: post.date,
    dateModified: post.date,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://www.tatkalclaims.com/blog/${post.slug}/`,
    },
    keywords: [post.category, "insurance claim", "dispute resolution", "india"],
    articleSection: post.category,
  };

  return (
    <main className="min-h-screen bg-white pt-20">
      <ReadingProgress />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <div className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="container-main px-4 py-3">
          <nav aria-label="Breadcrumb">
            <ol className="flex items-center gap-2 text-sm text-slate-600 flex-wrap">
              <li><Link href="/" className="hover:text-primary-700 transition-colors">Home</Link></li>
              <li aria-hidden="true">/</li>
              <li><Link href="/blog/" className="hover:text-primary-700 transition-colors">Knowledge Center</Link></li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="text-slate-900 font-medium line-clamp-1 max-w-[200px]">{post.title}</li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="relative h-64 md:h-96 overflow-hidden bg-slate-900">
        <img 
          src={post.image} 
          alt={post.title} 
          className="w-full h-full object-cover" 
          loading="eager"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
          <div className="container-main">
            <span className="bg-accent-500 text-white text-sm font-semibold px-4 py-1 rounded-full inline-block mb-4">
              {post.category}
            </span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mt-2 max-w-3xl">
              {post.title}
            </h1>
          </div>
        </div>
      </div>

      <div className="container-main px-4 py-12">
        <div className="flex items-center gap-6 text-sm text-slate-500 mb-8 pb-8 border-b border-slate-200 flex-wrap">
          <span className="flex items-center gap-2"><User className="w-4 h-4" aria-hidden="true" />{post.author}</span>
          <span className="flex items-center gap-2"><Calendar className="w-4 h-4" aria-hidden="true" />{formatDate(post.date)}</span>
          <span className="flex items-center gap-2"><Clock className="w-4 h-4" aria-hidden="true" />{post.readTime}</span>
        </div>

        <article className="max-w-3xl mx-auto">
          <div className="prose prose-lg max-w-none">
            {renderContent(post.content)}
          </div>
        </article>

        <div className="max-w-3xl mx-auto mt-16 p-8 bg-gradient-to-r from-primary-50 to-accent-50 rounded-2xl border border-primary-100">
          <h3 className="text-xl font-bold text-primary-900 mb-2">Facing a similar issue?</h3>
          <p className="text-slate-600 mb-6">Our experts can help you resolve your insurance dispute. Get a free case evaluation today.</p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/" className="btn-primary text-center">Get Free Case Evaluation</Link>
            <a href="tel:+919321152524" className="btn-secondary text-center">Call Our Experts</a>
          </div>
        </div>

        <div className="max-w-3xl mx-auto mt-16">
          <h3 className="text-xl font-bold text-slate-900 mb-6">More Articles</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {blogsData.posts
              .filter((p) => p.slug !== post.slug)
              .slice(0, 2)
              .map((relatedPost) => (
                <Link
                  key={relatedPost.slug}
                  href={`/blog/${relatedPost.slug}/`}
                  className="group p-4 bg-slate-50 rounded-xl hover:bg-primary-50 transition-colors border border-slate-100"
                >
                  <span className="text-xs font-semibold text-primary-700">{relatedPost.category}</span>
                  <h4 className="text-sm font-bold text-slate-900 mt-1 group-hover:text-primary-700 transition-colors line-clamp-2">
                    {relatedPost.title}
                  </h4>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </main>
  );
}
