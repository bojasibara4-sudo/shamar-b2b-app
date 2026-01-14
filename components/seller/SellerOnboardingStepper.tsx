'use client';

import React from 'react';
import { CheckCircle2, Circle, Clock } from 'lucide-react';

export type OnboardingStep = 'shop' | 'documents' | 'validation';

interface Step {
  id: OnboardingStep;
  label: string;
  description: string;
}

interface SellerOnboardingStepperProps {
  currentStep: OnboardingStep;
  steps: Step[];
  completedSteps?: OnboardingStep[];
}

export default function SellerOnboardingStepper({
  currentStep,
  steps,
  completedSteps = [],
}: SellerOnboardingStepperProps) {
  const getStepStatus = (stepId: OnboardingStep) => {
    if (completedSteps.includes(stepId)) {
      return 'completed';
    }
    if (stepId === currentStep) {
      return 'current';
    }
    const currentIndex = steps.findIndex((s) => s.id === currentStep);
    const stepIndex = steps.findIndex((s) => s.id === stepId);
    if (stepIndex < currentIndex) {
      return 'completed';
    }
    return 'upcoming';
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const status = getStepStatus(step.id);
          const isLast = index === steps.length - 1;

          return (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center flex-1">
                <div className="flex items-center">
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${
                      status === 'completed'
                        ? 'bg-emerald-600 border-emerald-600 text-white'
                        : status === 'current'
                        ? 'bg-blue-600 border-blue-600 text-white'
                        : 'bg-white border-gray-300 text-gray-400'
                    }`}
                  >
                    {status === 'completed' ? (
                      <CheckCircle2 size={20} />
                    ) : status === 'current' ? (
                      <Clock size={20} />
                    ) : (
                      <Circle size={20} />
                    )}
                  </div>
                </div>
                <div className="mt-2 text-center">
                  <p
                    className={`text-sm font-medium ${
                      status === 'current'
                        ? 'text-blue-600'
                        : status === 'completed'
                        ? 'text-emerald-600'
                        : 'text-gray-500'
                    }`}
                  >
                    {step.label}
                  </p>
                  <p className="text-xs text-gray-500 mt-1 hidden sm:block">
                    {step.description}
                  </p>
                </div>
              </div>
              {!isLast && (
                <div
                  className={`flex-1 h-0.5 mx-4 ${
                    status === 'completed' || steps.findIndex((s) => s.id === currentStep) > index
                      ? 'bg-emerald-600'
                      : 'bg-gray-300'
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
