import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import logo from '../../assets/logo.png';
import DynamicMenu from './DynamicMenu';
import { company } from '../../config/company';

const Navbar = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const searchRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!searchOpen) return undefined;
    const t = setTimeout(() => inputRef.current?.focus(), 220);
    return () => clearTimeout(t);
  }, [searchOpen]);

  useEffect(() => {
    if (!searchOpen) return undefined;
    const onDoc = (e) => {
      if (!searchRef.current?.contains(e.target)) setSearchOpen(false);
    };
    const onKey = (e) => {
      if (e.key === 'Escape') setSearchOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, [searchOpen]);

  const submitSearch = (e) => {
    e?.preventDefault();
    const q = query.trim();
    if (!q) return;
    setSearchOpen(false);
    navigate(`/trips?q=${encodeURIComponent(q)}`);
  };

  return (
    <header className="fixed top-0 w-full z-50 transition-all duration-300">
      {/* Top Utility Bar */}
      <div className="bg-gradient-to-r from-brand-800 via-brand-700 to-brand-800 text-slate-200 text-[11px] font-medium tracking-wider">
        <div className="max-w-7xl mx-auto px-6 py-2 flex flex-col md:flex-row md:items-center md:justify-between gap-1 md:gap-6">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
            <span className="flex items-center gap-2 font-semibold text-white">
              <span className="w-1.5 h-1.5 rounded-full bg-sunrise-400 animate-pulse" />
              {company.name}
            </span>
            <span className="text-slate-200">
              Reg. No: <span className="text-white font-semibold">{company.regNo}</span>
            </span>
            <span className="text-slate-200">
              VAT No: <span className="text-white font-semibold">{company.vatNo}</span>
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1 md:justify-end">
            <span className="text-slate-200">
              {company.address}, {company.country}
            </span>
            <span className="font-semibold text-white hover:text-sunrise-300 transition-colors duration-200">
              {company.mobile}
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
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between gap-4">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-3 group flex-shrink-0">
            <div className="relative overflow-hidden rounded-xl bg-slate-50 p-1 transition-transform duration-300 group-hover:scale-105">
              <img src={logo} alt="Himtrail logo" className="w-10 h-10 object-contain" />
            </div>
            <div>
              <p className="font-display text-2xl font-semibold tracking-wide text-brand group-hover:text-brand-800 transition-colors duration-200">
                {company.shortName}
              </p>
              <p className="text-[9px] uppercase font-semibold tracking-[0.3em] text-slate-400">
                Travel & Treks
              </p>
            </div>
          </Link>

          {/* Dynamic Dropdown Menus */}
          <DynamicMenu />

          {/* Search & Dashboard CTA */}
          <div className="hidden xl:flex items-center gap-3 flex-shrink-0">
            <div ref={searchRef} className="flex items-center h-10">
              <form
                onSubmit={submitSearch}
                className={`h-10 flex items-center overflow-hidden rounded-full bg-slate-50 border border-slate-200 transition-all ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  searchOpen
                    ? 'w-56 max-w-56 pl-4 pr-2 mr-2 opacity-100'
                    : 'w-0 max-w-0 pl-0 pr-0 mr-0 border-transparent opacity-0 pointer-events-none'
                }`}
                style={{ transitionDuration: '350ms' }}
              >
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full min-w-0 text-xs bg-transparent outline-none ring-0 border-0 focus:outline-none focus:ring-0 text-slate-800 placeholder-slate-400"
                  placeholder="I am looking for..."
                  tabIndex={searchOpen ? 0 : -1}
                />
                {query && searchOpen && (
                  <button
                    type="button"
                    onClick={() => {
                      setQuery('');
                      inputRef.current?.focus();
                    }}
                    className="flex-shrink-0 w-6 h-6 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200/80 text-sm leading-none"
                    aria-label="Clear search"
                  >
                    ×
                  </button>
                )}
              </form>

              <button
                type="button"
                onClick={() => setSearchOpen((v) => !v)}
                className={`nav-search-btn relative w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                  searchOpen
                    ? 'bg-slate-800 text-white is-open'
                    : 'bg-slate-50 text-brand border border-slate-200 hover:bg-slate-100'
                }`}
                aria-label={searchOpen ? 'Close search' : 'Open search'}
                aria-expanded={searchOpen}
              >
                {!searchOpen && (
                  <span className="nav-search-pulse pointer-events-none absolute inset-0 rounded-full border border-brand/30" />
                )}
                <span
                  className={`nav-search-icon relative z-[1] text-base leading-none inline-block ${
                    searchOpen ? 'is-close' : ''
                  }`}
                >
                  {searchOpen ? '✕' : '⌕'}
                </span>
              </button>
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
