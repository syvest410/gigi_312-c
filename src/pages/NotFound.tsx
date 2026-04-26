import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';

export default function NotFound() {
  return (
    <div className="min-h-screen relative font-sans text-brand-dark flex flex-col">
      <Navigation />
      
      <main className="flex-grow flex items-center justify-center pt-24 pb-16 px-6">
        <div className="text-center max-w-lg mx-auto">
          <h1 className="font-serif text-8xl md:text-9xl text-brand-primary mb-6">404</h1>
          <h2 className="font-serif text-3xl md:text-4xl mb-6">Seite nicht gefunden</h2>
          <p className="text-stone-600 mb-8 leading-relaxed">
            Die von Ihnen gesuchte Seite existiert leider nicht oder wurde verschoben.
          </p>
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 bg-brand-dark text-white px-8 py-4 rounded-full uppercase tracking-widest text-sm font-semibold hover:bg-brand-primary transition-colors"
          >
            <ChevronLeft size={18} />
            Zurück zur Startseite
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
