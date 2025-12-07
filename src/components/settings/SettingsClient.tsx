'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Save, Building2, User, Mic } from 'lucide-react'
import { trackSettingsSaved, trackFormError } from '@/lib/analytics'
import { Tabs, TabPanel } from '@/components/ui/Tabs'

interface SettingsClientProps {
  profile: {
    full_name: string
    email: string
    coach_preference?: {
      coach_type?: 'standard' | 'adhd'
      voice?: string
      gemini_voice?: string
      voice_speed?: number
      vad_threshold?: number
      vad_silence_duration?: number
    }
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
  const [activeTab, setActiveTab] = useState('profile')

  // Personal info
  const [fullName, setFullName] = useState(profile.full_name)

  // Coach type
  const [coachType, setCoachType] = useState<'standard' | 'adhd'>(profile.coach_preference?.coach_type || 'standard')

  // Voice preferences
  const [geminiVoice, setGeminiVoice] = useState(profile.coach_preference?.gemini_voice || 'Puck')
  const [voiceSpeed, setVoiceSpeed] = useState(profile.coach_preference?.voice_speed || 1.0)
  const [vadThreshold, setVadThreshold] = useState(profile.coach_preference?.vad_threshold || 0.5)
  const [vadSilenceDuration, setVadSilenceDuration] = useState(profile.coach_preference?.vad_silence_duration || 500)

  // Business profile
  const [industry, setIndustry] = useState(businessProfile?.industry || '')
  const [companyStage, setCompanyStage] = useState(businessProfile?.company_stage || '')
  const [companyName, setCompanyName] = useState(businessProfile?.company_name || '')
  const [role, setRole] = useState(businessProfile?.role || '')
  const [teamSize, setTeamSize] = useState(businessProfile?.team_size || '')
  const [revenueRange, setRevenueRange] = useState(businessProfile?.revenue_range || '')
  const [location, setLocation] = useState(businessProfile?.location || '')
  const [targetMarkets, setTargetMarkets] = useState(
    Array.isArray(businessProfile?.target_markets)
      ? businessProfile.target_markets.join(', ')
      : (businessProfile?.target_markets || '')
  )
  const [keyChallenges, setKeyChallenges] = useState(
    Array.isArray(businessProfile?.key_challenges)
      ? businessProfile.key_challenges.join(', ')
      : (businessProfile?.key_challenges || '')
  )
  const [reportsTo, setReportsTo] = useState(businessProfile?.reports_to || '')
  const [directReports, setDirectReports] = useState(businessProfile?.direct_reports?.toString() || '')

  const tabs = [
    { id: 'profile', label: 'Profile', icon: <User className="h-4 w-4" /> },
    { id: 'coach', label: 'Coach', icon: <Mic className="h-4 w-4" /> },
    { id: 'business', label: 'Business', icon: <Building2 className="h-4 w-4" /> },
  ]

  const handleSave = async () => {
    setSaving(true)
    setMessage(null)

    try {
      const response = await fetch('/api/settings/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          coachPreference: {
            coach_type: coachType,
            gemini_voice: geminiVoice,
            voice_speed: voiceSpeed,
            vad_threshold: vadThreshold,
            vad_silence_duration: vadSilenceDuration,
          },
          businessProfile: {
            industry: industry || null,
            company_stage: companyStage || null,
            company_name: companyName || null,
            role: role || null,
            team_size: teamSize ? parseInt(teamSize.split('-')[0]) : null,
            revenue_range: revenueRange || null,
            location: location || null,
            markets: targetMarkets
              ? (Array.isArray(targetMarkets) ? targetMarkets : targetMarkets.split(',').map((m: string) => m.trim()).filter(Boolean))
              : [],
            key_challenges: keyChallenges
              ? (Array.isArray(keyChallenges) ? keyChallenges : keyChallenges.split(',').map((c: string) => c.trim()).filter(Boolean))
              : [],
            reports_to: reportsTo || null,
            direct_reports: directReports ? parseInt(directReports) : null,
          },
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to save settings')
      }

      const changedFields: string[] = []
      if (fullName !== profile.full_name) changedFields.push('full_name')
      if (industry !== (businessProfile?.industry || '')) changedFields.push('industry')
      trackSettingsSaved(changedFields.length > 0 ? changedFields : undefined)

      setMessage({ type: 'success', text: 'Settings saved!' })
      setTimeout(() => setMessage(null), 3000)
      router.refresh()
    } catch (error) {
      console.error('Failed to save settings:', error)
      setMessage({ type: 'error', text: 'Failed to save settings' })
      trackFormError('settings', 'Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="pb-24 md:pb-6">
      {/* Success/Error Message */}
      {message && (
        <div
          className={`mb-4 rounded-lg border p-3 text-sm ${
            message.type === 'success'
              ? 'border-green-500/20 bg-green-500/10 text-green-400'
              : 'border-red-500/20 bg-red-500/10 text-red-400'
          }`}
        >
          {message.text}
        </div>
      )}

      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab}>
        {/* Profile Tab */}
        <TabPanel id="profile" activeTab={activeTab}>
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-silver-light">
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-titanium-800 px-3 py-2.5 text-silver focus:border-white/20 focus:outline-none"
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
                className="w-full rounded-lg border border-white/10 bg-titanium-900 px-3 py-2.5 text-gray-500"
              />
              <p className="mt-1 text-xs text-gray-500">
                Contact support to change your email
              </p>
            </div>
          </div>
        </TabPanel>

        {/* Coach Tab */}
        <TabPanel id="coach" activeTab={activeTab}>
          <div className="space-y-6">
            {/* Coach Style */}
            <div>
              <label className="mb-3 block text-sm font-medium text-silver-light">
                Coaching Style
              </label>
              <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => setCoachType('standard')}
                  className={`rounded-lg border p-4 text-left transition-all ${
                    coachType === 'standard'
                      ? 'border-deep-blue-500 bg-deep-blue-900/30'
                      : 'border-white/10 bg-titanium-800 hover:border-white/20'
                  }`}
                >
                  <div className="font-medium text-silver">Standard</div>
                  <p className="mt-1 text-xs text-silver-light">
                    General business coaching
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setCoachType('adhd')}
                  className={`rounded-lg border p-4 text-left transition-all ${
                    coachType === 'adhd'
                      ? 'border-amber-500 bg-amber-900/20'
                      : 'border-white/10 bg-titanium-800 hover:border-white/20'
                  }`}
                >
                  <div className="font-medium text-silver">ADHD</div>
                  <p className="mt-1 text-xs text-silver-light">
                    Single-action focus, no lists
                  </p>
                </button>
              </div>
            </div>

            {/* Voice Selection */}
            <div>
              <label className="mb-2 block text-sm font-medium text-silver-light">
                Voice
              </label>
              <select
                value={geminiVoice}
                onChange={(e) => setGeminiVoice(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-titanium-800 px-3 py-2.5 text-silver focus:border-white/20 focus:outline-none"
              >
                <option value="Puck">Puck - Energetic</option>
                <option value="Kore">Kore - Calm</option>
                <option value="Aoede">Aoede - Warm</option>
                <option value="Charon">Charon - Deep</option>
                <option value="Fenrir">Fenrir - Bold</option>
              </select>
            </div>

            {/* Voice Speed */}
            <div>
              <label className="mb-2 block text-sm font-medium text-silver-light">
                Speech Speed: {voiceSpeed.toFixed(1)}x
              </label>
              <input
                type="range"
                min="0.8"
                max="1.2"
                step="0.1"
                value={voiceSpeed}
                onChange={(e) => setVoiceSpeed(parseFloat(e.target.value))}
                className="w-full accent-deep-blue-500"
              />
              <div className="mt-1 flex justify-between text-xs text-silver-light">
                <span>Slower</span>
                <span>Faster</span>
              </div>
            </div>

            {/* Mic Sensitivity */}
            <div>
              <label className="mb-2 block text-sm font-medium text-silver-light">
                Mic Sensitivity: {(vadThreshold * 100).toFixed(0)}%
              </label>
              <input
                type="range"
                min="0.3"
                max="0.7"
                step="0.05"
                value={vadThreshold}
                onChange={(e) => setVadThreshold(parseFloat(e.target.value))}
                className="w-full accent-deep-blue-500"
              />
              <div className="mt-1 flex justify-between text-xs text-silver-light">
                <span>More sensitive</span>
                <span>Less sensitive</span>
              </div>
            </div>

            {/* Pause Detection */}
            <div>
              <label className="mb-2 block text-sm font-medium text-silver-light">
                Pause Detection: {vadSilenceDuration}ms
              </label>
              <input
                type="range"
                min="300"
                max="1000"
                step="100"
                value={vadSilenceDuration}
                onChange={(e) => setVadSilenceDuration(parseInt(e.target.value))}
                className="w-full accent-deep-blue-500"
              />
              <div className="mt-1 flex justify-between text-xs text-silver-light">
                <span>Quick</span>
                <span>Patient</span>
              </div>
            </div>
          </div>
        </TabPanel>

        {/* Business Tab */}
        <TabPanel id="business" activeTab={activeTab}>
          <div className="space-y-4">
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-silver-light">
                  Company Name
                </label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-titanium-800 px-3 py-2.5 text-silver focus:border-white/20 focus:outline-none"
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
                  placeholder="e.g., CEO, Founder"
                  className="w-full rounded-lg border border-white/10 bg-titanium-800 px-3 py-2.5 text-silver focus:border-white/20 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-silver-light">
                  Industry
                </label>
                <input
                  type="text"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  placeholder="e.g., SaaS, E-commerce"
                  className="w-full rounded-lg border border-white/10 bg-titanium-800 px-3 py-2.5 text-silver focus:border-white/20 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-silver-light">
                  Company Stage
                </label>
                <select
                  value={companyStage}
                  onChange={(e) => setCompanyStage(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-titanium-800 px-3 py-2.5 text-silver focus:border-white/20 focus:outline-none"
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
                  Team Size
                </label>
                <select
                  value={teamSize}
                  onChange={(e) => setTeamSize(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-titanium-800 px-3 py-2.5 text-silver focus:border-white/20 focus:outline-none"
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
                  className="w-full rounded-lg border border-white/10 bg-titanium-800 px-3 py-2.5 text-silver focus:border-white/20 focus:outline-none"
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
                  placeholder="e.g., San Francisco"
                  className="w-full rounded-lg border border-white/10 bg-titanium-800 px-3 py-2.5 text-silver focus:border-white/20 focus:outline-none"
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
                  className="w-full rounded-lg border border-white/10 bg-titanium-800 px-3 py-2.5 text-silver focus:border-white/20 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-silver-light">
                Target Markets
              </label>
              <input
                type="text"
                value={targetMarkets}
                onChange={(e) => setTargetMarkets(e.target.value)}
                placeholder="e.g., North America, Europe"
                className="w-full rounded-lg border border-white/10 bg-titanium-800 px-3 py-2.5 text-silver focus:border-white/20 focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-silver-light">
                Key Challenges
              </label>
              <textarea
                value={keyChallenges}
                onChange={(e) => setKeyChallenges(e.target.value)}
                rows={3}
                placeholder="What are your biggest challenges right now?"
                className="w-full rounded-lg border border-white/10 bg-titanium-800 px-3 py-2.5 text-silver focus:border-white/20 focus:outline-none resize-none"
              />
            </div>
          </div>
        </TabPanel>
      </Tabs>

      {/* Sticky Save Button - Mobile */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-white/5 bg-titanium-950/95 backdrop-blur-sm p-4 md:hidden">
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full flex items-center justify-center gap-2 rounded-lg bg-deep-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-deep-blue-500 disabled:opacity-50"
        >
          {saving ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Save className="h-5 w-5" />
          )}
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {/* Desktop Save Button */}
      <div className="hidden md:flex justify-end mt-6">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 rounded-lg bg-deep-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-deep-blue-500 disabled:opacity-50"
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
