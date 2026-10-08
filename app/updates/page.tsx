'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
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
    version: '1.2',
    date: '2026-10-08',
    changes: {
      en: [
        'Import your existing CV! Upload a PDF or photo of your CV and AI recreates it in the editor',
        'Imported CVs keep their own look: layout, columns, colors, fonts and section titles follow your original CV (close, but not 100% identical)',
        'See every step while your CV is being read, with automatic switching to another AI model when one is busy',
        'New "Job Title / Headline" field under your name',
        'Fresh new look: a cleaner, modern and mobile-friendly design across all pages',
        'Clearer privacy notice explaining exactly what is sent where',
      ],
      id: [
        'Import CV yang sudah ada! Upload PDF atau foto CV Anda dan AI akan membuatnya ulang di editor',
        'CV hasil import mempertahankan tampilannya: layout, kolom, warna, font, dan judul section mengikuti CV asli (mirip, tapi tidak 100% identik)',
        'Lihat setiap langkah saat CV sedang dibaca, dengan perpindahan otomatis ke model AI lain jika satu model sedang sibuk',
        'Field baru "Jabatan / Headline" di bawah nama',
        'Tampilan baru: desain yang lebih bersih, modern, dan nyaman di HP untuk semua halaman',
        'Pemberitahuan privasi yang lebih jelas tentang data apa yang dikirim ke mana',
      ],
    },
  },
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
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="relative flex-grow w-full overflow-hidden px-4 py-14 sm:py-20 sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[360px] bg-grid" />
        <div className="relative max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <span className="eyebrow">Changelog</span>
            <h1 className="mt-4 text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground">
              {t('updates')}
            </h1>
            <p className="mt-4 text-muted-foreground text-base sm:text-lg">
              {t('updatesSubtitle')}
            </p>
          </div>

          <ol className="relative space-y-8 border-l-2 border-dashed border-border pl-6 sm:pl-8 ml-2">
            {updates.map((update, index) => (
              <li key={update.version} className="relative">
                <span
                  className={`absolute -left-[33px] sm:-left-[41px] top-6 flex h-4 w-4 items-center justify-center rounded-full border-4 border-background ${
                    index === 0 ? 'bg-primary ring-4 ring-primary/15' : 'bg-slate-300'
                  }`}
                />
                <div className="bg-card border rounded-2xl p-6 sm:p-7 shadow-sm transition-shadow hover:shadow-md">
                  <div className="flex flex-wrap items-center gap-3 mb-5">
                    <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-bold">
                      v{update.version}
                    </span>
                    <span className="text-muted-foreground text-sm tabular-nums">
                      {update.date}
                    </span>
                    {index === 0 && (
                      <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-700 rounded-full text-xs font-semibold">
                        {language === 'en' ? 'Latest' : 'Terbaru'}
                      </span>
                    )}
                  </div>
                  <ul className="space-y-3">
                    {update.changes[language].map((change, changeIndex) => (
                      <li
                        key={changeIndex}
                        className="flex items-start gap-3 text-foreground/90 leading-relaxed"
                      >
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                        <span>{change}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default UpdatesPage;
