import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import logo from '../../assets/logo.png';
import DynamicMenu from './DynamicMenu';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="fixed top-0 w-full z-50 transition-all duration-300">
      {/* Top Utility Bar */}
      <div className="bg-gradient-to-r from-brand-800 via-brand-700 to-brand-800 text-slate-200 text-[11px] font-medium tracking-wider">
        <div className="max-w-7xl mx-auto px-6 py-2 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-sunrise-400 animate-pulse" />
              Tourism License: 2427
            </span>
            <span className="hidden md:inline text-slate-300 hover:text-white transition-colors duration-200 cursor-pointer">
              Top 15 Trips for 2026 - read more
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden md:inline text-slate-300">Free Travel Consultation</span>
            <span className="font-semibold text-white hover:text-sunrise-300 transition-colors duration-200">
              +977-9851221603
            </span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div
        className={`transition-all duration-300 border-b ${
          isScrolled
            ? 'bg-white/90 backdrop-blur-md shadow-premium border-slate-200/40 py-2.5'
            : 'bg-white/95 backdrop-blur-sm border-slate-100 py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative overflow-hidden rounded-xl bg-slate-50 p-1 transition-transform duration-300 group-hover:scale-105">
              <img src={logo} alt="Himtrail logo" className="w-10 h-10 object-contain" />
            </div>
            <div>
              <p className="font-display text-2xl font-semibold tracking-wide text-brand group-hover:text-brand-800 transition-colors duration-200">
                Himtrail
              </p>
              <p className="text-[9px] uppercase font-semibold tracking-[0.3em] text-slate-400">
                Travel & Treks
              </p>
            </div>
          </Link>

          {/* Dynamic Dropdown Menus */}
          <DynamicMenu />

          {/* Search & Dashboard CTA */}
          <div className="hidden xl:flex items-center gap-4">
            <div className="flex items-center border border-slate-200 hover:border-slate-300 focus-within:border-brand/50 focus-within:ring-2 focus-within:ring-brand/10 rounded-full px-3 py-1.5 w-60 bg-slate-50 transition-all duration-200">
              <input
                className="w-full text-xs bg-transparent outline-none text-slate-800 placeholder-slate-400"
                placeholder="I am looking for ..."
              />
              <span className="text-brand/70 font-semibold cursor-pointer select-none">⌕</span>
            </div>
            <Link
              to="/dashboard"
              className="px-5 py-2 rounded-full bg-brand text-white text-xs font-semibold tracking-wider uppercase transition-all duration-300 hover:bg-brand-600 hover:shadow-glow hover:-translate-y-0.5 active:translate-y-0"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
