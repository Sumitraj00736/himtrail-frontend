import { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Link } from 'react-router-dom';

const StatCard = ({ icon, label, value, color }) => (
  <div className={`bg-gradient-to-br ${color} rounded-2xl p-6 text-white relative overflow-hidden`}>
    <div className="absolute -right-4 -top-4 text-white/10 text-8xl font-black">{icon}</div>
    <p className="text-white/70 text-xs uppercase font-bold tracking-widest">{label}</p>
    <p className="text-4xl font-black mt-2">{value}</p>
  </div>
);

const DashboardHome = () => {
  const [trips, setTrips] = useState([]);
  const [recentTrips, setRecentTrips] = useState([]);

  useEffect(() => {
    api.get('/trips').then((res) => {
      const data = res.data.data || [];
      setTrips(data);
      setRecentTrips(data.slice(0, 6));
    }).catch(() => {});
  }, []);

  const sections = ['Featured', 'Best Seller', 'Trekking in Nepal', 'Luxury Travel', 'Departing Soon'];

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-800 tracking-tight">Dashboard Overview</h1>
        <p className="text-slate-500 mt-1.5 font-medium">Welcome back! Manage your Himtrail adventure empire.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <StatCard icon="🏔️" label="Total Trips" value={trips.length} color="from-brand to-blue-700" />
        <StatCard icon="⭐" label="Featured" value={trips.filter(t => t.displaySections?.includes('Featured')).length} color="from-amber-500 to-orange-600" />
        <StatCard icon="✨" label="Luxury" value={trips.filter(t => t.displaySections?.includes('Luxury Travel')).length} color="from-purple-600 to-pink-600" />
        <StatCard icon="🚀" label="Departing Soon" value={trips.filter(t => t.displaySections?.includes('Departing Soon')).length} color="from-emerald-500 to-teal-600" />
      </div>

      {/* Quick Links */}
      <div className="mb-10">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link to="/dashboard/trips" className="px-5 py-2.5 bg-brand text-white text-sm font-semibold rounded-full shadow-md shadow-brand/20 hover:-translate-y-0.5 transition-all duration-300">
            ➕ Add New Trip
          </Link>
          <Link to="/dashboard/trips" className="px-5 py-2.5 bg-slate-100 text-slate-700 text-sm font-semibold rounded-full hover:bg-slate-200 transition-all duration-300">
            📋 Manage All Trips
          </Link>
          <Link to="/dashboard/homepage" className="px-5 py-2.5 bg-slate-100 text-slate-700 text-sm font-semibold rounded-full hover:bg-slate-200 transition-all duration-300">
            ⚙️ Homepage Settings
          </Link>
          <Link to="/dashboard/bookings" className="px-5 py-2.5 bg-slate-100 text-slate-700 text-sm font-semibold rounded-full hover:bg-slate-200 transition-all duration-300">
            📅 View Bookings
          </Link>
        </div>
      </div>

      {/* Section Coverage */}
      <div className="mb-10">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">Homepage Section Coverage</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {sections.map((sec) => {
            const count = trips.filter(t => t.displaySections?.includes(sec)).length;
            return (
              <div key={sec} className="flex items-center justify-between bg-slate-50 rounded-2xl px-5 py-4 border border-slate-100">
                <span className="font-semibold text-slate-700 text-sm">{sec}</span>
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${count > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-50 text-red-400'}`}>
                  {count} trips
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Trips Preview */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">Recent Trips</h2>
          <Link to="/dashboard/trips" className="text-brand text-sm font-semibold hover:underline">View All →</Link>
        </div>
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {recentTrips.map((trip) => (
            <div key={trip._id} className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
              <div className="h-36 bg-slate-100 overflow-hidden relative">
                {trip.heroImage ? (
                  <img src={trip.heroImage} alt={trip.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300 text-4xl">🏔️</div>
                )}
                {trip.displaySections?.length > 0 && (
                  <div className="absolute bottom-2 left-2 flex flex-wrap gap-1">
                    {trip.displaySections.map(s => (
                      <span key={s} className="text-[9px] font-bold bg-black/60 text-white px-2 py-0.5 rounded-full backdrop-blur">{s}</span>
                    ))}
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-bold text-slate-800 line-clamp-1 text-sm">{trip.title}</h3>
                <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                  <span>{trip.duration} days</span>
                  <span>•</span>
                  <span>{trip.region}</span>
                  <span>•</span>
                  <span className="font-bold text-brand">${trip.price}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
