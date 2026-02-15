import { useEffect, useState } from 'react';

const useCountdown = (targetDate) => {
  const [remaining, setRemaining] = useState('');

  useEffect(() => {
    const target = new Date(targetDate).getTime();
    const interval = setInterval(() => {
      const now = Date.now();
      const diff = Math.max(target - now, 0);
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      setRemaining(`${days}d ${hours}h`);
    }, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  return remaining;
};

const DepartingSoon = () => {
  const countdown = useCountdown('2026-03-01T09:00:00');

  return (
    <section className="max-w-6xl mx-auto px-6 py-16">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-forest-600">
            Departing Soon
          </p>
          <h2 className="section-title mt-3">Guaranteed Spring Departures</h2>
        </div>
        <span className="px-4 py-2 bg-sunrise-200 rounded-full text-sm">
          Countdown: {countdown}
        </span>
      </div>
      <div className="mt-8 grid md:grid-cols-3 gap-6">
        {[
          {
            title: 'Everest Base Camp',
            date: 'Mar 1, 2026',
            badge: 'Guaranteed',
          },
          {
            title: 'Annapurna Circuit',
            date: 'Mar 10, 2026',
            badge: 'Limited Spots',
          },
          {
            title: 'Kilimanjaro Summit',
            date: 'Mar 18, 2026',
            badge: 'Guaranteed',
          },
        ].map((trip) => (
          <div key={trip.title} className="bg-white rounded-2xl p-5 border">
            <p className="text-xs uppercase tracking-[0.2em] text-forest-600">
              {trip.date}
            </p>
            <h3 className="font-display text-xl mt-2">{trip.title}</h3>
            <span className="inline-block mt-3 text-xs px-3 py-1 rounded-full bg-forest-100 text-forest-700">
              {trip.badge}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default DepartingSoon;
