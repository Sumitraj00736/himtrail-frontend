import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams, Link } from 'react-router-dom';
import TripCard from '../components/TripCard';
import TripFilters from '../components/TripFilters';
import { fetchTrips } from '../features/trips/tripsSlice';

const Trips = () => {
  const dispatch = useDispatch();
  const { items, status } = useSelector((state) => state.trips);
  const [params] = useSearchParams();

  const initialFilters = useMemo(
    () => ({
      destination: params.get('destination') || '',
      category: params.get('category') || '',
      region: params.get('region') || '',
      duration: params.get('duration') || '',
    }),
    [params]
  );

  const [filters, setFilters] = useState(initialFilters);
  const searchQuery = (params.get('q') || '').trim().toLowerCase();

  useEffect(() => {
    dispatch(
      fetchTrips({
        destination: filters.destination || undefined,
        category: filters.category || undefined,
        region: filters.region || undefined,
        duration: filters.duration || undefined,
      })
    );
  }, [dispatch, filters]);

  const visibleItems = useMemo(() => {
    if (!searchQuery) return items;
    return items.filter((trip) =>
      [trip.title, trip.slug, trip.region, trip.destination, trip.category, trip.shortDescription]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(searchQuery)
    );
  }, [items, searchQuery]);

  // Loading skeleton helpers
  const skeletonCards = Array.from({ length: 6 });

  return (
    <div>
      {/* Page Hero Banner */}
      <section className="relative py-16 bg-slate-900 text-white overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-40 scale-105"
          style={{ 
            backgroundImage: `url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1200')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
        <div className="relative z-10 max-w-6xl mx-auto px-6">
          <div className="text-xs uppercase tracking-[0.2em] text-slate-400 font-semibold flex items-center gap-2">
            <Link to="/" className="hover:text-white transition-colors duration-200">Home</Link>
            <span>/</span>
            <span className="text-white">Trips</span>
          </div>
          <h1 className="font-display text-3xl md:text-5xl font-bold mt-4 tracking-tight">Find Your Next Adventure</h1>
          <p className="text-slate-400 text-sm mt-2 max-w-md">Filter through our catalog of high-altitude Himalayan treks, wildlife safaris, and helicopter tours.</p>
        </div>
      </section>

      {/* Main Filter & Grid Body */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="bg-white rounded-3xl shadow-premium border border-slate-100 p-5 md:p-6 mb-10">
          <TripFilters filters={filters} onChange={setFilters} />
        </div>

        {/* Results Counter */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
            {status !== 'loading'
              ? `${visibleItems.length} adventures found${searchQuery ? ` for “${params.get('q')}”` : ''}`
              : 'Searching trails...'}
          </p>
        </div>

        {/* Grid Container */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Skeleton Loaders */}
          {status === 'loading' && 
            skeletonCards.map((_, idx) => (
              <div key={idx} className="bg-white rounded-3xl overflow-hidden border border-slate-100 p-6 space-y-4">
                <div className="h-44 w-full rounded-2xl shimmer-bg" />
                <div className="h-4 w-1/3 rounded shimmer-bg" />
                <div className="h-6 w-3/4 rounded shimmer-bg" />
                <div className="h-4 w-1/2 rounded shimmer-bg" />
                <div className="h-10 w-full rounded shimmer-bg pt-4" />
              </div>
            ))
          }

          {/* Normal Render */}
          {status !== 'loading' && visibleItems.map((trip) => (
            <div key={trip._id}>
              <TripCard trip={trip} />
            </div>
          ))}

          {status !== 'loading' && visibleItems.length === 0 && (
            <div className="col-span-full text-center py-20 bg-white border border-slate-100 rounded-3xl">
              <p className="text-slate-400 font-semibold">No trips found matching the selected filters.</p>
              <button 
                onClick={() => setFilters({ destination: '', category: '', region: '', duration: '' })}
                className="mt-4 px-6 py-2.5 bg-brand hover:bg-brand-600 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors duration-200"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Trips;
