'use client'

import { useState } from 'react'
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts'
import { TrendingUp, Brain, Target } from 'lucide-react'

// Mock data - in production, this would come from actual user data
const generateMockData = () => {
  const weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7', 'Week 8']
  return weeks.map((week, index) => ({
    week,
    growth: 20 + Math.random() * 10 + index * 8,
    clarity: 15 + Math.random() * 12 + index * 7,
    confidence: 25 + Math.random() * 8 + index * 6,
  }))
}

type MetricType = 'growth' | 'clarity' | 'confidence'

interface Metric {
  key: MetricType
  label: string
  color: string
  gradient: string
  icon: typeof TrendingUp
  description: string
}

const metrics: Metric[] = [
  {
    key: 'growth',
    label: 'Overall Growth',
    color: '#5384C4',
    gradient: 'from-[#5384C4] to-[#3E5A7F]',
    icon: TrendingUp,
    description: 'Your coaching journey progress is accelerating',
  },
  {
    key: 'clarity',
    label: 'Strategic Clarity',
    color: '#799FD0',
    gradient: 'from-[#799FD0] to-[#5384C4]',
    icon: Target,
    description: 'Your decision-making confidence is improving',
  },
  {
    key: 'confidence',
    label: 'Leadership Confidence',
    color: '#9FB9DC',
    gradient: 'from-[#9FB9DC] to-[#799FD0]',
    icon: Brain,
    description: 'Your leadership presence is strengthening',
  },
]

export function CoachingGrowthChart() {
  const [selectedMetric, setSelectedMetric] = useState<MetricType>('growth')
  const data = generateMockData()
  const currentMetric = metrics.find(m => m.key === selectedMetric) || metrics[0]
  const Icon = currentMetric.icon

  // Calculate current level based on latest data
  const latestValue = data[data.length - 1][selectedMetric]
  const level = latestValue >= 70 ? 'High' : latestValue >= 50 ? 'Moderate' : 'Low'

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-titanium-800 to-titanium-900 p-6 shadow-xl">
      {/* Background gradient accent */}
      <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-deep-blue-600/10 blur-3xl" />

      <div className="relative">
        {/* Header with Status Badge */}
        <div className="mb-6">
          <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-deep-blue-800/50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-silver">
            <Icon className="h-3 w-3" />
            {level}, This Week
          </div>

          {/* Title in serif font */}
          <h2 className="mb-2 font-serif text-4xl font-medium text-silver-light">
            Making Progress
          </h2>

          <p className="text-sm text-silver-light/70">
            {currentMetric.description}
          </p>
        </div>

        {/* Metric Tabs */}
        <div className="mb-6 flex gap-2">
          {metrics.map(metric => (
            <button
              key={metric.key}
              onClick={() => setSelectedMetric(metric.key)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                selectedMetric === metric.key
                  ? 'bg-white/10 text-silver-light'
                  : 'bg-transparent text-silver-dark hover:bg-white/5'
              }`}
            >
              {metric.label}
            </button>
          ))}
        </div>

        {/* Chart */}
        <div className="relative h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
              {/* Grid lines */}
              <defs>
                <linearGradient id={`gradient-${selectedMetric}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={currentMetric.color} stopOpacity={0.8} />
                  <stop offset="100%" stopColor={currentMetric.color} stopOpacity={0.2} />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>

              <XAxis
                dataKey="week"
                stroke="#8E8E93"
                tick={{ fill: '#8E8E93', fontSize: 12 }}
                axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
              />

              <YAxis
                stroke="#8E8E93"
                tick={{ fill: '#8E8E93', fontSize: 12 }}
                axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                domain={[0, 100]}
                ticks={[0, 25, 50, 75, 100]}
                tickFormatter={(value) => {
                  if (value === 100) return 'High'
                  if (value === 50) return 'Moderate'
                  if (value === 0) return 'Low'
                  return ''
                }}
              />

              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(26, 26, 26, 0.95)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                  padding: '8px 12px',
                }}
                labelStyle={{ color: '#E8E8ED', fontSize: '12px', fontWeight: 600 }}
                itemStyle={{ color: currentMetric.color, fontSize: '12px' }}
                formatter={(value: number) => value.toFixed(1)}
              />

              <Line
                type="monotone"
                dataKey={selectedMetric}
                stroke={`url(#gradient-${selectedMetric})`}
                strokeWidth={3}
                dot={false}
                filter="url(#glow)"
                animationDuration={1000}
              />
            </LineChart>
          </ResponsiveContainer>

          {/* Current level indicator */}
          <div className="absolute bottom-4 right-4 flex items-center gap-2 rounded-full bg-deep-blue-800/50 px-3 py-1.5 backdrop-blur-sm">
            <div className={`h-2 w-2 rounded-full bg-gradient-to-r ${currentMetric.gradient} shadow-lg`} />
            <span className="text-xs font-semibold text-silver">{level}</span>
          </div>
        </div>

        {/* Stats Footer */}
        <div className="mt-6 flex items-center justify-between border-t border-white/5 pt-4">
          <div>
            <p className="text-xs text-silver-dark">Sessions Completed</p>
            <p className="text-lg font-semibold text-silver-light">12</p>
          </div>
          <div>
            <p className="text-xs text-silver-dark">Avg. Session Rating</p>
            <p className="text-lg font-semibold text-silver-light">4.8/5</p>
          </div>
          <div>
            <p className="text-xs text-silver-dark">Action Items Done</p>
            <p className="text-lg font-semibold text-silver-light">34/38</p>
          </div>
        </div>
      </div>
    </div>
  )
}
