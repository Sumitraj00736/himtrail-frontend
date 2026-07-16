import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';

const inputCls =
  'w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand bg-white';

const DependenciesAdmin = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('countries'); // countries | categories
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const [countryForm, setCountryForm] = useState({ name: '', order: 0 });
  const [regionForm, setRegionForm] = useState({ name: '', countryName: '', order: 0 });
  const [categoryForm, setCategoryForm] = useState({ name: '', order: 0 });
  const [activeCountry, setActiveCountry] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/dashboard/trip-options');
      const all = res.data.data || [];
      setItems(all);
      const countryList = all.filter((i) => i.kind === 'country');
      setActiveCountry((prev) => {
        if (prev && countryList.some((c) => c.name === prev)) return prev;
        return countryList[0]?.name || '';
      });
    } catch (err) {
      console.error('Failed to load trip options', err);
      setItems([]);
      setMessage(err?.response?.status === 404
        ? 'Trip options API not found — restart the backend server.'
        : err?.response?.data?.message || err?.response?.data?.error || 'Failed to load dependencies.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const countries = useMemo(
    () => items.filter((i) => i.kind === 'country').sort((a, b) => a.order - b.order || a.name.localeCompare(b.name)),
    [items]
  );
  const categories = useMemo(
    () => items.filter((i) => i.kind === 'category').sort((a, b) => a.order - b.order || a.name.localeCompare(b.name)),
    [items]
  );
  const regionsForCountry = useMemo(
    () =>
      items
        .filter((i) => i.kind === 'region' && i.countryName === activeCountry)
        .sort((a, b) => a.order - b.order || a.name.localeCompare(b.name)),
    [items, activeCountry]
  );

  const flash = (text) => {
    setMessage(text);
    setTimeout(() => setMessage(''), 2500);
  };

  const createOption = async (body) => {
    setSaving(true);
    try {
      await api.post('/dashboard/trip-options', body);
      await load();
      flash('Saved');
    } catch (err) {
      flash(err?.response?.data?.message || err?.response?.data?.error || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const removeOption = async (item) => {
    const label =
      item.kind === 'country'
        ? `Delete country "${item.name}" and all its regions?`
        : `Delete ${item.kind} "${item.name}"?`;
    if (!window.confirm(label)) return;
    await api.delete(`/dashboard/trip-options/${item._id}`);
    await load();
    flash('Deleted');
  };

  const toggleActive = async (item) => {
    await api.put(`/dashboard/trip-options/${item._id}`, { isActive: !item.isActive });
    await load();
  };

  const addCountry = async (e) => {
    e.preventDefault();
    if (!countryForm.name.trim()) return;
    await createOption({
      kind: 'country',
      name: countryForm.name.trim(),
      order: Number(countryForm.order) || 0,
    });
    setCountryForm({ name: '', order: 0 });
  };

  const addRegion = async (e) => {
    e.preventDefault();
    const countryName = regionForm.countryName || activeCountry;
    if (!regionForm.name.trim() || !countryName) return;
    await createOption({
      kind: 'region',
      name: regionForm.name.trim(),
      countryName,
      order: Number(regionForm.order) || 0,
    });
    setRegionForm({ name: '', countryName: countryName, order: 0 });
    setActiveCountry(countryName);
  };

  const addCategory = async (e) => {
    e.preventDefault();
    if (!categoryForm.name.trim()) return;
    await createOption({
      kind: 'category',
      name: categoryForm.name.trim(),
      order: Number(categoryForm.order) || 0,
    });
    setCategoryForm({ name: '', order: 0 });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Dependencies</h1>
          <p className="text-slate-500 mt-1 text-sm font-medium max-w-xl">
            Manage <strong>Country → Region</strong> and <strong>Category</strong> options used in the Trip
            Database (and Destinations). Regions depend on the selected country.
          </p>
        </div>
        <Link
          to="/dashboard/trips/new"
          className="px-4 py-2.5 rounded-xl bg-brand text-white text-sm font-bold shadow-md shadow-brand/20 hover:-translate-y-0.5 transition-all"
        >
          Open Trip Form →
        </Link>
      </div>

      <div className="bg-brand/5 border border-brand/20 rounded-2xl px-5 py-4 text-sm text-brand/80 font-medium">
        Add countries and categories here first. Then in <strong>Trips Database</strong>, Destination / Category /
        Region dropdowns load from this list — regions filter by country.
      </div>

      {message && (
        <p className="text-sm font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-2">
          {message}
        </p>
      )}

      <div className="flex gap-2">
        {[
          { key: 'countries', label: '🌍 Countries & Regions' },
          { key: 'categories', label: '🏷️ Categories' },
        ].map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
              tab === key ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-slate-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : tab === 'countries' ? (
        <div className="grid lg:grid-cols-[280px_1fr] gap-6">
          {/* Countries list */}
          <div className="space-y-4">
            <form onSubmit={addCountry} className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Add country</p>
              <input
                className={inputCls}
                placeholder="e.g. Nepal"
                value={countryForm.name}
                onChange={(e) => setCountryForm({ ...countryForm, name: e.target.value })}
                required
              />
              <input
                className={inputCls}
                type="number"
                placeholder="Order"
                value={countryForm.order}
                onChange={(e) => setCountryForm({ ...countryForm, order: e.target.value })}
              />
              <button
                type="submit"
                disabled={saving}
                className="w-full py-2.5 rounded-xl bg-brand text-white text-sm font-bold disabled:opacity-60"
              >
                ＋ Add Country
              </button>
            </form>

            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
              {countries.length === 0 ? (
                <p className="p-4 text-sm text-slate-400 text-center">No countries yet</p>
              ) : (
                countries.map((c) => (
                  <div
                    key={c._id}
                    role="button"
                    tabIndex={0}
                    onClick={() => {
                      setActiveCountry(c.name);
                      setRegionForm((f) => ({ ...f, countryName: c.name }));
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setActiveCountry(c.name);
                        setRegionForm((f) => ({ ...f, countryName: c.name }));
                      }
                    }}
                    className={`w-full flex items-center justify-between gap-2 px-4 py-3 text-left border-b border-slate-100 last:border-0 transition-colors cursor-pointer ${
                      activeCountry === c.name ? 'bg-brand/10' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div>
                      <p className={`text-sm font-bold ${activeCountry === c.name ? 'text-brand' : 'text-slate-800'}`}>
                        {c.name}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        {items.filter((i) => i.kind === 'region' && i.countryName === c.name).length} regions
                        {!c.isActive && ' · inactive'}
                      </p>
                    </div>
                    <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        title={c.isActive ? 'Deactivate' : 'Activate'}
                        onClick={() => toggleActive(c)}
                        className="text-xs px-2 py-1 rounded-lg hover:bg-white text-slate-500"
                      >
                        {c.isActive ? 'On' : 'Off'}
                      </button>
                      <button
                        type="button"
                        onClick={() => removeOption(c)}
                        className="text-xs px-2 py-1 rounded-lg text-red-500 hover:bg-red-50"
                      >
                        🗑
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Regions for selected country */}
          <div className="space-y-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-5">
              <h2 className="font-bold text-slate-800 text-base mb-1">
                Regions {activeCountry ? `for ${activeCountry}` : ''}
              </h2>
              <p className="text-xs text-slate-400 mb-4">
                These appear in the Trip form Region dropdown when this country is selected.
              </p>

              {!activeCountry ? (
                <p className="text-sm text-slate-400">Select or create a country first.</p>
              ) : (
                <>
                  <form onSubmit={addRegion} className="grid sm:grid-cols-[1fr_100px_auto] gap-2 mb-5">
                    <input
                      className={inputCls}
                      placeholder={`New region under ${activeCountry}`}
                      value={regionForm.name}
                      onChange={(e) =>
                        setRegionForm({ ...regionForm, name: e.target.value, countryName: activeCountry })
                      }
                      required
                    />
                    <input
                      className={inputCls}
                      type="number"
                      placeholder="Order"
                      value={regionForm.order}
                      onChange={(e) => setRegionForm({ ...regionForm, order: e.target.value })}
                    />
                    <button
                      type="submit"
                      disabled={saving}
                      className="px-4 py-2 rounded-xl bg-brand text-white text-sm font-bold disabled:opacity-60"
                    >
                      ＋ Add
                    </button>
                  </form>

                  {regionsForCountry.length === 0 ? (
                    <div className="border-2 border-dashed border-slate-200 rounded-2xl py-10 text-center text-slate-400 text-sm">
                      No regions for {activeCountry} yet
                    </div>
                  ) : (
                    <ul className="space-y-2">
                      {regionsForCountry.map((r) => (
                        <li
                          key={r._id}
                          className="flex items-center justify-between gap-3 bg-slate-50 border border-slate-100 rounded-xl px-4 py-3"
                        >
                          <div>
                            <p className="text-sm font-semibold text-slate-800">{r.name}</p>
                            <p className="text-[11px] text-slate-400">
                              Depends on {r.countryName}
                              {!r.isActive && ' · inactive'}
                            </p>
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => toggleActive(r)}
                              className="text-xs px-2 py-1 rounded-lg text-slate-500 hover:bg-white"
                            >
                              {r.isActive ? 'On' : 'Off'}
                            </button>
                            <button
                              type="button"
                              onClick={() => removeOption(r)}
                              className="text-xs px-2 py-1 rounded-lg text-red-500 hover:bg-red-50"
                            >
                              🗑
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-xl space-y-4">
          <form onSubmit={addCategory} className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Add category</p>
            <div className="grid sm:grid-cols-[1fr_100px_auto] gap-2">
              <input
                className={inputCls}
                placeholder="e.g. Trekking"
                value={categoryForm.name}
                onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                required
              />
              <input
                className={inputCls}
                type="number"
                placeholder="Order"
                value={categoryForm.order}
                onChange={(e) => setCategoryForm({ ...categoryForm, order: e.target.value })}
              />
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 rounded-xl bg-brand text-white text-sm font-bold disabled:opacity-60"
              >
                ＋ Add
              </button>
            </div>
          </form>

          {categories.length === 0 ? (
            <div className="border-2 border-dashed border-slate-200 rounded-2xl py-10 text-center text-slate-400 text-sm">
              No categories yet
            </div>
          ) : (
            <ul className="space-y-2">
              {categories.map((c) => (
                <li
                  key={c._id}
                  className="flex items-center justify-between gap-3 bg-white border border-slate-200 rounded-xl px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{c.name}</p>
                    {!c.isActive && <p className="text-[11px] text-slate-400">inactive</p>}
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => toggleActive(c)}
                      className="text-xs px-2 py-1 rounded-lg text-slate-500 hover:bg-slate-50"
                    >
                      {c.isActive ? 'On' : 'Off'}
                    </button>
                    <button
                      type="button"
                      onClick={() => removeOption(c)}
                      className="text-xs px-2 py-1 rounded-lg text-red-500 hover:bg-red-50"
                    >
                      🗑
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default DependenciesAdmin;
