import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';

/* ─── Region config ─────────────────────────────────────────── */
const REGION_CONFIG = {
  Everest:         { from: '#1a3a5c', to: '#2d6a9f', icon: '🏔️' },
  Annapurna:       { from: '#1a4a2e', to: '#2d7a4f', icon: '🌿' },
  Langtang:        { from: '#3a2a1a', to: '#7a5a2d', icon: '🌲' },
  Manaslu:         { from: '#2a1a3a', to: '#5a2d7a', icon: '⛰️' },
  'Upper Mustang': { from: '#4a1a1a', to: '#9a3a2a', icon: '🏜️' },
  Dolpo:           { from: '#1a2a4a', to: '#2a5a8a', icon: '💧' },
  Tibet:           { from: '#4a3a1a', to: '#8a6a2a', icon: '🕌' },
  Bhutan:          { from: '#2a3a1a', to: '#5a7a2a', icon: '🐉' },
  Tanzania:        { from: '#3a2a1a', to: '#8a5a2a', icon: '🦁' },
};

const DEFAULT_COLORS = { from: '#1a3a5c', to: '#2d6a9f', icon: '📍' };

/* ─── Section pill shown on card ───────────────────────────── */
const SectionPill = ({ label }) => (
  <span
    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${
      label === 'Trek in Nepal'
        ? 'bg-emerald-400/20 text-emerald-100'
        : 'bg-amber-400/20 text-amber-100'
    }`}
  >
    {label === 'Trek in Nepal' ? '🏔️' : '✨'} {label}
  </span>
);

/* ─── Card ──────────────────────────────────────────────────── */
const DestinationCard = ({ item }) => {
  const cfg = REGION_CONFIG[item.region] || DEFAULT_COLORS;

  return (
    <Link
      to={`/trips?region=${encodeURIComponent(item.region)}`}
      className="group relative flex-shrink-0 w-72 h-80 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 cursor-pointer"
      style={{ background: `linear-gradient(145deg, ${cfg.from}, ${cfg.to})` }}
    >
      {/* Background image */}
      {item.heroImage && (
        <img
          src={item.heroImage}
          alt={item.title}
          className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-60 group-hover:scale-105 transition-all duration-700"
        />
      )}
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

      {/* Top badges */}
      <div className="absolute top-4 left-4 right-4 flex items-start justify-between">
        <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-white/15 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-widest border border-white/20">
          {item.category}
        </span>
        {item.destinationSections?.length > 0 && (
          <div className="flex flex-col gap-1 items-end">
            {item.destinationSections.map((s) => <SectionPill key={s} label={s} />)}
          </div>
        )}
      </div>

      {/* Bottom content */}
      <div className="absolute bottom-0 left-0 right-0 p-5">
        <p className="text-white/60 text-[11px] font-bold uppercase tracking-widest mb-1">
          {item.region}
        </p>
        <h3 className="text-white font-black text-lg leading-tight line-clamp-2 group-hover:text-white/90 transition-colors">
          {item.title}
        </h3>
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-3 text-white/70 text-xs font-medium">
            <span>⏱ {item.duration}d</span>
            {item.maxAltitude && <span>⛰ {item.maxAltitude}</span>}
          </div>
          <div className="text-right">
            {item.oldPrice > 0 && (
              <p className="text-white/50 text-[10px] line-through">
                US${item.oldPrice?.toLocaleString()}
              </p>
            )}
            <p className="text-white font-black text-sm">
              US${item.price?.toLocaleString()}
            </p>
          </div>
        </div>
        {/* Hover CTA */}
        <div className="mt-3 overflow-hidden max-h-0 group-hover:max-h-10 transition-all duration-300">
          <div className="flex items-center gap-1.5 text-white/80 text-xs font-semibold">
            <span>Explore trips</span>
            <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

/* ─── Main section ──────────────────────────────────────────── */
const Destinations = () => {
  const [items, setItems]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');

  useEffect(() => {
    api.get('/content/destinations')
      .then((res) => setItems(res.data.data || []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  /* Build tab list dynamically from loaded data — same regions as menu */
  const tabs = useMemo(() => {
    const regions = [...new Set(items.map((i) => i.region))].sort((a, b) => {
      // Keep the preferred display order matching the menu
      const ORDER = ['Everest','Annapurna','Langtang','Manaslu','Upper Mustang','Dolpo','Tibet','Bhutan','Tanzania'];
      return ORDER.indexOf(a) - ORDER.indexOf(b);
    });
    return ['All', ...regions];
  }, [items]);

  const visible = useMemo(() => {
    if (activeTab === 'All') return items;
    return items.filter((i) => i.region === activeTab);
  }, [items, activeTab]);

  if (!loading && items.length === 0) return null;

  return (
    <section className="reveal reveal-up py-20">
      <div className="max-w-6xl mx-auto px-6">

        {/* ── Section header ── */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand to-blue-500 text-white flex items-center justify-center text-xl shadow-lg shadow-brand/20">
              📍
            </div>
            <div>
              <p className="text-xs uppercase font-bold tracking-[0.25em] text-sunrise-500">
                EXPLORE THE WORLD
              </p>
              <h2 className="section-title mt-1 text-slate-800 font-display">
                Destinations
              </h2>
            </div>
          </div>
          <Link
            to="/trips"
            className="px-6 py-3 rounded-full border border-slate-200 hover:border-brand hover:text-brand bg-white font-semibold text-xs tracking-wider uppercase transition-all duration-300 self-start sm:self-auto hover:-translate-y-0.5"
          >
            View All Trips →
          </Link>
        </div>

        {/* ── Region tabs (same as menu) ── */}
        {!loading && tabs.length > 1 && (
          <div className="flex items-center gap-2 flex-wrap mb-8 overflow-x-auto no-scrollbar pb-1">
            {tabs.map((tab) => {
              const cfg   = REGION_CONFIG[tab] || DEFAULT_COLORS;
              const count = tab === 'All' ? items.length : items.filter((i) => i.region === tab).length;
              const isActive = tab === activeTab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold flex-shrink-0 transition-all duration-200 ${
                    isActive
                      ? 'text-white shadow-md scale-105'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:scale-105'
                  }`}
                  style={isActive ? { background: `linear-gradient(135deg, ${cfg.from}, ${cfg.to})` } : {}}
                >
                  {tab !== 'All' && <span className="text-base leading-none">{cfg.icon}</span>}
                  {tab}
                  <span
                    className={`text-[11px] px-1.5 py-0.5 rounded-full font-bold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-500'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* ── Cards ── */}
        {loading ? (
          <div className="flex gap-6 overflow-x-auto no-scrollbar pb-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex-shrink-0 w-72 h-80 rounded-3xl bg-slate-200 animate-pulse" />
            ))}
          </div>
        ) : visible.length === 0 ? (
          <div className="text-center py-14 text-slate-400 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
            <p className="text-3xl mb-3">📍</p>
            <p className="font-semibold text-slate-500">No destinations in {activeTab} yet</p>
          </div>
        ) : (
          <div
            key={activeTab}
            className="flex gap-6 overflow-x-auto no-scrollbar pb-4 -mx-6 px-6"
            style={{ animation: 'fadeIn 0.3s ease' }}
          >
            {visible.map((item) => (
              <DestinationCard key={item._id} item={item} />
            ))}
          </div>
        )}

        {/* Scroll hint */}
        {visible.length > 3 && (
          <p className="text-center text-xs text-slate-400 mt-4 font-medium sm:hidden">
            ← Scroll to explore more →
          </p>
        )}
      </div>
    </section>
  );
};

export default Destinations;
