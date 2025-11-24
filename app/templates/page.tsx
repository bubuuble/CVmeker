'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';

const TemplatesPage: React.FC = () => {
  const { t } = useLanguage();

  const availableTemplates = [
    {
      id: 'template1',
      name: t('modernProfessional'),
      image: '/template1-preview.png',
    },
    {
      id: 'template2',
      name: t('classicATS'),
      image: '/template2-preview.png',
    },
    {
      id: 'template3',
      name: t('professionalResume'),
      image: '/template3-preview.png',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-grow">
        <section className="py-16 sm:py-24">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h1 className="text-4xl sm:text-5xl font-bold text-foreground">{t('chooseTemplate')}</h1>
              <p className="mt-4 text-lg text-muted-foreground">{t('selectTemplate')}</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {availableTemplates.map((template) => (
                <Link key={template.id} href={`/editor?template=${template.id}`} passHref>
                  <div className="group cursor-pointer">
                    <div className="w-full aspect-[3/4] overflow-hidden rounded-lg border bg-white shadow-sm group-hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1">
                      <img 
                        src={template.image} 
                        alt={template.name}
                        className="w-full h-full object-cover object-top"
                      />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold text-center text-foreground group-hover:text-primary transition-colors">
                      {template.name}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default TemplatesPage;