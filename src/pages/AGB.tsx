import React, { useEffect } from 'react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';

export default function AGB() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen relative font-sans text-brand-dark selection:bg-brand-primary/30 flex flex-col">
      <Navigation />
      <div className="flex-grow pt-32 pb-24 px-6">
        <div className="max-w-3xl mx-auto bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-stone-200">
          <h1 className="font-serif text-4xl mb-8">Allgemeine Geschäftsbedingungen (AGB)</h1>
          
          <div className="space-y-6 text-stone-600 leading-relaxed font-light">
            <section>
              <h2 className="font-serif text-2xl mb-4 text-brand-dark">§ 1 Geltungsbereich</h2>
              <p className="mb-4">
                Für alle Geschäftsbeziehungen zwischen Gigi's Catering (nachfolgend „Caterer“) und dem Kunden gelten ausschließlich die nachfolgenden Allgemeinen Geschäftsbedingungen in ihrer zum Zeitpunkt der Bestellung gültigen Fassung.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl mb-4 text-brand-dark">§ 2 Vertragsschluss</h2>
              <p className="mb-4">
                Die Angebote auf der Website stellen eine unverbindliche Aufforderung an den Kunden dar, Buchungsanfragen zu stellen. Durch das Absenden des Kontaktformulars gibt der Kunde eine Anfrage ab. Ein bindender Vertrag kommt erst durch eine ausdrückliche schriftliche Auftragsbestätigung durch uns zustande.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl mb-4 text-brand-dark">§ 3 Leistungen und Stornierung</h2>
              <p className="mb-4">
                Die genauen Leistungen ergeben sich aus dem individuellen Angebot und der Auftragsbestätigung. Bei Stornierungen durch den Kunden können Stornogebühren anfallen, die gestaffelt nach dem Zeitpunkt der Absage berechnet werden. Genaue Stornobedingungen werden im Angebot ausgewiesen.
              </p>
            </section>

             <section>
              <h2 className="font-serif text-2xl mb-4 text-brand-dark">§ 4 Zahlungsbedingungen</h2>
              <p className="mb-4">
                Soweit nicht anders vereinbart, sind Rechnungen innerhalb von 14 Tagen nach Rechnungsstellung ohne Abzug fällig. Bei größeren Aufträgen können Vorauszahlungen vereinbart werden.
              </p>
            </section>
            
            <section>
              <h2 className="font-serif text-2xl mb-4 text-brand-dark">§ 5 Haftung</h2>
              <p className="mb-4">
                Der Caterer haftet für Vorsatz und grobe Fahrlässigkeit. Für leichte Fahrlässigkeit haftet der Caterer nur bei Verletzung einer wesentlichen Vertragspflicht (Kardinalpflicht), deren Erfüllung die ordnungsgemäße Durchführung des Vertrags überhaupt erst ermöglicht und auf deren Einhaltung der Vertragspartner regelmäßig vertrauen darf.
              </p>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
