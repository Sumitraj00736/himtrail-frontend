import { useEffect, useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { api } from '../services/api';
import { buildWhatsAppUrl } from '../config/company';
import { FontAwesomeIcon, SOCIAL_ICONS, faChevronLeft, faChevronRight, faPause, faPlay, faWhatsapp } from '../utils/homeIcons';

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: 50 },
  show: {
    opacity: 1,
    x: 0,
    transition: {
      type: 'spring',
      stiffness: 80,
      damping: 15,
    },
  },
};

const AUTO_SLIDE_MS = 3500;

const TeamSection = () => {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const scrollContainerRef = useRef(null);
  const intervalRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    api
      .get('/content/team')
      .then((res) => {
        setTeam(res.data.data || []);
      })
      .catch((err) => {
        console.error('Error fetching team members:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const scrollLeft = () => {
    setPaused(true);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -340, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    setPaused(true);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 340, behavior: 'smooth' });
    }
  };

  /* Advance one card; loop back to the start once the end is reached */
  const advance = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const atRightEdge = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4;
    if (atRightEdge) {
      el.scrollTo({ left: 0, behavior: 'smooth' });
    } else {
      el.scrollBy({ left: 340, behavior: 'smooth' });
    }
  }, []);

  /* ── Auto-slide engine ──
     Runs on a fixed interval, paused on hover/touch/focus so visitors
     stay in control the moment they show interest, and paused while
     the section is scrolled out of view. */
  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el || paused || loading) return undefined;
    if (el.scrollWidth <= el.clientWidth + 4) return undefined; // nothing to slide

    intervalRef.current = setInterval(advance, AUTO_SLIDE_MS);
    return () => clearInterval(intervalRef.current);
  }, [advance, paused, loading, team]);

  /* Progress ring feeding the play/pause button */
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
  }, [paused, loading]);

  /* Pause when the carousel scrolls out of the viewport */
  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => setPaused((p) => (entry.isIntersecting ? p : true)),
      { threshold: 0.25 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [loading]);

  const pause = useCallback(() => setPaused(true), []);
  const resume = useCallback(() => setPaused(false), []);

  if (loading) {
    return (
      <section className="bg-slate-50 py-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <div className="w-12 h-12 border-4 border-brand/20 border-t-brand rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-500 font-medium">Loading our adventure guides...</p>
        </div>
      </section>
    );
  }

  if (team.length === 0) {
    return null; // Don't show the section if it is empty.
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="bg-slate-50 py-20 overflow-hidden"
    >
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-12">
          <div>
            <p className="text-xs uppercase font-bold tracking-[0.25em] text-sunrise-500">
              Meet the Experts
            </p>
            <h2 className="text-3xl md:text-4xl font-display font-semibold text-slate-800 mt-3 leading-tight">
              Our Passionate Team
            </h2>
            <div className="mt-4 h-1 w-16 bg-sunrise-500 rounded-full" />
            <p className="text-slate-500 text-sm mt-4 max-w-xl leading-relaxed">
              From safety-certified high-altitude guides to travel coordinators, our team is committed to delivering unforgettable, sustainable journeys.
            </p>
          </div>

          {/* Navigation Arrows */}
          <div className="flex items-center gap-3.5 self-start sm:self-auto">
            {/* Auto-play toggle */}
            <button
              onClick={() => setPaused((p) => !p)}
              aria-label={paused ? 'Resume autoplay' : 'Pause autoplay'}
              aria-pressed={!paused}
              className="relative w-11 h-11 rounded-full border border-slate-200 hover:border-brand/40 bg-white text-slate-500 hover:text-brand flex items-center justify-center transition-all duration-300 shadow-sm overflow-hidden"
            >
              <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 44 44">
                <circle cx="22" cy="22" r="19" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-100" />
                <circle
                  cx="22" cy="22" r="19" fill="none" stroke="currentColor" strokeWidth="2"
                  className="text-brand transition-none"
                  strokeDasharray={2 * Math.PI * 19}
                  strokeDashoffset={paused ? 2 * Math.PI * 19 : 2 * Math.PI * 19 * (1 - progress)}
                  strokeLinecap="round"
                />
              </svg>
              <FontAwesomeIcon className="relative text-sm" icon={paused ? faPlay : faPause} />
            </button>
            <button
              onClick={scrollLeft}
              className="w-11 h-11 rounded-full border border-slate-200 hover:border-brand/40 bg-white text-slate-600 hover:text-brand flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 shadow-sm"
              aria-label="Scroll left"
            >
              <FontAwesomeIcon icon={faChevronLeft} className="w-5 h-5" />
            </button>
            <button
              onClick={scrollRight}
              className="w-11 h-11 rounded-full border border-slate-200 hover:border-brand/40 bg-white text-slate-600 hover:text-brand flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 shadow-sm"
              aria-label="Scroll right"
            >
              <FontAwesomeIcon icon={faChevronRight} className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Team Scroll Container */}
        <motion.div
          ref={scrollContainerRef}
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-100px' }}
          onTouchStart={pause}
          onTouchEnd={resume}
          onFocus={pause}
          onBlur={resume}
          className="flex overflow-x-auto no-scrollbar gap-8 pb-6 snap-x snap-mandatory scroll-smooth px-1"
        >
          {team.map((member) => (
            <motion.div
              key={member._id}
              variants={itemVariants}
              className="w-[300px] flex-shrink-0 snap-start bg-white rounded-3xl overflow-hidden border border-slate-100/80 shadow-premium hover:shadow-premium-hover transition-all duration-300 transform hover:-translate-y-1.5 flex flex-col h-full group"
            >
              {/* Image Container */}
              <div className="relative h-64 w-full overflow-hidden bg-slate-100">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              {/* Bio Content */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-800 tracking-tight leading-tight">
                    {member.name}
                  </h3>
                  <p className="text-xs font-semibold text-brand-500 tracking-wide uppercase mt-1">
                    {member.role}
                  </p>
                  {(member.phoneCountryCode || member.phoneNumber) && (
                    <p className="text-[11px] text-slate-500 font-medium mt-2">
                      WhatsApp: {(member.phoneCountryCode || '').trim()} {(member.phoneNumber || '').trim()}
                    </p>
                  )}
                  {member.bio && (
                    <p className="text-slate-500 text-xs mt-3.5 leading-relaxed line-clamp-3 whitespace-normal">
                      {member.bio}
                    </p>
                  )}
                </div>

                <div className="mt-6 pt-4 border-t border-slate-50">
                  <div className="flex items-center gap-3">
                    {member.phoneCountryCode && member.phoneNumber && (
                      <a
                        href={buildWhatsAppUrl(member.phoneCountryCode, member.phoneNumber, `Hello ${member.name}`)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-8 h-8 rounded-full bg-slate-50 hover:bg-emerald-500 hover:text-white text-slate-400 flex items-center justify-center transition-all duration-300 hover:scale-110"
                        title={`Chat with ${member.name} on WhatsApp`}
                        aria-label={`Chat with ${member.name} on WhatsApp`}
                      >
                        <FontAwesomeIcon icon={faWhatsapp} className="w-4 h-4" />
                      </a>
                    )}

                    {member.socialLinks && Object.values(member.socialLinks).some(Boolean) &&
                      Object.entries(member.socialLinks).map(([platform, url]) => {
                        if (!url) return null;
                        return (
                          <a
                            key={platform}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-8 h-8 rounded-full bg-slate-50 hover:bg-brand hover:text-white text-slate-400 flex items-center justify-center transition-all duration-300 hover:scale-110"
                            title={`${member.name} on ${platform}`}
                            aria-label={`${member.name} on ${platform}`}
                          >
                            {SOCIAL_ICONS[platform] && <FontAwesomeIcon icon={SOCIAL_ICONS[platform]} />}
                          </a>
                        );
                      })}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
};

export default TeamSection;