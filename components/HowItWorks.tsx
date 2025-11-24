'use client';

import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Step } from '@/types/types';

const HowItWorks: React.FC = () => {
  const { t } = useLanguage();

  const steps: Step[] = [
    {
      id: 1,
      icon: 'dashboard',
      title: t('step1Title'),
      description: t('step1Desc'),
    },
    {
      id: 2,
      icon: 'edit_document',
      title: t('step2Title'),
      description: t('step2Desc'),
    },
    {
      id: 3,
      icon: 'download',
      title: t('step3Title'),
      description: t('step3Desc'),
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-secondary border-y">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-12">
          <div className="text-center">
            <h4 className="text-primary text-sm font-bold tracking-wider uppercase">{t('howItWorksTitle')}</h4>
            <h2 className="text-secondary-foreground text-3xl sm:text-4xl font-bold mt-2">
              {t('howItWorksTitle')}
            </h2>
          </div>
          <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step) => (
              <div key={step.id} className="flex flex-col items-center text-center gap-4 p-6 rounded-xl">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 text-primary">
                  <span className="material-symbols-outlined text-3xl">{step.icon}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <h3 className="text-secondary-foreground text-xl font-bold">{step.title}</h3>
                  <p className="text-base text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;