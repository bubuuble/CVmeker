'use client';

import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Feature } from '@/types/types';

const Features: React.FC = () => {
  const { t } = useLanguage();

  const features: Feature[] = [
    {
      id: 1,
      icon: 'edit_square',
      title: t('feature2Title'),
      description: t('feature2Desc'),
    },
    {
      id: 2,
      icon: 'layers',
      title: t('feature1Title'),
      description: t('feature1Desc'),
    },
    {
      id: 3,
      icon: 'picture_as_pdf',
      title: t('feature3Title'),
      description: t('feature3Desc'),
    },
  ];

  return (
    <section className="py-16 sm:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-12">
          <div className="max-w-2xl text-center">
            <h2 className="text-foreground text-3xl sm:text-4xl font-bold tracking-tight">
              {t('featuresTitle')}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div key={feature.id} className="flex flex-col gap-4 rounded-xl border bg-card p-6 shadow-sm hover:shadow-md transition-shadow">
                <span className="material-symbols-outlined text-primary text-3xl">{feature.icon}</span>
                <div className="flex flex-col gap-1">
                  <h3 className="text-card-foreground text-lg font-bold">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;