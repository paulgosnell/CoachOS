'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Save, Building2, User, Mic } from 'lucide-react'
import { trackSettingsSaved, trackFormError } from '@/lib/analytics'

interface SettingsClientProps {
  profile: {
    full_name: string
    email: string
    coach_preference?: {
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

  // Personal info
  const [fullName, setFullName] = useState(profile.full_name)

  // Voice preferences (Gemini only now)
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
          coachPreference: {
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
            markets: targetMarkets ? targetMarkets.split(',').map((m: string) => m.trim()).filter(Boolean) : [],
            key_challenges: keyChallenges ? keyChallenges.split(',').map((c: string) => c.trim()).filter(Boolean) : [],
            reports_to: reportsTo || null,
            direct_reports: directReports ? parseInt(directReports) : null,
          },
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to save settings')
      }

      // Track which fields were changed
      const changedFields: string[] = []
      if (fullName !== profile.full_name) changedFields.push('full_name')
      if (industry !== (businessProfile?.industry || '')) changedFields.push('industry')
      if (companyStage !== (businessProfile?.company_stage || '')) changedFields.push('company_stage')
      if (companyName !== (businessProfile?.company_name || '')) changedFields.push('company_name')
      if (role !== (businessProfile?.role || '')) changedFields.push('role')

      trackSettingsSaved(changedFields.length > 0 ? changedFields : undefined)

      setMessage({ type: 'success', text: 'Settings saved successfully' })
      setTimeout(() => setMessage(null), 3000)
      router.refresh()
    } catch (error) {
      console.error('Failed to save settings:', error)
      const errorMessage = 'Failed to save settings'
      setMessage({ type: 'error', text: errorMessage })
      trackFormError('settings', errorMessage)
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

      {/* Voice Preferences */}
      <div className="card">
        <div className="mb-4 flex items-center gap-2">
          <Mic className="h-5 w-5 text-silver" />
          <h2 className="text-xl font-semibold text-silver">Voice Agent Settings</h2>
        </div>

        <div className="space-y-6">
          <div>
            <label className="mb-2 block text-sm font-medium text-silver-light">
              Voice
            </label>
            <select
              value={geminiVoice}
              onChange={(e) => setGeminiVoice(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-titanium-800 px-3 py-2 text-silver focus:border-white/20 focus:outline-none"
            >
              <option value="Puck">Puck - Energetic, playful (Default)</option>
              <option value="Kore">Kore - Calm, supportive</option>
              <option value="Aoede">Aoede - Warm, melodic</option>
              <option value="Charon">Charon - Deep, grounding</option>
              <option value="Fenrir">Fenrir - Bold, direct</option>
            </select>
            <p className="mt-1 text-xs text-silver-light">
              Choose the voice personality for your AI coach
            </p>
          </div>

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
              className="w-full"
            />
            <div className="mt-1 flex justify-between text-xs text-silver-light">
              <span>Slower (0.8x)</span>
              <span>Normal (1.0x)</span>
              <span>Faster (1.2x)</span>
            </div>
            <p className="mt-1 text-xs text-silver-light">
              Adjust how fast the AI speaks
            </p>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-silver-light">
              Microphone Sensitivity: {(vadThreshold * 100).toFixed(0)}%
            </label>
            <input
              type="range"
              min="0.3"
              max="0.7"
              step="0.05"
              value={vadThreshold}
              onChange={(e) => setVadThreshold(parseFloat(e.target.value))}
              className="w-full"
            />
            <div className="mt-1 flex justify-between text-xs text-silver-light">
              <span>More Sensitive</span>
              <span>Balanced</span>
              <span>Less Sensitive</span>
            </div>
            <p className="mt-1 text-xs text-silver-light">
              Higher = requires louder speech to activate
            </p>
          </div>

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
              className="w-full"
            />
            <div className="mt-1 flex justify-between text-xs text-silver-light">
              <span>Quick (300ms)</span>
              <span>Balanced (500ms)</span>
              <span>Patient (1000ms)</span>
            </div>
            <p className="mt-1 text-xs text-silver-light">
              How long to wait after you stop speaking before the AI responds
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
