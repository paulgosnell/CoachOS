import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const contentDirectory = path.join(process.cwd(), 'content/articles')

export interface ArticleFrontmatter {
  title: string
  description: string
  category: string
  type: 'guide' | 'listicle' | 'comparison' | 'explainer' | 'how-to' | 'case-study'
  publishedAt: string
  author: string
  readingTime: number
  featured?: boolean
  tags: string[]
  metaTitle?: string
  metaDescription?: string
}

export interface ArticleData {
  slug: string
  frontmatter: ArticleFrontmatter
  content: string
}

export function getArticleSlugs(): string[] {
  if (!fs.existsSync(contentDirectory)) {
    return []
  }
  return fs.readdirSync(contentDirectory).filter(file => file.endsWith('.md')).map(file => file.replace('.md', ''))
}

export function getArticleBySlugFromFile(slug: string): ArticleData | null {
  const filePath = path.join(contentDirectory, `${slug}.md`)

  if (!fs.existsSync(filePath)) {
    return null
  }

  const fileContents = fs.readFileSync(filePath, 'utf8')
  const { data, content } = matter(fileContents)

  return {
    slug,
    frontmatter: data as ArticleFrontmatter,
    content,
  }
}

export function getAllArticlesFromFiles(): ArticleData[] {
  const slugs = getArticleSlugs()
  return slugs
    .map(slug => getArticleBySlugFromFile(slug))
    .filter((article): article is ArticleData => article !== null)
    .sort((a, b) => new Date(b.frontmatter.publishedAt).getTime() - new Date(a.frontmatter.publishedAt).getTime())
}
