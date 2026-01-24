'use client'

import Link from 'next/link'
import { ArrowLeft, Clock, Calendar, ArrowRight } from 'lucide-react'
import { Article, CATEGORY_LABELS } from '@/lib/content/types'

interface ArticleLayoutProps {
  article: Article
  children: React.ReactNode
}

export function ArticleLayout({ article, children }: ArticleLayoutProps) {
  const publishedDate = new Date(article.publishedAt).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <main className="min-h-screen bg-titanium-950">
      {/* Header */}
      <header className="border-b border-white/5 py-4">
        <div className="container mx-auto max-w-4xl px-6">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-silver-dark hover:text-silver transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Resources
          </Link>
        </div>
      </header>

      {/* Article */}
      <article className="py-12">
        <div className="container mx-auto max-w-4xl px-6">
          {/* Meta */}
          <div className="mb-8">
            <div className="mb-4 flex flex-wrap items-center gap-4 text-sm text-silver-dark">
              <Link
                href={`/blog?category=${article.category}`}
                className="rounded-full bg-deep-blue-800/50 px-3 py-1 text-xs font-medium text-silver hover:bg-deep-blue-700/50 transition-colors"
              >
                {CATEGORY_LABELS[article.category]}
              </Link>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{publishedDate}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{article.readingTime} min read</span>
              </div>
            </div>

            <h1 className="mb-4 font-serif text-4xl font-bold leading-tight md:text-5xl">
              {article.title}
            </h1>

            <p className="text-lg text-silver-light">
              {article.description}
            </p>
          </div>

          {/* Content */}
          <div className="prose prose-invert prose-lg max-w-none">
            {children}
          </div>

          {/* Tags */}
          {article.tags.length > 0 && (
            <div className="mt-12 border-t border-white/5 pt-8">
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-titanium-800 px-3 py-1 text-xs text-silver-dark"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="mt-12 rounded-2xl border border-white/10 bg-titanium-900 p-8 text-center">
            <h3 className="mb-2 font-serif text-2xl font-bold">
              Ready for AI coaching that understands ADHD?
            </h3>
            <p className="mb-6 text-silver-light">
              Coach OS provides framework-based coaching with automatic task extraction.
              Available 24/7, no scheduling needed.
            </p>
            <Link href="/auth/signup" className="btn btn-primary">
              Try Coach OS Free
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </article>
    </main>
  )
}
