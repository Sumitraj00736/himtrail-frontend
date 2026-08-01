import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import TripCard from './TripCard';
import { CarouselArrow, CarouselDots, useSmoothCarousel } from './ScrollCarousel';

const CARDS_PER_PAGE = 3;

const fallbackFeatured = [
  { tag: 'Short Trek', title: 'Mardi Himal Trek - 9 Days', duration: '9 Days', price: 'US$790', oldPrice: 'US$1,190', reviews: '5 Reviews', image: 'https://images.unsplash.com/photo-1482192505345-5655af888cc4?q=80&w=1200&auto=format&fit=crop' },
  { tag: 'Ultimate Adventure', title: 'Mera Peak Expedition - 18 Days', duration: '18 Days', price: 'US$2,490', oldPrice: 'US$3,000', reviews: '11 Reviews', image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=1200&auto=format&fit=crop' },
  { tag: 'Footprint Special', title: 'Destination Wedding at EBC - 14 Days', duration: '14 Days', price: 'US$7,990', oldPrice: 'US$12,000', reviews: '2 Reviews', image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1200&auto=format&fit=crop' },
];

const FeaturedTrips = () => {
  const [cards, setCards] = useState([]);

  useEffect(() => {
    api.get('/content/featured-trips')
      .then((res) => setCards(res.data.data?.length ? res.data.data : fallbackFeatured))
      .catch(() => setCards(fallbackFeatured));
  }, []);

  const { page, totalPages, prev, next, goTo, translateX } = useSmoothCarousel(
    cards.length, CARDS_PER_PAGE, 5000
  );

  return (
    <section className="reveal reveal-up bg-white">
      <div className="max-w-6xl mx-auto px-6 py-20">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-brand/5 text-brand flex items-center justify-center text-xl border border-brand/10">⭐</div>
            <div>
              <p className="text-xs uppercase font-bold tracking-[0.25em] text-sunrise-500">OUR FEATURED TRIPS 2026</p>
              <h2 className="section-title mt-1 text-slate-800 font-display">Special Adventure Offers</h2>
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
              View All Trips →
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
                  paddingRight: pageIdx < totalPages - 1 ? '0' : '0',
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

export default FeaturedTrips;
