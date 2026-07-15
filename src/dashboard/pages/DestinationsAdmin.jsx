import { useEffect, useState, useCallback, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';

/* Region display order — same as menu */
const REGION_ORDER = ['Everest','Annapurna','Langtang','Manaslu','Upper Mustang','Dolpo','Tibet','Bhutan','Tanzania'];
const REGION_ICONS = {
  Everest: '🏔️', Annapurna: '🌿', Langtang: '🌲', Manaslu: '⛰️',
  'Upper Mustang': '🏜️', Dolpo: '💧', Tibet: '🕌', Bhutan: '🐉', Tanzania: '🦁',
};

const sectionTag = (label, active) => (
  <span
    key={label}
    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wide ${
      active
        ? label === 'Trek in Nepal'
          ? 'bg-emerald-100 text-emerald-700'
          : 'bg-amber-100 text-amber-700'
        : 'bg-slate-100 text-slate-400'
    }`}
  >
    {label === 'Trek in Nepal' ? '🏔️' : '✨'} {label}
  </span>
);

/* ─── Destination row ───────────────────────────────────────── */
const DestinationRow = ({ item, onDelete }) => {
  const [deleting, setDeleting] = useState(false);
  const navigate = useNavigate();

  const handleDelete = async () => {
    if (!window.confirm(`Delete "${item.title}"? This cannot be undone.`)) return;
    setDeleting(true);
    await onDelete(item._id);
  };

  return (
    <div className="group flex items-center gap-4 bg-white border border-slate-200 rounded-2xl p-4 hover:shadow-md hover:border-slate-300 transition-all duration-200">
      {/* Hero thumbnail */}
      <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-200">
        {item.heroImage ? (
          <img src={item.heroImage} alt={item.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-2xl">
            {REGION_ICONS[item.region] || '📍'}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="font-bold text-slate-800 text-sm truncate">{item.title}</h3>
        </div>
        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
            {REGION_ICONS[item.region] || '📍'} {item.region}
          </span>
          <span className="text-[11px] text-slate-400">·</span>
          <span className="text-[11px] text-slate-500">{item.duration} days</span>
          <span className="text-[11px] text-slate-400">·</span>
          <span className="text-[11px] text-slate-500">US${item.price?.toLocaleString()}</span>
          <span className="text-[11px] text-slate-400">·</span>
          <span className="text-[11px] text-slate-500">{item.category}</span>
        </div>
        <div className="flex items-center gap-2 mt-2 flex-wrap">
          {['Trek in Nepal', 'Luxury Travel'].map((sec) =>
            sectionTag(sec, item.destinationSections?.includes(sec))
          )}
          {(!item.destinationSections || item.destinationSections.length === 0) && (
            <span className="text-[11px] text-slate-400 italic">Not linked to any carousel</span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex-shrink-0">
        <button
          onClick={() => navigate(`/dashboard/trips/${item._id}`)}
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
  );
};

/* ─── Main page ─────────────────────────────────────────────── */
const DestinationsAdmin = () => {
  const [items, setItems]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All'); // 'All' | region name | 'Trek in Nepal' | 'Luxury Travel'
  const [viewMode, setViewMode] = useState('region'); // 'region' | 'section'

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/trips');
      const all = res.data.data || res.data || [];
      setItems(all.filter((t) => t.isDestination));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async (id) => {
    await api.delete(`/trips/${id}`);
    load();
  };

  /* Dynamic region tabs (same order as menu) */
  const regionTabs = useMemo(() => {
    const present = [...new Set(items.map((i) => i.region))];
    return present.sort((a, b) => REGION_ORDER.indexOf(a) - REGION_ORDER.indexOf(b));
  }, [items]);

  /* Section tabs */
  const SECTION_TABS = ['Trek in Nepal', 'Luxury Travel', 'Not linked'];

  /* All tabs depending on view mode */
  const tabs = viewMode === 'region'
    ? ['All', ...regionTabs]
    : ['All', ...SECTION_TABS];

  /* Filter */
  const filtered = useMemo(() => {
    if (activeTab === 'All') return items;
    if (viewMode === 'region') return items.filter((i) => i.region === activeTab);
    if (activeTab === 'Not linked') return items.filter((i) => !i.destinationSections?.length);
    return items.filter((i) => i.destinationSections?.includes(activeTab));
  }, [items, activeTab, viewMode]);

  /* Count helper */
  const countFor = (tab) => {
    if (tab === 'All') return items.length;
    if (viewMode === 'region') return items.filter((i) => i.region === tab).length;
    if (tab === 'Not linked') return items.filter((i) => !i.destinationSections?.length).length;
    return items.filter((i) => i.destinationSections?.includes(tab)).length;
  };

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
    setActiveTab('All');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Destinations</h1>
          <p className="text-slate-500 mt-1 text-sm font-medium">
            Manage destination pages. Tag them to appear in Trek in Nepal or Luxury Travel carousels.
          </p>
        </div>
        <Link
          to="/dashboard/trips/new"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand text-white text-sm font-bold shadow-md shadow-brand/25 hover:shadow-lg hover:shadow-brand/30 hover:-translate-y-0.5 transition-all duration-200 flex-shrink-0"
        >
          <span className="text-base leading-none">＋</span> New Destination
        </Link>
      </div>

      {/* Info banner */}
      <div className="bg-brand/5 border border-brand/20 rounded-2xl px-5 py-4 flex items-start gap-3">
        <span className="text-xl flex-shrink-0">💡</span>
        <p className="text-sm text-brand/80 font-medium leading-relaxed">
          Destinations use the same <strong>Trip form</strong>. Edit any trip → scroll to <strong>📍 Destination Settings</strong> → toggle ON and choose which homepage carousels it feeds into.
        </p>
      </div>

      {/* View mode toggle */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1">Filter by:</span>
        {[
          { key: 'region', label: '🗺️ Region' },
          { key: 'section', label: '📋 Homepage Section' },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => handleViewModeChange(key)}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
              viewMode === key
                ? 'bg-slate-800 text-white shadow-sm'
                : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 flex-wrap overflow-x-auto no-scrollbar pb-1">
        {tabs.map((tab) => {
          const count = countFor(tab);
          const isActive = tab === activeTab;
          const icon = viewMode === 'region' ? REGION_ICONS[tab] : undefined;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold flex-shrink-0 transition-all duration-200 ${
                isActive
                  ? 'bg-brand text-white shadow-md shadow-brand/20'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {icon && <span className="text-base leading-none">{icon}</span>}
              {tab}
              <span className={`text-[11px] px-1.5 py-0.5 rounded-full font-bold ${isActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-500'}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-slate-100 rounded-2xl h-20 animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 py-16 flex flex-col items-center justify-center gap-3">
          <span className="text-4xl">📍</span>
          <p className="font-bold text-slate-600">No destinations found</p>
          <p className="text-sm text-slate-400 text-center max-w-xs">
            {activeTab === 'All'
              ? 'Create your first destination by clicking "New Destination" above.'
              : `No destinations in "${activeTab}".`}
          </p>
          {activeTab === 'All' && (
            <Link
              to="/dashboard/trips/new"
              className="mt-2 px-5 py-2.5 rounded-xl bg-brand text-white text-sm font-bold shadow-md shadow-brand/25 hover:shadow-lg hover:-translate-y-0.5 transition-all"
            >
              Create First Destination
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => (
            <DestinationRow key={item._id} item={item} onDelete={handleDelete} />
          ))}
        </div>
      )}

      {/* Stats summary */}
      {!loading && items.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-100">
          {[
            { label: 'Total', value: items.length, color: 'text-brand', bg: 'bg-brand/5' },
            { label: 'Trek in Nepal', value: items.filter((i) => i.destinationSections?.includes('Trek in Nepal')).length, color: 'text-emerald-700', bg: 'bg-emerald-50' },
            { label: 'Luxury Travel', value: items.filter((i) => i.destinationSections?.includes('Luxury Travel')).length, color: 'text-amber-700', bg: 'bg-amber-50' },
            { label: 'Regions', value: regionTabs.length, color: 'text-slate-700', bg: 'bg-slate-100' },
          ].map(({ label, value, color, bg }) => (
            <div key={label} className={`${bg} rounded-2xl p-4 text-center`}>
              <p className={`text-2xl font-black ${color}`}>{value}</p>
              <p className="text-xs text-slate-500 font-medium mt-1">{label}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DestinationsAdmin;
