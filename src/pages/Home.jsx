import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Hero from '../components/Hero';
import TripCard from '../components/TripCard';
import DepartingSoonTable from '../components/DepartingSoonTable';
import BestSellers from '../components/BestSellers';
import FeaturedTrips from '../components/FeaturedTrips';
import TrekkingInNepal from '../components/TrekkingInNepal';
import LuxuryTravel from '../components/LuxuryTravel';
import AboutCompany from '../components/AboutCompany';
import TeamSection from '../components/TeamSection';
import Reviews from '../components/Reviews';
import Destinations from '../components/Destinations';
import { fetchTrips } from '../features/trips/tripsSlice';

const Home = () => {
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.trips);

  useEffect(() => {
    dispatch(fetchTrips());
  }, [dispatch]);

  const featured = items.filter(trip => trip.displaySections?.includes('Featured')).slice(0, 3);

  return (
    <div>
      <Hero />
      
      {/* Destinations Section */}
      <Destinations />

      {/* Featured Journeys Section */}
      <section className="reveal reveal-up max-w-6xl mx-auto px-6 py-20">
        <div className="text-center md:text-left mb-12">
          <p className="text-xs uppercase font-bold tracking-[0.25em] text-sunrise-500">
            Curated for 2026
          </p>
          <h2 className="section-title mt-3 text-slate-800 font-display">Featured Journeys</h2>
          <p className="text-slate-500 text-sm mt-2">Handpicked adventures across the majestic Himalayas and beyond.</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {featured.map((trip) => (
            <div key={trip._id}>
              <TripCard trip={trip} />
            </div>
          ))}
          {featured.length === 0 && (
            <div className="col-span-full text-center py-12 text-slate-400 bg-white border border-slate-100 rounded-3xl">
              Add your first trips in the admin panel to showcase featured journeys.
            </div>
          )}
        </div>
      </section>

      <DepartingSoonTable />
      <BestSellers />
      <TrekkingInNepal />
      <FeaturedTrips />
      <LuxuryTravel />
      <AboutCompany />
      <TeamSection />
      <Reviews />
    </div>
  );
};

export default Home;
