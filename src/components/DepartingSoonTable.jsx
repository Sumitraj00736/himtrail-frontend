import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { api } from '../services/api';

const DepartingSoonTable = () => {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    api.get('/content/departing-soon').then((res) => {
      setRows(res.data.data || []);
    });
  }, []);

  const getStatusStyle = (status) => {
    const s = status?.toLowerCase() || '';
    if (s.includes('guaranteed')) return 'bg-emerald-50 text-emerald-700 border-emerald-100';
    if (s.includes('limited') || s.includes('fast')) return 'bg-amber-50 text-amber-700 border-amber-100';
    return 'bg-blue-50 text-blue-700 border-blue-100';
  };

  // Flatten trips so each departure date gets its own row in the table
  const departures = [];
  rows.forEach((trip) => {
    if (trip.dates && trip.dates.length > 0) {
      trip.dates.forEach((date, index) => {
        departures.push({
          id: `${trip._id}-${index}`,
          title: trip.title,
          slug: trip.slug,
          startDate: date.startDate || 'TBA',
          endDate: date.endDate || 'TBA',
          status: date.status || 'Guaranteed',
          price: date.price ? (typeof date.price === 'number' ? `US$${date.price}` : date.price) : (trip.price ? `US$${trip.price}` : 'TBA'),
        });
      });
    } else {
      // Fallback if no dates array exists (legacy card support)
      departures.push({
        id: trip._id,
        title: trip.title || trip.tripName || 'TBA',
        slug: trip.slug,
        startDate: trip.startDate || 'TBA',
        endDate: trip.endDate || 'TBA',
        status: trip.status || 'Guaranteed',
        price: trip.price ? (typeof trip.price === 'number' ? `US$${trip.price}` : trip.price) : 'TBA',
      });
    }
  });

  return (
    <section className="reveal reveal-up bg-slate-50/75 border-y border-slate-100">
      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <div className="flex items-center gap-3">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sunrise-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-sunrise-500"></span>
              </span>
              <p className="text-xs uppercase font-bold tracking-[0.25em] text-sunrise-500">
                DEPARTING SOON!
              </p>
            </div>
            <h2 className="section-title mt-3 text-slate-800 font-display">Guaranteed Departures</h2>
            <p className="text-sm text-slate-500 mt-2">Grab last-minute availability on upcoming treks with locked-in prices.</p>
          </div>
          <Link
            to="/trips"
            className="px-6 py-3 rounded-full border border-slate-200 hover:border-brand hover:text-brand bg-white font-semibold text-xs tracking-wider uppercase transition-all duration-300 self-start md:self-auto hover:-translate-y-0.5"
          >
            Explore all departures →
          </Link>
        </div>

        {/* Table Container */}
        <div className="mt-10 overflow-hidden bg-white rounded-3xl shadow-premium border border-slate-100">
          <div className="min-w-[700px] overflow-x-auto">
            {/* Table Header */}
            <div className="grid grid-cols-12 px-6 py-4 bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">
              <div className="col-span-4">Trip Name</div>
              <div className="col-span-4">Departure Window</div>
              <div className="col-span-2">Trip Status</div>
              <div className="col-span-1 text-right pr-4">Price</div>
              <div className="col-span-1"></div>
            </div>

            {/* Table Body */}
            {departures.length === 0 ? (
              <div className="text-center py-10 text-slate-400 text-sm">
                No upcoming departures listed at the moment.
              </div>
            ) : (
              departures.map((dep) => {
                const linkPath = dep.slug ? `/trips/${dep.slug}` : '/booking';
                return (
                  <div
                    key={dep.id}
                    className="grid grid-cols-12 px-6 py-5 border-t border-slate-100 text-sm text-slate-600 items-center hover:bg-slate-50/50 transition-colors duration-200"
                  >
                    <div className="col-span-4 font-semibold text-slate-800">
                      {dep.slug ? <Link to={`/trips/${dep.slug}`} className="hover:text-brand">{dep.title}</Link> : dep.title}
                    </div>
                    <div className="col-span-4 text-xs font-medium">
                      🗓 {dep.startDate} - {dep.endDate}
                    </div>
                    <div className="col-span-2">
                      <span className={`inline-block px-2.5 py-0.5 text-[10px] font-bold rounded-full border ${getStatusStyle(dep.status)}`}>
                        {dep.status}
                      </span>
                    </div>
                    <div className="col-span-1 text-right pr-4 font-bold text-slate-900">{dep.price}</div>
                    <div className="col-span-1 text-right">
                      <Link
                        to={linkPath}
                        className="px-4 py-2 rounded-full bg-brand/5 hover:bg-brand text-brand hover:text-white font-bold text-[10px] uppercase tracking-wider transition-all duration-200 inline-block"
                      >
                        Enquire
                      </Link>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default DepartingSoonTable;
