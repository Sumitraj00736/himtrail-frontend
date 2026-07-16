import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../services/api';
import TripCard from '../components/TripCard';

const DestinationCategory = () => {
  const { country, slug } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    api
      .get(`/content/destinations/${country}/${slug}`)
      .then((res) => setData(res.data.data))
      .catch(() => setError('Destination not found'))
      .finally(() => setLoading(false));
  }, [country, slug]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-brand/20 border-t-brand rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-24 text-center">
        <p className="text-4xl mb-4">📍</p>
        <h1 className="text-2xl font-bold text-slate-800">Destination not found</h1>
        <Link to="/" className="inline-block mt-6 text-brand font-semibold hover:underline">
          ← Back to home
        </Link>
      </div>
    );
  }

  const gallery = data.gallery?.length
    ? data.gallery
    : data.heroImage
      ? [data.heroImage]
      : [
          'https://images.unsplash.com/photo-1544735716-392fe8d75f2e?w=600',
          'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600',
          'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600',
          'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=600',
        ];

  const countryLabel = data.country || country;
  const trips = data.trips || [];

  return (
    <div>
      {/* Hero collage */}
      <section className="relative bg-slate-900 text-white overflow-hidden">
        <div className="grid grid-cols-2 md:grid-cols-4 grid-rows-2 min-h-[280px] md:min-h-[340px]">
          {gallery.slice(0, 8).map((src, i) => (
            <div key={i} className="relative overflow-hidden">
              <img
                src={src}
                alt=""
                className="w-full h-full object-cover min-h-[140px] md:min-h-[170px] opacity-90"
              />
            </div>
          ))}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-slate-950/20" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <nav className="text-xs uppercase tracking-[0.2em] text-white/70 font-semibold flex flex-wrap items-center justify-center gap-2 mb-4">
            <Link to="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <span>›</span>
            <span>Destinations</span>
            <span>›</span>
            <span>{countryLabel}</span>
            <span>›</span>
            <span className="text-white">{data.title}</span>
          </nav>
          <h1 className="font-display text-3xl md:text-5xl font-bold tracking-tight">{data.title}</h1>
        </div>
      </section>

      {/* Description */}
      {(data.shortDescription || data.longDescription) && (
        <section className="bg-white py-12 md:py-16">
          <div className="max-w-4xl mx-auto px-6">
            {data.shortDescription && (
              <p className="text-slate-600 text-base md:text-lg leading-relaxed font-medium">
                {data.shortDescription}
              </p>
            )}
            {data.longDescription && (
              <div
                className="mt-6 prose prose-slate max-w-none text-slate-600 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: data.longDescription }}
              />
            )}
          </div>
        </section>
      )}

      {/* Packages grid */}
      <section className="bg-slate-50 py-14 md:py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-center font-display text-2xl md:text-3xl font-bold text-slate-800 tracking-tight mb-10">
            {trips.length} {trips.length === 1 ? 'PACKAGE' : 'PACKAGES'}
          </h2>

          {trips.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border-2 border-dashed border-slate-200">
              <p className="text-slate-500 font-medium">No packages in this destination yet.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {trips.map((trip) => (
                <TripCard key={trip._id} trip={trip} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default DestinationCategory;
