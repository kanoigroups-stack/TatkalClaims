# Tatkal Claims

India's Most Trusted Insurance Dispute Resolution Platform

## Deploy on Vercel

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → Add New Project
3. Import your GitHub repo
4. Vercel auto-detects Next.js → Click Deploy

## Add Blog Posts

Edit `data/blogs.json` directly on GitHub:

1. Open `data/blogs.json`
2. Click the pencil icon (Edit)
3. Add a new post object to the `"posts"` array
4. Commit changes
5. Vercel auto-deploys!

## Post Format

```json
{
  "slug": "your-post-slug",
  "title": "Your Post Title",
  "excerpt": "Short description",
  "category": "Claim Rejection",
  "readTime": "5 min read",
  "author": "Legal Team",
  "date": "2026-06-15",
  "image": "https://images.unsplash.com/photo-xxx?w=800&h=400&fit=crop",
  "content": "Your content here. Use \\n for new lines. Use ## for headings."
}
```

## Tech Stack

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Framer Motion
