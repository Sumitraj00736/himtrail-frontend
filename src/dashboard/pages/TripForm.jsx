import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../../services/api';
import ImageUploader from '../../components/ImageUploader';

const EMPTY_FORM = {
  title: '',
  slug: '',
  destination: 'Nepal',
  category: 'Trekking',
  region: 'Everest',
  duration: 10,
  price: 1500,
  oldPrice: 0,
  heroImage: '',
  shortDescription: '',
  longDescription: '',
  tripGrade: '',
  maxAltitude: '',
  groupSize: '',
  activity: '',
  destinationLabel: '',
  itinerary: [{ day: 1, title: '', description: '' }],
  gallery: [''],
  included: [''],
  excluded: [''],
  dates: [{ startDate: '', endDate: '', status: '', price: '' }],
  displaySections: [],
};

const Field = ({ label, children }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{label}</label>
    {children}
  </div>
);

const inputCls = 'w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-all';
const textareaCls = `${inputCls} rounded-2xl resize-y`;

const TripForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = id === 'new';

  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    if (isNew) return;
    api.get(`/trips/id/${id}`)
      .then((res) => {
        const t = res.data.data || res.data;
        setForm({
          title: t.title || '',
          slug: t.slug || '',
          destination: t.destination || 'Nepal',
          category: t.category || 'Trekking',
          region: t.region || 'Everest',
          duration: t.duration || 10,
          price: t.price || 0,
          oldPrice: t.oldPrice || 0,
          heroImage: t.heroImage || '',
          shortDescription: t.shortDescription || '',
          longDescription: t.longDescription || '',
          tripGrade: t.tripGrade || '',
          maxAltitude: t.maxAltitude || '',
          groupSize: t.groupSize || '',
          activity: t.activity || '',
          destinationLabel: t.destinationLabel || '',
          itinerary: t.itinerary?.length ? t.itinerary : [{ day: 1, title: '', description: '' }],
          gallery: t.gallery?.length ? t.gallery : [''],
          included: t.included?.length ? t.included : [''],
          excluded: t.excluded?.length ? t.excluded : [''],
          dates: t.dates?.length ? t.dates : [{ startDate: '', endDate: '', status: '', price: '' }],
          displaySections: t.displaySections || [],
        });
      })
      .catch(() => setMessage({ text: 'Failed to load trip.', type: 'error' }))
      .finally(() => setLoading(false));
  }, [id, isNew]);

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (isNew) {
        await api.post('/trips', form);
        setMessage({ text: '✅ Trip created successfully!', type: 'success' });
        setTimeout(() => navigate('/dashboard/trips'), 1200);
      } else {
        await api.put(`/trips/${id}`, form);
        setMessage({ text: '✅ Changes saved!', type: 'success' });
      }
    } catch (err) {
      setMessage({ text: '❌ Failed to save. Check all required fields.', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const deleteTrip = async () => {
    if (!window.confirm('Delete this trip permanently? This cannot be undone.')) return;
    try {
      await api.delete(`/trips/${id}`);
      navigate('/dashboard/trips');
    } catch {
      setMessage({ text: '❌ Failed to delete trip.', type: 'error' });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-brand/20 border-t-brand rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-500 font-medium">Loading trip...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate('/dashboard/trips')}
          className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors flex-shrink-0"
          title="Back to trips"
        >
          ←
        </button>
        <div className="flex-grow">
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
            {isNew ? '➕ Create New Trip' : `✏️ Edit Trip`}
          </h1>
          {!isNew && form.title && (
            <p className="text-slate-500 mt-0.5 text-sm font-medium truncate">{form.title}</p>
          )}
        </div>
        {!isNew && (
          <button
            onClick={deleteTrip}
            className="px-4 py-2 rounded-xl border border-red-200 text-red-500 text-sm font-semibold hover:bg-red-50 transition-colors flex-shrink-0"
          >
            🗑️ Delete
          </button>
        )}
      </div>

      {/* Hero preview */}
      {form.heroImage && (
        <div className="mb-8 rounded-3xl overflow-hidden h-48 bg-slate-100 border border-slate-200">
          <img src={form.heroImage} alt="Hero preview" className="w-full h-full object-cover" />
        </div>
      )}

      <form onSubmit={submit} className="space-y-8">
        {/* ── Basic Info ── */}
        <section className="bg-slate-50 border border-slate-200 rounded-3xl p-6 space-y-4">
          <h2 className="font-bold text-slate-700 text-base mb-2">Basic Information</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Title *">
              <input className={inputCls} placeholder="Everest Base Camp Trek" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            </Field>
            <Field label="Slug *">
              <input className={inputCls} placeholder="everest-base-camp-trek" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} required />
            </Field>
          </div>
          <Field label="Hero Image">
            <ImageUploader
              value={form.heroImage}
              onChange={(url) => setForm({ ...form, heroImage: url })}
              label="Upload Hero Image"
            />
          </Field>
          <div className="grid sm:grid-cols-3 gap-4">
            <Field label="Destination">
              <select className={inputCls} value={form.destination} onChange={(e) => setForm({ ...form, destination: e.target.value })}>
                {['Nepal', 'Tanzania', 'Bhutan', 'Tibet'].map((d) => <option key={d}>{d}</option>)}
              </select>
            </Field>
            <Field label="Category">
              <select className={inputCls} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                {['Trekking', 'Heli Tour', 'Adventure', 'Climbing', 'Cultural', 'Wildlife'].map((c) => <option key={c}>{c}</option>)}
              </select>
            </Field>
            <Field label="Region">
              <select className={inputCls} value={form.region} onChange={(e) => setForm({ ...form, region: e.target.value })}>
                {['Everest', 'Annapurna', 'Langtang', 'Manaslu', 'Upper Mustang', 'Dolpo', 'Tibet', 'Bhutan', 'Tanzania'].map((r) => <option key={r}>{r}</option>)}
              </select>
            </Field>
          </div>
        </section>

        {/* ── Pricing & Details ── */}
        <section className="bg-slate-50 border border-slate-200 rounded-3xl p-6 space-y-4">
          <h2 className="font-bold text-slate-700 text-base mb-2">Pricing & Details</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Field label="Duration (days)">
              <input className={inputCls} type="number" min="1" value={form.duration} onChange={(e) => setForm({ ...form, duration: Number(e.target.value) })} />
            </Field>
            <Field label="Price (USD)">
              <input className={inputCls} type="number" min="0" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />
            </Field>
            <Field label="Old Price (USD)">
              <input className={inputCls} type="number" min="0" value={form.oldPrice} placeholder="0" onChange={(e) => setForm({ ...form, oldPrice: Number(e.target.value) })} />
            </Field>
            <Field label="Trip Grade">
              <input className={inputCls} placeholder="Moderate" value={form.tripGrade} onChange={(e) => setForm({ ...form, tripGrade: e.target.value })} />
            </Field>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            <Field label="Max Altitude">
              <input className={inputCls} placeholder="5,364m" value={form.maxAltitude} onChange={(e) => setForm({ ...form, maxAltitude: e.target.value })} />
            </Field>
            <Field label="Group Size">
              <input className={inputCls} placeholder="2-12" value={form.groupSize} onChange={(e) => setForm({ ...form, groupSize: e.target.value })} />
            </Field>
            <Field label="Activity">
              <input className={inputCls} placeholder="Trekking" value={form.activity} onChange={(e) => setForm({ ...form, activity: e.target.value })} />
            </Field>
          </div>
          <Field label="Destination Label">
            <input className={inputCls} placeholder="Nepal Himalayas" value={form.destinationLabel} onChange={(e) => setForm({ ...form, destinationLabel: e.target.value })} />
          </Field>
        </section>

        {/* ── Descriptions ── */}
        <section className="bg-slate-50 border border-slate-200 rounded-3xl p-6 space-y-4">
          <h2 className="font-bold text-slate-700 text-base mb-2">Descriptions</h2>
          <Field label="Short Description">
            <textarea className={textareaCls} rows={2} value={form.shortDescription} onChange={(e) => setForm({ ...form, shortDescription: e.target.value })} placeholder="A brief summary shown on cards..." />
          </Field>
          <Field label="Long Description (HTML allowed)">
            <textarea className={textareaCls} rows={6} value={form.longDescription} onChange={(e) => setForm({ ...form, longDescription: e.target.value })} placeholder="Full trip description — HTML tags like <b>, <p>, <ul>, <li> are supported." />
          </Field>
        </section>

        {/* ── Homepage Sections ── */}
        <section className="bg-slate-50 border border-slate-200 rounded-3xl p-6">
          <h2 className="font-bold text-slate-700 text-base mb-1">Homepage Sections</h2>
          <p className="text-slate-400 text-xs mb-4">Tick the sections where this trip should appear on the public homepage.</p>
          <div className="flex flex-wrap gap-3">
            {['Featured', 'Best Seller', 'Trekking in Nepal', 'Luxury Travel', 'Departing Soon'].map((sec) => (
              <label
                key={sec}
                className={`flex items-center gap-2.5 px-4 py-2.5 rounded-2xl border text-sm font-semibold cursor-pointer transition-all duration-200 ${
                  form.displaySections.includes(sec)
                    ? 'bg-brand text-white border-brand shadow-md shadow-brand/20'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-brand/40 hover:bg-brand/5'
                }`}
              >
                <input
                  type="checkbox"
                  className="hidden"
                  checked={form.displaySections.includes(sec)}
                  onChange={(e) => {
                    setForm((prev) => ({
                      ...prev,
                      displaySections: e.target.checked
                        ? [...prev.displaySections, sec]
                        : prev.displaySections.filter((s) => s !== sec),
                    }));
                  }}
                />
                {form.displaySections.includes(sec) ? '✓ ' : ''}{sec}
              </label>
            ))}
          </div>
        </section>

        {/* ── Itinerary ── */}
        <section className="bg-slate-50 border border-slate-200 rounded-3xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-slate-700 text-base">Itinerary</h2>
            <button
              type="button"
              onClick={() => setForm({ ...form, itinerary: [...form.itinerary, { day: form.itinerary.length + 1, title: '', description: '' }] })}
              className="text-xs font-bold text-brand hover:underline"
            >
              + Add Day
            </button>
          </div>
          <div className="space-y-3">
            {form.itinerary.map((it, idx) => (
              <div key={idx} className="grid grid-cols-[64px_1fr_2fr_auto] gap-2 items-start">
                <input className={inputCls} type="number" min="1" value={it.day} placeholder="Day" onChange={(e) => {
                  const itinerary = form.itinerary.map((x, i) => i === idx ? { ...x, day: Number(e.target.value) } : x);
                  setForm({ ...form, itinerary });
                }} />
                <input className={inputCls} value={it.title} placeholder="Title" onChange={(e) => {
                  const itinerary = form.itinerary.map((x, i) => i === idx ? { ...x, title: e.target.value } : x);
                  setForm({ ...form, itinerary });
                }} />
                <input className={inputCls} value={it.description} placeholder="Description" onChange={(e) => {
                  const itinerary = form.itinerary.map((x, i) => i === idx ? { ...x, description: e.target.value } : x);
                  setForm({ ...form, itinerary });
                }} />
                <button type="button" className="text-red-400 hover:text-red-600 text-xs font-bold px-2 py-2.5" onClick={() => {
                  const itinerary = form.itinerary.filter((_, i) => i !== idx);
                  setForm({ ...form, itinerary: itinerary.length ? itinerary : [{ day: 1, title: '', description: '' }] });
                }}>✕</button>
              </div>
            ))}
          </div>
        </section>

        {/* ── Gallery ── */}
        <section className="bg-slate-50 border border-slate-200 rounded-3xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-slate-700 text-base">Gallery Images</h2>
            <button type="button" onClick={() => setForm({ ...form, gallery: [...form.gallery, ''] })} className="text-xs font-bold text-brand hover:underline">+ Add Image</button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {form.gallery.map((url, idx) => (
              <div key={idx} className="relative bg-white border border-slate-200 rounded-2xl p-3 flex flex-col gap-2">
                <ImageUploader
                  value={url}
                  onChange={(newUrl) => {
                    const gallery = form.gallery.map((x, i) => i === idx ? newUrl : x);
                    setForm({ ...form, gallery });
                  }}
                  label="Upload Image"
                />
                <button
                  type="button"
                  className="absolute top-2 right-2 text-slate-400 hover:text-red-500 font-bold text-xs"
                  onClick={() => {
                    const gallery = form.gallery.filter((_, i) => i !== idx);
                    setForm({ ...form, gallery: gallery.length ? gallery : [''] });
                  }}
                >
                  ✕ Remove Card
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* ── Included / Excluded ── */}
        <div className="grid sm:grid-cols-2 gap-6">
          <section className="bg-slate-50 border border-slate-200 rounded-3xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-slate-700 text-base">✅ Included</h2>
              <button type="button" onClick={() => setForm({ ...form, included: [...form.included, ''] })} className="text-xs font-bold text-brand hover:underline">+ Add</button>
            </div>
            <div className="space-y-2">
              {form.included.map((item, idx) => (
                <div key={idx} className="flex gap-2">
                  <input className={inputCls} value={item} placeholder="Accommodation" onChange={(e) => {
                    const included = form.included.map((x, i) => i === idx ? e.target.value : x);
                    setForm({ ...form, included });
                  }} />
                  <button type="button" className="text-red-400 hover:text-red-600 text-xs font-bold px-1" onClick={() => {
                    const included = form.included.filter((_, i) => i !== idx);
                    setForm({ ...form, included: included.length ? included : [''] });
                  }}>✕</button>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-slate-50 border border-slate-200 rounded-3xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-slate-700 text-base">❌ Excluded</h2>
              <button type="button" onClick={() => setForm({ ...form, excluded: [...form.excluded, ''] })} className="text-xs font-bold text-brand hover:underline">+ Add</button>
            </div>
            <div className="space-y-2">
              {form.excluded.map((item, idx) => (
                <div key={idx} className="flex gap-2">
                  <input className={inputCls} value={item} placeholder="International flights" onChange={(e) => {
                    const excluded = form.excluded.map((x, i) => i === idx ? e.target.value : x);
                    setForm({ ...form, excluded });
                  }} />
                  <button type="button" className="text-red-400 hover:text-red-600 text-xs font-bold px-1" onClick={() => {
                    const excluded = form.excluded.filter((_, i) => i !== idx);
                    setForm({ ...form, excluded: excluded.length ? excluded : [''] });
                  }}>✕</button>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* ── Departure Dates ── */}
        <section className="bg-slate-50 border border-slate-200 rounded-3xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-slate-700 text-base">Departure Dates</h2>
            <button type="button" onClick={() => setForm({ ...form, dates: [...form.dates, { startDate: '', endDate: '', status: '', price: '' }] })} className="text-xs font-bold text-brand hover:underline">+ Add Date</button>
          </div>
          <div className="space-y-3">
            {form.dates.map((row, idx) => (
              <div key={idx} className="grid grid-cols-[1fr_1fr_1fr_1fr_auto] gap-2 items-center">
                <input className={inputCls} value={row.startDate} placeholder="Start date" onChange={(e) => {
                  const dates = form.dates.map((x, i) => i === idx ? { ...x, startDate: e.target.value } : x);
                  setForm({ ...form, dates });
                }} />
                <input className={inputCls} value={row.endDate} placeholder="End date" onChange={(e) => {
                  const dates = form.dates.map((x, i) => i === idx ? { ...x, endDate: e.target.value } : x);
                  setForm({ ...form, dates });
                }} />
                <input className={inputCls} value={row.status} placeholder="Status" onChange={(e) => {
                  const dates = form.dates.map((x, i) => i === idx ? { ...x, status: e.target.value } : x);
                  setForm({ ...form, dates });
                }} />
                <input className={inputCls} value={row.price} placeholder="US$1,540" onChange={(e) => {
                  const dates = form.dates.map((x, i) => i === idx ? { ...x, price: e.target.value } : x);
                  setForm({ ...form, dates });
                }} />
                <button type="button" className="text-red-400 hover:text-red-600 text-xs font-bold px-2 py-2.5" onClick={() => {
                  const dates = form.dates.filter((_, i) => i !== idx);
                  setForm({ ...form, dates: dates.length ? dates : [{ startDate: '', endDate: '', status: '', price: '' }] });
                }}>✕</button>
              </div>
            ))}
          </div>
        </section>

        {/* ── Submit ── */}
        <div className="flex items-center gap-4 pb-6">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3.5 rounded-full bg-brand text-white font-bold shadow-md shadow-brand/20 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {saving ? (
              <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Saving...</>
            ) : (
              isNew ? '🚀 Create Trip' : '💾 Save Changes'
            )}
          </button>
          <button
            type="button"
            onClick={() => navigate('/dashboard/trips')}
            className="px-6 py-3.5 rounded-full border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>
          {message.text && (
            <p className={`text-sm font-semibold px-4 py-2 rounded-xl ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'}`}>
              {message.text}
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default TripForm;
