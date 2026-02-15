import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
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

  return (
    <section className="max-w-6xl mx-auto px-6 py-16">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-forest-600">
          Dynamic Trip Engine
        </p>
        <h1 className="section-title mt-3">Find Your Next Adventure</h1>
      </div>
      <div className="mt-6">
        <TripFilters filters={filters} onChange={setFilters} />
      </div>
      <div className="mt-10 grid md:grid-cols-3 gap-6">
        {status === 'loading' && <p>Loading trips...</p>}
        {items.map((trip) => (
          <TripCard key={trip._id} trip={trip} />
        ))}
        {status !== 'loading' && items.length === 0 && (
          <p className="text-forest-600">No trips found.</p>
        )}
      </div>
    </section>
  );
};

export default Trips;
