import { useOnboardingStore } from './useOnboardingStore'
import { WizardProgress } from './WizardProgress'
import { Step1Positioning } from './Step1Positioning'
import { Step2USP } from './Step2USP'
import { Step3Archetype } from './Step3Archetype'
import { Step4BrandInfo } from './Step4BrandInfo'
import { Step5Complete } from './Step5Complete'
import { Button } from '@/components/ui/Button'

const TOTAL_STEPS = 5

export default function BrandOnboarding() {
  const { step, nextStep, prevStep } = useOnboardingStore()

  const renderStep = () => {
    switch (step) {
      case 1: return <Step1Positioning />
      case 2: return <Step2USP />
      case 3: return <Step3Archetype />
      case 4: return <Step4BrandInfo />
      case 5: return <Step5Complete />
      default: return <Step1Positioning />
    }
  }

  const canProceed = () => {
    switch (step) {
      case 1: return true // optional choices
      case 2: return true
      case 3: return true
      case 4: return true
      case 5: return true
      default: return false
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gold flex items-center justify-center">
              <span className="font-display font-bold text-primary text-lg">F</span>
            </div>
            <div>
              <p className="text-xs text-muted-foreground tracking-widest uppercase">FnB Ăn Liền</p>
              <p className="text-sm font-display font-semibold text-foreground">Brand Onboarding</p>
            </div>
          </div>

          <WizardProgress currentStep={step} totalSteps={TOTAL_STEPS} />
        </div>

        {/* Step content */}
        <div className="bg-surface rounded-2xl shadow-soft border border-border p-6 sm:p-8 mb-6">
          {renderStep()}
        </div>

        {/* Navigation */}
        {step < 5 && (
          <div className="flex justify-between items-center">
            <Button
              variant="ghost"
              onClick={prevStep}
              disabled={step === 1}
            >
              ← Quay lại
            </Button>

            <Button
              variant="primary"
              onClick={nextStep}
              disabled={!canProceed()}
            >
              Tiếp tục →
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
