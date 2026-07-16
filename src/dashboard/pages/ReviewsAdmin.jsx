import { useCallback, useEffect, useMemo, useState } from 'react';
import { api } from '../../services/api';

const emptyForm = () => ({
  authorName: '',
  title: '',
  body: '',
  rating: 5,
  source: 'Google',
  publishedDate: '',
});

const SOURCES = ['Google', 'TripAdvisor', 'Trustpilot', 'Facebook', 'Website', 'Other'];

const Stars = ({ value, onChange, size = 'md' }) => {
  const sz = size === 'sm' ? 'text-sm' : 'text-xl';
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange?.(n)}
          disabled={!onChange}
          className={`${sz} leading-none transition-transform ${
            onChange ? 'hover:scale-110 cursor-pointer' : 'cursor-default'
          } ${n <= value ? 'text-amber-400' : 'text-slate-200'}`}
          aria-label={`${n} stars`}
        >
          ★
        </button>
      ))}
    </div>
  );
};

const ReviewsAdmin = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [filter, setFilter] = useState('All');
  const [query, setQuery] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/dashboard/reviews');
      setItems(res.data.data || []);
    } catch {
      setError('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const flash = (text) => {
    setMessage(text);
    setTimeout(() => setMessage(''), 2500);
  };

  const avgRating = useMemo(() => {
    if (!items.length) return 0;
    return items.reduce((s, r) => s + Number(r.rating || 0), 0) / items.length;
  }, [items]);

  const sourceTabs = useMemo(() => {
    const sources = [...new Set(items.map((i) => i.source).filter(Boolean))];
    return ['All', ...sources];
  }, [items]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((item) => {
      if (filter !== 'All' && item.source !== filter) return false;
      if (!q) return true;
      return [item.authorName, item.title, item.body, item.source]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(q);
    });
  }, [items, filter, query]);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm());
    setError('');
    setShowForm(true);
  };

  const openEdit = (item) => {
    setEditingId(item._id);
    setForm({
      authorName: item.authorName || '',
      title: item.title || '',
      body: item.body || '',
      rating: item.rating || 5,
      source: item.source || 'Google',
      publishedDate: item.publishedDate || '',
    });
    setError('');
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm());
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.authorName.trim() || !form.title.trim() || !form.body.trim()) {
      setError('Author, title, and review body are required');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        ...form,
        rating: Number(form.rating) || 5,
      };
      if (editingId) {
        await api.put(`/dashboard/reviews/${editingId}`, payload);
        flash('Review updated');
      } else {
        await api.post('/dashboard/reviews', payload);
        flash('Review added');
      }
      closeForm();
      await load();
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this review?')) return;
    try {
      await api.delete(`/dashboard/reviews/${id}`);
      flash('Review deleted');
      await load();
    } catch (err) {
      setError(err.response?.data?.error || 'Delete failed');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Reviews</h1>
          <p className="text-slate-500 mt-1 text-sm font-medium">
            Customer reviews shown on the homepage and trip pages.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="px-5 py-2.5 rounded-xl bg-brand text-white text-sm font-bold shadow-md shadow-brand/25 hover:shadow-lg hover:-translate-y-0.5 transition-all"
        >
          ➕ Add review
        </button>
      </div>

      {message && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-semibold rounded-2xl px-4 py-3">
          {message}
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {[
          { label: 'Total reviews', value: items.length, color: 'text-brand', bg: 'bg-brand/5' },
          {
            label: 'Average rating',
            value: items.length ? avgRating.toFixed(1) : '—',
            color: 'text-amber-600',
            bg: 'bg-amber-50',
          },
          {
            label: 'Sources',
            value: sourceTabs.length - 1,
            color: 'text-slate-700',
            bg: 'bg-slate-100',
          },
        ].map(({ label, value, color, bg }) => (
          <div key={label} className={`${bg} rounded-2xl p-4 text-center`}>
            <p className={`text-2xl font-black ${color}`}>{value}</p>
            <p className="text-xs text-slate-500 font-medium mt-1">{label}</p>
          </div>
        ))}
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-brand/5 to-transparent">
            <div>
              <h2 className="font-bold text-slate-800 text-sm">
                {editingId ? '✏️ Edit review' : '➕ New review'}
              </h2>
              <p className="text-[11px] text-slate-400 mt-0.5">Appears on the public site after save</p>
            </div>
            <button
              type="button"
              onClick={closeForm}
              className="w-8 h-8 rounded-xl hover:bg-slate-100 text-slate-400"
            >
              ✕
            </button>
          </div>

          <div className="p-6 space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Author name
                </label>
                <input
                  required
                  value={form.authorName}
                  onChange={(e) => setForm({ ...form, authorName: e.target.value })}
                  placeholder="Jane Doe"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-brand/20"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Source
                </label>
                <select
                  value={form.source}
                  onChange={(e) => setForm({ ...form, source: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-brand/20 bg-white"
                >
                  {SOURCES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Title
              </label>
              <input
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Amazing trek experience"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-brand/20"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Review
              </label>
              <textarea
                required
                rows={4}
                value={form.body}
                onChange={(e) => setForm({ ...form, body: e.target.value })}
                placeholder="Write the full review…"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-brand/20 resize-y"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Rating
                </label>
                <div className="flex items-center gap-3">
                  <Stars
                    value={Number(form.rating)}
                    onChange={(n) => setForm({ ...form, rating: n })}
                  />
                  <span className="text-sm font-bold text-slate-600">{form.rating}/5</span>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Published date
                </label>
                <input
                  value={form.publishedDate}
                  onChange={(e) => setForm({ ...form, publishedDate: e.target.value })}
                  placeholder="e.g. March 2026 or 2026-03-15"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-brand/20"
                />
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                {error}
              </p>
            )}

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={closeForm}
                className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2.5 rounded-xl bg-brand text-white text-sm font-bold shadow-md disabled:opacity-60"
              >
                {saving ? 'Saving…' : editingId ? 'Update review' : 'Add review'}
              </button>
            </div>
          </div>
        </form>
      )}

      <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
        <div className="flex gap-2 flex-wrap">
          {sourceTabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setFilter(tab)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                filter === tab ? 'bg-brand text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search reviews…"
          className="px-4 py-2 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-brand/20 w-full sm:w-56"
        />
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-slate-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-slate-200 rounded-3xl">
          <p className="text-4xl mb-3">⭐</p>
          <p className="font-bold text-slate-600">No reviews yet</p>
          <p className="text-sm text-slate-400 mt-1">Add your first customer review to show on the site.</p>
          <button
            type="button"
            onClick={openCreate}
            className="mt-4 px-5 py-2.5 rounded-xl bg-brand text-white text-sm font-bold"
          >
            ➕ Add review
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => (
            <div
              key={item._id}
              className="group bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-md hover:border-slate-300 transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-1.5">
                    <Stars value={item.rating} size="sm" />
                    {item.source && (
                      <span className="text-[10px] font-bold uppercase tracking-wide bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                        {item.source}
                      </span>
                    )}
                    {item.publishedDate && (
                      <span className="text-[11px] text-slate-400">{item.publishedDate}</span>
                    )}
                  </div>
                  <h3 className="font-bold text-slate-800 text-sm">{item.title}</h3>
                  <p className="text-sm text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">{item.body}</p>
                  <p className="text-xs font-semibold text-slate-400 mt-2">— {item.authorName}</p>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => openEdit(item)}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold text-brand bg-brand/5 hover:bg-brand/10"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(item._id)}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100"
                  >
                    🗑
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewsAdmin;
