import React from 'react';
import { Instagram, Mail, Phone, MapPin } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

export default function Footer() {
  const navigate = useNavigate();
  const location = useLocation();

  const scrollTo = (id: string) => {
    if (location.pathname !== '/') {
      navigate('/', { state: { targetId: id } });
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <footer className="bg-brand-dark text-white/70 py-12 px-6 border-t border-white/10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
        <div className="col-span-1 md:col-span-2">
          <Link to="/" className="font-serif text-2xl text-white mb-4 inline-block">
            Gigi's <span className="font-light italic text-brand-primary">Catering</span>
          </Link>
          <p className="max-w-xs font-light text-sm leading-relaxed mb-6">
            Macht Chicagoer Events mit unvergesslichem Essen und makelloser Ausführung zu etwas Besonderem.
          </p>
          <div className="flex gap-4">
            <a href="https://instagram.com/gigi_s312" target="_blank" rel="noreferrer" className="text-white hover:text-brand-primary transition-colors">
              <Instagram size={20} />
            </a>
            <a href="https://tiktok.com/@gigi_s312" target="_blank" rel="noreferrer" className="text-white hover:text-brand-primary transition-colors flex items-center justify-center">
               <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-music"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
            </a>
            <a href="mailto:hello@gigiscatering312.com" className="text-white hover:text-brand-primary transition-colors">
              <Mail size={20} />
            </a>
          </div>
        </div>
        
        <div>
          <h5 className="text-white uppercase tracking-wider text-xs font-bold mb-4">Kontakt</h5>
          <ul className="space-y-3 font-light text-sm text-white/60">
            <li className="flex items-start gap-2">
              <MapPin size={16} className="mt-0.5 shrink-0" /> 
              Chicago, IL (Wir bedienen den Großraum Chicago)
            </li>
            <li className="flex items-center gap-2">
              <Mail size={16} className="shrink-0" />
              hello@gigiscatering312.com
            </li>
            <li className="flex items-center gap-2">
              <Phone size={16} className="shrink-0" />
              (312) 555-0198
            </li>
          </ul>
        </div>
        
        <div>
          <h5 className="text-white uppercase tracking-wider text-xs font-bold mb-4">Schnellzugriff</h5>
          <ul className="space-y-2 font-light text-sm">
            <li><button onClick={() => scrollTo('services')} className="hover:text-brand-primary transition-colors">Leistungen</button></li>
            <li><button onClick={() => scrollTo('instagram')} className="hover:text-brand-primary transition-colors">Galerie</button></li>
            <li><button onClick={() => scrollTo('about')} className="hover:text-brand-primary transition-colors">Über uns</button></li>
            <li><button onClick={() => scrollTo('inquire')} className="hover:text-brand-primary transition-colors">Anfragen/Buchen</button></li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto pt-8 border-t border-white/10 text-xs font-light text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-6">
        <p>&copy; {new Date().getFullYear()} Gigi's Catering. Alle Rechte vorbehalten.</p>
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 w-full md:w-auto justify-between md:justify-end">
          <div className="space-x-4">
            <Link to="/datenschutz" className="hover:text-white transition-colors">Datenschutzerklärung</Link>
            <Link to="/impressum" className="hover:text-white transition-colors">Impressum</Link>
            <Link to="/agb" className="hover:text-white transition-colors">AGB</Link>
          </div>
          <button 
            onClick={() => scrollTo('inquire')} 
            className="bg-brand-primary text-brand-dark px-5 py-2.5 rounded-full font-semibold uppercase tracking-wider text-[10px] hover:bg-white transition-colors shadow-sm"
          >
            Jetzt Angebot anfordern
          </button>
        </div>
      </div>
    </footer>
  );
}
