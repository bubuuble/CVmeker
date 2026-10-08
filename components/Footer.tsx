'use client';

import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="border-t bg-secondary/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col items-center md:items-start gap-2">
            <a href="/" className="flex items-center gap-2">
              <img src="/logo2.png" alt="CV Maker Logo" className="h-7 w-7" />
              <span className="font-extrabold tracking-tight text-foreground">CV Maker</span>
            </a>
            <p className="text-sm text-muted-foreground">© 2024 CV Maker. All rights reserved.</p>
          </div>
          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-foreground">{t('quickLinks')}</span>
            <a className="text-sm text-muted-foreground hover:text-foreground transition-colors" href="/">{t('home')}</a>
            <a className="text-sm text-muted-foreground hover:text-foreground transition-colors" href="/templates">{t('templates')}</a>
            <a className="text-sm text-muted-foreground hover:text-foreground transition-colors" href="/updates">{t('updates')}</a>
            <a className="text-sm text-muted-foreground hover:text-foreground transition-colors" href="/support">Support</a>
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
