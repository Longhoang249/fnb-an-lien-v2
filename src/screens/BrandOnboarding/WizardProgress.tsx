import React from 'react'
import { cn } from '@/lib/utils'

interface WizardProgressProps {
  currentStep: number
  totalSteps: number
  labels?: string[]
}

const DEFAULT_LABELS = ['Định vị', 'USP', 'Archetype', 'Tên quán', 'Hoàn tất']

export function WizardProgress({ currentStep, totalSteps, labels = DEFAULT_LABELS }: WizardProgressProps) {
  return (
    <div className="w-full">
      {/* Mobile: step indicator */}
      <div className="flex items-center justify-between mb-2 lg:hidden">
        <span className="text-xs font-medium text-muted-foreground">
          Bước {currentStep} / {totalSteps}
        </span>
        <span className="text-xs text-amber-rich font-medium">
          {labels[currentStep - 1]}
        </span>
      </div>

      {/* Desktop: horizontal stepper */}
      <div className="hidden lg:flex items-center gap-2">
        {Array.from({ length: totalSteps }, (_, i) => {
          const stepNum = i + 1
          const isCompleted = stepNum < currentStep
          const isActive = stepNum === currentStep
          return (
            <React.Fragment key={stepNum}>
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-300',
                    isCompleted && 'bg-gold text-primary',
                    isActive && 'bg-amber-rich text-white ring-4 ring-amber-rich/20',
                    !isCompleted && !isActive && 'bg-surface border border-border text-muted-foreground'
                  )}
                >
                  {isCompleted ? (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    stepNum
                  )}
                </div>
                <span className={cn('text-xs font-medium', isActive ? 'text-foreground' : 'text-muted-foreground')}>
                  {labels[i]}
                </span>
              </div>
              {i < totalSteps - 1 && (
                <div className={cn('flex-1 h-0.5 rounded-full transition-colors', stepNum < currentStep ? 'bg-gold' : 'bg-border')} />
              )}
            </React.Fragment>
          )
        })}
      </div>
    </div>
  )
}
