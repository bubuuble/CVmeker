'use client';

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";

export default function SupportPage() {
    const { language } = useLanguage();

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
                {/* Intro Section - Asymmetric Layout */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
                    <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-start">
                        {/* Left: Message */}
                        <div className="flex-1 lg:max-w-2xl">
                            <div className="space-y-6">
                                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                                    {language === 'id' ? (
                                        <>
                                            <span className="text-foreground">Halo! </span>
                                            <span className="text-muted-foreground">👋</span>
                                        </>
                                    ) : (
                                        <>
                                            <span className="text-foreground">Hey there! </span>
                                            <span className="text-muted-foreground">👋</span>
                                        </>
                                    )}
                                </h1>
                                
                                <p className="text-xl text-muted-foreground leading-relaxed">
                                    {language === 'id' 
                                        ? 'Platform pembuat CV ini dikembangkan dengan harapan bisa membantu teman-teman membuat CV yang profesional tanpa ribet — dan yang terpenting, gratis.'
                                        : 'This CV maker platform was built with the hope of helping people create professional CVs without hassle — and most importantly, for free.'}
                                </p>

                                <div className="flex items-start gap-3 pt-4">
                                    <div className="w-1 h-20 bg-gradient-to-b from-primary to-primary/20 rounded-full mt-1"></div>
                                    <p className="text-base text-muted-foreground/80 italic pt-1">
                                        {language === 'id'
                                            ? 'Projek ini masih terus berkembang. Beberapa fitur mungkin belum sempurna, tapi kami berusaha untuk terus memperbaikinya.'
                                            : 'This project is still evolving. Some features might not be perfect yet, but we\'re continuously working to improve.'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Right: QR Code - Offset positioning */}
                        <div className="lg:mt-12">
                            <div className="relative">
                                {/* Decorative element */}
                                <div className="absolute -top-4 -left-4 w-24 h-24 bg-primary/5 rounded-full blur-2xl"></div>
                                
                                <div className="relative bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
                                    <div className="mb-4">
                                        <img 
                                            src="/qr.png" 
                                            alt="Donation QR Code" 
                                            className="w-48 h-48 mx-auto"
                                        />
                                    </div>
                                    <p className="text-sm text-center text-gray-500">
                                        {language === 'id' ? 'Scan untuk donasi' : 'Scan to donate'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Support Options - Horizontal Cards */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <h2 className="text-2xl font-bold mb-8 text-foreground">
                        {language === 'id' ? 'Cara mendukung projek ini:' : 'Ways to support this project:'}
                    </h2>

                    <div className="grid sm:grid-cols-2 gap-6">
                        {/* Donation Card */}
                        <a 
                            href="https://saweria.co/harsyax1"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group relative overflow-hidden bg-card border rounded-xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-500/10 to-transparent rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
                            
                            <div className="relative">
                                <div className="text-4xl mb-4">☕</div>
                                <h3 className="text-xl font-semibold mb-2 text-foreground">
                                    {language === 'id' ? 'Belikan Kopi' : 'Buy Me a Coffee'}
                                </h3>
                                <p className="text-muted-foreground text-sm leading-relaxed">
                                    {language === 'id'
                                        ? 'Dukungan finansial membantu kami untuk terus mengembangkan dan menambah fitur baru.'
                                        : 'Financial support helps us continue developing and adding new features.'}
                                </p>
                                <div className="mt-4 inline-flex items-center gap-2 text-primary text-sm font-medium">
                                    <span>Saweria</span>
                                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                                </div>
                            </div>
                        </a>

                        {/* Contribution Card */}
                        <a 
                            href="mailto:harsyax1@gmail.com"
                            className="group relative overflow-hidden bg-card border rounded-xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
                            
                            <div className="relative">
                                <div className="text-4xl mb-4">✉️</div>
                                <h3 className="text-xl font-semibold mb-2 text-foreground">
                                    {language === 'id' ? 'Kontribusi Template' : 'Contribute Templates'}
                                </h3>
                                <p className="text-muted-foreground text-sm leading-relaxed">
                                    {language === 'id'
                                        ? 'Punya ide template CV? Atau ingin berkontribusi dalam development? Hubungi kami!'
                                        : 'Have CV template ideas? Or want to contribute to development? Reach out!'}
                                </p>
                                <div className="mt-4 inline-flex items-center gap-2 text-primary text-sm font-medium">
                                    <span>harsyax1@gmail.com</span>
                                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                                </div>
                            </div>
                        </a>
                    </div>
                </div>

                {/* Closing Message - Different approach */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 pb-24">
                    <div className="text-center max-w-2xl mx-auto">
                        <div className="inline-block mb-4">
                            <div className="flex items-center gap-2 text-5xl">
                                <span className="animate-pulse">❤️</span>
                            </div>
                        </div>
                        <p className="text-lg text-muted-foreground">
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