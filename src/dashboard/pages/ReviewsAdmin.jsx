import { useEffect, useState } from 'react';
import { api } from '../../services/api';

const ReviewsAdmin = () => {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({
    authorName: '',
    title: '',
    body: '',
    rating: 5,
    source: 'Google',
    publishedDate: '',
  });

  const load = async () => {
    const res = await api.get('/dashboard/reviews');
    setItems(res.data.data);
  };

  useEffect(() => {
    load();
  }, []);

  const create = async (e) => {
    e.preventDefault();
    await api.post('/dashboard/reviews', form);
    setForm({ authorName: '', title: '', body: '', rating: 5, source: 'Google', publishedDate: '' });
    load();
  };

  const remove = async (id) => {
    await api.delete(`/dashboard/reviews/${id}`);
    load();
  };

  return (
    <div>
      <h1 className="text-xl font-semibold text-[#243b75]">Reviews</h1>
      <form onSubmit={create} className="mt-4 grid gap-3 max-w-xl">
        <input className="rounded-full border-slate-200" placeholder="Author" value={form.authorName} onChange={(e) => setForm({ ...form, authorName: e.target.value })} />
        <input className="rounded-full border-slate-200" placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <textarea className="rounded-2xl border-slate-200" placeholder="Body" value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} />
        <input className="rounded-full border-slate-200" type="number" min="1" max="5" value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })} />
        <input className="rounded-full border-slate-200" placeholder="Source" value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })} />
        <input className="rounded-full border-slate-200" placeholder="Published Date" value={form.publishedDate} onChange={(e) => setForm({ ...form, publishedDate: e.target.value })} />
        <button className="py-3 rounded-full bg-[#243b75] text-white" type="submit">Add Review</button>
      </form>

      <div className="mt-6 space-y-3">
        {items.map((item) => (
          <div key={item._id} className="border rounded-xl p-4">
            <div className="font-semibold">{item.title}</div>
            <div className="text-sm text-slate-500">{item.authorName}</div>
            <button className="mt-2 text-xs text-red-500" onClick={() => remove(item._id)}>
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewsAdmin;
