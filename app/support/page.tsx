'use client';

import { Coffee, Mail, ShieldCheck, Heart, ArrowUpRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";

export default function SupportPage() {
    const { language } = useLanguage();

    return (
        <>
            <Navbar />
            <div className="relative min-h-screen overflow-hidden bg-background">
                <div className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-grid" />
                <div className="pointer-events-none absolute -top-40 right-0 h-96 w-96 rounded-full bg-primary/15 blur-3xl" />

                {/* Intro Section */}
                <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 sm:pt-20 pb-12">
                    <div className="grid lg:grid-cols-[1fr_auto] gap-10 lg:gap-16 items-center">
                        <div className="space-y-6 text-center lg:text-left">
                            <span className="eyebrow">Support</span>
                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight text-foreground">
                                {language === 'id' ? 'Halo! ' : 'Hey there! '}
                                <span className="inline-block">👋</span>
                            </h1>

                            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto lg:mx-0">
                                {language === 'id'
                                    ? 'Platform pembuat CV ini dikembangkan dengan harapan bisa membantu teman-teman membuat CV yang profesional tanpa ribet — dan yang terpenting, gratis.'
                                    : 'This CV maker platform was built with the hope of helping people create professional CVs without hassle — and most importantly, for free.'}
                            </p>

                            <p className="mx-auto lg:mx-0 max-w-2xl rounded-2xl border-l-4 border-primary/40 bg-secondary/70 px-5 py-4 text-left text-sm sm:text-base text-muted-foreground italic">
                                {language === 'id'
                                    ? 'Projek ini masih terus berkembang. Beberapa fitur mungkin belum sempurna, tapi kami berusaha untuk terus memperbaikinya.'
                                    : 'This project is still evolving. Some features might not be perfect yet, but we\'re continuously working to improve.'}
                            </p>
                        </div>

                        {/* QR Code */}
                        <div className="mx-auto">
                            <div className="relative rounded-3xl border bg-card p-6 sm:p-8 shadow-2xl shadow-slate-900/10">
                                <img
                                    src="/qr.png"
                                    alt="Donation QR Code"
                                    className="w-48 h-48 sm:w-56 sm:h-56 mx-auto rounded-xl"
                                />
                                <p className="mt-4 text-sm font-medium text-center text-muted-foreground">
                                    {language === 'id' ? 'Scan untuk donasi' : 'Scan to donate'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Support Options */}
                <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-8 text-foreground text-center lg:text-left">
                        {language === 'id' ? 'Cara mendukung projek ini:' : 'Ways to support this project:'}
                    </h2>

                    <div className="grid sm:grid-cols-2 gap-5">
                        {/* Donation Card */}
                        <a
                            href="https://saweria.co/harsyax1"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group relative overflow-hidden rounded-2xl border bg-card p-6 sm:p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-amber-300"
                        >
                            <div className="flex items-start justify-between">
                                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600">
                                    <Coffee className="h-6 w-6" />
                                </span>
                                <ArrowUpRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" />
                            </div>
                            <h3 className="mt-5 text-xl font-bold mb-2 text-foreground">
                                {language === 'id' ? 'Belikan Kopi' : 'Buy Me a Coffee'}
                            </h3>
                            <p className="text-muted-foreground text-sm leading-relaxed">
                                {language === 'id'
                                    ? 'Dukungan finansial membantu kami untuk terus mengembangkan dan menambah fitur baru.'
                                    : 'Financial support helps us continue developing and adding new features.'}
                            </p>
                            <p className="mt-4 text-sm font-semibold text-amber-700">Saweria</p>
                        </a>

                        {/* Contribution Card */}
                        <a
                            href="mailto:harsyax1@gmail.com"
                            className="group relative overflow-hidden rounded-2xl border bg-card p-6 sm:p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-primary/40"
                        >
                            <div className="flex items-start justify-between">
                                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                    <Mail className="h-6 w-6" />
                                </span>
                                <ArrowUpRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" />
                            </div>
                            <h3 className="mt-5 text-xl font-bold mb-2 text-foreground">
                                {language === 'id' ? 'Kontribusi Template' : 'Contribute Templates'}
                            </h3>
                            <p className="text-muted-foreground text-sm leading-relaxed">
                                {language === 'id'
                                    ? 'Punya ide template CV? Atau ingin berkontribusi dalam development? Hubungi kami!'
                                    : 'Have CV template ideas? Or want to contribute to development? Reach out!'}
                            </p>
                            <p className="mt-4 text-sm font-semibold text-primary break-all">harsyax1@gmail.com</p>
                        </a>
                    </div>
                </div>

                {/* Privacy Notice - No Data Stored */}
                <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-6 sm:p-8">
                        <div className="flex flex-col sm:flex-row items-start gap-5">
                            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-500 text-white shadow-sm">
                                <ShieldCheck className="h-6 w-6" />
                            </span>
                            <div className="flex-1 space-y-3">
                                <h3 className="text-xl font-bold text-emerald-950">
                                    {language === 'id' ? 'Privasi & Keamanan Data' : 'Privacy & Data Security'}
                                </h3>
                                <p className="font-semibold text-emerald-900">
                                    {language === 'id'
                                        ? '✓ Kami tidak menyimpan data CV Anda.'
                                        : '✓ We don\'t store your CV data.'}
                                </p>
                                <ul className="space-y-2 text-sm leading-relaxed text-emerald-800 list-disc pl-5 marker:text-emerald-500">
                                    <li>
                                        {language === 'id'
                                            ? 'CV yang Anda buat hanya tersimpan di browser Anda sendiri (penyimpanan lokal). Hapus dengan tombol "Hapus Semua" di editor atau dengan membersihkan data browser.'
                                            : 'The CV you build is saved only in your own browser (local storage). Remove it with the "Clear All" button in the editor or by clearing your browser data.'}
                                    </li>
                                    <li>
                                        {language === 'id'
                                            ? 'Saat Anda mengunduh PDF, data CV dikirim ke server kami hanya untuk membuat file PDF-nya, lalu tidak disimpan.'
                                            : 'When you download a PDF, your CV data is sent to our server only to generate the PDF file and is not saved.'}
                                    </li>
                                    <li>
                                        {language === 'id'
                                            ? 'Saat Anda memakai fitur Import CV, file yang diupload dikirim ke Google Gemini untuk dibaca isinya. CV Maker tidak menyimpan salinannya, tetapi pemrosesan oleh Google tunduk pada ketentuan layanan Gemini API dari Google.'
                                            : 'When you use Import CV, the uploaded file is sent to Google Gemini to read its content. CV Maker doesn\'t keep a copy, but Google\'s processing is subject to Google\'s Gemini API terms.'}
                                    </li>
                                    <li>
                                        {language === 'id'
                                            ? 'Kami memakai Vercel Analytics untuk statistik kunjungan anonim. Isi CV Anda tidak ikut dikirim.'
                                            : 'We use Vercel Analytics for anonymous visit statistics. Your CV content is not included.'}
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Closing Message */}
                <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 pb-24">
                    <div className="text-center max-w-2xl mx-auto">
                        <span className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-500">
                            <Heart className="h-7 w-7 fill-current animate-pulse" />
                        </span>
                        <p className="text-lg text-muted-foreground leading-relaxed">
                            {language === 'id'
                                ? 'Terima kasih sudah mampir dan menggunakan platform ini. Semoga tumbuh hal baik di sela-sela harapanmu!'
                                : 'Thank you for stopping by and using this platform. Hope you get that job!'}
                        </p>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}
