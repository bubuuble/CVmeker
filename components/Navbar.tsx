'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { GiUsaFlag } from 'react-icons/gi';
import { FaFlag, FaBars, FaTimes } from 'react-icons/fa';

const Navbar: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <a href="/" className="flex items-center gap-2">
            <img src="/logo2.png" alt="CV Maker Logo" className="h-8 w-8" />
            <h1 className="text-foreground text-xl font-bold">CV Maker</h1>
          </a>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors" href="/">{t('home')}</a>
            <a className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors" href="/templates">{t('templates')}</a>
            <a className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors" href="/support">Support</a>
          </nav>
          
          <div className="flex items-center gap-2">
            {/* Language Toggle - Always Visible */}
            <div className="flex items-center gap-1 sm:gap-2">
              <button
                onClick={() => setLanguage('en')}
                className={`px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium border rounded-md transition-colors flex items-center gap-1 sm:gap-2 ${
                  language === 'en' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-background hover:bg-accent'
                }`}
              >
                <GiUsaFlag className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">EN</span>
              </button>
              <button
                onClick={() => setLanguage('id')}
                className={`px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium border rounded-md transition-colors flex items-center gap-1 sm:gap-2 ${
                  language === 'id' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-background hover:bg-accent'
                }`}
              >
                <FaFlag className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
                <span className="hidden sm:inline">ID</span>
              </button>
            </div>

            {/* Hamburger Menu Button - Mobile Only */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-foreground hover:text-primary transition-colors"
            >
              {isMenuOpen ? <FaTimes className="w-6 h-6" /> : <FaBars className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <nav className="flex flex-col gap-4">
              <a 
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors py-2" 
                href="/"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('home')}
              </a>
              <a 
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors py-2" 
                href="/templates"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('templates')}
              </a>
              <a 
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors py-2" 
                href="/support"
                onClick={() => setIsMenuOpen(false)}
              >
                Support
              </a>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;