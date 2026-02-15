import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Hero from '../components/Hero';
import TripCard from '../components/TripCard';
import Sustainability from '../components/Sustainability';
import DepartingSoonTable from '../components/DepartingSoonTable';
import BestSellers from '../components/BestSellers';
import FeaturedTrips from '../components/FeaturedTrips';
import AboutCompany from '../components/AboutCompany';
import Reviews from '../components/Reviews';
import { fetchTrips } from '../features/trips/tripsSlice';

const Home = () => {
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.trips);

  useEffect(() => {
    dispatch(fetchTrips());
  }, [dispatch]);

  const featured = items.slice(0, 3);

  return (
    <div>
      <Hero />
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-forest-600">
              Curated for 2026
            </p>
            <h2 className="section-title mt-3">Featured Journeys</h2>
          </div>
        </div>
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          {featured.map((trip) => (
            <TripCard key={trip._id} trip={trip} />
          ))}
          {featured.length === 0 && (
            <div className="col-span-full text-forest-600">
              Add your first trips in the admin panel to showcase featured
              journeys.
            </div>
          )}
        </div>
      </section>
      <DepartingSoonTable />
      <BestSellers />
      <FeaturedTrips />
      <AboutCompany />
      <Reviews />
      <Sustainability />
    </div>
  );
};

export default Home;
