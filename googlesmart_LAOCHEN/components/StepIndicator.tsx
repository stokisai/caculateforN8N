
import React from 'react';
import { AppStep } from '../types';

interface StepIndicatorProps {
  currentStep: AppStep;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep }) => {
  const steps = [
    { id: AppStep.INPUT, name: '信息获取' },
    { id: AppStep.KNOWLEDGE, name: '知识库同步' },
    { id: AppStep.GENERATION, name: '文案生成' },
  ];

  return (
    <nav aria-label="Progress" className="mb-8">
      <ol role="list" className="space-y-4 md:flex md:space-x-8 md:space-y-0">
        {steps.map((step) => (
          <li key={step.name} className="md:flex-1">
            <div
              className={`group flex flex-col border-l-4 py-2 pl-4 transition-colors md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4 ${
                currentStep >= step.id ? 'border-orange-600' : 'border-gray-200'
              }`}
            >
              <span className={`text-sm font-medium ${currentStep >= step.id ? 'text-orange-600' : 'text-gray-500'}`}>
                Step {step.id}
              </span>
              <span className="text-sm font-semibold uppercase tracking-wide">{step.name}</span>
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default StepIndicator;
