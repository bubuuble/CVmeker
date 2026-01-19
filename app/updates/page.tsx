'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import { useLanguage } from '@/contexts/LanguageContext';

interface UpdateItem {
  version: string;
  date: string;
  changes: {
    en: string[];
    id: string[];
  };
}

const updates: UpdateItem[] = [
  {
    version: '1.1',
    date: '2026-01-19',
    changes: {
      en: [
        'Your CV is now saved automatically! No more losing your work (still safe)',
        'Added "Clear All" button to start fresh with an empty CV',
        'Your CV stays saved even if you close the browser',
        'All your settings (font, colors, etc.) are also remembered',
      ],
      id: [
        'CV Anda sekarang tersimpan otomatis! Tidak perlu khawatir kehilangan pekerjaan (masih aman)',
        'Tombol "Hapus Semua" untuk mulai dari awal dengan CV kosong',
        'CV Anda tetap tersimpan meskipun browser ditutup',
        'Semua pengaturan (font, warna, dll.) juga diingat',
      ],
    },
  },
  {
    version: '1.0',
    date: '2025-12-12',
    changes: {
      en: [
        'Welcome to CV Maker!',
        '3 professional CV templates to choose from',
        'Edit your CV and see changes instantly',
        'Download your CV as PDF',
        'Customize fonts, sizes, and colors',
        'Add your photo to CV',
        'Available in English and Indonesian',
      ],
      id: [
        'Selamat datang di CV Maker!',
        '3 template CV profesional untuk dipilih',
        'Edit CV dan lihat perubahan secara langsung',
        'Unduh CV sebagai PDF',
        'Sesuaikan font, ukuran, dan warna',
        'Tambahkan foto ke CV',
        'Tersedia dalam Bahasa Inggris dan Indonesia',
      ],
    },
  },
];

const UpdatesPage: React.FC = () => {
  const { language, t } = useLanguage();

  return (
    <div className="flex flex-col min-h-screen bg-secondary">
      <Navbar />
      <main className="flex-grow w-full px-4 py-8 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              {t('updates')}
            </h1>
            <p className="text-muted-foreground text-lg">
              {t('updatesSubtitle')}
            </p>
          </div>

          <div className="space-y-8">
            {updates.map((update, index) => (
              <div
                key={update.version}
                className="bg-card border rounded-lg p-6 shadow-sm"
              >
                <div className="flex items-center gap-4 mb-4">
                  <span className="px-3 py-1 bg-primary text-primary-foreground rounded-full text-sm font-semibold">
                    v{update.version}
                  </span>
                  <span className="text-muted-foreground text-sm">
                    {update.date}
                  </span>
                  {index === 0 && (
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
                      {language === 'en' ? 'Latest' : 'Terbaru'}
                    </span>
                  )}
                </div>
                <ul className="space-y-2">
                  {update.changes[language].map((change, changeIndex) => (
                    <li
                      key={changeIndex}
                      className="flex items-start gap-2 text-foreground"
                    >
                      <span className="text-primary mt-1">•</span>
                      <span>{change}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default UpdatesPage;
