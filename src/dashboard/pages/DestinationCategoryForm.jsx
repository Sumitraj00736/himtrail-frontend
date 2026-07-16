import { useEffect, useState, useMemo } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api } from '../../services/api';
import ImageUploader from '../../components/ImageUploader';

const slugify = (value = '') =>
  String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const emptyForm = () => ({
  title: '',
  slug: '',
  country: 'Nepal',
  shortDescription: '',
  longDescription: '',
  heroImage: '',
  gallery: [''],
  tripIds: [],
  order: 0,
  isActive: true,
});

const DestinationCategoryForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = !id || id === 'new';

  const [form, setForm] = useState(emptyForm);
  const [trips, setTrips] = useState([]);
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [tripQuery, setTripQuery] = useState('');

  useEffect(() => {
    api.get('/trips').then((res) => {
      const all = res.data.data || res.data || [];
      setTrips(Array.isArray(all) ? all : []);
    });
    api.get('/content/trip-options').then((res) => {
      setCountries(res.data.data?.countries || []);
    });
  }, []);

  useEffect(() => {
    if (isNew) return;
    setLoading(true);
    api
      .get(`/dashboard/destinations/${id}`)
      .then((res) => {
        const d = res.data.data;
        setForm({
          title: d.title || '',
          slug: d.slug || '',
          country: d.country || 'Nepal',
          shortDescription: d.shortDescription || '',
          longDescription: d.longDescription || '',
          heroImage: d.heroImage || '',
          gallery: d.gallery?.length ? d.gallery : [''],
          tripIds: (d.tripIds || []).map(String),
          order: d.order || 0,
          isActive: d.isActive !== false,
        });
      })
      .catch(() => setError('Could not load destination'))
      .finally(() => setLoading(false));
  }, [id, isNew]);

  const filteredTrips = useMemo(() => {
    const q = tripQuery.trim().toLowerCase();
    if (!q) return trips;
    return trips.filter((t) =>
      [t.title, t.slug, t.region, t.destination, t.category]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(q)
    );
  }, [trips, tripQuery]);

  const toggleTrip = (tripId) => {
    const sid = String(tripId);
    setForm((prev) => ({
      ...prev,
      tripIds: prev.tripIds.includes(sid)
        ? prev.tripIds.filter((x) => x !== sid)
        : [...prev.tripIds, sid],
    }));
  };

  const handleChange = (field, value) => {
    setForm((prev) => {
      const next = { ...prev, [field]: value };
      if (field === 'title' && isNew && !prev.slug) {
        next.slug = slugify(value);
      }
      return next;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.title.trim() || !form.slug.trim() || !form.country.trim()) {
      setError('Title, slug, and country are required');
      return;
    }

    const payload = {
      ...form,
      slug: slugify(form.slug),
      gallery: (form.gallery || []).map((s) => String(s || '').trim()).filter(Boolean),
      tripIds: form.tripIds,
    };

    setSaving(true);
    try {
      if (isNew) {
        await api.post('/dashboard/destinations', payload);
      } else {
        await api.put(`/dashboard/destinations/${id}`, payload);
      }
      navigate('/dashboard/destinations');
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (isNew) return;
    const ok = window.confirm(`Delete "${form.title}"? This removes it from the menu and homepage.`);
    if (!ok) return;
    setSaving(true);
    try {
      await api.delete(`/dashboard/destinations/${id}`);
      navigate('/dashboard/destinations');
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Delete failed');
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="h-40 bg-slate-100 rounded-3xl animate-pulse" />;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-black text-slate-800">
            {isNew ? '➕ New destination category' : '✏️ Edit destination category'}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Creates a page with description + package list (e.g. Day Tours → packages below).
          </p>
        </div>
        <Link
          to="/dashboard/destinations"
          className="text-sm font-semibold text-slate-500 hover:text-slate-800"
        >
          ← Back
        </Link>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-5 shadow-sm">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              Title
            </label>
            <input
              value={form.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Day Tours"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              URL slug
            </label>
            <input
              value={form.slug}
              onChange={(e) => handleChange('slug', e.target.value)}
              placeholder="day-tours"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-mono"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
            Country / menu column
          </label>
          <input
            list="destination-countries"
            value={form.country}
            onChange={(e) => handleChange('country', e.target.value)}
            placeholder="Nepal"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm"
            required
          />
          <datalist id="destination-countries">
            {countries.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
          <p className="text-[11px] text-slate-400 mt-1">
            Page URL: /destinations/{slugify(form.country)}/{slugify(form.slug) || '…'}
          </p>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
            Short description
          </label>
          <textarea
            value={form.shortDescription}
            onChange={(e) => handleChange('shortDescription', e.target.value)}
            rows={3}
            placeholder="Intro shown below the hero banner…"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
            Long description (HTML allowed)
          </label>
          <textarea
            value={form.longDescription}
            onChange={(e) => handleChange('longDescription', e.target.value)}
            rows={6}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-mono text-xs"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            Hero image
          </label>
          <p className="text-[11px] text-slate-400 mb-3">
            Upload a photo — it uploads automatically. No URL needed.
          </p>
          <ImageUploader
            value={form.heroImage}
            onChange={(url) => handleChange('heroImage', url)}
            label="Upload hero photo"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                Gallery (hero collage)
              </label>
              <p className="text-[11px] text-slate-400 mt-1">
                Upload multiple photos for the destination page collage.
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                setForm((prev) => ({ ...prev, gallery: [...(prev.gallery || []), ''] }))
              }
              className="text-xs font-bold text-brand hover:underline"
            >
              + Add photo
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {(form.gallery?.length ? form.gallery : ['']).map((url, idx) => (
              <div
                key={idx}
                className="relative bg-slate-50 border border-slate-200 rounded-2xl p-3 flex flex-col gap-2"
              >
                <ImageUploader
                  value={url}
                  onChange={(newUrl) => {
                    setForm((prev) => {
                      const gallery = [...(prev.gallery || [''])];
                      gallery[idx] = newUrl;
                      return { ...prev, gallery };
                    });
                  }}
                  label="Upload photo"
                />
                <button
                  type="button"
                  className="text-[11px] font-semibold text-slate-400 hover:text-red-500"
                  onClick={() => {
                    setForm((prev) => {
                      const gallery = (prev.gallery || []).filter((_, i) => i !== idx);
                      return { ...prev, gallery: gallery.length ? gallery : [''] };
                    });
                  }}
                >
                  ✕ Remove
                </button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            Packages in this destination ({form.tripIds.length} selected)
          </label>
          <input
            value={tripQuery}
            onChange={(e) => setTripQuery(e.target.value)}
            placeholder="Search trips to add…"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm mb-3"
          />
          <div className="max-h-64 overflow-y-auto border border-slate-200 rounded-2xl divide-y divide-slate-100">
            {filteredTrips.length === 0 ? (
              <p className="p-4 text-sm text-slate-400">No trips found</p>
            ) : (
              filteredTrips.map((trip) => {
                const checked = form.tripIds.includes(String(trip._id));
                return (
                  <label
                    key={trip._id}
                    className={`flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-slate-50 ${
                      checked ? 'bg-brand/5' : ''
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleTrip(trip._id)}
                      className="rounded border-slate-300 text-brand focus:ring-brand"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-slate-800 truncate">{trip.title}</p>
                      <p className="text-[11px] text-slate-400 truncate">
                        {trip.region} · US${trip.price?.toLocaleString()}
                      </p>
                    </div>
                  </label>
                );
              })
            )}
          </div>
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">{error}</p>
      )}

      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 rounded-xl bg-brand text-white text-sm font-bold shadow-md disabled:opacity-60"
          >
            {saving ? 'Saving…' : isNew ? 'Create destination' : 'Save changes'}
          </button>
          <Link
            to="/dashboard/destinations"
            className="px-6 py-3 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600"
          >
            Cancel
          </Link>
        </div>
        {!isNew && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={saving}
            className="px-4 py-3 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50"
          >
            🗑 Delete
          </button>
        )}
      </div>
    </form>
  );
};

export default DestinationCategoryForm;
