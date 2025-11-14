'use client'

import { LineChart, Line, ResponsiveContainer } from 'recharts'
import { TrendingUp } from 'lucide-react'

// Generate simple mock data for the mini chart
const generateMiniData = () => {
  return Array.from({ length: 8 }, (_, index) => ({
    value: 20 + Math.random() * 10 + index * 8,
  }))
}

export function MiniProgressChart() {
  const data = generateMiniData()

  return (
    <div className="flex items-center gap-4">
      {/* Icon and Text */}
      <div className="flex-1">
        <div className="mb-2 flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-deep-blue-800/50">
            <TrendingUp className="h-5 w-5 text-silver" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-silver">
              Progress
            </h3>
            <p className="text-sm text-silver-light">
              Track your growth
            </p>
          </div>
        </div>
      </div>

      {/* Mini Chart */}
      <div className="h-16 w-32 opacity-70">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <defs>
              <linearGradient id="miniGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#5384C4" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#5384C4" stopOpacity={0.3} />
              </linearGradient>
            </defs>
            <Line
              type="monotone"
              dataKey="value"
              stroke="url(#miniGradient)"
              strokeWidth={2}
              dot={false}
              animationDuration={800}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
