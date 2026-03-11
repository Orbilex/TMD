import React from 'react';
import { useCreator } from '../context/CreatorContext';
import OnboardingFlow from '../components/dashboard/OnboardingFlow';
import DashboardLayout from '../components/dashboard/DashboardLayout';

export default function CreatorDemo() {
  const { profile } = useCreator();

  return (
    <div className="min-h-screen bg-bg-main text-text-primary font-sans selection:bg-tawny-200 selection:text-tawny-900">
      {!profile.isBoarded ? (
        <div className="min-h-screen flex flex-col items-center justify-center p-6">
          <OnboardingFlow />
        </div>
      ) : (
        <DashboardLayout />
      )}
    </div>
  );
}
