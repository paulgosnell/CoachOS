'use client'

import Link from 'next/link'
import { Clock, ArrowRight } from 'lucide-react'
import { Article, CATEGORY_LABELS } from '@/lib/content/types'

interface ArticleCardProps {
  article: Article
  featured?: boolean
}

export function ArticleCard({ article, featured = false }: ArticleCardProps) {
  if (featured) {
    return (
      <Link
        href={`/blog/${article.slug}`}
        className="group block rounded-2xl border border-white/10 bg-titanium-900 p-8 transition-all duration-300 hover:border-silver/30 hover:-translate-y-1"
      >
        <div className="mb-4 flex items-center gap-3">
          <span className="rounded-full bg-deep-blue-800/50 px-3 py-1 text-xs font-medium text-silver">
            {CATEGORY_LABELS[article.category]}
          </span>
          <span className="flex items-center gap-1 text-xs text-silver-dark">
            <Clock className="h-3 w-3" />
            {article.readingTime} min
          </span>
        </div>

        <h2 className="mb-3 font-serif text-2xl font-bold group-hover:text-gradient transition-all md:text-3xl">
          {article.title}
        </h2>

        <p className="mb-6 text-silver-light">
          {article.description}
        </p>

        <div className="flex items-center gap-2 text-sm font-medium text-silver group-hover:text-white transition-colors">
          Read article
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </div>
      </Link>
    )
  }

  return (
    <Link
      href={`/blog/${article.slug}`}
      className="group block rounded-xl border border-white/5 bg-titanium-900 p-6 transition-all duration-300 hover:border-silver/20 hover:-translate-y-1"
    >
      <div className="mb-3 flex items-center gap-3">
        <span className="rounded-full bg-titanium-800 px-2 py-0.5 text-xs text-silver-dark">
          {CATEGORY_LABELS[article.category]}
        </span>
        <span className="flex items-center gap-1 text-xs text-silver-dark">
          <Clock className="h-3 w-3" />
          {article.readingTime} min
        </span>
      </div>

      <h3 className="mb-2 text-lg font-semibold group-hover:text-silver transition-colors">
        {article.title}
      </h3>

      <p className="text-sm text-silver-dark line-clamp-2">
        {article.description}
      </p>
    </Link>
  )
}
