import { Link } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { api } from '../services/api';
import TripCard from './TripCard';

const fallbackCards = [
  { tag: "Traveler's Choice", title: 'Everest Base Camp Trek - 15 Days', duration: '15 Days', price: 'US$1,490', oldPrice: 'US$1,800', reviews: '82 Reviews', image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop' },
  { tag: 'Best Seller', title: 'Mount Everest Heli Tour', duration: '1 Days', price: 'US$1,390', oldPrice: 'US$1,500', reviews: '5 Reviews', image: 'https://images.unsplash.com/photo-1500043357865-c6b8827edf39?q=80&w=1200&auto=format&fit=crop' },
  { tag: "Traveler's Choice", title: 'Kilimanjaro Climbing via Machame Route', duration: '9 Days', price: 'US$2,290', oldPrice: 'US$2,500', reviews: '7 Reviews', image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?q=80&w=1200&auto=format&fit=crop' },
];

const BestSellers = () => {
  const [cards, setCards] = useState([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    api.get('/content/best-sellers')
      .then((res) => {
        setCards(res.data.data?.length ? res.data.data : fallbackCards);
      })
      .catch(() => {
        setCards(fallbackCards);
      });
  }, []);

  useEffect(() => {
    if (cards.length <= 3) return undefined;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % cards.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [cards]);

  const visible = useMemo(() => {
    if (cards.length <= 3) return cards;
    return [0, 1, 2].map((offset) => cards[(index + offset) % cards.length]);
  }, [cards, index]);

  return (
    <section className="reveal reveal-up bg-[#f8fafc]">
      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-brand/5 text-brand flex items-center justify-center text-xs font-bold border border-brand/10">
              BEST
            </div>
            <div>
              <p className="text-xs uppercase font-bold tracking-[0.25em] text-sunrise-500">
                TRAVELERS' CHOICE
              </p>
              <h2 className="section-title mt-1 text-slate-800 font-display">Top Best Sellers</h2>
            </div>
          </div>
          <Link
            to="/trips"
            className="px-6 py-3 rounded-full border border-slate-200 hover:border-brand hover:text-brand bg-white font-semibold text-xs tracking-wider uppercase transition-all duration-300 self-start sm:self-auto hover:-translate-y-0.5"
          >
            Explore More →
          </Link>
        </div>

        <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {visible.map((card, i) => (
            <TripCard key={card._id || card.title || i} trip={card} />
          ))}
        </div>

        {cards.length > 3 && (
          <div className="mt-10 flex items-center justify-center gap-2">
            {cards.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                className={`transition-all duration-300 rounded-full h-2 ${
                  i === index ? 'w-6 bg-brand' : 'w-2 bg-slate-200 hover:bg-slate-300'
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default BestSellers;
