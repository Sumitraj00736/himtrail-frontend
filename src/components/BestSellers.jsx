import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { api } from '../services/api';
import TripCard from './TripCard';
import { CarouselArrow, CarouselDots, useSmoothCarousel } from './ScrollCarousel';

const CARDS_PER_PAGE = 3;

const fallbackCards = [
  { tag: "Traveler's Choice", title: 'Everest Base Camp Trek - 15 Days', duration: '15 Days', price: 'US$1,490', oldPrice: 'US$1,800', reviews: '82 Reviews', image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop' },
  { tag: 'Best Seller', title: 'Mount Everest Heli Tour', duration: '1 Days', price: 'US$1,390', oldPrice: 'US$1,500', reviews: '5 Reviews', image: 'https://images.unsplash.com/photo-1500043357865-c6b8827edf39?q=80&w=1200&auto=format&fit=crop' },
  { tag: "Traveler's Choice", title: 'Kilimanjaro Climbing via Machame Route', duration: '9 Days', price: 'US$2,290', oldPrice: 'US$2,500', reviews: '7 Reviews', image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?q=80&w=1200&auto=format&fit=crop' },
];

const BestSellers = () => {
  const [cards, setCards] = useState([]);

  useEffect(() => {
    api.get('/content/best-sellers')
      .then((res) => setCards(res.data.data?.length ? res.data.data : fallbackCards))
      .catch(() => setCards(fallbackCards));
  }, []);

  const { page, totalPages, prev, next, goTo, translateX } = useSmoothCarousel(
    cards.length, CARDS_PER_PAGE, 5000
  );

  return (
    <section className="reveal reveal-up bg-[#f8fafc]">
      <div className="max-w-6xl mx-auto px-6 py-20">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-brand/5 text-brand flex items-center justify-center text-xs font-bold border border-brand/10">BEST</div>
            <div>
              <p className="text-xs uppercase font-bold tracking-[0.25em] text-sunrise-500">TRAVELERS' CHOICE</p>
              <h2 className="section-title mt-1 text-slate-800 font-display">Top Best Sellers</h2>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {totalPages > 1 && (
              <>
                <CarouselArrow dir="prev" onClick={prev} />
                <CarouselArrow dir="next" onClick={next} />
              </>
            )}
            <Link to="/trips" className="px-6 py-3 rounded-full border border-slate-200 hover:border-brand hover:text-brand bg-white font-semibold text-xs tracking-wider uppercase transition-all duration-300 hover:-translate-y-0.5">
              Explore More →
            </Link>
          </div>
        </div>

        {/* Slider viewport */}
        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-700 ease-[cubic-bezier(.16,1,.3,1)]"
            style={{ transform: `translateX(${translateX})`, width: `${totalPages * 100}%` }}
          >
            {Array.from({ length: totalPages }).map((_, pageIdx) => (
              <div
                key={pageIdx}
                className="grid gap-8"
                style={{
                  gridTemplateColumns: `repeat(${CARDS_PER_PAGE}, 1fr)`,
                  width: `${100 / totalPages}%`,
                  flexShrink: 0,
                }}
              >
                {cards.slice(pageIdx * CARDS_PER_PAGE, pageIdx * CARDS_PER_PAGE + CARDS_PER_PAGE).map((card, i) => (
                  <TripCard key={card._id || card.title || i} trip={card} />
                ))}
              </div>
            ))}
          </div>
        </div>

        {totalPages > 1 && (
          <CarouselDots total={totalPages} current={page} onSelect={goTo} />
        )}
      </div>
    </section>
  );
};

export default BestSellers;
