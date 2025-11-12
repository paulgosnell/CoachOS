import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

interface MobileHeaderProps {
  title: string
  backHref?: string
}

export function MobileHeader({ title, backHref = '/dashboard' }: MobileHeaderProps) {
  return (
    <div className="flex items-center justify-between border-b border-white/5 bg-titanium-900/80 p-4 lg:hidden">
      <Link
        href={backHref}
        className="text-silver-light transition-colors hover:text-silver"
      >
        <ArrowLeft className="h-5 w-5" />
      </Link>
      <p className="text-sm font-medium text-silver">{title}</p>
      <div className="w-5" />
    </div>
  )
}
