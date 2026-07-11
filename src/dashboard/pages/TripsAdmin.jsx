import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';

const TripsAdmin = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/trips')
      .then((res) => setTrips(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = trips.filter((t) =>
    t.title?.toLowerCase().includes(search.toLowerCase()) ||
    t.region?.toLowerCase().includes(search.toLowerCase()) ||
    t.category?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Trips Database</h1>
          <p className="text-slate-500 mt-1 text-sm">Click a trip to edit it, or create a new one.</p>
        </div>
        <button
          onClick={() => navigate('/dashboard/trips/new')}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand text-white text-sm font-semibold rounded-full shadow-md shadow-brand/20 hover:-translate-y-0.5 transition-all duration-300"
        >
          ➕ New Trip
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search trips by name, region, category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md rounded-full border border-slate-200 px-5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-all"
        />
      </div>

      {/* Stats row */}
      <div className="flex flex-wrap gap-3 mb-8">
        {[
          { label: 'Total', count: trips.length, color: 'bg-slate-100 text-slate-700' },
          { label: 'Featured', count: trips.filter(t => t.displaySections?.includes('Featured')).length, color: 'bg-amber-50 text-amber-700' },
          { label: 'Best Seller', count: trips.filter(t => t.displaySections?.includes('Best Seller')).length, color: 'bg-emerald-50 text-emerald-700' },
          { label: 'Luxury', count: trips.filter(t => t.displaySections?.includes('Luxury Travel')).length, color: 'bg-purple-50 text-purple-700' },
          { label: 'Trekking', count: trips.filter(t => t.displaySections?.includes('Trekking in Nepal')).length, color: 'bg-blue-50 text-blue-700' },
        ].map((s) => (
          <div key={s.label} className={`px-4 py-1.5 rounded-full text-xs font-bold ${s.color}`}>
            {s.label}: {s.count}
          </div>
        ))}
      </div>

      {/* Trip Grid */}
      {loading ? (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-slate-100 animate-pulse rounded-2xl h-56" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-slate-50 border border-slate-200 border-dashed rounded-3xl p-14 text-center">
          <p className="text-3xl mb-3">🏔️</p>
          <p className="text-slate-500 font-medium">{search ? 'No trips match your search.' : 'No trips yet. Create your first one!'}</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((trip) => (
            <button
              key={trip._id}
              onClick={() => navigate(`/dashboard/trips/${trip._id}`)}
              className="group bg-white border border-slate-100 rounded-2xl overflow-hidden text-left shadow-sm hover:shadow-xl hover:border-brand/20 transition-all duration-300 hover:-translate-y-1.5 flex flex-col"
            >
              {/* Image */}
              <div className="relative h-40 bg-slate-100 overflow-hidden flex-shrink-0">
                {trip.heroImage ? (
                  <img
                    src={trip.heroImage}
                    alt={trip.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl text-slate-200">🏔️</div>
                )}
                {/* Section badges overlay */}
                {trip.displaySections?.length > 0 && (
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-3 pb-2.5 pt-8">
                    <div className="flex flex-wrap gap-1">
                      {trip.displaySections.map((s) => (
                        <span key={s} className="text-[9px] font-bold bg-white/20 backdrop-blur-sm text-white px-2 py-0.5 rounded-full border border-white/20">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {/* Edit pill */}
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur text-brand text-[10px] font-bold px-2.5 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-sm">
                  Edit ✏️
                </div>
              </div>

              {/* Details */}
              <div className="p-4 flex flex-col flex-grow">
                <h3 className="font-bold text-slate-800 text-sm leading-snug line-clamp-2 group-hover:text-brand transition-colors duration-200">
                  {trip.title}
                </h3>
                <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                  <span className="bg-slate-100 rounded-full px-2 py-0.5 font-medium">{trip.category}</span>
                  <span>•</span>
                  <span>{trip.region}</span>
                  <span>•</span>
                  <span>{trip.duration} days</span>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="font-black text-brand text-base">${trip.price?.toLocaleString()}</span>
                  {trip.oldPrice ? (
                    <span className="text-xs text-slate-400 line-through">${trip.oldPrice?.toLocaleString()}</span>
                  ) : null}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default TripsAdmin;
