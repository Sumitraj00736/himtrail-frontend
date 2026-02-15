import { useEffect, useState } from 'react';
import { api } from '../../services/api';

const FeaturedTripsAdmin = () => {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({
    tag: '',
    title: '',
    duration: '',
    price: '',
    oldPrice: '',
    reviews: '',
    image: '',
    order: 0,
  });

  const load = async () => {
    const res = await api.get('/dashboard/featured-trips');
    setItems(res.data.data);
  };

  useEffect(() => {
    load();
  }, []);

  const create = async (e) => {
    e.preventDefault();
    await api.post('/dashboard/featured-trips', form);
    setForm({ tag: '', title: '', duration: '', price: '', oldPrice: '', reviews: '', image: '', order: 0 });
    load();
  };

  const remove = async (id) => {
    await api.delete(`/dashboard/featured-trips/${id}`);
    load();
  };

  return (
    <div>
      <h1 className="text-xl font-semibold text-[#243b75]">Featured Trips</h1>
      <form onSubmit={create} className="mt-4 grid gap-3 max-w-xl">
        <input className="rounded-full border-slate-200" placeholder="Tag" value={form.tag} onChange={(e) => setForm({ ...form, tag: e.target.value })} />
        <input className="rounded-full border-slate-200" placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <input className="rounded-full border-slate-200" placeholder="Duration" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} />
        <input className="rounded-full border-slate-200" placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
        <input className="rounded-full border-slate-200" placeholder="Old Price" value={form.oldPrice} onChange={(e) => setForm({ ...form, oldPrice: e.target.value })} />
        <input className="rounded-full border-slate-200" placeholder="Reviews" value={form.reviews} onChange={(e) => setForm({ ...form, reviews: e.target.value })} />
        <input className="rounded-full border-slate-200" placeholder="Image URL" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
        <input className="rounded-full border-slate-200" type="number" placeholder="Order" value={form.order} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} />
        <button className="py-3 rounded-full bg-[#243b75] text-white" type="submit">Add Card</button>
      </form>

      <div className="mt-6 space-y-3">
        {items.map((item) => (
          <div key={item._id} className="border rounded-xl p-4">
            <div className="font-semibold">{item.title}</div>
            <div className="text-sm text-slate-500">{item.tag}</div>
            <button className="mt-2 text-xs text-red-500" onClick={() => remove(item._id)}>
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedTripsAdmin;
