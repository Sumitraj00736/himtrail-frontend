import { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { api } from '../../services/api';

/* ─── helpers ─────────────────────────────────────────── */
const emptyMenu = () => ({
  label: '',
  style: 'mega',
  order: 0,
  columns: [{ title: '', items: [{ label: '', tripId: '', href: '' }] }],
});

const deepClone = (v) => JSON.parse(JSON.stringify(v));

const tripHref = (slug) => `/trips/${slug}`;

/** Pull slug from legacy `/trips/foo` or bare slug */
const slugFromHref = (href = '') =>
  String(href)
    .replace(/^\/?(trips|destinations)\//i, '')
    .replace(/^\//, '')
    .toLowerCase()
    .trim();

/** Attach tripId to legacy items that only have href */
const hydrateMenuTripIds = (menu, trips) => {
  if (!menu?.columns?.length || !trips?.length) return menu;
  const bySlug = new Map(trips.map((t) => [String(t.slug).toLowerCase(), t]));
  const columns = menu.columns.map((col) => ({
    ...col,
    items: (col.items || []).map((item) => {
      if (item.tripId) return item;
      const slug = slugFromHref(item.href);
      const trip = slug ? bySlug.get(slug) : null;
      if (!trip) return item;
      return {
        ...item,
        tripId: trip._id,
        href: tripHref(trip.slug),
        label: item.label || trip.title,
      };
    }),
  }));
  return { ...menu, columns };
};

/* ─── sub-components ──────────────────────────────────── */
const Badge = ({ children, color = 'slate' }) => {
  const colors = {
    slate: 'bg-slate-100 text-slate-600',
    emerald: 'bg-emerald-100 text-emerald-700',
    amber: 'bg-amber-100 text-amber-700',
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wide ${colors[color]}`}
    >
      {children}
    </span>
  );
};

const IconBtn = ({ onClick, title, children, danger }) => (
  <button
    type="button"
    title={title}
    onClick={onClick}
    className={`w-8 h-8 flex items-center justify-center rounded-xl text-sm transition-all duration-200 flex-shrink-0 ${
      danger
        ? 'hover:bg-red-50 text-slate-400 hover:text-red-500'
        : 'hover:bg-slate-100 text-slate-400 hover:text-slate-700'
    }`}
  >
    {children}
  </button>
);

/* ─── Searchable trip picker ──────────────────────────── */
const TripSearchSelect = ({ trips, value, onSelect }) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const rootRef = useRef(null);
  const inputRef = useRef(null);

  const selected = useMemo(
    () => trips.find((t) => String(t._id) === String(value)) || null,
    [trips, value]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return trips.slice(0, 80);
    return trips
      .filter((t) => {
        const hay = [t.title, t.slug, t.region, t.destination, t.category]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();
        return hay.includes(q);
      })
      .slice(0, 80);
  }, [trips, query]);

  useEffect(() => {
    const onDoc = (e) => {
      if (!rootRef.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  useEffect(() => {
    if (open) {
      setQuery('');
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [open]);

  const pick = (trip) => {
    onSelect(trip);
    setOpen(false);
    setQuery('');
  };

  return (
    <div ref={rootRef} className="relative w-full">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`w-full text-left text-sm bg-white border-2 rounded-xl px-3 py-2.5 transition-all flex items-center gap-2 ${
          selected
            ? 'border-brand/50 ring-2 ring-brand/10 bg-brand/[0.02]'
            : 'border-dashed border-brand/40 hover:border-brand hover:bg-brand/[0.03]'
        }`}
      >
        <span className="text-base leading-none flex-shrink-0">🔍</span>
        <span className="flex-1 min-w-0">
          {selected ? (
            <>
              <span className="block font-semibold text-slate-800 truncate">{selected.title}</span>
              <span className="block text-[11px] text-slate-400 truncate mt-0.5">
                {[selected.destination, selected.region, selected.category].filter(Boolean).join(' · ')}
              </span>
            </>
          ) : (
            <>
              <span className="block font-semibold text-brand">Select trip from database</span>
              <span className="block text-[11px] text-slate-400 mt-0.5">
                Click to search all trips — no path needed
              </span>
            </>
          )}
        </span>
        <span className="text-slate-400 text-xs flex-shrink-0 font-bold">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className="absolute z-50 left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-2xl shadow-xl shadow-slate-200/80 overflow-hidden">
          <div className="p-2 border-b border-slate-100 bg-slate-50/80">
            <input
              ref={inputRef}
              type="search"
              className="w-full text-sm bg-white border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand/40"
              placeholder="Type to filter trips by title, region, destination…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Escape') setOpen(false);
                if (e.key === 'Enter' && filtered[0]) {
                  e.preventDefault();
                  pick(filtered[0]);
                }
              }}
            />
          </div>
          <ul className="max-h-64 overflow-y-auto py-1">
            {trips.length === 0 ? (
              <li className="px-3 py-6 text-center text-xs text-amber-600 font-medium">
                No trips loaded. Create trips first, then refresh this page.
              </li>
            ) : filtered.length === 0 ? (
              <li className="px-3 py-4 text-center text-xs text-slate-400 font-medium">
                No trips match “{query}”
              </li>
            ) : (
              filtered.map((trip) => {
                const isActive = String(trip._id) === String(value);
                return (
                  <li key={trip._id}>
                    <button
                      type="button"
                      onClick={() => pick(trip)}
                      className={`w-full text-left px-3 py-2.5 text-sm transition-colors ${
                        isActive ? 'bg-brand/10 text-brand' : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="font-medium truncate">{trip.title}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5 truncate">
                        {[trip.destination, trip.region, trip.category].filter(Boolean).join(' · ')}
                      </div>
                    </button>
                  </li>
                );
              })
            )}
          </ul>
          <div className="px-3 py-1.5 border-t border-slate-100 text-[10px] text-slate-400 font-medium clear-both">
            Showing {filtered.length} of {trips.length} trips
            {selected && (
              <button
                type="button"
                className="float-right text-red-400 hover:text-red-600 font-semibold"
                onClick={() => {
                  onSelect(null);
                  setOpen(false);
                }}
              >
                Clear link
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

/* ─── Searchable category picker (Destinations menu) ─── */
const CategorySearchSelect = ({ categories, value, onSelect }) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const rootRef = useRef(null);

  const selected = useMemo(
    () => categories.find((c) => String(c._id) === String(value)) || null,
    [categories, value]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return categories;
    return categories.filter((c) =>
      [c.title, c.slug, c.country].filter(Boolean).join(' ').toLowerCase().includes(q)
    );
  }, [categories, query]);

  useEffect(() => {
    const onDoc = (e) => {
      if (!rootRef.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  return (
    <div ref={rootRef} className="relative w-full">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full text-left text-sm bg-white border-2 border-dashed border-brand/40 rounded-xl px-3 py-2.5 hover:border-brand"
      >
        {selected ? (
          <>
            <span className="block font-semibold text-slate-800">{selected.title}</span>
            <span className="block text-[11px] text-slate-400">{selected.country} · {selected.href}</span>
          </>
        ) : (
          <span className="font-semibold text-brand">Select destination category</span>
        )}
      </button>
      {open && (
        <div className="absolute z-50 left-0 right-0 mt-1 bg-white border rounded-2xl shadow-xl overflow-hidden">
          <input
            className="w-full px-3 py-2 border-b text-sm"
            placeholder="Search categories…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <ul className="max-h-48 overflow-y-auto">
            {filtered.map((cat) => (
              <li key={cat._id}>
                <button
                  type="button"
                  className="w-full text-left px-3 py-2 text-sm hover:bg-brand/5"
                  onClick={() => {
                    onSelect(cat);
                    setOpen(false);
                  }}
                >
                  {cat.title} <span className="text-slate-400">({cat.country})</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

/* ─── Column editor ───────────────────────────────────── */
const ColumnEditor = ({ columns, onChange, trips, categories = [], isDestinationsMenu = false }) => {
  const updateColumnTitle = (idx, val) => {
    const cols = deepClone(columns);
    cols[idx].title = val;
    onChange(cols);
  };

  const removeColumn = (idx) => {
    const cols = columns.filter((_, i) => i !== idx);
    onChange(cols.length ? cols : [{ title: '', items: [{ label: '', tripId: '', href: '' }] }]);
  };

  const addColumn = () =>
    onChange([...columns, { title: '', items: [{ label: '', tripId: '', href: '' }] }]);

  const updateItem = (colIdx, itemIdx, patch) => {
    const cols = deepClone(columns);
    cols[colIdx].items[itemIdx] = { ...cols[colIdx].items[itemIdx], ...patch };
    onChange(cols);
  };

  const linkCategory = (colIdx, itemIdx, cat) => {
    const cols = deepClone(columns);
    const item = cols[colIdx].items[itemIdx];
    if (!cat) {
      cols[colIdx].items[itemIdx] = { ...item, categoryId: '', itemType: 'category', tripId: '', href: '' };
    } else {
      cols[colIdx].items[itemIdx] = {
        ...item,
        itemType: 'category',
        categoryId: cat._id,
        tripId: '',
        href: cat.href || '',
        label: item.label?.trim() ? item.label : cat.title,
      };
    }
    onChange(cols);
  };

  const linkTrip = (colIdx, itemIdx, trip) => {
    const cols = deepClone(columns);
    const item = cols[colIdx].items[itemIdx];
    if (!trip) {
      cols[colIdx].items[itemIdx] = { ...item, tripId: '', href: '' };
    } else {
      cols[colIdx].items[itemIdx] = {
        ...item,
        itemType: 'trip',
        tripId: trip._id,
        categoryId: '',
        href: tripHref(trip.slug),
        label: item.label?.trim() ? item.label : trip.title,
      };
    }
    onChange(cols);
  };

  const addItem = (colIdx) => {
    const cols = deepClone(columns);
    cols[colIdx].items.push({ label: '', tripId: '', href: '' });
    onChange(cols);
  };

  const removeItem = (colIdx, itemIdx) => {
    const cols = deepClone(columns);
    cols[colIdx].items = cols[colIdx].items.filter((_, i) => i !== itemIdx);
    if (!cols[colIdx].items.length) cols[colIdx].items = [{ label: '', tripId: '', href: '' }];
    onChange(cols);
  };

  return (
    <div className="space-y-3">
      {columns.map((col, colIdx) => (
        <div
          key={colIdx}
          className="border border-slate-200 rounded-2xl p-4 bg-slate-50/60 transition-all"
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="w-5 h-5 rounded-md bg-brand/10 text-brand text-[10px] font-black flex items-center justify-center flex-shrink-0">
              {colIdx + 1}
            </div>
            <input
              className="flex-1 text-sm font-semibold bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand/40 transition-all"
              placeholder="Column title (e.g., Everest Region)"
              value={col.title}
              onChange={(e) => updateColumnTitle(colIdx, e.target.value)}
            />
            <IconBtn danger title="Remove column" onClick={() => removeColumn(colIdx)}>
              🗑
            </IconBtn>
          </div>

          <div className="space-y-3 pl-7">
            {col.items.map((item, itemIdx) => (
              <div
                key={itemIdx}
                className="bg-white border border-slate-200 rounded-2xl p-3 space-y-2 shadow-sm"
              >
                <div className="flex items-center gap-2">
                  <input
                    className="flex-1 text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand/40 transition-all"
                    placeholder="Item label (menu text)"
                    value={item.label}
                    onChange={(e) => updateItem(colIdx, itemIdx, { label: e.target.value })}
                  />
                  <IconBtn danger title="Remove item" onClick={() => removeItem(colIdx, itemIdx)}>
                    ✕
                  </IconBtn>
                </div>
                {isDestinationsMenu ? (
                  <CategorySearchSelect
                    categories={categories}
                    value={item.categoryId}
                    onSelect={(cat) => linkCategory(colIdx, itemIdx, cat)}
                  />
                ) : (
                  <TripSearchSelect
                    trips={trips}
                    value={item.tripId}
                    onSelect={(trip) => linkTrip(colIdx, itemIdx, trip)}
                  />
                )}
                {isDestinationsMenu && !item.categoryId && (
                  <p className="text-[10px] text-amber-600 font-medium">
                    Pick a destination category — links to its description + packages page.
                  </p>
                )}
                {!isDestinationsMenu && !item.tripId && (
                  <p className="text-[10px] text-amber-600 font-medium">
                    Pick a trip above — the page link is created automatically.
                  </p>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => addItem(colIdx)}
              className="flex items-center gap-1.5 text-xs text-brand font-semibold hover:text-brand/70 transition-colors pl-3.5 mt-1"
            >
              <span className="text-base leading-none">＋</span> Add link
            </button>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addColumn}
        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-2xl border-2 border-dashed border-slate-300 text-sm font-semibold text-slate-500 hover:border-brand/50 hover:text-brand hover:bg-brand/5 transition-all duration-200"
      >
        <span className="text-base leading-none">＋</span> Add column
      </button>
    </div>
  );
};

/* ─── MenuForm (create / edit) ────────────────────────── */
const MenuForm = ({ initial, onSave, onCancel, isEdit, trips, tripsLoading, categories, categoriesLoading }) => {
  const [form, setForm] = useState(() => hydrateMenuTripIds(initial || emptyMenu(), trips));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const isDestinationsMenu = /destination/i.test(form.label || '');

  /* When trips finish loading, attach tripIds from legacy hrefs */
  useEffect(() => {
    if (!trips.length) return;
    setForm((prev) => hydrateMenuTripIds(prev, trips));
  }, [trips]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const missing = (form.columns || []).some((col) =>
      (col.items || []).some((item) => {
        if (isDestinationsMenu) return !item.categoryId && !item.href;
        return !item.tripId && !item.href;
      })
    );
    if (missing) {
      setError(
        isDestinationsMenu
          ? 'Every item must link to a destination category.'
          : 'Every menu item must be linked to a trip.'
      );
      return;
    }

    setSaving(true);
    try {
      await onSave(form);
    } catch (err) {
      setError(err?.response?.data?.message || err?.response?.data?.error || err?.message || 'Failed to save menu.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-3xl border border-slate-200 shadow-lg shadow-slate-100 overflow-hidden"
    >
      <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-brand/5 via-transparent to-transparent border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-brand text-white flex items-center justify-center shadow-md shadow-brand/30 text-base">
            {isEdit ? '✏️' : '＋'}
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-sm leading-tight">
              {isEdit ? 'Edit Menu' : 'Create New Menu'}
            </h3>
            <p className="text-[11px] text-slate-400 font-medium">
              {isDestinationsMenu
                ? 'Link items to destination categories (Day Tours, etc.)'
                : 'Link each item to a trip — no path typing needed'}
            </p>
          </div>
        </div>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="text-slate-400 hover:text-slate-700 text-xl leading-none transition-colors"
          >
            ✕
          </button>
        )}
      </div>

      <div className="p-6 space-y-5">
        <div className="grid sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              Menu Label
            </label>
            <input
              required
              className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand/40 focus:bg-white transition-all"
              placeholder="e.g., Destinations"
              value={form.label}
              onChange={(e) => setForm({ ...form, label: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              Style
            </label>
            <select
              className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand/40 focus:bg-white transition-all"
              value={form.style}
              onChange={(e) => setForm({ ...form, style: e.target.value })}
            >
              <option value="mega">Mega (multi-column)</option>
              <option value="list">List (single column)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              Order
            </label>
            <input
              type="number"
              className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand/40 focus:bg-white transition-all"
              placeholder="0"
              value={form.order}
              onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2.5">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
              {isDestinationsMenu ? 'Columns & Category Links' : 'Columns & Trip Links'}
            </label>
            {isDestinationsMenu ? (
              categoriesLoading ? (
                <span className="text-[11px] text-slate-400 font-medium">Loading categories…</span>
              ) : (
                <span className="text-[11px] text-slate-400 font-medium">{categories.length} categories</span>
              )
            ) : tripsLoading ? (
              <span className="text-[11px] text-slate-400 font-medium">Loading trips…</span>
            ) : (
              <span className="text-[11px] text-slate-400 font-medium">{trips.length} trips available</span>
            )}
          </div>
          <ColumnEditor
            columns={form.columns}
            trips={trips}
            categories={categories}
            isDestinationsMenu={isDestinationsMenu}
            onChange={(cols) => setForm({ ...form, columns: cols })}
          />
        </div>

        {error && (
          <p className="text-sm font-semibold text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-2.5">
            {error}
          </p>
        )}

        <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-all"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={saving || tripsLoading}
            className="px-6 py-2.5 rounded-xl bg-brand text-white text-sm font-bold shadow-md shadow-brand/25 hover:shadow-lg hover:shadow-brand/30 hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0"
          >
            {saving ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving…
              </span>
            ) : isEdit ? (
              'Update Menu'
            ) : (
              'Create Menu'
            )}
          </button>
        </div>
      </div>
    </form>
  );
};

/* ─── MenuCard ────────────────────────────────────────── */
const MenuCard = ({ item, onEdit, onDelete }) => {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Delete the menu "${item.label}"? This cannot be undone.`)) return;
    setDeleting(true);
    await onDelete(item._id);
  };

  const totalLinks = item.columns?.reduce((n, c) => n + (c.items?.length || 0), 0) ?? 0;
  const linkedTrips =
    item.columns?.reduce(
      (n, c) => n + (c.items?.filter((i) => i.tripId).length || 0),
      0
    ) ?? 0;

  return (
    <div className="group bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-md hover:shadow-slate-100 hover:border-slate-300 transition-all duration-300">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand/10 to-blue-500/10 text-brand flex items-center justify-center text-lg flex-shrink-0 shadow-sm">
            🍔
          </div>
          <div className="min-w-0">
            <h4 className="font-bold text-slate-800 text-sm truncate">{item.label}</h4>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <Badge color={item.style === 'mega' ? 'emerald' : 'amber'}>{item.style}</Badge>
              <span className="text-[11px] text-slate-400 font-medium">Order #{item.order}</span>
              <span className="text-[11px] text-slate-400 font-medium">
                {item.columns?.length ?? 0} col · {totalLinks} links · {linkedTrips} trips
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={() => onEdit(item)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-brand bg-brand/5 hover:bg-brand/10 transition-all"
          >
            ✏️ Edit
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-red-500 bg-red-50 hover:bg-red-100 transition-all disabled:opacity-50"
          >
            {deleting ? '…' : '🗑 Delete'}
          </button>
        </div>
      </div>

      {item.columns?.length > 0 && (
        <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {item.columns.map((col, i) => (
            <div key={i} className="min-w-0">
              {col.title && (
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1 truncate">
                  {col.title}
                </p>
              )}
              <ul className="space-y-0.5">
                {col.items?.slice(0, 4).map((it, j) => (
                  <li key={j} className="text-xs text-slate-500 truncate flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-slate-300 flex-shrink-0" />
                    {it.label || <span className="italic text-slate-300">untitled</span>}
                    {it.tripId && <span className="text-brand text-[9px] font-bold">TRIP</span>}
                  </li>
                ))}
                {(col.items?.length ?? 0) > 4 && (
                  <li className="text-[10px] text-slate-400 font-medium pl-2">
                    +{col.items.length - 4} more
                  </li>
                )}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/* ─── Main Page ───────────────────────────────────────── */
const MenusAdmin = () => {
  const [items, setItems] = useState([]);
  const [trips, setTrips] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tripsLoading, setTripsLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [editTarget, setEditTarget] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/dashboard/menus');
      setItems(res.data.data);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadTrips = useCallback(async () => {
    setTripsLoading(true);
    try {
      const res = await api.get('/trips');
      const all = res.data.data || res.data || [];
      setTrips(Array.isArray(all) ? all : []);
    } catch {
      setTrips([]);
    } finally {
      setTripsLoading(false);
    }
  }, []);

  const loadCategories = useCallback(async () => {
    setCategoriesLoading(true);
    try {
      const res = await api.get('/dashboard/destinations');
      setCategories(res.data.data || []);
    } catch {
      setCategories([]);
    } finally {
      setCategoriesLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    loadTrips();
    loadCategories();
  }, [load, loadTrips, loadCategories]);

  const handleCreate = async (form) => {
    await api.post('/dashboard/menus', form);
    setShowCreate(false);
    load();
  };

  const handleUpdate = async (form) => {
    await api.put(`/dashboard/menus/${editTarget._id}`, form);
    setEditTarget(null);
    load();
  };

  const handleDelete = async (id) => {
    await api.delete(`/dashboard/menus/${id}`);
    load();
  };

  const startEdit = (item) => {
    setEditTarget(hydrateMenuTripIds(deepClone(item), trips));
    setShowCreate(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Menu Management</h1>
          <p className="text-slate-500 mt-1 text-sm font-medium">
            Build multi-column menus by linking items directly to trips from your database.
          </p>
        </div>
        {!showCreate && !editTarget && (
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand text-white text-sm font-bold shadow-md shadow-brand/25 hover:shadow-lg hover:shadow-brand/30 hover:-translate-y-0.5 transition-all duration-200 flex-shrink-0"
          >
            <span className="text-base leading-none">＋</span> New Menu
          </button>
        )}
      </div>

      <div className="bg-brand/5 border border-brand/20 rounded-2xl px-5 py-4 flex items-start gap-3">
        <span className="text-xl flex-shrink-0">🔗</span>
        <p className="text-sm text-brand/80 font-medium leading-relaxed">
          For each menu item: set a <strong>column title</strong>, an <strong>item label</strong>, then{' '}
          <strong>search &amp; pick a trip</strong>. The page path is created automatically (
          <code className="text-xs bg-white px-1.5 py-0.5 rounded font-mono">/trips/slug</code>
          ). No manual paths.
        </p>
      </div>

      {showCreate && (
        <div className="animate-[fadeInDown_0.2s_ease]">
          <MenuForm
            onSave={handleCreate}
            onCancel={() => setShowCreate(false)}
            isEdit={false}
            trips={trips}
            tripsLoading={tripsLoading}
          />
        </div>
      )}

      {editTarget && (
        <div className="animate-[fadeInDown_0.2s_ease]">
          <MenuForm
            key={editTarget._id}
            initial={editTarget}
            onSave={handleUpdate}
            onCancel={() => setEditTarget(null)}
            isEdit
            trips={trips}
            tripsLoading={tripsLoading}
          />
        </div>
      )}

      {(showCreate || editTarget) && items.length > 0 && (
        <div className="flex items-center gap-3">
          <div className="flex-1 border-t border-slate-200" />
          <span className="text-[11px] uppercase tracking-widest font-bold text-slate-400">
            Existing Menus
          </span>
          <div className="flex-1 border-t border-slate-200" />
        </div>
      )}

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-slate-100 rounded-2xl h-24 animate-pulse" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 py-16 flex flex-col items-center justify-center gap-3">
          <span className="text-4xl">🍔</span>
          <p className="font-bold text-slate-600">No menus yet</p>
          <p className="text-sm text-slate-400">Click &quot;New Menu&quot; to create your first navigation menu.</p>
          {!showCreate && (
            <button
              onClick={() => setShowCreate(true)}
              className="mt-2 px-5 py-2.5 rounded-xl bg-brand text-white text-sm font-bold shadow-md shadow-brand/25 hover:shadow-lg hover:-translate-y-0.5 transition-all"
            >
              Create First Menu
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <MenuCard key={item._id} item={item} onEdit={startEdit} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MenusAdmin;
