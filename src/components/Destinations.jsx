import { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { CarouselArrow } from './ScrollCarousel';
import { FontAwesomeIcon, RegionIcon, faArrowLeft, faArrowRight, faClock, faGem, faLocationDot, faMountain, faPause, faPlay } from '../utils/homeIcons';

/* ─── Region config ─────────────────────────────────────────── */
const REGION_CONFIG = {
  Everest:         { from: '#1a3a5c', to: '#2d6a9f' },
  Annapurna:       { from: '#1a4a2e', to: '#2d7a4f' },
  Langtang:        { from: '#3a2a1a', to: '#7a5a2d' },
  Manaslu:         { from: '#2a1a3a', to: '#5a2d7a' },
  'Upper Mustang': { from: '#4a1a1a', to: '#9a3a2a' },
  Dolpo:           { from: '#1a2a4a', to: '#2a5a8a' },
  Tibet:           { from: '#4a3a1a', to: '#8a6a2a' },
  Bhutan:          { from: '#2a3a1a', to: '#5a7a2a' },
  Tanzania:        { from: '#3a2a1a', to: '#8a5a2a' },
};

const DEFAULT_COLORS = { from: '#1a3a5c', to: '#2d6a9f' };

/* ─── Section pill shown on card ───────────────────────────── */
const SectionPill = ({ label }) => (
  <span
    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide backdrop-blur-sm ${
      label === 'Trek in Nepal'
        ? 'bg-emerald-400/20 text-emerald-100 ring-1 ring-emerald-300/30'
        : 'bg-amber-400/20 text-amber-100 ring-1 ring-amber-300/30'
    }`}
  >
    <FontAwesomeIcon icon={label === 'Trek in Nepal' ? faMountain : faGem} /> {label}
  </span>
);

/* ─── Card ──────────────────────────────────────────────────── */
const DestinationCard = ({ item }) => {
  const cfg = REGION_CONFIG[item.region] || DEFAULT_COLORS;
  const href = item.href || `/destinations/${String(item.country || item.menuColumn || '').toLowerCase()}/${item.slug}`;
  const packageLabel =
    item.packageCount != null
      ? `${item.packageCount} package${item.packageCount === 1 ? '' : 's'}`
      : null;

  return (
    <Link
      to={href}
      data-carousel-item
      className="group relative flex-shrink-0 w-72 h-80 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 cursor-pointer ring-1 ring-black/5 snap-start"
      style={{ background: `linear-gradient(145deg, ${cfg.from}, ${cfg.to})` }}
    >
      {/* Background image */}
      {item.heroImage && (
        <img
          src={item.heroImage}
          alt={item.title}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-60 group-hover:scale-105 transition-all duration-700"
        />
      )}
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

      {/* Sheen sweep on hover */}
      <div className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-[1200ms] ease-out bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* Top badges */}
      <div className="absolute top-4 left-4 right-4 flex items-start justify-between">
        <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-white/15 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-widest border border-white/20">
          {item.country || item.menuColumn || item.category || 'Destination'}
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
          {item.menuColumn || item.country || item.region}
        </p>
        <h3 className="text-white font-black text-lg leading-tight line-clamp-2 group-hover:text-white/90 transition-colors">
          {item.title}
        </h3>
        <div className="mt-3 flex items-center justify-between">
          {packageLabel ? (
            <span className="text-white/80 text-xs font-semibold">{packageLabel}</span>
          ) : (
            <div className="flex items-center gap-3 text-white/70 text-xs font-medium">
              {item.duration != null && <span><FontAwesomeIcon icon={faClock} className="mr-1" />{item.duration}d</span>}
              {item.maxAltitude && <span><FontAwesomeIcon icon={faMountain} className="mr-1" />{item.maxAltitude}</span>}
            </div>
          )}
          {item.price != null && (
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
          )}
        </div>
        {/* Hover CTA */}
        <div className="mt-3 overflow-hidden max-h-0 group-hover:max-h-10 transition-all duration-300">
          <div className="flex items-center gap-1.5 text-white/80 text-xs font-semibold">
            <span>Explore destination</span>
            <FontAwesomeIcon icon={faArrowRight} className="group-hover:translate-x-1 transition-transform duration-300" />
          </div>
        </div>
      </div>
    </Link>
  );
};

/* ─── Main section ──────────────────────────────────────────── */
const AUTO_SLIDE_MS = 3500;

const Destinations = () => {
  const [items, setItems]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd]     = useState(false);
  const [paused, setPaused]   = useState(false);
  const [progress, setProgress] = useState(0); // 0-1, drives the active dot's fill

  const scrollRef   = useRef(null);
  const intervalRef = useRef(null);
  const rafRef       = useRef(null);

  const onScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 4);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 4);
  }, []);

  const scrollBy = useCallback((dir) => {
    const el = scrollRef.current;
    if (!el) return;
    const card = el.querySelector('[data-carousel-item]');
    const step = card ? card.getBoundingClientRect().width + 24 : 320;
    el.scrollBy({ left: dir * step, behavior: 'smooth' });
  }, []);

  /* Advance one card; loop back to start once the end is reached */
  const advance = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const atRightEdge = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4;
    if (atRightEdge) {
      el.scrollTo({ left: 0, behavior: 'smooth' });
    } else {
      scrollBy(1);
    }
  }, [scrollBy]);

  /* ── Auto-slide engine ──
     Runs on a fixed interval, paused on hover/touch/focus so visitors
     stay in control the moment they show interest. Also pauses while
     the section is scrolled out of view. */
  useEffect(() => {
    const el = scrollRef.current;
    if (!el || paused || loading) return undefined;
    if (el.scrollWidth <= el.clientWidth + 4) return undefined; // nothing to slide

    intervalRef.current = setInterval(advance, AUTO_SLIDE_MS);
    return () => clearInterval(intervalRef.current);
  }, [advance, paused, loading, activeTab, items]);

  /* Lightweight progress ring for the "next slide" affordance */
  useEffect(() => {
    if (paused || loading) {
      setProgress(0);
      return undefined;
    }
    const start = performance.now();
    const tick = (now) => {
      const pct = ((now - start) % AUTO_SLIDE_MS) / AUTO_SLIDE_MS;
      setProgress(pct);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [paused, loading, activeTab]);

  /* Pause on hover/touch/focus-within, resume on leave */
  const pause  = useCallback(() => setPaused(true), []);
  const resume = useCallback(() => setPaused(false), []);

  /* Pause when the carousel scrolls out of the viewport */
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => setPaused((p) => (entry.isIntersecting ? p : true)),
      { threshold: 0.25 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [activeTab, loading]);

  useEffect(() => {
    api.get('/content/destinations')
      .then((res) => setItems(res.data.data || []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  /* Build tab list from menu columns (navbar) or regions */
  const tabs = useMemo(() => {
    const hasMenuColumns = items.some((i) => i.menuColumn);
    const key = hasMenuColumns ? 'menuColumn' : 'region';
    const values = [...new Set(items.map((i) => i[key]).filter(Boolean))];
    if (key === 'region') {
      const ORDER = ['Everest','Annapurna','Langtang','Manaslu','Upper Mustang','Dolpo','Tibet','Bhutan','Tanzania'];
      values.sort((a, b) => ORDER.indexOf(a) - ORDER.indexOf(b));
    }
    return ['All', ...values];
  }, [items]);

  const tabKey = items.some((i) => i.menuColumn) ? 'menuColumn' : 'region';

  const visible = useMemo(() => {
    if (activeTab === 'All') return items;
    return items.filter((i) => i[tabKey] === activeTab);
  }, [items, activeTab, tabKey]);

  if (!loading && items.length === 0) return null;

  return (
    <section className="reveal reveal-up py-20">
      <div className="max-w-6xl mx-auto px-6">

        {/* ── Section header ── */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand to-blue-500 text-white flex items-center justify-center text-xl shadow-lg shadow-brand/20">
              <FontAwesomeIcon icon={faLocationDot} />
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
          <div className="flex items-center gap-3">
            {/* Auto-play toggle */}
            <button
              onClick={() => setPaused((p) => !p)}
              aria-label={paused ? 'Resume autoplay' : 'Pause autoplay'}
              aria-pressed={!paused}
              className="relative w-10 h-10 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-500 hover:text-brand hover:border-brand transition-colors duration-300 overflow-hidden"
            >
              {/* progress ring */}
              <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 40 40">
                <circle cx="20" cy="20" r="17" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-100" />
                <circle
                  cx="20" cy="20" r="17" fill="none" stroke="currentColor" strokeWidth="2"
                  className="text-brand transition-none"
                  strokeDasharray={2 * Math.PI * 17}
                  strokeDashoffset={paused ? 2 * Math.PI * 17 : 2 * Math.PI * 17 * (1 - progress)}
                  strokeLinecap="round"
                />
              </svg>
              <FontAwesomeIcon className="relative text-sm" icon={paused ? faPlay : faPause} />
            </button>
            <CarouselArrow dir="prev" onClick={() => { pause(); scrollBy(-1); }} disabled={atStart} />
            <CarouselArrow dir="next" onClick={() => { pause(); scrollBy(1); }} disabled={atEnd} />
            <Link
              to="/trips"
              className="px-6 py-3 rounded-full border border-slate-200 hover:border-brand hover:text-brand bg-white font-semibold text-xs tracking-wider uppercase transition-all duration-300 self-start sm:self-auto hover:-translate-y-0.5"
            >
              View All Trips <FontAwesomeIcon icon={faArrowRight} className="ml-1" />
            </Link>
          </div>
        </div>

        {/* ── Region tabs (same as menu) ── */}
        {!loading && tabs.length > 1 && (
          <div className="flex items-center gap-2 flex-wrap mb-8 overflow-x-auto no-scrollbar pb-1">
            {tabs.map((tab) => {
              const cfg   = REGION_CONFIG[tab] || DEFAULT_COLORS;
              const count = tab === 'All' ? items.length : items.filter((i) => i[tabKey] === tab).length;
              const isActive = tab === activeTab;
              return (
                <button
                  key={tab}
                  onClick={() => { setActiveTab(tab); setPaused(false); }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold flex-shrink-0 transition-all duration-200 ${
                    isActive
                      ? 'text-white shadow-md scale-105'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:scale-105'
                  }`}
                  style={isActive ? { background: `linear-gradient(135deg, ${cfg.from}, ${cfg.to})` } : {}}
                >
                  {tab !== 'All' && <RegionIcon region={tab} className="text-base" />}
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
            <FontAwesomeIcon icon={faLocationDot} className="text-3xl mb-3" />
            <p className="font-semibold text-slate-500">No destinations in {activeTab} yet</p>
          </div>
        ) : (
          <div
            key={activeTab}
            ref={scrollRef}
            onScroll={onScroll}
            onTouchStart={pause}
            onTouchEnd={resume}
            onFocus={pause}
            onBlur={resume}
            className="relative flex gap-6 overflow-x-auto no-scrollbar pb-4 -mx-6 px-6 scroll-smooth snap-x snap-proximity"
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
            <FontAwesomeIcon icon={faArrowLeft} className="mr-1" /> Scroll to explore more <FontAwesomeIcon icon={faArrowRight} className="ml-1" />
          </p>
        )}
      </div>
    </section>
  );
};

export default Destinations;