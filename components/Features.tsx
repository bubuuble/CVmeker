'use client';

import React from 'react';
import { SlidersHorizontal, LayoutGrid, FileText, Sparkles, LucideIcon } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const Features: React.FC = () => {
  const { t } = useLanguage();

  const features: { id: number; icon: LucideIcon; title: string; description: string; tone: string }[] = [
    {
      id: 1,
      icon: Sparkles,
      title: t('feature4Title'),
      description: t('feature4Desc'),
      tone: 'bg-violet-500/10 text-violet-600',
    },
    {
      id: 2,
      icon: SlidersHorizontal,
      title: t('feature2Title'),
      description: t('feature2Desc'),
      tone: 'bg-primary/10 text-primary',
    },
    {
      id: 3,
      icon: LayoutGrid,
      title: t('feature1Title'),
      description: t('feature1Desc'),
      tone: 'bg-amber-500/10 text-amber-600',
    },
    {
      id: 4,
      icon: FileText,
      title: t('feature3Title'),
      description: t('feature3Desc'),
      tone: 'bg-emerald-500/10 text-emerald-600',
    },
  ];

  return (
    <section className="py-20 sm:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <span className="eyebrow">{t('featuresEyebrow')}</span>
          <h2 className="mt-4 text-foreground text-3xl sm:text-4xl font-extrabold tracking-tight">
            {t('featuresTitle')}
          </h2>
        </div>

        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 gap-5">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.id}
                className="group flex flex-col sm:flex-row gap-5 rounded-2xl border bg-card p-6 sm:p-7 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:border-primary/30"
              >
                <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${feature.tone}`}>
                  <Icon className="h-6 w-6" />
                </span>
                <div className="flex flex-col gap-1.5">
                  <h3 className="text-card-foreground text-lg font-bold">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;
