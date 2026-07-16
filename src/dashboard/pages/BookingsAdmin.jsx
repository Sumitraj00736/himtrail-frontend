import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';

const STATUS_META = {
  Pending: {
    label: 'Pending',
    badge: 'bg-amber-50 text-amber-700 border-amber-200',
    dot: 'bg-amber-400',
  },
  Confirmed: {
    label: 'Confirmed',
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    dot: 'bg-emerald-500',
  },
  Cancelled: {
    label: 'Cancelled',
    badge: 'bg-slate-100 text-slate-500 border-slate-200',
    dot: 'bg-slate-400',
  },
};

const formatDate = (value) => {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const BookingsAdmin = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [filter, setFilter] = useState('All');
  const [query, setQuery] = useState('');
  const [updatingId, setUpdatingId] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/bookings');
      setBookings(res.data.data || []);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load bookings');
      setBookings([]);
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

  const counts = useMemo(() => {
    const base = { All: bookings.length, Pending: 0, Confirmed: 0, Cancelled: 0 };
    bookings.forEach((b) => {
      if (base[b.status] != null) base[b.status] += 1;
    });
    return base;
  }, [bookings]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return bookings.filter((b) => {
      if (filter !== 'All' && b.status !== filter) return false;
      if (!q) return true;
      const hay = [
        b.trip?.title,
        b.travelerName,
        b.travelerEmail,
        b.travelerPhone,
        b.user?.email,
        b.user?.name,
        b.notes,
        b.tripPrice,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return hay.includes(q);
    });
  }, [bookings, filter, query]);

  const updateStatus = async (id, status) => {
    setUpdatingId(id);
    try {
      await api.put(`/bookings/${id}`, { status });
      setBookings((prev) => prev.map((b) => (b._id === id ? { ...b, status } : b)));
      flash(`Marked as ${status}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Bookings</h1>
          <p className="text-slate-500 mt-1 text-sm font-medium">
            Manage trip enquiries and confirmations from travelers.
          </p>
        </div>
        <button
          type="button"
          onClick={load}
          className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-all"
        >
          ↻ Refresh
        </button>
      </div>

      {message && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-semibold rounded-2xl px-4 py-3">
          {message}
        </div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 text-sm font-semibold rounded-2xl px-4 py-3">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { key: 'All', label: 'Total', color: 'text-brand', bg: 'bg-brand/5' },
          { key: 'Pending', label: 'Pending', color: 'text-amber-600', bg: 'bg-amber-50' },
          { key: 'Confirmed', label: 'Confirmed', color: 'text-emerald-700', bg: 'bg-emerald-50' },
          { key: 'Cancelled', label: 'Cancelled', color: 'text-slate-600', bg: 'bg-slate-100' },
        ].map(({ key, label, color, bg }) => (
          <button
            key={key}
            type="button"
            onClick={() => setFilter(key)}
            className={`${bg} rounded-2xl p-4 text-center transition-all ${
              filter === key ? 'ring-2 ring-brand/30 shadow-sm' : 'hover:opacity-90'
            }`}
          >
            <p className={`text-2xl font-black ${color}`}>{counts[key]}</p>
            <p className="text-xs text-slate-500 font-medium mt-1">{label}</p>
          </button>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
        <div className="flex gap-2 flex-wrap">
          {['All', 'Pending', 'Confirmed', 'Cancelled'].map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setFilter(tab)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                filter === tab ? 'bg-brand text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab}
              <span className="ml-1.5 opacity-70">{counts[tab]}</span>
            </button>
          ))}
        </div>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search traveler, trip, email…"
          className="px-4 py-2 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-brand/20 w-full sm:w-64"
        />
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-slate-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50">
          <p className="text-4xl mb-3">📅</p>
          <p className="font-bold text-slate-600">No bookings found</p>
          <p className="text-sm text-slate-400 mt-1 max-w-sm mx-auto">
            {filter === 'All'
              ? 'New booking enquiries from the site will appear here.'
              : `No ${filter.toLowerCase()} bookings right now.`}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((booking) => {
            const meta = STATUS_META[booking.status] || STATUS_META.Pending;
            const isOpen = expandedId === booking._id;
            const traveler =
              booking.travelerName || booking.user?.name || booking.travelerEmail || booking.user?.email || 'Guest';
            const email = booking.travelerEmail || booking.user?.email;
            const busy = updatingId === booking._id;

            return (
              <div
                key={booking._id}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-md hover:border-slate-300 transition-all"
              >
                <div className="p-5 flex items-start gap-4">
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-200">
                    {booking.trip?.heroImage ? (
                      <img
                        src={booking.trip.heroImage}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xl">🏔️</div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-bold text-slate-800 text-sm truncate">
                            {booking.trip?.title || 'Unknown trip'}
                          </h3>
                          <span
                            className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full border ${meta.badge}`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${meta.dot}`} />
                            {meta.label}
                          </span>
                        </div>
                        <p className="text-sm text-slate-500 mt-1">
                          <span className="font-semibold text-slate-700">{traveler}</span>
                          {email && <span className="text-slate-400"> · {email}</span>}
                        </p>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-[11px] text-slate-400 font-medium">
                          {booking.groupSize != null && <span>👥 {booking.groupSize} travelers</span>}
                          {(booking.tripStartDate || booking.tripEndDate) && (
                            <span>
                              🗓 {[booking.tripStartDate, booking.tripEndDate].filter(Boolean).join(' → ')}
                            </span>
                          )}
                          {booking.tripPrice && <span className="text-brand font-bold">{booking.tripPrice}</span>}
                          {booking.createdAt && <span>Received {formatDate(booking.createdAt)}</span>}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">
                        {booking.status !== 'Confirmed' && (
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() => updateStatus(booking._id, 'Confirmed')}
                            className="px-3 py-1.5 rounded-xl text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 disabled:opacity-50 transition-all"
                          >
                            ✓ Confirm
                          </button>
                        )}
                        {booking.status === 'Confirmed' && (
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() => updateStatus(booking._id, 'Pending')}
                            className="px-3 py-1.5 rounded-xl text-xs font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 disabled:opacity-50 transition-all"
                          >
                            ↩ Pending
                          </button>
                        )}
                        {booking.status !== 'Cancelled' && (
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() => updateStatus(booking._id, 'Cancelled')}
                            className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 transition-all"
                          >
                            Cancel
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => setExpandedId(isOpen ? null : booking._id)}
                          className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50"
                        >
                          {isOpen ? 'Hide' : 'Details'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {isOpen && (
                  <div className="px-5 pb-5 pt-0 border-t border-slate-100 bg-slate-50/60">
                    <div className="grid sm:grid-cols-2 gap-4 pt-4 text-sm">
                      <div className="space-y-2">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Traveler</p>
                        <p className="text-slate-700 font-medium">{traveler}</p>
                        {email && (
                          <a href={`mailto:${email}`} className="block text-brand text-xs font-semibold hover:underline">
                            {email}
                          </a>
                        )}
                        {booking.travelerPhone && (
                          <a
                            href={`tel:${booking.travelerPhone}`}
                            className="block text-slate-600 text-xs font-medium hover:underline"
                          >
                            📞 {booking.travelerPhone}
                          </a>
                        )}
                      </div>
                      <div className="space-y-2">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Trip</p>
                        {booking.trip?.slug ? (
                          <Link
                            to={`/trips/${booking.trip.slug}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-brand text-xs font-semibold hover:underline"
                          >
                            View trip page ↗
                          </Link>
                        ) : (
                          <p className="text-slate-500 text-xs">No trip link</p>
                        )}
                        {booking.trip?.destination && (
                          <p className="text-xs text-slate-500">
                            {booking.trip.destination}
                            {booking.trip.region ? ` · ${booking.trip.region}` : ''}
                          </p>
                        )}
                      </div>
                    </div>
                    {booking.notes && (
                      <div className="mt-4 rounded-xl bg-white border border-slate-200 px-4 py-3">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Notes</p>
                        <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">{booking.notes}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default BookingsAdmin;
