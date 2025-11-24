'use client';

import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-card border-t">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-sm text-muted-foreground">© 2024 CV Maker. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <h4 className="text-sm font-semibold text-foreground">{t('quickLinks')}</h4>
            <a className="text-sm text-muted-foreground hover:text-primary transition-colors" href="/">{t('home')}</a>
            <a className="text-sm text-muted-foreground hover:text-primary transition-colors" href="/templates">{t('templates')}</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;