import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { api } from '../services/api';

const Hero = () => {
  const navigate = useNavigate();
  const [content, setContent] = useState(null);
  const [trips, setTrips] = useState([]);
  
  // Search parameters state
  const [dest, setDest] = useState('');
  const [activity, setActivity] = useState('');
  const [duration, setDuration] = useState('');

  useEffect(() => {
    api.get('/content/homepage').then((res) => {
      setContent(res.data.data);
    });
    api.get('/trips').then((res) => {
      setTrips(res.data.data || []);
    });
  }, []);

  // Dynamically analyze options from the database
  const destinations = useMemo(() => {
    const set = new Set(trips.map(t => t.destination).filter(Boolean));
    return Array.from(set).sort();
  }, [trips]);

  const categories = useMemo(() => {
    const set = new Set(trips.map(t => t.category).filter(Boolean));
    return Array.from(set).sort();
  }, [trips]);

  const durationOptions = useMemo(() => {
    const durations = trips.map(t => t.duration).filter(Boolean);
    if (durations.length === 0) return [7, 10, 14, 18];
    const max = Math.max(...durations);
    
    // Create step options up to the max duration in database
    const steps = [];
    if (max >= 5) steps.push(7);
    if (max >= 8) steps.push(10);
    if (max >= 11) steps.push(14);
    if (max >= 15) steps.push(18);
    if (max > 18) steps.push(Math.ceil(max));
    return Array.from(new Set(steps)).sort((a, b) => a - b);
  }, [trips]);

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
    <section className="relative min-h-[90vh] flex flex-col justify-between text-white overflow-hidden bg-slate-950">
      {/* Background Image with Scale Parallax Effect */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-65 scale-105 transition-all duration-1000"
        style={{ 
          backgroundImage: `url(${heroImage})`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent z-0" />

      {/* Floating Ambient Glow */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-brand/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-sunrise-500/10 rounded-full blur-[150px] pointer-events-none" />

      {/* Center Cinematic Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 flex-grow flex flex-col justify-center items-center text-center pt-32 pb-16">
        <motion.p 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-xs md:text-sm font-black uppercase tracking-[0.4em] text-sunrise-400"
        >
          {content?.heroSubtitle || 'Trekking to the foothills of the world’s highest mountain'}
        </motion.p>
        
        <motion.h1 
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="font-display text-4xl md:text-6xl lg:text-7.5xl mt-6 tracking-tight leading-[1.1] font-black max-w-4xl bg-clip-text bg-gradient-to-b from-white via-white to-white/80"
        >
          {content?.heroTitle || 'Everest Base Camp Trek - 15 Days'}
        </motion.h1>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-10 flex items-center justify-center gap-5"
        >
          <Link
            to={content?.heroCtaUrl || '/trips'}
            className="px-8 py-4 bg-brand hover:bg-brand/90 text-white rounded-full text-xs font-bold uppercase tracking-[0.25em] transition-all duration-300 shadow-lg shadow-brand/20 hover:shadow-xl hover:-translate-y-0.5"
          >
            {content?.heroCtaLabel || 'Explore More →'}
          </Link>
          <button
            className="w-12 h-12 rounded-full bg-white/10 hover:bg-white text-white hover:text-slate-900 flex items-center justify-center font-bold border border-white/20 transition-all duration-300 backdrop-blur-md shadow-md"
            type="button"
            aria-label="Play video"
          >
            ▶
          </button>
        </motion.div>
      </div>

      {/* Floating Interactive Search Panel */}
      <div className="relative z-10 max-w-5xl w-full mx-auto px-6 pb-12">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="bg-white/90 backdrop-blur-2xl text-slate-800 rounded-3xl shadow-2xl p-6 md:p-8 grid md:grid-cols-4 gap-4 items-end border border-white/80"
        >
          <div className="md:col-span-4 lg:col-span-4 font-black text-slate-800 text-xs tracking-[0.2em] uppercase mb-2">
            🧭 Find Your Next Holiday
          </div>
          
          <div className="flex flex-col gap-2">
            <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 pl-1">Destination</span>
            <select 
              value={dest}
              onChange={(e) => setDest(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand font-medium transition-all"
            >
              <option value="">All Destinations</option>
              {destinations.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 pl-1">Activity</span>
            <select 
              value={activity}
              onChange={(e) => setActivity(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand font-medium transition-all"
            >
              <option value="">All Activities</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 pl-1">Duration</span>
            <select 
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand font-medium transition-all"
            >
              <option value="">Any Duration</option>
              {durationOptions.map(days => <option key={days} value={days}>Up to {days} days</option>)}
            </select>
          </div>

          <button 
            onClick={handleSearch}
            className="w-full py-3.5 bg-brand hover:bg-brand/95 text-white rounded-xl font-bold tracking-wider text-xs uppercase transition-all duration-300 shadow-md shadow-brand/10 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
          >
            Search Adventure
          </button>
        </motion.div>

        {/* Scroll down chevron */}
        <div className="flex justify-center mt-8 text-white/40 animate-bounce">
          <span className="text-xl">↓</span>
        </div>
      </div>
    </section>
  );
};

export default Hero;
