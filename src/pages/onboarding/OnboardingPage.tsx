import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useUserStore } from '../../store/userStore'
import type { AgeGroup, Preference } from '../../types/user'
import { AgeGroupStep } from './AgeGroupStep'
import { IntroStep } from './IntroStep'
import { LocationStep } from './LocationStep'
import { PreferenceStep } from './PreferenceStep'

type Step = 'intro' | 'ageGroup' | 'preferences' | 'location'

export function OnboardingPage() {
  const navigate = useNavigate()
  const login = useUserStore((state) => state.login)

  const [step, setStep] = useState<Step>('intro')
  const [ageGroup, setAgeGroup] = useState<AgeGroup | null>(null)
  const [preferences, setPreferences] = useState<Preference[]>([])

  const togglePreference = (preference: Preference) => {
    setPreferences((current) =>
      current.includes(preference)
        ? current.filter((item) => item !== preference)
        : [...current, preference],
    )
  }

  const finish = () => {
    if (ageGroup === null) return
    login({ id: 'user-001', ageGroup, preferences })
    navigate('/', { replace: true })
  }

  return (
    <main className="flex min-h-dvh justify-center bg-background px-6 py-12">
      <div className="w-full max-w-sm">
        {step === 'intro' && <IntroStep onNext={() => setStep('ageGroup')} />}
        {step === 'ageGroup' && (
          <AgeGroupStep
            value={ageGroup}
            onSelect={setAgeGroup}
            onNext={() => setStep('preferences')}
          />
        )}
        {step === 'preferences' && (
          <PreferenceStep
            selected={preferences}
            onToggle={togglePreference}
            onNext={() => setStep('location')}
          />
        )}
        {step === 'location' && <LocationStep onFinish={finish} />}
      </div>
    </main>
  )
}
