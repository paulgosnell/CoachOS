'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search } from 'lucide-react'
import { ArticleCard } from '@/components/blog/ArticleCard'
import { Article, ArticleCategory, CATEGORY_LABELS } from '@/lib/content/types'

const categories: ArticleCategory[] = [
  'adhd-business',
  'adhd-productivity',
  'coaching',
  'frameworks',
  'decisions',
  'founder-life',
]

interface BlogClientProps {
  articles: Article[]
}

export function BlogClient({ articles }: BlogClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<ArticleCategory | 'all'>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredArticles = articles.filter((article) => {
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory
    const matchesSearch =
      searchQuery === '' ||
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesCategory && matchesSearch
  })

  const featuredArticle = articles.find((a) => a.featured)

  return (
    <main className="min-h-screen bg-titanium-950 pt-16">
      {/* Hero */}
      <section className="border-b border-white/5 py-16">
        <div className="container mx-auto max-w-6xl px-6">
          <h1 className="mb-4 font-serif text-4xl font-bold md:text-5xl">
            Resources for <span className="text-gradient">ADHD Entrepreneurs</span>
          </h1>
          <p className="max-w-2xl text-lg text-silver-light">
            Practical guides, frameworks, and strategies for running a business with ADHD.
            Built by founders who get it.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="border-b border-white/5 py-6">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            {/* Categories */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  selectedCategory === 'all'
                    ? 'bg-white text-black'
                    : 'bg-titanium-800 text-silver-dark hover:text-silver'
                }`}
              >
                All
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    selectedCategory === category
                      ? 'bg-white text-black'
                      : 'bg-titanium-800 text-silver-dark hover:text-silver'
                  }`}
                >
                  {CATEGORY_LABELS[category]}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-silver-dark" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg bg-titanium-800 py-2 pl-10 pr-4 text-sm text-white placeholder-silver-dark focus:outline-none focus:ring-2 focus:ring-silver/50 md:w-64"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Articles */}
      <section className="py-12">
        <div className="container mx-auto max-w-6xl px-6">
          {/* Featured Article */}
          {selectedCategory === 'all' && searchQuery === '' && featuredArticle && (
            <div className="mb-12">
              <h2 className="mb-6 text-sm font-semibold uppercase tracking-wider text-silver-dark">
                Featured
              </h2>
              <ArticleCard article={featuredArticle} featured />
            </div>
          )}

          {/* Article Grid */}
          <div>
            <h2 className="mb-6 text-sm font-semibold uppercase tracking-wider text-silver-dark">
              {selectedCategory === 'all' ? 'All Articles' : CATEGORY_LABELS[selectedCategory]}
              <span className="ml-2 text-silver-darker">({filteredArticles.length})</span>
            </h2>

            {filteredArticles.length === 0 ? (
              <div className="rounded-xl border border-white/5 bg-titanium-900 p-12 text-center">
                <p className="text-silver-dark">No articles found. Try a different search or category.</p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredArticles
                  .filter((a) => !a.featured || selectedCategory !== 'all' || searchQuery !== '')
                  .map((article) => (
                    <ArticleCard key={article.slug} article={article} />
                  ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-white/5 py-16">
        <div className="container mx-auto max-w-6xl px-6 text-center">
          <h2 className="mb-4 font-serif text-3xl font-bold">
            Ready for personalized coaching?
          </h2>
          <p className="mb-8 text-silver-light">
            Coach OS provides framework-based AI coaching designed for ADHD entrepreneurs.
          </p>
          <Link href="/auth/signup" className="btn btn-primary">
            Try Coach OS Free
          </Link>
        </div>
      </section>
    </main>
  )
}
