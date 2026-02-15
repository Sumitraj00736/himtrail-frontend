import { Link } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { api } from '../services/api';

const fallbackCards = [
  {
    tag: "Traveler's Choice",
    title: 'Everest Base Camp Trek - 15 Days',
    duration: '15 Days',
    price: 'US$1,490',
    oldPrice: 'US$1,800',
    reviews: '82 Reviews',
    image:
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop',
  },
  {
    tag: 'Best Seller',
    title: 'Mount Everest Heli Tour',
    duration: '1 Days',
    price: 'US$1,390',
    oldPrice: 'US$1,500',
    reviews: '5 Reviews',
    image:
      'https://images.unsplash.com/photo-1500043357865-c6b8827edf39?q=80&w=1200&auto=format&fit=crop',
  },
  {
    tag: "Traveler's Choice",
    title: 'Kilimanjaro Climbing via Machame Route',
    duration: '9 Days',
    price: 'US$2,290',
    oldPrice: 'US$2,500',
    reviews: '7 Reviews',
    image:
      'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?q=80&w=1200&auto=format&fit=crop',
  },
];

const BestSellers = () => {
  const [cards, setCards] = useState([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    api.get('/content/best-sellers').then((res) => {
      setCards(res.data.data?.length ? res.data.data : fallbackCards);
    });
  }, []);

  useEffect(() => {
    if (cards.length <= 3) return undefined;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % cards.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [cards]);

  const visible = useMemo(() => {
    if (cards.length <= 3) return cards;
    return [0, 1, 2].map((offset) => cards[(index + offset) % cards.length]);
  }, [cards, index]);

  return (
    <section className="bg-slate-50">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#e6efff] text-[#243b75] flex items-center justify-center text-lg font-bold">
              TOP
            </div>
            <div>
              <p className="text-[#243b75] text-2xl font-semibold">BEST SELLERS</p>
              <p className="text-sm text-slate-500">Travelers' Choice</p>
            </div>
          </div>
          <Link
            to="/trips"
            className="px-6 py-3 rounded-full border border-sunrise-500 text-sunrise-500 font-semibold"
          >
            Explore more →
          </Link>
        </div>

        <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visible.map((card) => (
            <div key={card.title} className="bg-white rounded-2xl shadow-sm border overflow-hidden">
              <div className="relative">
                <img src={card.image} alt={card.title} className="h-44 w-full object-cover" />
                <span className="absolute top-3 left-3 bg-[#243b75] text-white text-xs px-3 py-1 rounded-full">
                  {card.tag}
                </span>
              </div>
              <div className="p-4">
                <div className="text-sunrise-500 font-semibold">
                  {card.price} <span className="text-slate-400 line-through text-sm">{card.oldPrice}</span>
                </div>
                <div className="text-sunrise-500 text-sm mt-1">★★★★★ <span className="text-slate-500">{card.reviews}</span></div>
                <div className="mt-3 text-sm text-slate-500">Duration: {card.duration}</div>
                <div className="mt-2 font-semibold text-[#243b75]">{card.title}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex items-center justify-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#243b75]" />
          <span className="w-3 h-3 rounded-full border border-[#243b75]" />
          <span className="w-3 h-3 rounded-full border border-[#243b75]" />
        </div>
      </div>
    </section>
  );
};

export default BestSellers;
