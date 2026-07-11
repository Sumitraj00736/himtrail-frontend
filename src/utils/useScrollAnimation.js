import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const useScrollAnimation = () => {
  const location = useLocation();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
            // Unobserve after showing so animation runs only once
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.05,
        rootMargin: '0px 0px -60px 0px',
      }
    );

    // Dynamic delay mapping based on dataset or order
    const elements = document.querySelectorAll('.reveal');
    elements.forEach((el) => {
      // Add staggered delay if not already set
      if (el.classList.contains('stagger') && !el.style.transitionDelay) {
        const parent = el.parentElement;
        const siblings = Array.from(parent?.children || []).filter(c => c.classList.contains('reveal'));
        const sibIndex = siblings.indexOf(el);
        if (sibIndex !== -1) {
          el.style.transitionDelay = `${sibIndex * 0.1}s`;
        }
      }
      observer.observe(el);
    });

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, [location.pathname]); // Re-observe when path changes
};
