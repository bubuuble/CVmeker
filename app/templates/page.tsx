'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CvImport from '@/components/CvImport';
import { useLanguage } from '@/contexts/LanguageContext';
import { saveCvToStorage } from '@/lib/cv-storage';
import type { CvDesign } from '@/lib/cv-design';
import { CVData } from '@/types/types';

const TemplatesPage: React.FC = () => {
  const { t } = useLanguage();
  const router = useRouter();

  // An imported CV keeps its own look: it opens in the "custom" template built from its design
  const openImportedCv = ({ cvData, design }: { cvData: CVData; design: CvDesign }) => {
    saveCvToStorage(cvData, 'custom', {
      customDesign: design,
      settings: {
        fontFamily: design.typography.bodyFont,
        fontSize: String(design.typography.baseSizePt),
        highlightColor: design.colors.accent,
      },
    });
    router.push('/editor?template=custom');
  };

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
        <section className="relative overflow-hidden py-14 sm:py-20">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-grid" />
          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
              <span className="eyebrow">{t('templates')}</span>
              <h1 className="mt-4 text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground">{t('chooseTemplate')}</h1>
              <p className="mt-4 text-base sm:text-lg text-muted-foreground">
                {t('selectTemplate')}
              </p>
            </div>

            <div className="max-w-3xl mx-auto mb-14 sm:mb-20">
              <CvImport onImported={openImportedCv} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {availableTemplates.map((template) => (
                <Link key={template.id} href={`/editor?template=${template.id}`} passHref>
                  <div className="group cursor-pointer rounded-2xl border bg-card p-3 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10 hover:border-primary/40">
                    <div className="relative w-full aspect-[3/4] overflow-hidden rounded-xl bg-slate-100">
                      <img
                        src={template.image}
                        alt={template.name}
                        className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
                      />
                      <div className="absolute inset-0 flex items-end justify-center bg-gradient-to-t from-slate-950/60 via-transparent to-transparent p-5 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow">
                          {t('getStarted')}
                          <ArrowRight className="h-4 w-4" />
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between px-2 pt-4 pb-1">
                      <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors">
                        {template.name}
                      </h3>
                      <ArrowRight className="h-4 w-4 text-muted-foreground transition-all group-hover:translate-x-1 group-hover:text-primary" />
                    </div>
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
