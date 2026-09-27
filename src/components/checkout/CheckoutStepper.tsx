import React from 'react';
import { Check } from 'lucide-react';

interface CheckoutStepperProps {
  currentStep: number;
  steps: string[];
}

export const CheckoutStepper: React.FC<CheckoutStepperProps> = ({ currentStep, steps }) => {
  return (
    <div className="w-full py-4 mb-8">
      <div className="flex items-center justify-between max-w-2xl mx-auto relative">
        {/* Background Connecting Line */}
        <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-0.5 bg-slate-200 dark:bg-slate-800 -z-0" />

        {/* Active Progress Line */}
        <div
          style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
          className="absolute top-1/2 left-0 -translate-y-1/2 h-0.5 bg-[#4F46E5] transition-all duration-300 -z-0"
        />

        {steps.map((stepName, idx) => {
          const isCompleted = idx < currentStep;
          const isCurrent = idx === currentStep;

          return (
            <div key={idx} className="flex flex-col items-center relative z-10">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                  isCompleted
                    ? 'bg-[#4F46E5] text-white shadow-sm'
                    : isCurrent
                    ? 'bg-surface text-[#4F46E5] border-2 border-[#4F46E5] ring-4 ring-[#4F46E5]/15'
                    : 'bg-surface text-text-muted border border-surface-border'
                }`}
              >
                {isCompleted ? <Check className="w-4 h-4" /> : idx + 1}
              </div>
              <span
                className={`text-[11px] font-medium mt-2 hidden sm:block transition-colors ${
                  isCurrent ? 'text-[#4F46E5] font-semibold' : 'text-text-muted'
                }`}
              >
                {stepName}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
