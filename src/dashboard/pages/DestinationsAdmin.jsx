import { useEffect, useState, useCallback, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';

const CategoryRow = ({ item, onDelete, deleting }) => {
  const href = item.href || '#';

  return (
    <div className="group flex items-center gap-4 bg-white border border-slate-200 rounded-2xl p-4 hover:shadow-md hover:border-slate-300 transition-all">
      <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-200">
        {item.heroImage ? (
          <img src={item.heroImage} alt={item.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-2xl">📍</div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="font-bold text-slate-800 text-sm truncate">{item.title}</h3>
          {item.menuColumn && (
            <span className="text-[10px] font-bold uppercase tracking-wide bg-brand/10 text-brand px-2 py-0.5 rounded-full">
              {item.menuColumn}
            </span>
          )}
        </div>
        <p className="text-[11px] text-slate-500 mt-1.5">
          {item.packageCount ?? item.tripIds?.length ?? 0} packages
          {item.shortDescription && (
            <>
              <span className="text-slate-300 mx-1">·</span>
              <span className="text-slate-400 line-clamp-1">{item.shortDescription}</span>
            </>
          )}
        </p>
        <p className="text-[11px] text-slate-400 mt-1 font-mono truncate">{href}</p>
      </div>

      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
        <Link
          to={href}
          target="_blank"
          rel="noreferrer"
          className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200"
        >
          ↗ View
        </Link>
        <Link
          to={`/dashboard/destinations/${item._id}`}
          className="px-3 py-1.5 rounded-xl text-xs font-semibold text-brand bg-brand/5 hover:bg-brand/10"
        >
          ✏️ Edit
        </Link>
        <button
          type="button"
          onClick={() => onDelete(item)}
          disabled={deleting}
          className="px-3 py-1.5 rounded-xl text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 disabled:opacity-50"
        >
          {deleting ? '…' : '🗑 Remove'}
        </button>
      </div>
    </div>
  );
};

const DestinationsAdmin = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');
  const [deletingId, setDeletingId] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/dashboard/destinations');
      setItems(res.data.data || []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const columnTabs = useMemo(() => {
    return [...new Set(items.map((i) => i.menuColumn || i.country).filter(Boolean))];
  }, [items]);

  const tabs = ['All', ...columnTabs];

  const filtered = useMemo(() => {
    if (activeTab === 'All') return items;
    return items.filter((i) => (i.menuColumn || i.country) === activeTab);
  }, [items, activeTab]);

  const handleDelete = async (item) => {
    const ok = window.confirm(
      `Delete "${item.title}"?\n\nRemoves the category page and menu link. Trips in your database are not deleted.`
    );
    if (!ok) return;
    setDeletingId(item._id);
    try {
      await api.delete(`/dashboard/destinations/${item._id}`);
      await load();
    } catch (err) {
      window.alert(err.response?.data?.error || 'Delete failed');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-black text-slate-800">Destinations</h1>
          <p className="text-slate-500 mt-1 text-sm">
            Category pages like <strong>Day Tours</strong> — description on top, packages listed below.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => navigate('/dashboard/destinations/new')}
            className="px-5 py-2.5 rounded-xl bg-brand text-white text-sm font-bold shadow-md shadow-brand/25"
          >
            ➕ Add destination
          </button>
          <Link
            to="/dashboard/menus"
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50"
          >
            🍔 Menus
          </Link>
        </div>
      </div>

      <div className="bg-brand/5 border border-brand/20 rounded-2xl px-5 py-4 flex gap-3">
        <span className="text-xl">💡</span>
        <p className="text-sm text-brand/80 font-medium leading-relaxed">
          Each destination is a category page (e.g. Nepal → Day Tours). Add a description and select which trip
          packages appear below — same as the navbar Destinations menu.
        </p>
      </div>

      {tabs.length > 1 && (
        <div className="flex gap-2 flex-wrap">
          {tabs.map((tab) => {
            const count =
              tab === 'All'
                ? items.length
                : items.filter((i) => (i.menuColumn || i.country) === tab).length;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-full text-sm font-semibold ${
                  tab === activeTab ? 'bg-brand text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {tab} ({count})
              </button>
            );
          })}
        </div>
      )}

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-slate-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-slate-200 rounded-3xl">
          <p className="text-4xl mb-3">📍</p>
          <p className="font-bold text-slate-600">No destination categories yet</p>
          <button
            type="button"
            onClick={() => navigate('/dashboard/destinations/new')}
            className="mt-4 px-5 py-2.5 rounded-xl bg-brand text-white text-sm font-bold"
          >
            Create Day Tours
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => (
            <CategoryRow
              key={item._id}
              item={item}
              onDelete={handleDelete}
              deleting={deletingId === item._id}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default DestinationsAdmin;
