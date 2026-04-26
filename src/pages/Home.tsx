import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { 
  Instagram, ChevronRight, 
  Utensils, CalendarDays, GlassWater, 
  CheckCircle2, Heart, MessageCircle, X, Loader2
} from 'lucide-react';
import { useLocation } from 'react-router-dom';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';

// Typ für einen Instagram-Post
interface IgPost {
  id: string;
  url: string;
  likes: number;
  comments: number;
  text: string;
  platform: 'instagram' | 'tiktok';
}

const SOCIAL_MEDIA_ITEMS = [
  {
    url: "https://images.unsplash.com/photo-1599921841143-81906ce6d36e",
    type: "Reel",
    platform: "instagram",
    title: "Vorbereitung für unseren Sekt-Empfang!"
  },
  {
    url: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1",
    type: "Live",
    platform: "tiktok",
    title: "Live: Frische Pasta für euer Event"
  },
  {
    url: "https://images.unsplash.com/photo-1621307684693-02fce7ce31c0",
    type: "Reel",
    platform: "instagram",
    title: "Tipps & Tricks: Das perfekte Schnitzel"
  },
  {
    url: "https://images.unsplash.com/photo-1541544741938-0af808871cc0",
    type: "Live",
    platform: "tiktok",
    title: "Cocktail-Kreationen mit Gigi"
  }
];

const MENU_PREVIEW_ITEMS = [
  {
    img: "https://images.unsplash.com/photo-1599921841143-81906ce6d36e?auto=format&fit=crop&q=80&w=800",
    title: "Sekt- & Cocktail-Empfang",
    desc: "Der perfekte Kick-off für Ihr Event: Spritzige Aperitifs, kreative Cocktails und ausgewählte Weine."
  },
  {
    img: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=800",
    title: "Schnitzel & Wurst",
    desc: "Ehrliches Handwerk: Goldbraune Schnitzel, liebevoll zubereitete Wurstspezialitäten und passende Beilagen."
  },
  {
    img: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&q=80&w=800",
    title: "Handgemachte Pasta",
    desc: "Ein Stück Italien: Frische Pasta mit unwiderstehlichen Saucen, heiß serviert aus unserer mobilen Küche."
  }
];

export default function Home() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const location = useLocation();
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Parallax Hooks
  const { scrollY } = useScroll();
  const heroBgY = useTransform(scrollY, [0, 1000], [0, 250]);
  const heroOpacity = useTransform(scrollY, [0, 600], [1, 0]);
  const aboutImgY = useTransform(scrollY, [1500, 3000], [0, 150]);
  
  // Instagram Gallery State
  const [igPosts, setIgPosts] = useState<IgPost[]>([]);
  const [isLoadingIg, setIsLoadingIg] = useState(true);
  const [selectedPost, setSelectedPost] = useState<IgPost | null>(null);

  // Form state and validation
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    date: '',
    guests: '',
    type: '',
    location: '',
    diet: '',
    message: ''
  });
  
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

  const validateField = (name: string, value: string) => {
    let error = '';
    switch (name) {
      case 'firstName':
        if (!value.trim()) error = 'Vorname ist erforderlich.';
        break;
      case 'lastName':
        if (!value.trim()) error = 'Nachname ist erforderlich.';
        break;
      case 'email':
        if (!value.trim()) {
          error = 'E-Mail-Adresse ist erforderlich.';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = 'Bitte geben Sie eine gültige E-Mail-Adresse ein.';
        }
        break;
      case 'phone':
        if (!value.trim()) {
          error = 'Telefonnummer ist erforderlich.';
        } else if (!/^[\d\s+\-()]*$/.test(value) || value.replace(/[\s+\-()]/g, '').length < 5) {
          error = 'Gültige Telefonnummer erforderlich.';
        }
        break;
      case 'date':
        if (!value) {
          error = 'Datum ist erforderlich.';
        } else {
          const selectedDate = new Date(value);
          const today = new Date();
          today.setHours(0,0,0,0);
          if (selectedDate < today) {
            error = 'Datum darf nicht in der Vergangenheit liegen.';
          }
        }
        break;
      case 'guests':
        if (!value) {
          error = 'Gästezahl ist erforderlich.';
        } else if (parseInt(value, 10) < 1) {
          error = 'Bitte eine gültige Gästezahl eingeben.';
        }
        break;
      case 'type':
        if (!value) error = 'Veranstaltungsart erforderlich.';
        break;
      default:
        break;
    }
    return error;
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (touched[name]) {
      setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
    }
  };

  const handleFormBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
  };

  useEffect(() => {
    if (location.state && location.state.targetId) {
      setTimeout(() => {
        const element = document.getElementById(location.state.targetId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, [location]);

  // Simuliere den Fetch-Vorgang der Instagram API
  useEffect(() => {
    const fetchInstagramPosts = async () => {
      setIsLoadingIg(true);
      // HINWEIS: In einer echten Anwendung würden Sie hier die Instagram Graph API 
      // oder einen Service wie Behold.so aufrufen:
      // const response = await fetch('/api/instagram');
      // const data = await response.json();
      
      // Simuliere Netzwerkverzögerung
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setIgPosts([
        { id: "1", url: "https://images.unsplash.com/photo-1599921841143-81906ce6d36e?auto=format&fit=crop&q=80&w=800", likes: 342, comments: 12, text: "Der perfekte Start ins Wochenende mit unserem Sekt- & Cocktail-Empfang! 🥂✨ #wiesbadenevents #wiesbadencatering", platform: 'instagram' },
        { id: "2", url: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=800", likes: 189, comments: 5, text: "Frische Pasta, direkt vor Ort für euch zubereitet. Ein Hauch Italien in Wiesbaden 🍝🎉 #gigi312 #pastalove", platform: 'instagram' },
        { id: "3", url: "https://images.unsplash.com/photo-1599921841143-81906ce6d36e?auto=format&fit=crop&q=80&w=800", likes: 421, comments: 28, text: "Goldbraunes Schnitzel und knackige Salate - Traditionell und doch modern interpretiert. 🥩🔥 #schnitzellove #hessen", platform: 'tiktok' },
        { id: "4", url: "https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&q=80&w=800", likes: 256, comments: 9, text: "Unser neues Cocktail-Menü ist bereit. Lass uns gemeinsam anstoßen! 🍹✨ #cocktailtime #gigi312", platform: 'tiktok' }
      ]);
      setIsLoadingIg(false);
    };

    fetchInstagramPosts();
  }, []);

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    const newErrors: { [key: string]: string } = {};
    let hasErrors = false;
    
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key as keyof typeof formData]);
      if (error) {
        newErrors[key] = error;
        hasErrors = true;
      }
    });
    
    setErrors(newErrors);
    
    // Mark all as touched
    const allTouched = Object.keys(formData).reduce((acc, key) => ({ ...acc, [key]: true }), {});
    setTouched(allTouched);

    if (hasErrors) {
      return;
    }

    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setFormData({
        firstName: '', lastName: '', email: '', phone: '', date: '', guests: '', type: '', location: '', diet: '', message: ''
      });
      setTouched({});
      setErrors({});
    }, 5000);
  };

  return (
    <div ref={containerRef} className="min-h-screen relative font-sans text-brand-dark selection:bg-brand-primary/30">
      
      <Navigation />

      {/* Hero Section */}
      <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-black/40 z-10" />
        <motion.div 
          style={{ y: heroBgY }} 
          className="absolute inset-0 z-0 origin-top"
        >
          <img 
            src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" 
            alt="Gourmet Street Food Grill" 
            fetchPriority="high"
            className="w-full h-full object-cover scale-110 animate-[kenburns_20s_ease-in-out_infinite_alternate]"
          />
        </motion.div>
        
        <motion.div 
          style={{ opacity: heroOpacity }}
          className="relative z-20 text-center px-6 max-w-4xl mx-auto flex flex-col items-center"
        >
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-serif text-5xl md:text-7xl lg:text-8xl text-white font-light leading-tight mb-6 drop-shadow-lg"
          >
            Schnitzel. Pasta. <span className="italic text-brand-primary font-medium">Wurst.</span><br className="hidden md:block"/> Sekt- & Cocktail-Empfang
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-lg md:text-xl text-white/90 font-light mb-10 max-w-2xl leading-relaxed drop-shadow-md"
          >
            Wir bringen ehrliches, verdammt gutes Essen auf Ihre Feier in Wiesbaden (+ 100km mobil). Von klassischen Schnitzeln über handgemachte Pasta bis hin zum stilvollen Gin- oder Sekt-Empfang.
          </motion.p>
          
          <motion.button 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.9 }}
            onClick={() => scrollTo('inquire')}
            className="group flex items-center gap-2 bg-brand-primary text-white px-8 py-4 rounded-full uppercase tracking-widest text-sm font-semibold hover:bg-orange-700 transition-colors"
          >
            Jetzt anfragen
            <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </motion.div>
      </section>

      {/* Social Proof / IG SECTION (Dynamic Interactive Gallery) */}
      <section id="instagram" className="py-24 bg-brand-light px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div>
              <h2 className="font-serif text-4xl md:text-5xl mb-4">Ein Augenschmaus</h2>
              <div className="flex flex-col sm:flex-row gap-4">
                <a href="https://instagram.com/gigi_s312" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-brand-accent hover:text-brand-primary transition-colors font-medium">
                  <Instagram size={20} />
                  Folgen Sie @gigi_s312
                </a>
                <a href="https://tiktok.com/@gigi_s312" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-brand-accent hover:text-brand-primary transition-colors font-medium">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
                  Live auf TikTok ansehen
                </a>
              </div>
            </div>
            
            <div className="flex items-center gap-3 bg-red-50 text-red-600 px-4 py-2 rounded-full border border-red-100 shadow-sm animate-pulse-slow">
              <div className="w-2.5 h-2.5 bg-red-600 rounded-full animate-ping absolute"></div>
              <div className="w-2.5 h-2.5 bg-red-600 rounded-full relative"></div>
              <span className="text-sm font-semibold tracking-wider uppercase">Live Streams verfügbar</span>
            </div>
          </div>
          
          {isLoadingIg ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className={`aspect-square bg-stone-200 animate-pulse ${i === 1 || i === 4 ? 'rounded-tl-3xl rounded-br-3xl' : 'rounded-tr-3xl rounded-bl-3xl'} flex items-center justify-center`}>
                  <Loader2 className="animate-spin text-stone-400" size={32} />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
              {igPosts.map((post, i) => (
                <motion.div 
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => setSelectedPost(post)}
                  className={`group relative overflow-hidden aspect-square cursor-pointer ${i === 0 || i === 3 ? 'rounded-tl-3xl rounded-br-3xl' : 'rounded-tr-3xl rounded-bl-3xl'}`}
                >
                  <img src={post.url} alt="Social Post" loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  
                  {/* Platform Indicator */}
                  <div className="absolute top-4 right-4 z-10 w-8 h-8 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-white">
                    {post.platform === 'tiktok' ? (
                       <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
                    ) : (
                       <Instagram size={16} />
                    )}
                  </div>

                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="flex gap-6 text-white font-medium">
                      <span className="flex items-center gap-2"><Heart fill="currentColor" size={20} /> {post.likes}</span>
                      <span className="flex items-center gap-2"><MessageCircle fill="currentColor" size={20} /> {post.comments}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
          
          <div className="text-center mt-12">
            <button
               onClick={() => scrollTo('social-media')}
               className="inline-flex items-center gap-3 bg-brand-dark text-white px-8 py-4 rounded-full uppercase tracking-widest text-sm font-semibold hover:bg-brand-primary transition-colors"
            >
               Mehr Inhalte entdecken <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* Instagram Lightbox Modal */}
      <AnimatePresence>
        {selectedPost && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 md:p-12"
            onClick={() => setSelectedPost(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl overflow-hidden max-w-4xl w-full flex flex-col md:flex-row relative"
            >
              <button 
                onClick={() => setSelectedPost(null)}
                className="absolute top-4 right-4 z-10 bg-black/20 hover:bg-black/40 text-white rounded-full p-2 transition-colors md:text-stone-400 md:bg-transparent md:hover:bg-stone-100 md:hover:text-stone-800"
              >
                <X size={24} />
              </button>
              
              <div className="w-full md:w-3/5 bg-stone-100 aspect-square md:aspect-auto">
                <img src={selectedPost.url} alt="Post Bild" loading="lazy" className="w-full h-full object-cover" />
              </div>
              
              <div className="w-full md:w-2/5 p-6 md:p-8 flex flex-col h-full max-h-[50vh] md:max-h-none overflow-y-auto">
                <div className="flex items-center justify-between mb-6 pb-6 border-b border-stone-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-brand-primary flex items-center justify-center text-white font-serif font-bold">G</div>
                    <div>
                      <h4 className="font-semibold text-sm">gigi_s312</h4>
                      <p className="text-xs text-stone-500">Chicago, Illinois</p>
                    </div>
                  </div>
                  {selectedPost.platform === 'tiktok' ? (
                     <div className="text-stone-400" title="TikTok"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg></div>
                  ) : (
                     <div className="text-stone-400" title="Instagram"><Instagram size={20} /></div>
                  )}
                </div>
                
                <p className="text-stone-700 text-sm leading-relaxed mb-6 flex-grow">
                  {selectedPost.text}
                </p>
                
                <div className="pt-6 border-t border-stone-100 mt-auto">
                  <div className="flex gap-4 mb-4">
                    <button className="text-stone-400 hover:text-red-500 transition-colors"><Heart size={24} /></button>
                    <button className="text-stone-400 hover:text-brand-primary transition-colors"><MessageCircle size={24} /></button>
                  </div>
                  <div className="font-semibold text-sm mb-4">{selectedPost.likes} {selectedPost.platform === 'tiktok' ? 'Likes' : 'Gefällt mir Angaben'}</div>
                  <a 
                    href={selectedPost.platform === 'tiktok' ? 'https://tiktok.com/@gigi_s312' : 'https://instagram.com/gigi_s312'} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="block w-full bg-stone-100 hover:bg-stone-200 text-center py-3 rounded-xl text-sm font-medium transition-colors"
                  >
                    {selectedPost.platform === 'tiktok' ? 'Auf TikTok ansehen' : 'Auf Instagram ansehen'}
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Social Media Section */}
      <section id="social-media" className="py-24 bg-white border-t border-stone-200 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl md:text-5xl mb-6">Unsere Social Media</h2>
            <p className="text-stone-600 max-w-2xl mx-auto font-light leading-relaxed mb-6">
              Tauchen Sie ein in unsere Welt. Erleben Sie Live-Zubereitungen auf TikTok, exklusive Blicke hinter die Kulissen und die neuesten Kreationen auf Instagram.
            </p>
            <div className="w-24 h-px bg-brand-primary mx-auto"></div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {SOCIAL_MEDIA_ITEMS.map((media, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                onClick={() => {
                   if (media.platform === 'tiktok') {
                      window.open('https://tiktok.com/@gigi_s312', '_blank');
                   } else {
                      window.open('https://instagram.com/gigi_s312', '_blank');
                   }
                }}
                className="group relative rounded-3xl overflow-hidden aspect-[9/16] bg-stone-100 shadow-sm flex items-center justify-center cursor-pointer"
              >
                <img src={`${media.url}?auto=format&fit=crop&q=80&w=600&h=1066`} alt={media.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                
                <div className="absolute top-4 left-4 flex gap-2">
                  <div className={`px-2 md:px-3 py-1 rounded-full text-[10px] md:text-xs font-bold tracking-wider uppercase text-white flex items-center gap-1 ${media.type === 'Live' ? 'bg-red-600 animate-pulse' : 'bg-brand-primary'}`}>
                    {media.type === 'Live' ? <div className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-white animate-ping mr-1"></div> : null}
                    {media.type}
                  </div>
                  <div className="w-6 h-6 md:w-7 md:h-7 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-white">
                    {media.platform === 'tiktok' ? (
                       <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="md:w-3.5 md:h-3.5"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
                    ) : (
                       <Instagram size={12} className="md:w-3.5 md:h-3.5" />
                    )}
                  </div>
                </div>

                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/50">
                     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1 md:w-7 md:h-7"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                  </div>
                </div>

                <div className="absolute bottom-4 left-4 right-4 md:bottom-6 md:left-6 md:right-6">
                   <p className="text-white font-medium text-xs md:text-sm leading-snug drop-shadow-md line-clamp-2">{media.title}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12 flex flex-col sm:flex-row justify-center gap-4">
             <a href="https://tiktok.com/@gigi_s312" target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 bg-black text-white px-8 py-4 rounded-full uppercase tracking-widest text-sm font-semibold hover:bg-stone-800 transition-colors">
               <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
               Zu TikTok
             </a>
             <a href="https://instagram.com/gigi_s312" target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white px-8 py-4 rounded-full uppercase tracking-widest text-sm font-semibold hover:opacity-90 transition-opacity shadow-sm">
               <Instagram size={18} />
               Zu Instagram
             </a>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 bg-white px-6 border-y border-stone-200">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="font-serif text-4xl md:text-5xl mb-6">Unsere Leistungen</h2>
            <div className="w-24 h-px bg-brand-primary mx-auto"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-12 lg:gap-16">
            {/* Service 1 */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col items-center text-center"
            >
              <div className="w-20 h-20 rounded-full bg-brand-light flex items-center justify-center mb-6 text-brand-accent">
                <CalendarDays size={32} />
              </div>
              <h3 className="font-serif text-2xl mb-4">Corporate & Team-Events</h3>
              <p className="text-stone-600 leading-relaxed text-sm lg:text-base">
                Beeindrucken Sie Kunden und Verwöhnen Sie Ihr Team. Mit frischer Pasta und kühlen Cocktails schaffen wir die perfekte Atmosphäre. Professionalität und grandioser Geschmack für Ihr Firmenfest in der Region Wiesbaden.
              </p>
            </motion.div>

            {/* Service 2 */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="flex flex-col items-center text-center"
            >
              <div className="w-20 h-20 rounded-full bg-brand-light flex items-center justify-center mb-6 text-brand-primary">
                <Utensils size={32} />
              </div>
              <h3 className="font-serif text-2xl mb-4">Private Feiern & Feste</h3>
              <p className="text-stone-600 leading-relaxed text-sm lg:text-base">
                Geburtstage, Sommerfeste oder Polterabende – ein fantastisches Catering rundet alles ab. Deftiges Schnitzel und spritziger Sekt – sorgen Sie für leuchtende Augen bei all Ihren Gästen.
              </p>
            </motion.div>

            {/* Service 3 */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="flex flex-col items-center text-center"
            >
              <div className="w-20 h-20 rounded-full bg-brand-light flex items-center justify-center mb-6 text-brand-accent">
                <GlassWater size={32} />
              </div>
              <h3 className="font-serif text-2xl mb-4">Hochzeiten & Empfänge</h3>
              <p className="text-stone-600 leading-relaxed text-sm lg:text-base">
                Es ist Ihr besonderer Tag! Genießen Sie vollkommen unbeschwert unseren professionellen Cocktail-Empfang, gefolgt von feinster Pasta und edlen Kreationen. Wir unterstützen Sie flexibel bis zu 100km um Wiesbaden.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Menu Preview Section */}
      <section id="menu-preview" className="py-24 bg-stone-50 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl md:text-5xl mb-6">Menü-Vorschau</h2>
            <p className="text-stone-600 max-w-2xl mx-auto font-light leading-relaxed mb-6">
              Ein kleiner Vorgeschmack auf das, was wir für Ihre Veranstaltung kreieren können. Entdecken Sie unsere kuratierte Auswahl appetitlicher Highlights direkt aus unserem Instagram-Feed.
            </p>
            <div className="w-24 h-px bg-brand-primary mx-auto"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {MENU_PREVIEW_ITEMS.map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group bg-white rounded-3xl overflow-hidden shadow-sm border border-stone-100 flex flex-col"
              >
                <div className="relative h-64 overflow-hidden">
                  <img src={item.img} alt={item.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <a href="https://instagram.com/gigi_s312" target="_blank" rel="noreferrer" className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase text-brand-dark flex items-center gap-1 hover:text-brand-primary transition-colors">
                    <Instagram size={14} /> IG Post
                  </a>
                </div>
                <div className="p-8 flex flex-col flex-grow">
                  <h3 className="font-serif text-2xl mb-3 group-hover:text-brand-primary transition-colors">{item.title}</h3>
                  <p className="text-stone-600 font-light text-sm leading-relaxed mb-6 flex-grow">{item.desc}</p>
                  <button className="text-sm font-semibold uppercase tracking-wider text-brand-dark group-hover:text-brand-primary transition-colors flex items-center gap-2 mt-auto cursor-not-allowed opacity-50" title="Verfügbar in Kürze">
                    Optionen ansehen (Bald) <ChevronRight size={16} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <button 
              className="inline-flex flex-col sm:flex-row items-center justify-center gap-2 bg-stone-200 text-stone-500 px-8 py-4 rounded-full uppercase tracking-widest text-sm font-semibold cursor-not-allowed w-full sm:w-auto"
              title="Unsere vollständigen interaktiven Menüs sind in Kürze online verfügbar."
            >
              <span>Vollständiges Menü ansehen</span> 
              <span className="bg-stone-300 text-stone-600 px-2 py-0.5 rounded text-[10px] sm:ml-2">In Kürze online</span>
            </button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-white border-t border-stone-200 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl md:text-5xl mb-6">Was unsere Kunden sagen</h2>
            <div className="w-24 h-px bg-brand-primary mx-auto"></div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                text: "Der perfekte Cocktail-Empfang! Und die Pasta danach war das absolute Highlight. Gigi & das gesamte Team haben einen tollen Job in Wiesbaden gemacht.",
                author: "Sarah M.",
                event: "Corporate Summer Event"
              },
              {
                text: "Gigi's 312 hat unsere Hochzeit komplettiert. Das frische Schnitzel und die köstliche Wurst kamen bei allen super an - einfache Klassiker, perfekt zubereitet.",
                author: "Michael & Lisa T.",
                event: "Hochzeit im Rheingau"
              },
              {
                text: "Super nettes Team und das Essen war auf den Punkt! Selbst bei 80 Gästen herrschte null Stress - gerne wieder!",
                author: "Elena R.",
                event: "Private Backyard Party"
              },
              {
                text: "Von der Getränkeplanung bis zum Abbau war einfach alles top. Sehr entspanntes Feeling, toller Service, Wiesbaden hat endlich einen grandiosen mobilen Caterer.",
                author: "James L.",
                event: "Runder Geburtstag"
              }
            ].map((testimonial, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-stone-50 p-8 rounded-3xl shadow-sm border border-stone-100 flex flex-col h-full"
              >
                <div className="flex gap-1 text-brand-primary mb-6">
                  {[1, 2, 3, 4, 5].map(star => (
                    <svg key={star} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                  ))}
                </div>
                <p className="text-stone-600 font-light leading-relaxed mb-8 flex-grow text-sm md:text-base">
                  "{testimonial.text}"
                </p>
                <div>
                  <h4 className="font-serif font-bold text-brand-dark">{testimonial.author}</h4>
                  <p className="text-xs text-stone-500 uppercase tracking-widest mt-1">{testimonial.event}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-24 bg-brand-accent text-white px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl md:text-5xl mb-6">So funktioniert's</h2>
            <p className="font-light text-white/80 max-w-xl mx-auto">Ein erstklassiges Catering zu buchen, sollte nicht stressig sein. Wir haben unseren Prozess vereinfacht, damit Sie sich auf das Wesentliche konzentrieren können.</p>
          </div>

          <div className="relative">
            {/* Connecting line for desktop */}
            <motion.div 
               initial={{ scaleX: 0 }}
               whileInView={{ scaleX: 1 }}
               viewport={{ once: true, margin: "-100px" }}
               transition={{ duration: 1, delay: 0.2 }}
               className="hidden md:block absolute top-[40px] left-[10%] right-[10%] h-px bg-white/20 z-0 origin-left"
            ></motion.div>
            
            <div className="grid md:grid-cols-3 gap-12 relative z-10">
              {[
                { step: "01", title: "Angebot anfordern", desc: "Füllen Sie unser kurzes Anfrageformular mit Ihren Veranstaltungsdetails, dem Datum und der geschätzten Gästezahl aus." },
                { step: "02", title: "Menü anpassen", desc: "Wir beraten Sie gerne und erstellen ein maßgeschneidertes Menü, das genau auf Ihren Geschmack und Ihre Ernährungsbedürfnisse abgestimmt ist." },
                { step: "03", title: "Event genießen", desc: "Wir kümmern uns um die Vorbereitung, das Kochen, die Präsentation und das Aufräumen. Sie nehmen einfach die Komplimente entgegen." }
              ].map((item, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, delay: i * 0.2 }}
                  className="flex flex-col items-center text-center bg-brand-accent/50 p-6 rounded-2xl backdrop-blur-sm"
                >
                  <div className="w-20 h-20 rounded-full bg-brand-dark flex items-center justify-center font-serif text-2xl mb-6 border border-white/10 text-brand-primary">
                    {item.step}
                  </div>
                  <h3 className="font-serif text-2xl mb-3">{item.title}</h3>
                  <p className="font-light text-white/70 text-sm">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-0 flex flex-col md:flex-row min-h-[600px] overflow-hidden">
        <div className="md:w-1/2 min-h-[400px] relative overflow-hidden">
          <motion.img 
            style={{ y: aboutImgY }}
            src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&q=80&w=1200" 
            alt="Chef preparing food" 
            className="absolute inset-0 w-full h-full object-cover scale-110"
          />
        </div>
        <div className="md:w-1/2 bg-brand-light p-12 md:p-24 flex items-center justify-center">
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="max-w-lg"
          >
            <h4 className="text-brand-primary uppercase tracking-widest text-xs font-bold mb-4">Hinter dem Menü</h4>
            <h2 className="font-serif text-4xl md:text-5xl mb-8">Lernen Sie Gigi kennen</h2>
            <p className="text-stone-600 mb-6 leading-relaxed">
              "Gutes Essen braucht keine steife Atmosphäre. Die ehrlichsten und besten Geschmäcker habe ich immer auf der Straße, an kleinen Ständen und Food-Trucks gefunden."
            </p>
            <p className="text-stone-600 mb-8 leading-relaxed">
              Mit Gigi's 312 bringen wir echte Klassiker und frische Pasta direkt zu Ihnen – im Raum Wiesbaden und im Umkreis von +100km! Egal ob frische Cocktails, ein großartiger Sekt-Empfang zur Begrüßung oder deftiges wie Wurst und Schnitzel später am Abend: Wir machen Ihre Feier kulinarisch unvergesslich.
            </p>
            <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Signature_of_John_Hancock.svg" alt="Signature" loading="lazy" className="h-12 opacity-40 mix-blend-multiply" />
          </motion.div>
        </div>
      </section>

      {/* Inquiry Form Section */}
      <section id="inquire" className="py-24 bg-stone-100 px-6 overflow-hidden">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="font-serif text-4xl md:text-5xl mb-4">Lassen Sie uns gemeinsam planen</h2>
            <p className="text-stone-600 max-w-xl mx-auto">Füllen Sie das untenstehende Formular aus, um ein genaues Angebot zu erhalten. Lassen Sie uns direkt mit der offiziellen Menüplanung beginnen.</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8 }}
            className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-stone-200"
          >
            {formSubmitted ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-16 text-center"
              >
                <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle2 size={40} className="text-green-600" />
                </div>
                <h3 className="font-serif text-3xl mb-4">Anfrage erhalten!</h3>
                <p className="text-stone-600 max-w-md">Vielen Dank für Ihre Nachricht. Gigi und unser Team werden Ihre Angaben prüfen und sich innerhalb von 24-48 Stunden mit einem Angebot bei Ihnen melden.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="firstName" className="text-xs uppercase tracking-wider font-semibold text-stone-500">Vorname *</label>
                    <input 
                      id="firstName"
                      required 
                      type="text" 
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleFormChange}
                      onBlur={handleFormBlur}
                      className={`w-full bg-stone-50 border ${errors.firstName && touched.firstName ? 'border-red-500 focus:ring-red-500' : 'border-stone-200 focus:border-brand-primary focus:ring-brand-primary'} rounded-lg px-4 py-3 focus:outline-none focus:ring-1 transition-colors`} 
                      placeholder="Jane" 
                    />
                    {touched.firstName && errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="lastName" className="text-xs uppercase tracking-wider font-semibold text-stone-500">Nachname *</label>
                    <input 
                      id="lastName"
                      required 
                      type="text" 
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleFormChange}
                      onBlur={handleFormBlur}
                      className={`w-full bg-stone-50 border ${errors.lastName && touched.lastName ? 'border-red-500 focus:ring-red-500' : 'border-stone-200 focus:border-brand-primary focus:ring-brand-primary'} rounded-lg px-4 py-3 focus:outline-none focus:ring-1 transition-colors`} 
                      placeholder="Doe" 
                    />
                    {touched.lastName && errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-xs uppercase tracking-wider font-semibold text-stone-500">E-Mail-Adresse *</label>
                    <input 
                      id="email"
                      required 
                      type="email" 
                      name="email"
                      value={formData.email}
                      onChange={handleFormChange}
                      onBlur={handleFormBlur}
                      className={`w-full bg-stone-50 border ${errors.email && touched.email ? 'border-red-500 focus:ring-red-500' : 'border-stone-200 focus:border-brand-primary focus:ring-brand-primary'} rounded-lg px-4 py-3 focus:outline-none focus:ring-1 transition-colors`} 
                      placeholder="jane@example.com" 
                    />
                    {touched.email && errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="phone" className="text-xs uppercase tracking-wider font-semibold text-stone-500">Telefonnummer *</label>
                    <input 
                      id="phone"
                      required 
                      type="tel" 
                      name="phone"
                      value={formData.phone}
                      onChange={handleFormChange}
                      onBlur={handleFormBlur}
                      className={`w-full bg-stone-50 border ${errors.phone && touched.phone ? 'border-red-500 focus:ring-red-500' : 'border-stone-200 focus:border-brand-primary focus:ring-brand-primary'} rounded-lg px-4 py-3 focus:outline-none focus:ring-1 transition-colors`} 
                      placeholder="(312) 555-0198" 
                    />
                    {touched.phone && errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="date" className="text-xs uppercase tracking-wider font-semibold text-stone-500">Veranstaltungsdatum *</label>
                    <input 
                      id="date"
                      required 
                      type="date" 
                      name="date"
                      value={formData.date}
                      onChange={handleFormChange}
                      onBlur={handleFormBlur}
                      className={`w-full bg-stone-50 border ${errors.date && touched.date ? 'border-red-500 focus:ring-red-500' : 'border-stone-200 focus:border-brand-primary focus:ring-brand-primary'} rounded-lg px-4 py-3 font-sans focus:outline-none focus:ring-1 transition-colors`} 
                    />
                    {touched.date && errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="guests" className="text-xs uppercase tracking-wider font-semibold text-stone-500">Gästezahl *</label>
                    <input 
                      id="guests"
                      required 
                      type="number" 
                      min="1" 
                      name="guests"
                      value={formData.guests}
                      onChange={handleFormChange}
                      onBlur={handleFormBlur}
                      className={`w-full bg-stone-50 border ${errors.guests && touched.guests ? 'border-red-500 focus:ring-red-500' : 'border-stone-200 focus:border-brand-primary focus:ring-brand-primary'} rounded-lg px-4 py-3 focus:outline-none focus:ring-1 transition-colors`} 
                      placeholder="z.B. 50" 
                    />
                    {touched.guests && errors.guests && <p className="text-red-500 text-xs mt-1">{errors.guests}</p>}
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="type" className="text-xs uppercase tracking-wider font-semibold text-stone-500">Art der Veranstaltung *</label>
                    <select 
                      id="type"
                      required 
                      name="type"
                      value={formData.type}
                      onChange={handleFormChange}
                      onBlur={handleFormBlur}
                      className={`w-full bg-stone-50 border ${errors.type && touched.type ? 'border-red-500 focus:ring-red-500' : 'border-stone-200 focus:border-brand-primary focus:ring-brand-primary'} rounded-lg px-4 py-3 appearance-none focus:outline-none focus:ring-1 transition-colors`}
                    >
                      <option value="">Bitte auswählen...</option>
                      <option value="corporate">Geschäftlich</option>
                      <option value="wedding">Hochzeit</option>
                      <option value="private_party">Private Party / Geburtstag</option>
                      <option value="other">Sonstiges</option>
                    </select>
                    {touched.type && errors.type && <p className="text-red-500 text-xs mt-1">{errors.type}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="location" className="text-xs uppercase tracking-wider font-semibold text-stone-500">Veranstaltungsort / Adresse</label>
                  <input 
                    id="location"
                    type="text" 
                    name="location"
                    value={formData.location}
                    onChange={handleFormChange}
                    onBlur={handleFormBlur}
                    className="w-full bg-stone-50 border border-stone-200 rounded-lg px-4 py-3 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-colors" 
                    placeholder="Adresse oder Stadtteil" 
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="diet" className="text-xs uppercase tracking-wider font-semibold text-stone-500">Ernährungseinschränkungen</label>
                  <input 
                    id="diet"
                    type="text" 
                    name="diet"
                    value={formData.diet}
                    onChange={handleFormChange}
                    onBlur={handleFormBlur}
                    className="w-full bg-stone-50 border border-stone-200 rounded-lg px-4 py-3 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-colors" 
                    placeholder="z.B. Vegan, Glutenfrei, Nussallergien" 
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="text-xs uppercase tracking-wider font-semibold text-stone-500">Erzählen Sie uns mehr über Ihre Veranstaltung</label>
                  <textarea 
                    id="message"
                    rows={4} 
                    name="message"
                    value={formData.message}
                    onChange={handleFormChange}
                    onBlur={handleFormBlur}
                    className="w-full bg-stone-50 border border-stone-200 rounded-lg px-4 py-3 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-colors" 
                    placeholder="Beschreiben Sie die gewünschte Atmosphäre, das Thema oder bestimmte Gerichte, die Sie sich vorstellen..."
                  ></textarea>
                </div>

                <button type="submit" className="w-full bg-brand-dark text-white rounded-lg py-4 uppercase tracking-widest text-sm font-semibold hover:bg-brand-primary transition-colors">
                  Angebot anfordern
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
