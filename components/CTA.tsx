'use client';

import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const CTA: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section className="pb-20 sm:pb-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-slate-950 px-6 py-14 sm:px-12 sm:py-20 text-center shadow-2xl">
          <div className="pointer-events-none absolute -top-32 -left-24 h-80 w-80 rounded-full bg-primary/40 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-32 -right-24 h-80 w-80 rounded-full bg-violet-500/30 blur-3xl" />
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.15]"
            style={{ backgroundImage: 'radial-gradient(rgb(255 255 255 / 0.5) 1px, transparent 1px)', backgroundSize: '22px 22px' }}
          />

          <div className="relative flex flex-col items-center gap-6">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white max-w-2xl text-balance">
              {t('ctaTitle')}
            </h2>
            <p className="text-base sm:text-lg max-w-xl text-slate-300">
              {t('ctaSubtitle')}
            </p>
            <a
              href="/templates"
              className="mt-2 inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl h-12 px-8 bg-white text-slate-950 font-semibold shadow-lg transition-all hover:-translate-y-0.5 hover:bg-slate-100"
            >
              {t('createYourCV')}
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
