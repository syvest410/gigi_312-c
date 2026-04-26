import React, { useEffect } from 'react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';

export default function Impressum() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen relative font-sans text-brand-dark selection:bg-brand-primary/30 flex flex-col">
      <Navigation />
      <div className="flex-grow pt-32 pb-24 px-6">
        <div className="max-w-3xl mx-auto bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-stone-200">
          <h1 className="font-serif text-4xl mb-8">Impressum</h1>
          
          <div className="space-y-6 text-stone-600 leading-relaxed font-light">
            <section>
              <h2 className="font-semibold text-brand-dark mb-2">Angaben gemäß § 5 TMG:</h2>
              <p>
                Gigi's Catering<br />
                Musterstraße 123<br />
                60311 Frankfurt am Main<br />
                Deutschland
              </p>
            </section>
            
            <section>
              <h2 className="font-semibold text-brand-dark mb-2">Vertreten durch:</h2>
              <p>Gigi Meyer (Beispielname)</p>
            </section>

            <section>
              <h2 className="font-semibold text-brand-dark mb-2">Kontakt:</h2>
              <p>
                Telefon: (312) 555-0198<br />
                E-Mail: hello@gigiscatering312.com
              </p>
            </section>

            <section>
              <h2 className="font-semibold text-brand-dark mb-2">Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz:</h2>
              <p>DE 123 456 789</p>
            </section>

            <section>
              <h2 className="font-semibold text-brand-dark mb-2">Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV:</h2>
              <p>
                Gigi Meyer<br />
                Musterstraße 123<br />
                60311 Frankfurt am Main
              </p>
            </section>

            <section>
              <h2 className="font-semibold text-brand-dark mb-2">Streitschlichtung</h2>
              <p>
                Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit: 
                <br /><a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer" className="text-brand-primary hover:underline">https://ec.europa.eu/consumers/odr</a>.<br />
                Unsere E-Mail-Adresse finden Sie oben im Impressum.
              </p>
              <p className="mt-2">
                Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.
              </p>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
