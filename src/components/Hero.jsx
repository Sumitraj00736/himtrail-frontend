import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { api } from '../services/api';

const Hero = () => {
  const navigate = useNavigate();
  const [content, setContent] = useState(null);
  
  // Search parameters state
  const [dest, setDest] = useState('');
  const [activity, setActivity] = useState('');
  const [duration, setDuration] = useState('');

  useEffect(() => {
    api.get('/content/homepage').then((res) => {
      setContent(res.data.data);
    });
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (dest) params.append('destination', dest);
    if (activity) params.append('category', activity);
    if (duration) params.append('duration', duration);
    navigate(`/trips?${params.toString()}`);
  };

  const heroImage =
    content?.heroImage ||
    'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=2000&auto=format&fit=crop';

  return (
    <section
      className="relative min-h-[85vh] flex flex-col justify-between text-white overflow-hidden"
    >
      {/* Background Image with Zoom & Blur Parallax Effect */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-105"
        style={{ 
          backgroundImage: `url(${heroImage})`,
        }}
      />
      <div className="absolute inset-0 hero-veil z-0" />

      {/* Floating Decorative Elements */}
      <div className="absolute inset-0 bg-brand-glow opacity-60 pointer-events-none" />

      {/* Center Cinematic Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 flex-grow flex flex-col justify-center items-center text-center pt-24 pb-12">
        <motion.p 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-xs md:text-sm font-semibold uppercase tracking-[0.35em] text-sunrise-200"
        >
          {content?.heroSubtitle || 'Trekking to the foothills of the world’s highest mountain'}
        </motion.p>
        
        <motion.h1 
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="font-display text-4xl md:text-6xl lg:text-7xl mt-6 tracking-tight leading-[1.1] font-bold max-w-4xl"
        >
          {content?.heroTitle || 'Everest Base Camp Trek - 15 Days'}
        </motion.h1>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-8 flex items-center justify-center gap-5"
        >
          <Link
            to={content?.heroCtaUrl || '/trips'}
            className="px-8 py-3.5 bg-sunrise-500 hover:bg-sunrise-600 text-white rounded-full text-xs font-semibold uppercase tracking-[0.2em] transition-all duration-300 shadow-glow hover:shadow-lg hover:-translate-y-0.5"
          >
            {content?.heroCtaLabel || 'Explore More →'}
          </Link>
          <button
            className="w-12 h-12 rounded-full bg-white/10 hover:bg-white text-white hover:text-brand flex items-center justify-center font-semibold border border-white/20 transition-all duration-300 backdrop-blur-sm shadow-md"
            type="button"
            aria-label="Play video"
          >
            ▶
          </button>
        </motion.div>
      </div>

      {/* Floating Interactive Search Panel */}
      <div className="relative z-10 max-w-5xl w-full mx-auto px-6 pb-8 md:pb-12">
        <div className="glass-panel text-slate-800 rounded-3xl shadow-premium p-5 md:p-6 grid md:grid-cols-4 gap-4 items-center border border-white/40">
          <div className="md:col-span-4 lg:col-span-1 font-semibold text-brand text-sm tracking-wide uppercase text-center lg:text-left mb-1 lg:mb-0">
            Find Your Next Holiday
          </div>
          <select 
            value={dest}
            onChange={(e) => setDest(e.target.value)}
            className="rounded-xl border-slate-200 bg-white/70 py-2.5 text-sm focus:border-brand focus:ring-brand"
          >
            <option value="">Destination</option>
            <option value="Nepal">Nepal</option>
            <option value="Tanzania">Tanzania</option>
            <option value="Bhutan">Bhutan</option>
            <option value="Tibet">Tibet</option>
          </select>
          <select 
            value={activity}
            onChange={(e) => setActivity(e.target.value)}
            className="rounded-xl border-slate-200 bg-white/70 py-2.5 text-sm focus:border-brand focus:ring-brand"
          >
            <option value="">Activity</option>
            <option value="Trekking">Trekking</option>
            <option value="Heli Tour">Heli Tour</option>
            <option value="Adventure">Adventure</option>
            <option value="Climbing">Climbing</option>
          </select>
          <select 
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="rounded-xl border-slate-200 bg-white/70 py-2.5 text-sm focus:border-brand focus:ring-brand"
          >
            <option value="">Duration</option>
            <option value="7">Up to 7 days</option>
            <option value="10">Up to 10 days</option>
            <option value="14">Up to 14 days</option>
            <option value="18">Up to 18 days</option>
          </select>
          <button 
            onClick={handleSearch}
            className="md:col-span-4 lg:col-span-4 xl:col-span-4 w-full py-3 bg-brand hover:bg-brand-600 text-white rounded-xl font-semibold tracking-wider transition-all duration-300 hover:shadow-lg active:scale-95"
          >
            Search Adventure
          </button>
        </div>

        {/* Scroll down chevron */}
        <div className="flex justify-center mt-6 text-white/50 animate-bounce">
          <span className="text-xl">↓</span>
        </div>
      </div>
    </section>
  );
};

export default Hero;
