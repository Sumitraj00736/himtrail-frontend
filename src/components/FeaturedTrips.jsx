import { useEffect, useMemo, useState } from 'react';
import { api } from '../services/api';

const fallbackFeatured = [
  {
    tag: 'Short Trek',
    title: 'Mardi Himal Trek - 9 Days',
    duration: '9 Days',
    price: 'US$790',
    oldPrice: 'US$1,190',
    reviews: '5 Reviews',
    image:
      'https://images.unsplash.com/photo-1482192505345-5655af888cc4?q=80&w=1200&auto=format&fit=crop',
  },
  {
    tag: 'Ultimate Adventure',
    title: 'Mera Peak Expedition - 18 Days',
    duration: '18 Days',
    price: 'US$2,490',
    oldPrice: 'US$3,000',
    reviews: '11 Reviews',
    image:
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=1200&auto=format&fit=crop',
  },
  {
    tag: 'Footprint Special',
    title: 'Destination Wedding at EBC - 14 Days',
    duration: '14 Days',
    price: 'US$7,990',
    oldPrice: 'US$12,000',
    reviews: '2 Reviews',
    image:
      'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1200&auto=format&fit=crop',
  },
];

const FeaturedTrips = () => {
  const [cards, setCards] = useState([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    api.get('/content/featured-trips').then((res) => {
      setCards(res.data.data?.length ? res.data.data : fallbackFeatured);
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
    <section>
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center">
          <p className="text-[#243b75] text-2xl font-semibold">OUR FEATURED TRIPS 2026</p>
          <p className="text-slate-500 text-sm">Popular tours and trip packages with special deals</p>
        </div>
        <div className="mt-10 grid md:grid-cols-3 gap-6">
          {visible.map((card) => (
            <div key={card.title} className="bg-white rounded-2xl shadow-sm border overflow-hidden">
              <div className="relative">
                <img src={card.image} alt={card.title} className="h-48 w-full object-cover" />
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
      </div>
    </section>
  );
};

export default FeaturedTrips;
