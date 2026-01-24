// Content types for CoachOS blog/resources

export type ArticleCategory =
  | 'adhd-business'
  | 'adhd-productivity'
  | 'coaching'
  | 'frameworks'
  | 'decisions'
  | 'founder-life'

export type ArticleType =
  | 'guide'
  | 'explainer'
  | 'comparison'
  | 'listicle'
  | 'case-study'
  | 'how-to'

export interface Article {
  slug: string
  title: string
  description: string
  category: ArticleCategory
  type: ArticleType
  publishedAt: string
  updatedAt?: string
  author: string
  readingTime: number // minutes
  featured?: boolean
  tags: string[]
  // SEO
  metaTitle?: string
  metaDescription?: string
  ogImage?: string
}

export interface ArticleContent extends Article {
  content: string // MDX or HTML content
}

export const CATEGORY_LABELS: Record<ArticleCategory, string> = {
  'adhd-business': 'ADHD & Business',
  'adhd-productivity': 'ADHD Productivity',
  'coaching': 'Coaching',
  'frameworks': 'Frameworks',
  'decisions': 'Decision Making',
  'founder-life': 'Founder Life',
}

export const CATEGORY_DESCRIPTIONS: Record<ArticleCategory, string> = {
  'adhd-business': 'Strategies for running a successful business with ADHD',
  'adhd-productivity': 'Systems and tools that work with your ADHD brain',
  'coaching': 'Understanding executive coaching and its benefits',
  'frameworks': 'Proven coaching and decision-making frameworks',
  'decisions': 'Make better decisions with less stress',
  'founder-life': 'Navigating the challenges of being a founder',
}
