'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function BusinessInfoPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    industry: '',
    companyStage: '',
    companyName: '',
    location: '',
    revenueRange: '',
    teamSize: '',
    role: '',
    reportsTo: '',
    directReports: '',
    markets: '',
    keyChallenges: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const supabase = createClient()

      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      // Parse markets and challenges as arrays
      const markets = formData.markets
        .split(',')
        .map((m) => m.trim())
        .filter(Boolean)

      const keyChallenges = formData.keyChallenges
        .split(',')
        .map((c) => c.trim())
        .filter(Boolean)

      // Save business profile
      const { error: dbError } = await supabase
        .from('business_profiles')
        .upsert({
          user_id: user.id,
          industry: formData.industry,
          company_stage: formData.companyStage,
          company_name: formData.companyName || null,
          location: formData.location || null,
          revenue_range: formData.revenueRange || null,
          team_size: formData.teamSize ? parseInt(formData.teamSize) : null,
          role: formData.role,
          reports_to: formData.reportsTo || null,
          direct_reports: formData.directReports ? parseInt(formData.directReports) : null,
          markets: markets.length > 0 ? markets : null,
          key_challenges: keyChallenges.length > 0 ? keyChallenges : null,
        })

      if (dbError) throw dbError

      // Navigate to next step
      router.push('/onboarding/goals')
    } catch (err: any) {
      console.error('Error saving business profile:', err)
      setError(err.message || 'Failed to save business profile')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">Tell me about your business</h1>
        <p className="text-silver-light">
          This helps me give you relevant, actionable guidance
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Industry */}
        <div className="card">
          <label htmlFor="industry" className="mb-2 block text-sm font-medium text-silver-light">
            Industry <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            id="industry"
            name="industry"
            value={formData.industry}
            onChange={handleChange}
            required
            className="input"
            placeholder="e.g., SaaS, E-commerce, Consulting"
          />
        </div>

        {/* Company Stage */}
        <div className="card">
          <label htmlFor="companyStage" className="mb-2 block text-sm font-medium text-silver-light">
            Company Stage <span className="text-red-400">*</span>
          </label>
          <select
            id="companyStage"
            name="companyStage"
            value={formData.companyStage}
            onChange={handleChange}
            required
            className="input"
          >
            <option value="">Select stage</option>
            <option value="Pre-seed/Idea">Pre-seed / Idea</option>
            <option value="Seed">Seed Stage</option>
            <option value="Series A">Series A</option>
            <option value="Series B+">Series B+</option>
            <option value="Profitable/Bootstrapped">Profitable / Bootstrapped</option>
            <option value="Established">Established (50+ employees)</option>
          </select>
        </div>

        {/* Company Name (Optional) */}
        <div className="card">
          <label htmlFor="companyName" className="mb-2 block text-sm font-medium text-silver-light">
            Company Name <span className="text-xs text-gray-500">(optional)</span>
          </label>
          <input
            type="text"
            id="companyName"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            className="input"
            placeholder="Your company name"
          />
        </div>

        {/* Your Role */}
        <div className="card">
          <label htmlFor="role" className="mb-2 block text-sm font-medium text-silver-light">
            Your Role <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
            className="input"
            placeholder="e.g., Founder, CEO, VP Product"
          />
        </div>

        {/* Team Size & Revenue */}
        <div className="grid gap-6 md:grid-cols-2">
          <div className="card">
            <label htmlFor="teamSize" className="mb-2 block text-sm font-medium text-silver-light">
              Team Size <span className="text-xs text-gray-500">(optional)</span>
            </label>
            <input
              type="number"
              id="teamSize"
              name="teamSize"
              value={formData.teamSize}
              onChange={handleChange}
              min="1"
              className="input"
              placeholder="Number of employees"
            />
          </div>

          <div className="card">
            <label htmlFor="revenueRange" className="mb-2 block text-sm font-medium text-silver-light">
              Revenue Range <span className="text-xs text-gray-500">(optional)</span>
            </label>
            <select
              id="revenueRange"
              name="revenueRange"
              value={formData.revenueRange}
              onChange={handleChange}
              className="input"
            >
              <option value="">Select range</option>
              <option value="Pre-revenue">Pre-revenue</option>
              <option value="£0-100k">£0-100k</option>
              <option value="£100k-500k">£100k-500k</option>
              <option value="£500k-1M">£500k-1M</option>
              <option value="£1M-5M">£1M-5M</option>
              <option value="£5M-10M">£5M-10M</option>
              <option value="£10M+">£10M+</option>
            </select>
          </div>
        </div>

        {/* Location */}
        <div className="card">
          <label htmlFor="location" className="mb-2 block text-sm font-medium text-silver-light">
            Location <span className="text-xs text-gray-500">(optional)</span>
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="input"
            placeholder="e.g., London, UK"
          />
        </div>

        {/* Markets */}
        <div className="card">
          <label htmlFor="markets" className="mb-2 block text-sm font-medium text-silver-light">
            Target Markets <span className="text-xs text-gray-500">(optional, comma-separated)</span>
          </label>
          <input
            type="text"
            id="markets"
            name="markets"
            value={formData.markets}
            onChange={handleChange}
            className="input"
            placeholder="e.g., UK, Europe, North America"
          />
          <p className="mt-1 text-xs text-gray-500">Separate multiple markets with commas</p>
        </div>

        {/* Key Challenges */}
        <div className="card">
          <label htmlFor="keyChallenges" className="mb-2 block text-sm font-medium text-silver-light">
            Key Challenges <span className="text-xs text-gray-500">(optional, comma-separated)</span>
          </label>
          <textarea
            id="keyChallenges"
            name="keyChallenges"
            value={formData.keyChallenges}
            onChange={handleChange}
            rows={3}
            className="input"
            placeholder="e.g., Hiring, Product-market fit, Scaling operations"
          />
          <p className="mt-1 text-xs text-gray-500">
            What are the biggest challenges you're facing right now?
          </p>
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-between pt-6">
          <button
            type="button"
            onClick={() => router.back()}
            className="btn btn-ghost"
            disabled={loading}
          >
            ← Back
          </button>

          <button type="submit" disabled={loading} className="btn btn-primary">
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                Continue to Goals
                <ArrowRight className="h-5 w-5" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
