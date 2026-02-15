import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { api } from '../services/api';

const Hero = () => {
  const [content, setContent] = useState(null);

  useEffect(() => {
    api.get('/content/homepage').then((res) => {
      setContent(res.data.data);
    });
  }, []);

  const heroImage =
    content?.heroImage ||
    'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=2000&auto=format&fit=crop';

  return (
    <section
      className="relative bg-cover bg-center text-white"
      style={{ backgroundImage: `url(${heroImage})` }}
    >
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative max-w-6xl mx-auto px-6 pt-28 pb-24 md:pt-40 md:pb-32 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-white/80">
          {content?.heroSubtitle || 'Trekking to the foothills of the world’s highest mountain'}
        </p>
        <h1 className="font-display text-3xl md:text-5xl mt-4 tracking-wide">
          {content?.heroTitle || 'Everest Base Camp Trek - 15 Days'}
        </h1>
        <div className="mt-6 flex items-center justify-center gap-4">
          <Link
            to={content?.heroCtaUrl || '/trips'}
            className="px-6 py-3 border border-white/70 rounded-full text-sm uppercase tracking-[0.2em]"
          >
            {content?.heroCtaLabel || 'Explore More →'}
          </Link>
          <button
            className="w-14 h-14 rounded-full bg-white text-[#243b75] font-semibold"
            type="button"
            aria-label="Play video"
          >
            ▶
          </button>
        </div>
        <div className="mt-10 flex items-center justify-center gap-2">
          <span className="w-2 h-2 rounded-full bg-white/50" />
          <span className="w-3 h-3 rounded-full bg-white" />
          <span className="w-2 h-2 rounded-full bg-white/50" />
        </div>
      </div>
    <div className="relative max-w-5xl mx-auto -mb-10 px-6">
      <div className="bg-white text-forest-900 rounded-2xl shadow-lg p-6 grid md:grid-cols-5 gap-4 items-center">
        <div className="md:col-span-2 font-semibold text-forest-800">
          Find Your Next Holiday:
        </div>
        <select className="rounded-full border-forest-200">
          <option>Destination</option>
          <option>Nepal</option>
          <option>Tanzania</option>
          <option>Bhutan</option>
          <option>Tibet</option>
        </select>
        <select className="rounded-full border-forest-200">
          <option>Activity</option>
          <option>Trekking</option>
          <option>Heli Tour</option>
          <option>Adventure</option>
        </select>
        <select className="rounded-full border-forest-200">
          <option>Duration</option>
          <option>Up to 7 days</option>
          <option>Up to 10 days</option>
          <option>Up to 14 days</option>
        </select>
        <button className="md:col-span-5 md:col-start-5 md:row-start-1 md:row-end-2 w-full py-3 bg-[#243b75] text-white rounded-xl font-semibold">
          Search
        </button>
      </div>
    </div>
  </section>
  );
};

export default Hero;
