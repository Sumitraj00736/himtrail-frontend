import { useEffect, useState, useCallback } from 'react';
import { api } from '../../services/api';

/* ─── helpers ─────────────────────────────────────────── */
const emptyMenu = () => ({
  label: '',
  style: 'mega',
  order: 0,
  columns: [{ title: '', items: [{ label: '', href: '' }] }],
});

const deepClone = (v) => JSON.parse(JSON.stringify(v));

/* ─── sub-components ──────────────────────────────────── */
const Badge = ({ children, color = 'slate' }) => {
  const colors = {
    slate: 'bg-slate-100 text-slate-600',
    emerald: 'bg-emerald-100 text-emerald-700',
    amber: 'bg-amber-100 text-amber-700',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wide ${colors[color]}`}>
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

/* ─── Column editor ───────────────────────────────────── */
const ColumnEditor = ({ columns, onChange }) => {
  const updateColumnTitle = (idx, val) => {
    const cols = deepClone(columns);
    cols[idx].title = val;
    onChange(cols);
  };

  const removeColumn = (idx) => {
    const cols = columns.filter((_, i) => i !== idx);
    onChange(cols.length ? cols : [{ title: '', items: [{ label: '', href: '' }] }]);
  };

  const addColumn = () =>
    onChange([...columns, { title: '', items: [{ label: '', href: '' }] }]);

  const updateItem = (colIdx, itemIdx, field, val) => {
    const cols = deepClone(columns);
    cols[colIdx].items[itemIdx][field] = val;
    onChange(cols);
  };

  const addItem = (colIdx) => {
    const cols = deepClone(columns);
    cols[colIdx].items.push({ label: '', href: '' });
    onChange(cols);
  };

  const removeItem = (colIdx, itemIdx) => {
    const cols = deepClone(columns);
    cols[colIdx].items = cols[colIdx].items.filter((_, i) => i !== itemIdx);
    if (!cols[colIdx].items.length) cols[colIdx].items = [{ label: '', href: '' }];
    onChange(cols);
  };

  return (
    <div className="space-y-3">
      {columns.map((col, colIdx) => (
        <div
          key={colIdx}
          className="border border-slate-200 rounded-2xl p-4 bg-slate-50/60 transition-all"
        >
          {/* Column header */}
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
            <IconBtn
              danger
              title="Remove column"
              onClick={() => removeColumn(colIdx)}
            >
              🗑
            </IconBtn>
          </div>

          {/* Items */}
          <div className="space-y-2 pl-7">
            {col.items.map((item, itemIdx) => (
              <div key={itemIdx} className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-300 flex-shrink-0 mt-0.5" />
                <input
                  className="flex-1 text-sm bg-white border border-slate-200 rounded-xl px-3 py-1.5 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand/40 transition-all"
                  placeholder="Item label"
                  value={item.label}
                  onChange={(e) => updateItem(colIdx, itemIdx, 'label', e.target.value)}
                />
                <input
                  className="flex-1 text-sm bg-white border border-slate-200 rounded-xl px-3 py-1.5 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand/40 transition-all font-mono text-xs"
                  placeholder="/path/to/page"
                  value={item.href}
                  onChange={(e) => updateItem(colIdx, itemIdx, 'href', e.target.value)}
                />
                <IconBtn danger title="Remove item" onClick={() => removeItem(colIdx, itemIdx)}>
                  ✕
                </IconBtn>
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
const MenuForm = ({ initial, onSave, onCancel, isEdit }) => {
  const [form, setForm] = useState(initial || emptyMenu());
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    await onSave(form);
    setSaving(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-3xl border border-slate-200 shadow-lg shadow-slate-100 overflow-hidden"
    >
      {/* Form header */}
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
              {isEdit ? 'Update menu structure and links' : 'Add a new navigation menu'}
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
        {/* Basic fields */}
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

        {/* Columns editor */}
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">
            Columns & Links
          </label>
          <ColumnEditor
            columns={form.columns}
            onChange={(cols) => setForm({ ...form, columns: cols })}
          />
        </div>

        {/* Actions */}
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
            disabled={saving}
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

  return (
    <div className="group bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-md hover:shadow-slate-100 hover:border-slate-300 transition-all duration-300">
      <div className="flex items-start justify-between gap-4">
        {/* Left info */}
        <div className="flex items-start gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand/10 to-blue-500/10 text-brand flex items-center justify-center text-lg flex-shrink-0 shadow-sm">
            🍔
          </div>
          <div className="min-w-0">
            <h4 className="font-bold text-slate-800 text-sm truncate">{item.label}</h4>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <Badge color={item.style === 'mega' ? 'emerald' : 'amber'}>{item.style}</Badge>
              <span className="text-[11px] text-slate-400 font-medium">
                Order #{item.order}
              </span>
              <span className="text-[11px] text-slate-400 font-medium">
                {item.columns?.length ?? 0} col · {totalLinks} links
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
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

      {/* Preview columns */}
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
                  <li
                    key={j}
                    className="text-xs text-slate-500 truncate flex items-center gap-1"
                  >
                    <span className="w-1 h-1 rounded-full bg-slate-300 flex-shrink-0" />
                    {it.label || <span className="italic text-slate-300">untitled</span>}
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
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [editTarget, setEditTarget] = useState(null); // menu being edited

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/dashboard/menus');
      setItems(res.data.data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

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
    setEditTarget(deepClone(item));
    setShowCreate(false);
    // Scroll to top of page smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Menu Management</h1>
          <p className="text-slate-500 mt-1 text-sm font-medium">
            Build and manage navigation menus with multi-column dropdowns — no code needed.
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

      {/* Create form */}
      {showCreate && (
        <div className="animate-[fadeInDown_0.2s_ease]">
          <MenuForm
            onSave={handleCreate}
            onCancel={() => setShowCreate(false)}
            isEdit={false}
          />
        </div>
      )}

      {/* Edit form */}
      {editTarget && (
        <div className="animate-[fadeInDown_0.2s_ease]">
          <MenuForm
            key={editTarget._id}
            initial={editTarget}
            onSave={handleUpdate}
            onCancel={() => setEditTarget(null)}
            isEdit
          />
        </div>
      )}

      {/* Divider when form is open */}
      {(showCreate || editTarget) && items.length > 0 && (
        <div className="flex items-center gap-3">
          <div className="flex-1 border-t border-slate-200" />
          <span className="text-[11px] uppercase tracking-widest font-bold text-slate-400">
            Existing Menus
          </span>
          <div className="flex-1 border-t border-slate-200" />
        </div>
      )}

      {/* Menu list */}
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
          <p className="text-sm text-slate-400">Click "New Menu" to create your first navigation menu.</p>
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
            <MenuCard
              key={item._id}
              item={item}
              onEdit={startEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MenusAdmin;
