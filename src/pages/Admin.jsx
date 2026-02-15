import { useState } from 'react';
import { useSelector } from 'react-redux';
import { api } from '../services/api';

const Admin = () => {
  const { user } = useSelector((state) => state.auth);
  const [message, setMessage] = useState('');
  const [form, setForm] = useState({
    title: '',
    slug: '',
    destination: 'Nepal',
    category: 'Trekking',
    region: 'Everest',
    duration: 10,
    price: 1500,
  });

  const submitTrip = async (e) => {
    e.preventDefault();
    try {
      await api.post('/trips', form);
      setMessage('Trip created.');
    } catch (err) {
      setMessage('Admin access required.');
    }
  };

  return (
    <section className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="section-title">Admin Panel</h1>
      <p className="text-forest-600 mt-2">
        Manage trips and inquiries.
      </p>
      {!user || user.role !== 'Admin' ? (
        <p className="mt-6 text-sm text-forest-700">
          Login with an Admin account to manage trips.
        </p>
      ) : (
        <form onSubmit={submitTrip} className="mt-6 grid gap-4">
          <input
            className="rounded-full border-forest-200"
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <input
            className="rounded-full border-forest-200"
            placeholder="Slug"
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
          />
          <div className="grid md:grid-cols-2 gap-4">
            <select
              className="rounded-full border-forest-200"
              value={form.destination}
              onChange={(e) => setForm({ ...form, destination: e.target.value })}
            >
              <option value="Nepal">Nepal</option>
              <option value="Tanzania">Tanzania</option>
              <option value="Bhutan">Bhutan</option>
              <option value="Tibet">Tibet</option>
            </select>
            <select
              className="rounded-full border-forest-200"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            >
              <option value="Trekking">Trekking</option>
              <option value="Heli Tour">Heli Tour</option>
              <option value="Adventure">Adventure</option>
              <option value="Climbing">Climbing</option>
              <option value="Cultural">Cultural</option>
              <option value="Wildlife">Wildlife</option>
            </select>
          </div>
          <select
            className="rounded-full border-forest-200"
            value={form.region}
            onChange={(e) => setForm({ ...form, region: e.target.value })}
          >
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
          <div className="grid md:grid-cols-2 gap-4">
            <input
              className="rounded-full border-forest-200"
              type="number"
              min="1"
              value={form.duration}
              onChange={(e) => setForm({ ...form, duration: e.target.value })}
            />
            <input
              className="rounded-full border-forest-200"
              type="number"
              min="0"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
            />
          </div>
          <button className="py-3 rounded-full bg-forest-900 text-white" type="submit">
            Add Trip
          </button>
        </form>
      )}
      {message && <p className="mt-4 text-sm text-forest-700">{message}</p>}
    </section>
  );
};

export default Admin;
