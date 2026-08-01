import { useRef, useState, useEffect, useCallback } from 'react';
import { FontAwesomeIcon, faArrowLeft, faArrowRight } from '../utils/homeIcons';

/* ─── Arrow button ────────────────────────────────────────────── */
export const CarouselArrow = ({ dir, onClick, disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    aria-label={dir === 'prev' ? 'Previous' : 'Next'}
    className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-200 flex-shrink-0 select-none ${
      disabled
        ? 'bg-slate-100 border-slate-200 text-slate-300 cursor-not-allowed'
        : 'bg-white border-slate-200 text-slate-600 hover:bg-brand hover:border-brand hover:text-white shadow-sm hover:shadow-md active:scale-95'
    }`}
  >
    <FontAwesomeIcon icon={dir === 'prev' ? faArrowLeft : faArrowRight} />
  </button>
);

/* ─── Dot pagination ──────────────────────────────────────────── */
export const CarouselDots = ({ total, current, onSelect }) => (
  <div className="flex items-center justify-center gap-2 mt-8">
    {Array.from({ length: total }).map((_, i) => (
      <button
        key={i}
        onClick={() => onSelect(i)}
        aria-label={`Go to page ${i + 1}`}
        className={`transition-all duration-400 rounded-full h-2 ${
          i === current ? 'w-6 bg-brand' : 'w-2 bg-slate-200 hover:bg-slate-300'
        }`}
      />
    ))}
  </div>
);

/**
 * useSmoothCarousel – CSS-transform based infinite slider.
 *
 * All cards are rendered once inside a flex row.
 * Sliding is done purely via `transform: translateX` + CSS transition,
 * so there is ZERO re-mount and ZERO jerk.
 *
 * @param {number} totalItems  – total number of cards
 * @param {number} perPage     – cards visible at once (desktop)
 * @param {number} autoMs      – auto-advance interval in ms (0 = off)
 */
export const useSmoothCarousel = (totalItems, perPage = 3, autoMs = 5000) => {
  const [page, setPage] = useState(0);
  const totalPages = Math.max(1, Math.ceil(totalItems / perPage));
  const timerRef = useRef(null);

  const resetTimer = useCallback(() => {
    if (!autoMs) return;
    clearInterval(timerRef.current);
    timerRef.current = setInterval(
      () => setPage((p) => (p + 1) % totalPages),
      autoMs
    );
  }, [autoMs, totalPages]);

  useEffect(() => {
    resetTimer();
    return () => clearInterval(timerRef.current);
  }, [resetTimer]);

  const prev = useCallback(() => {
    setPage((p) => (p - 1 + totalPages) % totalPages);
    resetTimer();
  }, [totalPages, resetTimer]);

  const next = useCallback(() => {
    setPage((p) => (p + 1) % totalPages);
    resetTimer();
  }, [totalPages, resetTimer]);

  const goTo = useCallback((i) => {
    setPage(i);
    resetTimer();
  }, [resetTimer]);

  /* translateX percentage: each page is `100 / totalPages` wide */
  const translateX = `-${page * (100 / totalPages)}%`;

  return { page, totalPages, prev, next, goTo, translateX };
};
