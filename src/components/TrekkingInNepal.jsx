import { Link } from 'react-router-dom';
import { useEffect, useMemo, useState, useCallback } from 'react';
import { api } from '../services/api';
import TripCard from './TripCard';
import { CarouselArrow, CarouselDots } from './ScrollCarousel';

const CARDS_PER_PAGE = 3;

const fallbackCards = [
  { tag: 'Classic Route', title: 'Everest Base Camp Trek - 15 Days', duration: '15 Days', price: 'US$1,490', oldPrice: 'US$1,800', reviews: '82 Reviews', image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1200&auto=format&fit=crop' },
  { tag: 'Remote Wilderness', title: 'Manaslu Circuit Trek - 14 Days', duration: '14 Days', price: 'US$1,190', oldPrice: 'US$1,350', reviews: '34 Reviews', image: 'https://images.unsplash.com/photo-1544735716-166f3636f4c4?q=80&w=1200&auto=format&fit=crop' },
  { tag: 'Scenic Trail', title: 'Annapurna Base Camp - 10 Days', duration: '10 Days', price: 'US$990', oldPrice: 'US$1,150', reviews: '115 Reviews', image: 'https://images.unsplash.com/photo-1500043357865-c6b8827edf39?q=80&w=1200&auto=format&fit=crop' },
];

const TrekkingInNepal = () => {
  const [cards, setCards] = useState([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    api.get('/content/trekking-in-nepal')
      .then((res) => setCards(res.data.data?.length ? res.data.data : fallbackCards))
      .catch(() => setCards(fallbackCards));
  }, []);

  const totalPages = Math.ceil(cards.length / CARDS_PER_PAGE);

  const prev = useCallback(() => setIndex((i) => (i - 1 + totalPages) % totalPages), [totalPages]);
  const next = useCallback(() => setIndex((i) => (i + 1) % totalPages), [totalPages]);

  // Auto-advance
  useEffect(() => {
    if (totalPages <= 1) return;
    const t = setInterval(next, 5000);
    return () => clearInterval(t);
  }, [totalPages, next]);

  const visible = useMemo(() =>
    cards.slice(index * CARDS_PER_PAGE, index * CARDS_PER_PAGE + CARDS_PER_PAGE),
    [cards, index]);

  return (
    <section className="reveal reveal-up bg-white">
      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-brand/5 text-brand flex items-center justify-center text-xl border border-brand/10">🏔️</div>
            <div>
              <p className="text-xs uppercase font-bold tracking-[0.25em] text-sunrise-500">HIMALAYAN TRAILS</p>
              <h2 className="section-title mt-1 text-slate-800 font-display">Trekking in Nepal</h2>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {totalPages > 1 && (
              <>
                <CarouselArrow dir="prev" onClick={prev} disabled={false} />
                <CarouselArrow dir="next" onClick={next} disabled={false} />
              </>
            )}
            <Link to="/trips" className="px-6 py-3 rounded-full border border-slate-200 hover:border-brand hover:text-brand bg-white font-semibold text-xs tracking-wider uppercase transition-all duration-300 hover:-translate-y-0.5">
              View All Treks →
            </Link>
          </div>
        </div>

        <div
          key={index}
          className="mt-10 grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          style={{ animation: 'slideInRight 0.4s cubic-bezier(.16,1,.3,1)' }}
        >
          {visible.map((card, i) => <TripCard key={card._id || card.title || i} trip={card} />)}
        </div>

        {totalPages > 1 && (
          <CarouselDots total={totalPages} current={index} onSelect={setIndex} />
        )}
      </div>
    </section>
  );
};

export default TrekkingInNepal;
