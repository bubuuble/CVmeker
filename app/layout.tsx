import type React from "react"
import "@/app/globals.css"
import { Plus_Jakarta_Sans } from "next/font/google"
import { LanguageProvider } from "@/contexts/LanguageContext"
import { Analytics } from "@vercel/analytics/next"

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], display: 'swap' })

export const metadata = {
  title: "CV Maker - Create Your Professional Resumes",
  description: "Create professional, ATS-friendly resumes that stand out with CV Maker.",
  generator: 'CV Maker',
  icons: {
    icon: '/logo3.png',
    shortcut: '/logo3.png',
    apple: '/logo3.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <Analytics />
      </head>
      {/* Browser extensions (e.g. ColorZilla's cz-shortcut-listen) add attributes to <body> before hydration */}
      <body className={jakarta.className} suppressHydrationWarning>
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  )
}