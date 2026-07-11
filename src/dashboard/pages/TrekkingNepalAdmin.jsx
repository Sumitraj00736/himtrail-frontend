import { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Link } from 'react-router-dom';

const TrekkingNepalAdmin = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const res = await api.get('/content/trekking-in-nepal');
      setItems(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Trekking in Nepal Overview</h1>
          <p className="text-slate-500 mt-1">
            These trips are currently displayed in the "Trekking in Nepal" section on the homepage.
          </p>
        </div>
        <Link 
          to="/dashboard/trips" 
          className="px-5 py-2.5 bg-brand text-white text-sm font-semibold rounded-full shadow-md shadow-brand/20 hover:-translate-y-0.5 transition-all duration-300"
        >
          Manage in Trips Database
        </Link>
      </div>

      {loading ? (
        <div className="text-slate-400 font-medium">Loading preview...</div>
      ) : items.length === 0 ? (
        <div className="bg-slate-50 border border-slate-200 border-dashed rounded-3xl p-12 text-center">
          <p className="text-slate-500 mb-4">No trips are currently marked as Trekking in Nepal.</p>
          <Link to="/dashboard/trips" className="text-brand font-semibold hover:underline">
            Go tag some trips!
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {items.map((item) => (
            <div key={item._id} className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="relative h-40 rounded-xl overflow-hidden bg-slate-100 mb-4">
                {item.heroImage ? (
                  <img src={item.heroImage} alt={item.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="flex items-center justify-center h-full text-slate-300">No Image</div>
                )}
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-2.5 py-1 rounded-md text-[10px] font-bold text-slate-700 shadow-sm">
                  {item.duration} Days
                </div>
              </div>
              <h3 className="font-bold text-slate-800 text-lg leading-snug line-clamp-2">{item.title}</h3>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-brand font-bold text-lg">${item.price}</span>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{item.destination}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TrekkingNepalAdmin;
