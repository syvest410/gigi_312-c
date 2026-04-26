import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { motion } from 'motion/react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    if (location.pathname !== '/') {
      navigate('/', { state: { targetId: id } });
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const navClass = location.pathname !== '/' 
    ? 'glass-panel py-4 shadow-sm bg-brand-light' 
    : isScrolled ? 'glass-panel py-4 shadow-sm' : 'bg-transparent py-6';

  const textClass = location.pathname !== '/' 
    ? 'text-brand-dark' 
    : isScrolled ? 'text-brand-dark' : 'text-white/90';

  const btnClass = location.pathname !== '/'
    ? 'bg-brand-primary text-white hover:bg-brand-dark'
    : isScrolled ? 'bg-brand-primary text-white hover:bg-brand-dark' : 'bg-brand-primary text-white hover:bg-brand-dark';

  const brandTextClass = location.pathname !== '/'
    ? 'text-brand-dark'
    : isScrolled ? 'text-brand-dark' : 'text-white';

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${navClass}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <Link to="/" className={`font-serif text-2xl md:text-3xl font-semibold tracking-wide cursor-pointer transition-colors ${brandTextClass}`} onClick={() => window.scrollTo(0,0)}>
          Gigi's <span className="font-light italic text-brand-primary">312</span>
        </Link>
        
        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {['Leistungen', 'Instagram', 'Über uns'].map((item) => (
            <button 
              key={item}
              onClick={() => scrollTo(item === 'Über uns' ? 'about' : item === 'Leistungen' ? 'services' : item.toLowerCase())}
              className={`text-sm uppercase tracking-widest font-medium hover:text-brand-primary transition-colors ${textClass}`}
            >
              {item}
            </button>
          ))}
          <button 
            onClick={() => scrollTo('inquire')}
            className={`px-6 py-2.5 rounded-full text-sm uppercase tracking-wider font-semibold transition-all ${btnClass}`}
          >
            Jetzt buchen
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className={`md:hidden ${location.pathname !== '/' || isScrolled || mobileMenuOpen ? 'text-brand-dark' : 'text-white'}`} 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Nav Overlay */}
      {mobileMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-full left-0 w-full bg-brand-light shadow-xl py-6 flex flex-col items-center gap-6 md:hidden glass-panel border-t border-brand-dark/10 text-brand-dark"
        >
          {['Leistungen', 'Instagram', 'Über uns'].map((item) => (
            <button 
              key={item}
              onClick={() => scrollTo(item === 'Über uns' ? 'about' : item === 'Leistungen' ? 'services' : item.toLowerCase())}
              className="text-lg uppercase tracking-widest font-medium border-b border-transparent hover:border-brand-primary"
            >
              {item}
            </button>
          ))}
          <button 
            onClick={() => scrollTo('inquire')}
            className="mt-4 bg-brand-dark text-white px-8 py-3 rounded-full uppercase tracking-wider text-sm font-semibold"
          >
            Jetzt buchen
          </button>
        </motion.div>
      )}
    </nav>
  );
}
