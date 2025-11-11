'use client'

import { usePathname } from 'next/navigation'
import { CheckCircle2, Circle } from 'lucide-react'

const steps = [
  { id: 1, name: 'Welcome', path: '/onboarding' },
  { id: 2, name: 'Business Info', path: '/onboarding/business' },
  { id: 3, name: 'Your Goals', path: '/onboarding/goals' },
  { id: 4, name: 'Complete', path: '/onboarding/complete' },
]

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  const currentStepIndex = steps.findIndex((step) => step.path === pathname)
  const currentStep = currentStepIndex >= 0 ? currentStepIndex : 0

  return (
    <div className="min-h-screen bg-titanium-950">
      {/* Progress Bar */}
      <div className="sticky top-0 z-10 border-b border-white/5 bg-titanium-900/80 backdrop-blur-md">
        <div className="container mx-auto px-6 py-6">
          {/* Steps Indicator */}
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const isCompleted = index < currentStep
              const isCurrent = index === currentStep
              const isUpcoming = index > currentStep

              return (
                <div key={step.id} className="flex flex-1 items-center">
                  {/* Step */}
                  <div className="flex items-center gap-3">
                    {/* Icon */}
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all ${
                        isCompleted
                          ? 'border-green-500 bg-green-500/10'
                          : isCurrent
                          ? 'border-white bg-white/5'
                          : 'border-gray-700 bg-transparent'
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      ) : (
                        <span
                          className={`text-sm font-semibold ${
                            isCurrent ? 'text-white' : 'text-gray-600'
                          }`}
                        >
                          {step.id}
                        </span>
                      )}
                    </div>

                    {/* Label */}
                    <span
                      className={`hidden text-sm font-medium sm:block ${
                        isCurrent ? 'text-white' : 'text-gray-500'
                      }`}
                    >
                      {step.name}
                    </span>
                  </div>

                  {/* Connector Line */}
                  {index < steps.length - 1 && (
                    <div className="mx-4 h-0.5 flex-1 bg-gray-800">
                      <div
                        className={`h-full transition-all duration-500 ${
                          isCompleted ? 'bg-green-500' : 'bg-transparent'
                        }`}
                      />
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Mobile Step Label */}
          <div className="mt-4 text-center sm:hidden">
            <p className="text-sm text-gray-400">
              Step {currentStep + 1} of {steps.length}
            </p>
            <p className="text-lg font-semibold text-white">
              {steps[currentStep]?.name}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-12">{children}</div>
    </div>
  )
}
