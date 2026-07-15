import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { api } from '../services/api';

const socialIcons = {
  facebook: (
    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
      <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
    </svg>
  ),
  instagram: (
    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  ),
  linkedin: (
    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
    </svg>
  ),
  twitter: (
    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
    </svg>
  ),
};

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

const TeamSection = () => {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollContainerRef = useRef(null);

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
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -340, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 340, behavior: 'smooth' });
    }
  };

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
            <button
              onClick={scrollLeft}
              className="w-11 h-11 rounded-full border border-slate-200 hover:border-brand/40 bg-white text-slate-600 hover:text-brand flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 shadow-sm"
              aria-label="Scroll left"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={scrollRight}
              className="w-11 h-11 rounded-full border border-slate-200 hover:border-brand/40 bg-white text-slate-600 hover:text-brand flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 shadow-sm"
              aria-label="Scroll right"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
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
                  {member.bio && (
                    <p className="text-slate-500 text-xs mt-3.5 leading-relaxed line-clamp-3 whitespace-normal">
                      {member.bio}
                    </p>
                  )}
                </div>

                {/* Social Links */}
                {member.socialLinks && Object.values(member.socialLinks).some(Boolean) && (
                  <div className="flex items-center gap-3 mt-6 pt-4 border-t border-slate-50">
                    {Object.entries(member.socialLinks).map(([platform, url]) => {
                      if (!url) return null;
                      return (
                        <a
                          key={platform}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-8 h-8 rounded-full bg-slate-50 hover:bg-brand hover:text-white text-slate-400 flex items-center justify-center transition-all duration-300 hover:scale-110"
                          title={`${member.name} on ${platform}`}
                        >
                          {socialIcons[platform]}
                        </a>
                      );
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
};

export default TeamSection;
