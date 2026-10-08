'use client';

import React from 'react';
import { LayoutTemplate, PencilLine, Download, LucideIcon } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const HowItWorks: React.FC = () => {
  const { t } = useLanguage();

  const steps: { id: number; icon: LucideIcon; title: string; description: string }[] = [
    {
      id: 1,
      icon: LayoutTemplate,
      title: t('step1Title'),
      description: t('step1Desc'),
    },
    {
      id: 2,
      icon: PencilLine,
      title: t('step2Title'),
      description: t('step2Desc'),
    },
    {
      id: 3,
      icon: Download,
      title: t('step3Title'),
      description: t('step3Desc'),
    },
  ];

  return (
    <section className="py-20 sm:py-28 bg-secondary/70 border-y">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <span className="eyebrow">{t('howItWorksTitle')}</span>
          <h2 className="mt-4 text-foreground text-3xl sm:text-4xl font-extrabold tracking-tight">
            {t('howItWorksSubtitle')}
          </h2>
        </div>

        <ol className="relative mt-14 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Connector line between steps on desktop */}
          <div className="pointer-events-none absolute top-11 left-[16%] right-[16%] hidden md:block border-t-2 border-dashed border-primary/20" />
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <li key={step.id} className="relative flex flex-col items-center text-center gap-4 rounded-2xl border bg-card p-7 shadow-sm transition-shadow hover:shadow-md">
                <div className="relative">
                  <div className="flex items-center justify-center h-16 w-16 rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/30">
                    <Icon className="h-7 w-7" />
                  </div>
                  <span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full border-2 border-card bg-foreground text-[11px] font-bold text-background">
                    {step.id}
                  </span>
                </div>
                <div className="flex flex-col gap-1.5">
                  <h3 className="text-foreground text-lg font-bold">{step.title}</h3>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{step.description}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
};

export default HowItWorks;
