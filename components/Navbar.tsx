'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, X, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const Navbar: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const links = [
    { href: '/', label: t('home') },
    { href: '/templates', label: t('templates') },
    { href: '/updates', label: t('updates') },
    { href: '/support', label: 'Support' },
  ];

  const languageToggle = (
    <div className="flex items-center rounded-full border bg-secondary p-0.5 text-xs font-semibold">
      {(['en', 'id'] as const).map((lang) => (
        <button
          key={lang}
          onClick={() => setLanguage(lang)}
          aria-pressed={language === lang}
          className={`rounded-full px-3 py-1.5 uppercase transition-all ${
            language === lang ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          {lang}
        </button>
      ))}
    </div>
  );

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/75 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <a href="/" className="flex items-center gap-2.5">
            <img src="/logo2.png" alt="CV Maker Logo" className="h-8 w-8" />
            <span className="text-foreground text-lg font-extrabold tracking-tight">CV Maker</span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <a
                  key={link.href}
                  href={link.href}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    isActive ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {link.label}
                </a>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            {languageToggle}

            <a
              href="/templates"
              className="hidden lg:inline-flex items-center gap-1.5 rounded-full bg-foreground px-4 py-2 text-sm font-semibold text-background transition-colors hover:bg-foreground/85"
            >
              {t('getStarted')}
              <ArrowRight className="h-3.5 w-3.5" />
            </a>

            {/* Hamburger Menu Button - Mobile Only */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Menu"
              aria-expanded={isMenuOpen}
              className="md:hidden flex h-9 w-9 items-center justify-center rounded-full border text-foreground transition-colors hover:bg-secondary"
            >
              {isMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-4">
            <nav className="flex flex-col gap-1 rounded-2xl border bg-card p-2 shadow-lg">
              {links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                    pathname === link.href ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                  }`}
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
