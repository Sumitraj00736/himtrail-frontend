import { useEffect, useState } from 'react';
import { api } from '../../services/api';

const TripsAdmin = () => {
  const [trips, setTrips] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [form, setForm] = useState({
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
  });
  const [message, setMessage] = useState('');

  const loadTrips = async () => {
    const res = await api.get('/trips');
    setTrips(res.data.data);
  };

  useEffect(() => {
    loadTrips();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    try {
      if (selectedId) {
        await api.put(`/trips/${selectedId}`, form);
        setMessage('Trip updated.');
      } else {
        await api.post('/trips', form);
        setMessage('Trip created.');
      }
      loadTrips();
    } catch (err) {
      setMessage('Unable to create trip.');
    }
  };

  return (
    <div>
      <h1 className="text-xl font-semibold text-[#243b75]">Trips</h1>
      <div className="mt-4 max-w-xl">
        <select
          className="rounded-full border-slate-200 w-full"
          value={selectedId}
          onChange={(e) => {
            const id = e.target.value;
            setSelectedId(id);
            const selected = trips.find((t) => t._id === id);
            if (selected) {
              setForm({
                title: selected.title || '',
                slug: selected.slug || '',
                destination: selected.destination || 'Nepal',
                category: selected.category || 'Trekking',
                region: selected.region || 'Everest',
                duration: selected.duration || 10,
                price: selected.price || 0,
                oldPrice: selected.oldPrice || 0,
                heroImage: selected.heroImage || '',
                shortDescription: selected.shortDescription || '',
                longDescription: selected.longDescription || '',
                tripGrade: selected.tripGrade || '',
                maxAltitude: selected.maxAltitude || '',
                groupSize: selected.groupSize || '',
                activity: selected.activity || '',
                destinationLabel: selected.destinationLabel || '',
                itinerary: selected.itinerary?.length ? selected.itinerary : [{ day: 1, title: '', description: '' }],
                gallery: selected.gallery?.length ? selected.gallery : [''],
                included: selected.included?.length ? selected.included : [''],
                excluded: selected.excluded?.length ? selected.excluded : [''],
                dates: selected.dates?.length ? selected.dates : [{ startDate: '', endDate: '', status: '', price: '' }],
              });
            }
          }}
        >
          <option value="">Create new trip</option>
          {trips.map((trip) => (
            <option key={trip._id} value={trip._id}>
              {trip.title}
            </option>
          ))}
        </select>
      </div>
      <form onSubmit={submit} className="mt-4 grid gap-3 max-w-xl">
        <input className="rounded-full border-slate-200" placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <input className="rounded-full border-slate-200" placeholder="Slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
        <input className="rounded-full border-slate-200" placeholder="Hero Image URL" value={form.heroImage} onChange={(e) => setForm({ ...form, heroImage: e.target.value })} />
        <select className="rounded-full border-slate-200" value={form.destination} onChange={(e) => setForm({ ...form, destination: e.target.value })}>
          <option value="Nepal">Nepal</option>
          <option value="Tanzania">Tanzania</option>
          <option value="Bhutan">Bhutan</option>
          <option value="Tibet">Tibet</option>
        </select>
        <select className="rounded-full border-slate-200" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
          <option value="Trekking">Trekking</option>
          <option value="Heli Tour">Heli Tour</option>
          <option value="Adventure">Adventure</option>
          <option value="Climbing">Climbing</option>
          <option value="Cultural">Cultural</option>
          <option value="Wildlife">Wildlife</option>
        </select>
        <select className="rounded-full border-slate-200" value={form.region} onChange={(e) => setForm({ ...form, region: e.target.value })}>
          <option value="Everest">Everest</option>
          <option value="Annapurna">Annapurna</option>
          <option value="Langtang">Langtang</option>
          <option value="Manaslu">Manaslu</option>
          <option value="Upper Mustang">Upper Mustang</option>
          <option value="Dolpo">Dolpo</option>
          <option value="Tibet">Tibet</option>
          <option value="Bhutan">Bhutan</option>
          <option value="Tanzania">Tanzania</option>
        </select>
        <div className="grid grid-cols-2 gap-3">
          <input className="rounded-full border-slate-200" type="number" min="1" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} />
          <input className="rounded-full border-slate-200" type="number" min="0" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <input className="rounded-full border-slate-200" type="number" min="0" value={form.oldPrice} onChange={(e) => setForm({ ...form, oldPrice: e.target.value })} placeholder="Old Price" />
          <input className="rounded-full border-slate-200" value={form.tripGrade} onChange={(e) => setForm({ ...form, tripGrade: e.target.value })} placeholder="Trip Grade" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <input className="rounded-full border-slate-200" value={form.maxAltitude} onChange={(e) => setForm({ ...form, maxAltitude: e.target.value })} placeholder="Max Altitude" />
          <input className="rounded-full border-slate-200" value={form.groupSize} onChange={(e) => setForm({ ...form, groupSize: e.target.value })} placeholder="Group Size" />
        </div>
        <input className="rounded-full border-slate-200" value={form.activity} onChange={(e) => setForm({ ...form, activity: e.target.value })} placeholder="Activity" />
        <input className="rounded-full border-slate-200" value={form.destinationLabel} onChange={(e) => setForm({ ...form, destinationLabel: e.target.value })} placeholder="Destination Label" />
        <textarea className="rounded-2xl border-slate-200" value={form.shortDescription} onChange={(e) => setForm({ ...form, shortDescription: e.target.value })} placeholder="Short Description" />
        <textarea className="rounded-2xl border-slate-200 min-h-[120px]" value={form.longDescription} onChange={(e) => setForm({ ...form, longDescription: e.target.value })} placeholder="Long Description (HTML allowed: <b>, <i>, <u>, <p>, <ul>, <li>, <a>)" />

        <div className="border rounded-2xl p-4">
          <p className="font-semibold text-forest-800">Itinerary</p>
          <div className="mt-3 space-y-3">
            {form.itinerary.map((it, idx) => (
              <div key={idx} className="grid md:grid-cols-[80px_1fr_1fr_auto] gap-2 items-center">
                <input className="rounded-full border-slate-200" type="number" min="1" value={it.day} onChange={(e) => {
                  const itinerary = [...form.itinerary];
                  itinerary[idx].day = Number(e.target.value);
                  setForm({ ...form, itinerary });
                }} placeholder="Day" />
                <input className="rounded-full border-slate-200" value={it.title} onChange={(e) => {
                  const itinerary = [...form.itinerary];
                  itinerary[idx].title = e.target.value;
                  setForm({ ...form, itinerary });
                }} placeholder="Title" />
                <input className="rounded-full border-slate-200" value={it.description} onChange={(e) => {
                  const itinerary = [...form.itinerary];
                  itinerary[idx].description = e.target.value;
                  setForm({ ...form, itinerary });
                }} placeholder="Description" />
                <button className="text-xs text-sunrise-500" type="button" onClick={() => {
                  const itinerary = form.itinerary.filter((_, i) => i !== idx);
                  setForm({ ...form, itinerary: itinerary.length ? itinerary : [{ day: 1, title: '', description: '' }] });
                }}>Remove</button>
              </div>
            ))}
          </div>
          <button className="mt-3 text-xs text-forest-800 font-semibold" type="button" onClick={() => {
            setForm({ ...form, itinerary: [...form.itinerary, { day: form.itinerary.length + 1, title: '', description: '' }] });
          }}>+ Add day</button>
        </div>

        <div className="border rounded-2xl p-4">
          <p className="font-semibold text-forest-800">Gallery</p>
          <div className="mt-3 space-y-2">
            {form.gallery.map((url, idx) => (
              <div key={idx} className="grid md:grid-cols-[1fr_auto] gap-2 items-center">
                <input className="rounded-full border-slate-200" value={url} onChange={(e) => {
                  const gallery = [...form.gallery];
                  gallery[idx] = e.target.value;
                  setForm({ ...form, gallery });
                }} placeholder="Image URL" />
                <button className="text-xs text-sunrise-500" type="button" onClick={() => {
                  const gallery = form.gallery.filter((_, i) => i !== idx);
                  setForm({ ...form, gallery: gallery.length ? gallery : [''] });
                }}>Remove</button>
              </div>
            ))}
          </div>
          <button className="mt-3 text-xs text-forest-800 font-semibold" type="button" onClick={() => setForm({ ...form, gallery: [...form.gallery, ''] })}>
            + Add image
          </button>
        </div>

        <div className="border rounded-2xl p-4">
          <p className="font-semibold text-forest-800">Included</p>
          <div className="mt-3 space-y-2">
            {form.included.map((item, idx) => (
              <div key={idx} className="grid md:grid-cols-[1fr_auto] gap-2 items-center">
                <input className="rounded-full border-slate-200" value={item} onChange={(e) => {
                  const included = [...form.included];
                  included[idx] = e.target.value;
                  setForm({ ...form, included });
                }} placeholder="Included item" />
                <button className="text-xs text-sunrise-500" type="button" onClick={() => {
                  const included = form.included.filter((_, i) => i !== idx);
                  setForm({ ...form, included: included.length ? included : [''] });
                }}>Remove</button>
              </div>
            ))}
          </div>
          <button className="mt-3 text-xs text-forest-800 font-semibold" type="button" onClick={() => setForm({ ...form, included: [...form.included, ''] })}>
            + Add included
          </button>
        </div>

        <div className="border rounded-2xl p-4">
          <p className="font-semibold text-forest-800">Excluded</p>
          <div className="mt-3 space-y-2">
            {form.excluded.map((item, idx) => (
              <div key={idx} className="grid md:grid-cols-[1fr_auto] gap-2 items-center">
                <input className="rounded-full border-slate-200" value={item} onChange={(e) => {
                  const excluded = [...form.excluded];
                  excluded[idx] = e.target.value;
                  setForm({ ...form, excluded });
                }} placeholder="Excluded item" />
                <button className="text-xs text-sunrise-500" type="button" onClick={() => {
                  const excluded = form.excluded.filter((_, i) => i !== idx);
                  setForm({ ...form, excluded: excluded.length ? excluded : [''] });
                }}>Remove</button>
              </div>
            ))}
          </div>
          <button className="mt-3 text-xs text-forest-800 font-semibold" type="button" onClick={() => setForm({ ...form, excluded: [...form.excluded, ''] })}>
            + Add excluded
          </button>
        </div>

        <div className="border rounded-2xl p-4">
          <p className="font-semibold text-forest-800">Dates & Price</p>
          <div className="mt-3 space-y-3">
            {form.dates.map((row, idx) => (
              <div key={idx} className="grid md:grid-cols-[1fr_1fr_1fr_1fr_auto] gap-2 items-center">
                <input className="rounded-full border-slate-200" value={row.startDate} onChange={(e) => {
                  const dates = [...form.dates];
                  dates[idx].startDate = e.target.value;
                  setForm({ ...form, dates });
                }} placeholder="Start date" />
                <input className="rounded-full border-slate-200" value={row.endDate} onChange={(e) => {
                  const dates = [...form.dates];
                  dates[idx].endDate = e.target.value;
                  setForm({ ...form, dates });
                }} placeholder="End date" />
                <input className="rounded-full border-slate-200" value={row.status} onChange={(e) => {
                  const dates = [...form.dates];
                  dates[idx].status = e.target.value;
                  setForm({ ...form, dates });
                }} placeholder="Status" />
                <input className="rounded-full border-slate-200" value={row.price} onChange={(e) => {
                  const dates = [...form.dates];
                  dates[idx].price = e.target.value;
                  setForm({ ...form, dates });
                }} placeholder="Price (e.g., US$1540)" />
                <button className="text-xs text-sunrise-500" type="button" onClick={() => {
                  const dates = form.dates.filter((_, i) => i !== idx);
                  setForm({ ...form, dates: dates.length ? dates : [{ startDate: '', endDate: '', status: '', price: '' }] });
                }}>Remove</button>
              </div>
            ))}
          </div>
          <button className="mt-3 text-xs text-forest-800 font-semibold" type="button" onClick={() => setForm({ ...form, dates: [...form.dates, { startDate: '', endDate: '', status: '', price: '' }] })}>
            + Add date
          </button>
        </div>
        <button className="py-3 rounded-full bg-[#243b75] text-white" type="submit">Add Trip</button>
        {message && <p className="text-sm text-slate-500">{message}</p>}
      </form>
    </div>
  );
};

export default TripsAdmin;
