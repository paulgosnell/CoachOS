'use client'

import { ReactNode } from 'react'

interface Tab {
  id: string
  label: string
  icon?: ReactNode
}

interface TabsProps {
  tabs: Tab[]
  activeTab: string
  onChange: (tabId: string) => void
  children: ReactNode
}

export function Tabs({ tabs, activeTab, onChange, children }: TabsProps) {
  return (
    <div className="flex flex-col">
      {/* Tab Navigation - Horizontal scroll on mobile */}
      <div className="mb-6 -mx-4 px-4 overflow-x-auto scrollbar-hide">
        <div className="flex gap-2 min-w-max">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={`flex items-center gap-2 whitespace-nowrap rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-deep-blue-600 text-white'
                  : 'bg-titanium-900/50 text-silver-light hover:bg-titanium-900 hover:text-silver'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div>{children}</div>
    </div>
  )
}

interface TabPanelProps {
  id: string
  activeTab: string
  children: ReactNode
}

export function TabPanel({ id, activeTab, children }: TabPanelProps) {
  if (id !== activeTab) return null
  return <div className="animate-fadeIn">{children}</div>
}
