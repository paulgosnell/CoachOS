'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Menu,
  X,
  ChevronDown,
  Brain,
  Target,
  Users,
  Layers,
  GitBranch,
  Heart,
  Sparkles,
  ArrowRight,
  BookOpen,
} from 'lucide-react'

// Routes where the public navbar should be hidden (authenticated pages)
const AUTHENTICATED_ROUTES = [
  '/dashboard',
  '/chat',
  '/voice-coach',
  '/sessions',
  '/goals',
  '/tasks',
  '/progress',
  '/settings',
  '/brain-dump',
  '/onboarding',
  '/subscribe',
  '/admin',
]

interface NavItem {
  label: string
  href?: string
  children?: {
    category: string
    categorySlug: string
    icon: React.ReactNode
    description: string
    links: { label: string; href: string }[]
  }[]
}

const navItems: NavItem[] = [
  {
    label: 'Resources',
    children: [
      {
        category: 'ADHD & Business',
        categorySlug: 'adhd-business',
        icon: <Brain className="h-5 w-5" />,
        description: 'Strategies for running a successful business with ADHD',
        links: [
          { label: 'ADHD Entrepreneur Guide', href: '/blog/adhd-entrepreneur-guide' },
          { label: 'Why Productivity Advice Fails', href: '/blog/why-productivity-advice-fails-adhd' },
          { label: 'Time Blindness in Business', href: '/blog/adhd-time-blindness-business' },
          { label: 'ADHD Accountability', href: '/blog/adhd-accountability' },
        ],
      },
      {
        category: 'ADHD Productivity',
        categorySlug: 'adhd-productivity',
        icon: <Target className="h-5 w-5" />,
        description: 'Systems and tools that work with your ADHD brain',
        links: [
          { label: 'Task Management Systems', href: '/blog/adhd-task-management-systems' },
          { label: 'The Overwhelm Spiral', href: '/blog/adhd-overwhelm-spiral' },
          { label: 'Focus Strategies', href: '/blog?category=adhd-productivity' },
          { label: 'Energy Management', href: '/blog?category=adhd-productivity' },
        ],
      },
      {
        category: 'Coaching',
        categorySlug: 'coaching',
        icon: <Users className="h-5 w-5" />,
        description: 'Understanding executive coaching and its benefits',
        links: [
          { label: 'Executive Coaching Costs 2025', href: '/blog/executive-coaching-cost-2025' },
          { label: 'AI vs Human Coaching', href: '/blog/ai-coaching-vs-human-coaching' },
          { label: 'Coaching vs Therapy', href: '/blog/coaching-vs-therapy' },
          { label: 'All Coaching Articles', href: '/blog?category=coaching' },
        ],
      },
      {
        category: 'Frameworks',
        categorySlug: 'frameworks',
        icon: <Layers className="h-5 w-5" />,
        description: 'Proven coaching and decision-making frameworks',
        links: [
          { label: 'GROW Coaching Model', href: '/blog/grow-coaching-model-adhd' },
          { label: 'Frameworks for Entrepreneurs', href: '/blog/coaching-frameworks-entrepreneurs' },
          { label: 'Decision Frameworks', href: '/blog?category=frameworks' },
          { label: 'All Frameworks', href: '/blog?category=frameworks' },
        ],
      },
      {
        category: 'Decision Making',
        categorySlug: 'decisions',
        icon: <GitBranch className="h-5 w-5" />,
        description: 'Make better decisions with less stress',
        links: [
          { label: 'ADHD Decision Fatigue', href: '/blog/adhd-decision-fatigue' },
          { label: 'Decision Making for Founders', href: '/blog/decision-making-founders' },
          { label: 'Strategic Decisions', href: '/blog?category=decisions' },
          { label: 'All Decision Articles', href: '/blog?category=decisions' },
        ],
      },
      {
        category: 'Founder Life',
        categorySlug: 'founder-life',
        icon: <Heart className="h-5 w-5" />,
        description: 'Navigating the challenges of being a founder',
        links: [
          { label: 'Founder Loneliness', href: '/blog/founder-loneliness' },
          { label: 'Mental Health for CEOs', href: '/blog?category=founder-life' },
          { label: 'Work-Life Balance', href: '/blog?category=founder-life' },
          { label: 'All Founder Articles', href: '/blog?category=founder-life' },
        ],
      },
    ],
  },
  {
    label: 'Blog',
    href: '/blog',
  },
  {
    label: 'Pricing',
    href: '/pricing',
  },
  {
    label: 'About',
    href: '/about',
  },
]

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false)
    setOpenDropdown(null)
  }, [pathname])

  // Hide navbar on authenticated routes - MUST be after all hooks
  const isAuthenticatedRoute = AUTHENTICATED_ROUTES.some(route => pathname?.startsWith(route))
  if (isAuthenticatedRoute) {
    return null
  }

  const isActive = (href: string) => {
    if (href === '/blog') {
      return pathname?.startsWith('/blog')
    }
    return pathname === href
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-titanium-950/80 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-navy-400 to-navy-600 shadow-lg transition-transform group-hover:scale-105">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="font-serif text-xl font-semibold text-white">Coach OS</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center lg:gap-1" ref={dropdownRef}>
            {navItems.map((item) => (
              <div key={item.label} className="relative">
                {item.children ? (
                  <>
                    <button
                      onClick={() => setOpenDropdown(openDropdown === item.label ? null : item.label)}
                      className={`flex items-center gap-1 px-4 py-2 text-sm font-medium transition-colors rounded-lg ${
                        openDropdown === item.label
                          ? 'text-white bg-white/10'
                          : 'text-silver hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {item.label}
                      <ChevronDown
                        className={`h-4 w-4 transition-transform ${
                          openDropdown === item.label ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    {/* Mega Menu Dropdown */}
                    {openDropdown === item.label && (
                      <div className="absolute left-1/2 top-full mt-2 -translate-x-1/2 w-[900px] rounded-2xl border border-white/10 bg-titanium-900/95 p-6 shadow-2xl backdrop-blur-xl">
                        <div className="grid grid-cols-3 gap-6">
                          {item.children.map((category) => (
                            <div key={category.category} className="space-y-3">
                              <div className="flex items-center gap-2 text-white">
                                <span className="text-navy-400">{category.icon}</span>
                                <span className="font-semibold">{category.category}</span>
                              </div>
                              <p className="text-xs text-silver/70">{category.description}</p>
                              <ul className="space-y-1">
                                {category.links.map((link) => (
                                  <li key={link.href}>
                                    <Link
                                      href={link.href}
                                      className="block rounded-lg px-3 py-2 text-sm text-silver transition-colors hover:bg-white/5 hover:text-white"
                                    >
                                      {link.label}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                              <Link
                                href={`/blog?category=${category.categorySlug}`}
                                className="inline-flex items-center gap-1 text-xs font-medium text-navy-400 hover:text-navy-300"
                              >
                                View all <ArrowRight className="h-3 w-3" />
                              </Link>
                            </div>
                          ))}
                        </div>

                        {/* Footer */}
                        <div className="mt-6 flex items-center justify-between border-t border-white/5 pt-6">
                          <Link
                            href="/blog"
                            className="inline-flex items-center gap-2 text-sm font-medium text-white hover:text-silver"
                          >
                            <BookOpen className="h-4 w-4" />
                            Browse all 500+ articles
                          </Link>
                          <Link
                            href="/subscribe"
                            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-navy-500 to-navy-600 px-4 py-2 text-sm font-medium text-white shadow-lg transition-all hover:from-navy-400 hover:to-navy-500"
                          >
                            Start Coaching <ArrowRight className="h-4 w-4" />
                          </Link>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    href={item.href!}
                    className={`px-4 py-2 text-sm font-medium transition-colors rounded-lg ${
                      isActive(item.href!)
                        ? 'text-white bg-white/10'
                        : 'text-silver hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* Right side - CTA and Mobile Menu */}
          <div className="flex items-center gap-4">
            <Link
              href="/auth/login"
              className="hidden sm:block text-sm font-medium text-silver hover:text-white transition-colors"
            >
              Sign in
            </Link>
            <Link
              href="/auth/signup"
              className="hidden sm:inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-navy-500 to-navy-600 px-4 py-2 text-sm font-medium text-white shadow-lg transition-all hover:from-navy-400 hover:to-navy-500"
            >
              Get Started
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-silver hover:text-white"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-white/5 bg-titanium-950/95 backdrop-blur-xl">
          <div className="px-4 py-4 space-y-2">
            {navItems.map((item) => (
              <div key={item.label}>
                {item.children ? (
                  <div>
                    <button
                      onClick={() => setOpenDropdown(openDropdown === item.label ? null : item.label)}
                      className="flex w-full items-center justify-between px-4 py-3 text-base font-medium text-silver hover:text-white rounded-lg hover:bg-white/5"
                    >
                      {item.label}
                      <ChevronDown
                        className={`h-5 w-5 transition-transform ${
                          openDropdown === item.label ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {openDropdown === item.label && (
                      <div className="mt-2 space-y-4 pl-4">
                        {item.children.map((category) => (
                          <div key={category.category} className="space-y-2">
                            <div className="flex items-center gap-2 text-white text-sm font-semibold">
                              <span className="text-navy-400">{category.icon}</span>
                              {category.category}
                            </div>
                            <ul className="space-y-1 pl-7">
                              {category.links.slice(0, 3).map((link) => (
                                <li key={link.href}>
                                  <Link
                                    href={link.href}
                                    className="block py-2 text-sm text-silver hover:text-white"
                                  >
                                    {link.label}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href={item.href!}
                    className={`block px-4 py-3 text-base font-medium rounded-lg ${
                      isActive(item.href!)
                        ? 'text-white bg-white/10'
                        : 'text-silver hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}

            {/* Mobile CTA buttons */}
            <div className="pt-4 space-y-2 border-t border-white/5 mt-4">
              <Link
                href="/auth/login"
                className="block w-full text-center px-4 py-3 text-base font-medium text-silver hover:text-white rounded-lg hover:bg-white/5"
              >
                Sign in
              </Link>
              <Link
                href="/auth/signup"
                className="block w-full text-center px-4 py-3 text-base font-medium text-white rounded-lg bg-gradient-to-r from-navy-500 to-navy-600"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
