'use client';

import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

const CTA: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section className="pb-20 sm:pb-28 pt-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-card rounded-xl p-8 sm:p-12 lg:p-16 text-center flex flex-col items-center gap-6 border shadow-lg">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground max-w-2xl">
            {t('ctaTitle')}
          </h2>
          <p className="text-lg max-w-xl text-muted-foreground">
            {t('ctaSubtitle')}
          </p>
            <a href="/templates">
            <button className="w-full sm:w-auto flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-8 bg-primary text-primary-foreground text-base font-bold tracking-wide hover:bg-primary/90 transition-colors mt-2">
              <span className="truncate">{t('createYourCV')}</span>
            </button>
            </a>
        </div>
      </div>
    </section>
  );
};

export default CTA;