import { articles } from '@/lib/content/articles'
import { BlogClient } from '@/components/blog/BlogClient'

export default function BlogPage() {
  return <BlogClient articles={articles} />
}
