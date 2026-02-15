import { useEffect, useState } from 'react';
import { api } from '../../services/api';

const DepartingSoonAdmin = () => {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({
    tripName: '',
    startDate: '',
    endDate: '',
    status: 'Guaranteed',
    price: 'US$0',
    order: 0,
  });

  const load = async () => {
    const res = await api.get('/dashboard/departing-soon');
    setItems(res.data.data);
  };

  useEffect(() => {
    load();
  }, []);

  const create = async (e) => {
    e.preventDefault();
    await api.post('/dashboard/departing-soon', form);
    setForm({ tripName: '', startDate: '', endDate: '', status: 'Guaranteed', price: 'US$0', order: 0 });
    load();
  };

  const remove = async (id) => {
    await api.delete(`/dashboard/departing-soon/${id}`);
    load();
  };

  return (
    <div>
      <h1 className="text-xl font-semibold text-[#243b75]">Departing Soon</h1>
      <form onSubmit={create} className="mt-4 grid gap-3 max-w-xl">
        <input className="rounded-full border-slate-200" placeholder="Trip name" value={form.tripName} onChange={(e) => setForm({ ...form, tripName: e.target.value })} />
        <input className="rounded-full border-slate-200" placeholder="Start date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
        <input className="rounded-full border-slate-200" placeholder="End date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
        <input className="rounded-full border-slate-200" placeholder="Status" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} />
        <input className="rounded-full border-slate-200" placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
        <input className="rounded-full border-slate-200" type="number" placeholder="Order" value={form.order} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} />
        <button className="py-3 rounded-full bg-[#243b75] text-white" type="submit">Add Row</button>
      </form>

      <div className="mt-6 space-y-3">
        {items.map((item) => (
          <div key={item._id} className="border rounded-xl p-4">
            <div className="font-semibold">{item.tripName}</div>
            <div className="text-sm text-slate-500">{item.startDate} - {item.endDate}</div>
            <button className="mt-2 text-xs text-red-500" onClick={() => remove(item._id)}>
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DepartingSoonAdmin;
