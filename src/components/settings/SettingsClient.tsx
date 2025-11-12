'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Save, Building2, User } from 'lucide-react'

interface SettingsClientProps {
  profile: {
    full_name: string
    email: string
  }
  businessProfile: {
    industry?: string
    company_stage?: string
    company_name?: string
    role?: string
    team_size?: string
    revenue_range?: string
    location?: string
    target_markets?: string
    key_challenges?: string
    reports_to?: string
    direct_reports?: number
  } | null
}

export function SettingsClient({ profile, businessProfile }: SettingsClientProps) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // Personal info
  const [fullName, setFullName] = useState(profile.full_name)

  // Business profile
  const [industry, setIndustry] = useState(businessProfile?.industry || '')
  const [companyStage, setCompanyStage] = useState(businessProfile?.company_stage || '')
  const [companyName, setCompanyName] = useState(businessProfile?.company_name || '')
  const [role, setRole] = useState(businessProfile?.role || '')
  const [teamSize, setTeamSize] = useState(businessProfile?.team_size || '')
  const [revenueRange, setRevenueRange] = useState(businessProfile?.revenue_range || '')
  const [location, setLocation] = useState(businessProfile?.location || '')
  const [targetMarkets, setTargetMarkets] = useState(businessProfile?.target_markets || '')
  const [keyChallenges, setKeyChallenges] = useState(businessProfile?.key_challenges || '')
  const [reportsTo, setReportsTo] = useState(businessProfile?.reports_to || '')
  const [directReports, setDirectReports] = useState(businessProfile?.direct_reports?.toString() || '')

  const handleSave = async () => {
    setSaving(true)
    setMessage(null)

    try {
      const response = await fetch('/api/settings/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          businessProfile: {
            industry,
            company_stage: companyStage,
            company_name: companyName,
            role,
            team_size: teamSize,
            revenue_range: revenueRange,
            location,
            target_markets: targetMarkets,
            key_challenges: keyChallenges,
            reports_to: reportsTo,
            direct_reports: directReports ? parseInt(directReports) : null,
          },
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to save settings')
      }

      setMessage({ type: 'success', text: 'Settings saved successfully' })
      setTimeout(() => setMessage(null), 3000)
      router.refresh()
    } catch (error) {
      console.error('Failed to save settings:', error)
      setMessage({ type: 'error', text: 'Failed to save settings' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Success/Error Message */}
      {message && (
        <div
          className={`rounded-lg border p-4 ${
            message.type === 'success'
              ? 'border-green-500/20 bg-green-500/10 text-green-400'
              : 'border-red-500/20 bg-red-500/10 text-red-400'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Personal Information */}
      <div className="card">
        <div className="mb-4 flex items-center gap-2">
          <User className="h-5 w-5 text-silver" />
          <h2 className="text-xl font-semibold text-silver">Personal Information</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-silver-light">
              Full Name
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-titanium-800 px-3 py-2 text-silver focus:border-white/20 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-silver-light">
              Email
            </label>
            <input
              type="email"
              value={profile.email}
              disabled
              className="w-full rounded-lg border border-white/10 bg-titanium-900 px-3 py-2 text-gray-500"
            />
            <p className="mt-1 text-xs text-gray-500">
              Contact support to change your email
            </p>
          </div>
        </div>
      </div>

      {/* Business Profile */}
      <div className="card">
        <div className="mb-4 flex items-center gap-2">
          <Building2 className="h-5 w-5 text-silver" />
          <h2 className="text-xl font-semibold text-silver">Business Profile</h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-silver-light">
              Industry
            </label>
            <input
              type="text"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              placeholder="e.g., SaaS, E-commerce, Healthcare"
              className="w-full rounded-lg border border-white/10 bg-titanium-800 px-3 py-2 text-silver focus:border-white/20 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-silver-light">
              Company Stage
            </label>
            <select
              value={companyStage}
              onChange={(e) => setCompanyStage(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-titanium-800 px-3 py-2 text-silver focus:border-white/20 focus:outline-none"
            >
              <option value="">Select stage</option>
              <option value="pre-seed">Pre-seed</option>
              <option value="seed">Seed</option>
              <option value="series-a">Series A</option>
              <option value="series-b-plus">Series B+</option>
              <option value="profitable">Profitable</option>
              <option value="established">Established</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-silver-light">
              Company Name
            </label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-titanium-800 px-3 py-2 text-silver focus:border-white/20 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-silver-light">
              Your Role
            </label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g., CEO, Founder, VP Product"
              className="w-full rounded-lg border border-white/10 bg-titanium-800 px-3 py-2 text-silver focus:border-white/20 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-silver-light">
              Team Size
            </label>
            <select
              value={teamSize}
              onChange={(e) => setTeamSize(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-titanium-800 px-3 py-2 text-silver focus:border-white/20 focus:outline-none"
            >
              <option value="">Select size</option>
              <option value="1-5">1-5</option>
              <option value="6-10">6-10</option>
              <option value="11-25">11-25</option>
              <option value="26-50">26-50</option>
              <option value="51-100">51-100</option>
              <option value="100+">100+</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-silver-light">
              Revenue Range
            </label>
            <select
              value={revenueRange}
              onChange={(e) => setRevenueRange(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-titanium-800 px-3 py-2 text-silver focus:border-white/20 focus:outline-none"
            >
              <option value="">Select range</option>
              <option value="pre-revenue">Pre-revenue</option>
              <option value="0-100k">$0-100K</option>
              <option value="100k-500k">$100K-500K</option>
              <option value="500k-1m">$500K-1M</option>
              <option value="1m-5m">$1M-5M</option>
              <option value="5m+">$5M+</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-silver-light">
              Location
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g., San Francisco, Remote"
              className="w-full rounded-lg border border-white/10 bg-titanium-800 px-3 py-2 text-silver focus:border-white/20 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-silver-light">
              Reports To
            </label>
            <input
              type="text"
              value={reportsTo}
              onChange={(e) => setReportsTo(e.target.value)}
              placeholder="e.g., Board, CEO"
              className="w-full rounded-lg border border-white/10 bg-titanium-800 px-3 py-2 text-silver focus:border-white/20 focus:outline-none"
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-silver-light">
              Target Markets
            </label>
            <input
              type="text"
              value={targetMarkets}
              onChange={(e) => setTargetMarkets(e.target.value)}
              placeholder="e.g., North America, Europe, APAC"
              className="w-full rounded-lg border border-white/10 bg-titanium-800 px-3 py-2 text-silver focus:border-white/20 focus:outline-none"
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-silver-light">
              Key Challenges
            </label>
            <textarea
              value={keyChallenges}
              onChange={(e) => setKeyChallenges(e.target.value)}
              rows={3}
              placeholder="What are your biggest challenges right now?"
              className="w-full rounded-lg border border-white/10 bg-titanium-800 px-3 py-2 text-silver focus:border-white/20 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 rounded-lg bg-deep-blue-700 px-6 py-3 font-medium text-silver transition-colors hover:bg-deep-blue-600 disabled:opacity-50"
        >
          {saving ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Save className="h-5 w-5" />
          )}
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  )
}
