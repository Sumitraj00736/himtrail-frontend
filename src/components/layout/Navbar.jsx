import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import logo from "../../assets/logo.png";
import DynamicMenu from "./DynamicMenu";
import { company } from "../../config/company";
import { api } from "../../services/api";

const Navbar = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const searchRef = useRef(null);
  const mobileSearchRef = useRef(null);
  const inputRef = useRef(null);
  const [suggestions, setSuggestions] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightedSuggestion, setHighlightedSuggestion] = useState(-1);

  useEffect(() => {
    if (!searchOpen) return;

    const q = query.trim();

    if (q.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const controller = new AbortController();

    const timer = setTimeout(async () => {
      try {
        setLoadingSuggestions(true);

        const res = await api.get(`/trips?q=${encodeURIComponent(q)}`, {
          signal: controller.signal,
        });

        setSuggestions(res.data.data || []);
        setShowSuggestions(true);
        setHighlightedSuggestion(-1);
      } catch (err) {
        if (err.name !== "CanceledError" && err.name !== "AbortError") {
          console.error("Search suggestions request failed:", err);
        }
      } finally {
        setLoadingSuggestions(false);
      }
    }, 500);

    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [query, searchOpen]);

  const selectSuggestion = (item) => {
    setSearchOpen(false);
    setShowSuggestions(false);
    setSuggestions([]);
    setQuery("");
    navigate(`/trips/${item.slug}`);
  };

  const handleSuggestionKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedSuggestion((current) => (current + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedSuggestion((current) => (current - 1 + suggestions.length) % suggestions.length);
    } else if (e.key === "Enter" && highlightedSuggestion >= 0) {
      e.preventDefault();
      selectSuggestion(suggestions[highlightedSuggestion]);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!searchOpen) return undefined;
    const t = setTimeout(() => {
      if (window.matchMedia("(min-width: 1280px)").matches) {
        inputRef.current?.focus();
      }
    }, 220);
    return () => clearTimeout(t);
  }, [searchOpen]);

  useEffect(() => {
    if (!searchOpen) return undefined;
    const onDoc = (e) => {
      if (!searchRef.current?.contains(e.target) && !mobileSearchRef.current?.contains(e.target)) {
        setSearchOpen(false);
        setShowSuggestions(false);
      }
    };
    const onKey = (e) => {
      if (e.key === "Escape") setSearchOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [searchOpen]);

  const submitSearch = (e) => {
    e?.preventDefault();
    const q = query.trim();
    if (!q) return;
    setSearchOpen(false);
    setShowSuggestions(false);
    setSuggestions([]);
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
              Reg. No:{" "}
              <span className="text-white font-semibold">{company.regNo}</span>
            </span>
            {/* <span className="text-slate-200">
              VAT No: <span className="text-white font-semibold">{company.vatNo}</span>
            </span> */}
          </div>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1 md:justify-end">
            <span className="text-slate-200">
              {company.address}, {company.country}
            </span>
            <span className="font-semibold text-white hover:text-sunrise-300 transition-colors duration-200">
              +977 {company.mobile}
            </span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div
        data-main-nav
        className={`relative transition-all duration-300 border-b ${
          isScrolled
            ? "bg-white/90 backdrop-blur-md shadow-premium border-slate-200/40 py-2.5"
            : "bg-white/95 backdrop-blur-sm border-slate-100 py-4"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between gap-4">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-3 group flex-shrink-0">
            <div className="relative overflow-hidden rounded-xl bg-slate-50 p-1 transition-transform duration-300 group-hover:scale-105">
              <img
                src={logo}
                alt="Him-Trail logo"
                className="w-10 h-10 object-contain"
              />
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

          {/* Navigation and mobile controls */}
          <div className="flex items-center gap-2">
            <DynamicMenu />

            {/* Mobile Search */}
            <div ref={mobileSearchRef} className="xl:hidden relative flex items-center">
            <button
              type="button"
              onClick={() => setSearchOpen((v) => !v)}
              className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all duration-200 ${
                searchOpen
                  ? "bg-slate-800 text-white border-slate-800"
                  : "bg-white text-brand border-slate-200 shadow-sm hover:border-brand/30"
              }`}
              aria-label={searchOpen ? "Close search" : "Open search"}
              aria-expanded={searchOpen}
            >
              <span className="text-base leading-none">{searchOpen ? "✕" : "⌕"}</span>
            </button>

            {searchOpen && (
              <form
                onSubmit={submitSearch}
                className="absolute top-full right-0 mt-3 w-[calc(100vw-2rem)] max-w-96 rounded-2xl border border-slate-200 bg-white p-3 shadow-xl z-[1000]"
              >
                <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
                  <input
                    autoFocus
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleSuggestionKeyDown}
                    className="w-full min-w-0 bg-transparent text-sm text-slate-800 outline-none placeholder-slate-400"
                    placeholder="Search trek name..."
                    aria-label="Search trek name"
                  />
                  {query && (
                    <button
                      type="button"
                      onClick={() => setQuery("")}
                      className="flex-shrink-0 text-slate-400 hover:text-slate-700"
                      aria-label="Clear search"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {showSuggestions && (
                  <div className="mt-2 max-h-80 overflow-y-auto rounded-xl border border-slate-200">
                    {loadingSuggestions && (
                      <div className="flex items-center gap-2 px-4 py-4 text-sm text-slate-400">
                        <span className="w-3.5 h-3.5 rounded-full border-2 border-brand/20 border-t-brand animate-spin" />
                        Searching treks...
                      </div>
                    )}
                    {!loadingSuggestions && suggestions.length > 0 && suggestions.map((item) => (
                      <Link
                        key={item._id}
                        to={`/trips/${item.slug}`}
                        onClick={(e) => {
                          e.preventDefault();
                          selectSuggestion(item);
                        }}
                        onMouseEnter={() => setHighlightedSuggestion(suggestions.indexOf(item))}
                        className={`flex items-center gap-3 border-b border-slate-100 px-4 py-3 last:border-b-0 transition-colors ${highlightedSuggestion === suggestions.indexOf(item) ? "bg-brand-50" : "hover:bg-slate-50"}`}
                      >
                        {item.heroImage ? (
                          <img src={item.heroImage} alt="" className="h-11 w-14 shrink-0 rounded-lg object-cover" />
                        ) : (
                          <div className="h-11 w-14 shrink-0 rounded-lg bg-brand/10" />
                        )}
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-slate-800">{item.title}</p>
                          <p className="mt-0.5 truncate text-xs text-slate-500">
                            {[item.destination || item.region, item.category].filter(Boolean).join(" · ") || "Adventure trip"}
                          </p>
                        </div>
                      </Link>
                    ))}
                    {!loadingSuggestions && query.length >= 2 && suggestions.length === 0 && (
                      <div className="px-4 py-4 text-sm text-slate-400">No matching treks found. Try a destination or activity.</div>
                    )}
                  </div>
                )}
              </form>
            )}
            </div>
          </div>

          {/* Search & Dashboard CTA */}
          <div className="hidden xl:flex items-center gap-3 flex-shrink-0">
            <div ref={searchRef} className="relative flex items-center h-10">
              <form
                onSubmit={submitSearch}
                className={`h-10 flex items-center overflow-hidden rounded-full bg-slate-50 border border-slate-200 transition-all ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  searchOpen
                    ? "w-56 max-w-56 pl-4 pr-2 mr-2 opacity-100"
                    : "w-0 max-w-0 pl-0 pr-0 mr-0 border-transparent opacity-0 pointer-events-none"
                }`}
                style={{ transitionDuration: "350ms" }}
              >
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleSuggestionKeyDown}
                  className="w-full min-w-0 text-xs bg-transparent outline-none ring-0 border-0 focus:outline-none focus:ring-0 text-slate-800 placeholder-slate-400"
                  placeholder="I am looking for..."
                  tabIndex={searchOpen ? 0 : -1}
                />
                {query && searchOpen && (
                  <button
                    type="button"
                    onClick={() => {
                      setQuery("");
                      inputRef.current?.focus();
                    }}
                    className="flex-shrink-0 w-6 h-6 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200/80 text-sm leading-none"
                    aria-label="Clear search"
                  >
                    ×
                  </button>
                )}
              </form>
              {searchOpen && showSuggestions && (
                  <div className="absolute top-full left-0 mt-2 w-80 max-h-96 overflow-y-auto bg-white rounded-2xl shadow-xl border border-slate-200 z-[999]">
                    {!loadingSuggestions && suggestions.length > 0 && (
                      <div className="px-4 py-2 border-b border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        {suggestions.length} matching trek{suggestions.length === 1 ? "" : "s"}
                      </div>
                    )}
                  {loadingSuggestions && (
                      <div className="flex items-center gap-2 px-4 py-4 text-sm text-slate-400">
                        <span className="w-3.5 h-3.5 rounded-full border-2 border-brand/20 border-t-brand animate-spin" />
                        Searching treks...
                      </div>
                  )}

                  {!loadingSuggestions &&
                    suggestions.length > 0 &&
                    suggestions.map((item) => (
                      <Link
                        key={item._id}
                        to={`/trips/${item.slug}`}
                        onClick={(e) => {
                          e.preventDefault();
                          selectSuggestion(item);
                        }}
                        onMouseEnter={() => setHighlightedSuggestion(suggestions.indexOf(item))}
                        className={`flex items-center gap-3 px-4 py-3 transition-colors ${highlightedSuggestion === suggestions.indexOf(item) ? "bg-brand-50" : "hover:bg-slate-50"}`}
                      >
                        {item.heroImage ? (
                          <img src={item.heroImage} alt="" className="h-11 w-14 shrink-0 rounded-lg object-cover" />
                        ) : (
                          <div className="h-11 w-14 shrink-0 rounded-lg bg-brand/10" />
                        )}
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-slate-800">{item.title}</p>
                          <p className="mt-0.5 truncate text-xs text-slate-500">
                            {[item.destination || item.region, item.category].filter(Boolean).join(" · ") || "Adventure trip"}
                          </p>
                        </div>
                      </Link>
                    ))}

                  {!loadingSuggestions &&
                    query.length >= 2 &&
                    suggestions.length === 0 && (
                      <div className="px-4 py-4 text-sm text-slate-400">No matching treks found. Try a destination or activity.</div>
                    )}
                </div>
              )}

              <button
                type="button"
                onClick={() => setSearchOpen((v) => !v)}
                className={`nav-search-btn relative w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                  searchOpen
                    ? "bg-slate-800 text-white is-open"
                    : "bg-slate-50 text-brand border border-slate-200 hover:bg-slate-100"
                }`}
                aria-label={searchOpen ? "Close search" : "Open search"}
                aria-expanded={searchOpen}
              >
                {!searchOpen && (
                  <span className="nav-search-pulse pointer-events-none absolute inset-0 rounded-full border border-brand/30" />
                )}
                <span
                  className={`nav-search-icon relative z-[1] text-base leading-none inline-block ${
                    searchOpen ? "is-close" : ""
                  }`}
                >
                  {searchOpen ? "✕" : "⌕"}
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