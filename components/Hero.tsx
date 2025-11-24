'use client';

import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

const Hero: React.FC = () => {
  const { t, language } = useLanguage();

  return (
    <section className="py-20 sm:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col gap-8 text-center lg:text-left items-center lg:items-start">

            <div className="flex flex-col gap-4">
              <h1 className="text-foreground text-4xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tighter">
                {t('heroTitle')}
              </h1>
              <p className="text-lg sm:text-xl max-w-lg text-muted-foreground">
                {t('heroSubtitle')}
              </p>
              
              {/* Free features list */}
              <div className="flex flex-wrap gap-3 justify-center lg:justify-start text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>{language === 'id' ? 'Tanpa daftar' : 'No signup'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>{language === 'id' ? 'Tanpa biaya' : 'No fees'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>{language === 'id' ? 'Tanpa watermark' : 'No watermark'}</span>
                </div>
              </div>
            </div>

            <a href="/templates" className="w-full sm:w-auto flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-8 bg-primary text-primary-foreground text-base font-bold tracking-wide hover:bg-primary/90 transition-colors shadow-lg hover:shadow-xl">
              <span className="truncate">{t('getStarted')}</span>
            </a>
          </div>
          
          <div className="relative">
            {/* FREE overlay badge on image */}
            <div className="absolute -top-3 -right-3 z-10 bg-gradient-to-br from-green-500 to-green-600 text-white px-4 py-2 rounded-lg shadow-lg transform rotate-3 hover:rotate-0 transition-transform">
              <div className="text-xs font-bold uppercase tracking-wider">
                {language === 'id' ? 'Gratis' : 'Free'}
              </div>
              <div className="text-lg font-black leading-none">100%</div>
            </div>

            <div className="w-full h-auto rounded-xl bg-card p-4 sm:p-6 border shadow-lg">
              <img 
                src="/hero2.png"
                alt="A modern CV template on a desk with a plant."
                className="w-full rounded-lg aspect-[4/3] object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;