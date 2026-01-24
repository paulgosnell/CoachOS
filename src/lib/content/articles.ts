import { Article } from './types'

// Articles - in production, this would come from a CMS or MDX files
export const articles: Article[] = [
  // Featured
  {
    slug: 'adhd-entrepreneur-guide',
    title: 'The Complete Guide to Running a Business with ADHD',
    description:
      'ADHD entrepreneurs are 300% more likely to start businesses. Learn how to leverage your strengths and build systems that work with your brain.',
    category: 'adhd-business',
    type: 'guide',
    publishedAt: '2025-01-24',
    author: 'Coach OS',
    readingTime: 12,
    featured: true,
    tags: ['ADHD', 'entrepreneurship', 'productivity', 'business'],
  },

  // ADHD Business
  {
    slug: 'why-productivity-advice-fails-adhd',
    title: 'Why Traditional Productivity Advice Fails ADHD Entrepreneurs',
    description:
      'Pomodoro, GTD, time blocking - none of it works for you. Here is why, and what to do instead.',
    category: 'adhd-business',
    type: 'guide',
    publishedAt: '2025-01-23',
    author: 'Coach OS',
    readingTime: 8,
    featured: false,
    tags: ['ADHD', 'productivity', 'entrepreneurs', 'systems'],
  },
  {
    slug: 'adhd-accountability',
    title: 'ADHD Accountability: Why External Support Changes Everything',
    description:
      'Body doubling, coaches, and accountability partners work for ADHD brains. The science behind why you need external structure.',
    category: 'adhd-business',
    type: 'guide',
    publishedAt: '2025-01-22',
    author: 'Coach OS',
    readingTime: 7,
    featured: false,
    tags: ['ADHD', 'accountability', 'coaching', 'body doubling'],
  },
  {
    slug: 'adhd-time-blindness-business',
    title: 'Time Blindness: The ADHD Entrepreneur\'s Biggest Challenge',
    description:
      'For ADHD brains, time is either "now" or "not now". How to run a business when you cannot feel time passing.',
    category: 'adhd-business',
    type: 'guide',
    publishedAt: '2025-01-21',
    author: 'Coach OS',
    readingTime: 9,
    featured: false,
    tags: ['ADHD', 'time management', 'time blindness', 'business'],
  },

  // ADHD Productivity
  {
    slug: 'adhd-task-management-systems',
    title: 'ADHD Task Management: 5 Systems That Actually Work',
    description:
      'Traditional to-do lists fail ADHD brains. Here are 5 task management approaches designed for how you actually think.',
    category: 'adhd-productivity',
    type: 'listicle',
    publishedAt: '2025-01-20',
    author: 'Coach OS',
    readingTime: 7,
    featured: false,
    tags: ['ADHD', 'task management', 'productivity', 'systems'],
  },
  {
    slug: 'adhd-decision-fatigue',
    title: 'ADHD Decision Fatigue: Why Small Choices Feel Impossible',
    description:
      'Decision fatigue hits ADHD brains harder. Understand why and learn strategies to preserve your mental energy for what matters.',
    category: 'decisions',
    type: 'guide',
    publishedAt: '2025-01-19',
    author: 'Coach OS',
    readingTime: 9,
    featured: false,
    tags: ['ADHD', 'decision-making', 'overwhelm', 'productivity'],
  },
  {
    slug: 'adhd-overwhelm-spiral',
    title: 'The ADHD Overwhelm Spiral (And How to Break It)',
    description:
      'When everything feels urgent and nothing gets done. Understanding the overwhelm cycle and practical ways to escape it.',
    category: 'adhd-productivity',
    type: 'guide',
    publishedAt: '2025-01-18',
    author: 'Coach OS',
    readingTime: 8,
    featured: false,
    tags: ['ADHD', 'overwhelm', 'anxiety', 'productivity'],
  },

  // Coaching
  {
    slug: 'executive-coaching-cost-2025',
    title: 'Executive Coaching Costs in 2025: Is There a Better Way?',
    description:
      'Executive coaches charge £300-500 per session. We break down the costs and explore affordable alternatives that deliver real results.',
    category: 'coaching',
    type: 'comparison',
    publishedAt: '2025-01-17',
    author: 'Coach OS',
    readingTime: 6,
    featured: false,
    tags: ['coaching', 'pricing', 'AI coaching', 'executive'],
  },
  {
    slug: 'ai-coaching-vs-human-coaching',
    title: 'AI Coaching vs Human Coaching: An Honest Comparison',
    description:
      'When does AI coaching work? When do you need a human? A balanced look at the strengths and limitations of each approach.',
    category: 'coaching',
    type: 'comparison',
    publishedAt: '2025-01-16',
    author: 'Coach OS',
    readingTime: 10,
    featured: false,
    tags: ['AI coaching', 'executive coaching', 'comparison'],
  },
  {
    slug: 'coaching-vs-therapy',
    title: 'Coaching vs Therapy: Which Do You Actually Need?',
    description:
      'Coaching and therapy serve different purposes. Here is how to know which one is right for your situation.',
    category: 'coaching',
    type: 'explainer',
    publishedAt: '2025-01-15',
    author: 'Coach OS',
    readingTime: 6,
    featured: false,
    tags: ['coaching', 'therapy', 'mental health'],
  },

  // Frameworks
  {
    slug: 'grow-coaching-model-adhd',
    title: 'The GROW Coaching Model: A Complete Guide (with ADHD Adaptations)',
    description:
      'Learn the GROW framework used by executive coaches worldwide, plus specific adaptations that make it work for ADHD brains.',
    category: 'frameworks',
    type: 'explainer',
    publishedAt: '2025-01-14',
    author: 'Coach OS',
    readingTime: 8,
    featured: false,
    tags: ['GROW', 'coaching', 'frameworks', 'ADHD'],
  },
  {
    slug: 'coaching-frameworks-entrepreneurs',
    title: '5 Coaching Frameworks Every Entrepreneur Should Know',
    description:
      'GROW, SWOT, Eisenhower Matrix, OKRs, and more. The proven frameworks that help founders think more clearly.',
    category: 'frameworks',
    type: 'listicle',
    publishedAt: '2025-01-13',
    author: 'Coach OS',
    readingTime: 11,
    featured: false,
    tags: ['frameworks', 'coaching', 'entrepreneurs', 'strategy'],
  },

  // Founder Life
  {
    slug: 'founder-loneliness',
    title: 'Founder Loneliness: Why CEOs Need Someone to Talk To',
    description:
      '55% of CEOs experienced mental health issues last year. The isolation at the top is real. Here is how to find support.',
    category: 'founder-life',
    type: 'guide',
    publishedAt: '2025-01-12',
    author: 'Coach OS',
    readingTime: 8,
    featured: false,
    tags: ['founder', 'mental health', 'loneliness', 'support'],
  },
  {
    slug: 'decision-making-founders',
    title: 'Better Decision Making for Founders: A Practical Guide',
    description:
      'How to make better decisions faster, with less stress. Frameworks and mental models for founder-level thinking.',
    category: 'decisions',
    type: 'guide',
    publishedAt: '2025-01-11',
    author: 'Coach OS',
    readingTime: 10,
    featured: false,
    tags: ['decision-making', 'founders', 'strategy', 'frameworks'],
  },
]

export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find((article) => article.slug === slug)
}

export function getArticlesByCategory(category: string): Article[] {
  return articles.filter((article) => article.category === category)
}

export function getFeaturedArticles(): Article[] {
  return articles.filter((article) => article.featured)
}

export function getRecentArticles(limit: number = 6): Article[] {
  return [...articles]
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, limit)
}
