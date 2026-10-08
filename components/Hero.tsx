'use client';

import React from 'react';
import { ArrowRight, Check, FileDown, Sparkles, Upload } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const Hero: React.FC = () => {
  const { t, language } = useLanguage();

  const perks = language === 'id'
    ? ['Tanpa daftar', 'Tanpa biaya', 'Tanpa watermark']
    : ['No signup', 'No fees', 'No watermark'];

  return (
    <section className="relative overflow-hidden">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 bg-grid" />
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[480px] w-[880px] -translate-x-1/2 rounded-full bg-gradient-to-br from-primary/20 via-indigo-400/10 to-transparent blur-3xl" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-20 sm:pt-20 sm:pb-28">
        <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_1fr] gap-14 lg:gap-12 items-center">
          <div className="flex flex-col gap-7 text-center lg:text-left items-center lg:items-start">
            <span className="eyebrow">
              <Sparkles className="h-3.5 w-3.5" />
              {language === 'id' ? 'Gratis 100%' : '100% Free'}
            </span>

            <div className="flex flex-col gap-5">
              <h1 className="text-foreground text-4xl sm:text-5xl lg:text-[3.6rem] font-extrabold leading-[1.08] tracking-tight text-balance">
                {t('heroTitle')}
              </h1>
              <p className="text-base sm:text-lg max-w-xl text-muted-foreground leading-relaxed">
                {t('heroSubtitle')}
              </p>
            </div>

            <div className="flex w-full flex-col sm:flex-row sm:w-auto gap-3">
              <a href="/templates" className="btn-primary">
                {t('getStarted')}
                <ArrowRight className="h-4 w-4" />
              </a>
              <a href="/templates#import" className="btn-secondary">
                <Upload className="h-4 w-4" />
                {t('heroImportCta')}
              </a>
            </div>

            {/* Free features list */}
            <ul className="flex flex-wrap gap-x-5 gap-y-2 justify-center lg:justify-start text-sm text-muted-foreground">
              {perks.map((perk) => (
                <li key={perk} className="flex items-center gap-1.5">
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600">
                    <Check className="h-3 w-3" strokeWidth={3} />
                  </span>
                  {perk}
                </li>
              ))}
            </ul>
          </div>

          <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
            <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-tr from-primary/15 via-transparent to-violet-400/15 blur-2xl" />

            <div className="relative rounded-3xl border bg-card/80 p-3 shadow-2xl shadow-slate-900/10 backdrop-blur">
              <img
                src="/hero2.png"
                alt="A modern CV template on a desk with a plant."
                className="w-full rounded-2xl aspect-[4/3] object-cover"
              />
            </div>

            {/* Floating chips */}
            <div className="absolute -left-3 sm:-left-6 bottom-8 flex items-center gap-3 rounded-2xl border bg-card px-4 py-3 shadow-xl">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-600">
                <Check className="h-5 w-5" strokeWidth={2.5} />
              </span>
              <div className="text-left">
                <p className="text-sm font-bold text-foreground leading-tight">ATS-friendly</p>
                <p className="text-xs text-muted-foreground">{t('templates')}</p>
              </div>
            </div>
            <div className="absolute -right-2 sm:-right-5 top-8 flex items-center gap-3 rounded-2xl border bg-card px-4 py-3 shadow-xl">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <FileDown className="h-5 w-5" />
              </span>
              <div className="text-left">
                <p className="text-sm font-bold text-foreground leading-tight">PDF</p>
                <p className="text-xs text-muted-foreground">{language === 'id' ? 'Siap kirim' : 'Ready to send'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
