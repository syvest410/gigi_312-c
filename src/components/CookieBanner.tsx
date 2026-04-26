import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      // Small delay for better UX
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem('cookie-consent', 'all');
    setIsVisible(false);
  };

  const handleAcceptEssential = () => {
    localStorage.setItem('cookie-consent', 'essential');
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-0 left-0 right-0 z-[100] p-4 sm:p-6 pointer-events-none"
        >
          <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl border border-stone-200 p-6 md:p-8 pointer-events-auto flex flex-col lg:flex-row gap-6 md:gap-8 items-start lg:items-center">
            <div className="flex-grow">
              <h3 className="font-serif text-2xl text-brand-dark mb-3">Wir verwenden Cookies</h3>
              <p className="text-stone-600 text-sm leading-relaxed font-light">
                Um Ihnen ein optimales Webseiten-Erlebnis zu bieten, verwenden wir Cookies. Dazu zählen solche, die für den Betrieb der Seite notwendig sind, sowie solche, die lediglich zu anonymen Statistikzwecken oder für Social-Media-Funktionen genutzt werden. Sie können selbst entscheiden, welche Kategorien Sie zulassen möchten. Weitere Informationen finden Sie in unserer{' '}
                <Link to="/datenschutz" className="text-brand-primary hover:underline font-medium">Datenschutzerklärung</Link>.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto shrink-0">
              <button 
                onClick={handleAcceptEssential}
                className="px-6 py-3 rounded-full text-sm uppercase tracking-wider font-semibold text-stone-600 bg-stone-100 hover:bg-stone-200 transition-colors whitespace-nowrap"
              >
                Nur Essenzielle
              </button>
              <button 
                onClick={handleAcceptAll}
                className="px-6 py-3 rounded-full text-sm uppercase tracking-wider font-semibold text-white bg-brand-dark hover:bg-brand-primary transition-colors whitespace-nowrap"
              >
                Alle Akzeptieren
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
