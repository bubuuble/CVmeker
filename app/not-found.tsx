import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="relative flex-grow flex items-center justify-center overflow-hidden px-4 py-20">
        <div className="pointer-events-none absolute inset-0 bg-grid" />
        <div className="relative text-center">
          <p className="text-8xl sm:text-9xl font-extrabold tracking-tighter text-gradient">404</p>
          <h1 className="mt-4 text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">Page Not Found</h1>
          <p className="mt-3 text-muted-foreground mb-8">
            The page you're looking for doesn't exist.
          </p>
          <Link href="/" className="btn-primary">
            Go Home
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
