import type React from "react"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import { LanguageProvider } from "@/contexts/LanguageContext"
import { Analytics } from "@vercel/analytics/next"

const inter = Inter({ subsets: ["latin"], display: 'swap' })

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
        {/* Add this line for Google Material Symbols */}
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
      </head>
      <body className={inter.className}>
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  )
}