import { useEffect, useState } from 'react';
import { api } from '../../services/api';

const emptyMenu = {
  label: '',
  style: 'mega',
  order: 0,
  columns: [
    {
      title: '',
      items: [{ label: '', href: '' }],
    },
  ],
};

const MenusAdmin = () => {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(emptyMenu);

  const load = async () => {
    const res = await api.get('/dashboard/menus');
    setItems(res.data.data);
  };

  useEffect(() => {
    load();
  }, []);

  const updateColumnTitle = (idx, value) => {
    const columns = [...form.columns];
    columns[idx].title = value;
    setForm({ ...form, columns });
  };

  const updateItem = (colIdx, itemIdx, field, value) => {
    const columns = [...form.columns];
    columns[colIdx].items[itemIdx][field] = value;
    setForm({ ...form, columns });
  };

  const addColumn = () => {
    setForm({
      ...form,
      columns: [...form.columns, { title: '', items: [{ label: '', href: '' }] }],
    });
  };

  const removeColumn = (idx) => {
    const columns = form.columns.filter((_, i) => i !== idx);
    setForm({ ...form, columns: columns.length ? columns : emptyMenu.columns });
  };

  const addItem = (colIdx) => {
    const columns = [...form.columns];
    columns[colIdx].items.push({ label: '', href: '' });
    setForm({ ...form, columns });
  };

  const removeItem = (colIdx, itemIdx) => {
    const columns = [...form.columns];
    columns[colIdx].items = columns[colIdx].items.filter((_, i) => i !== itemIdx);
    if (!columns[colIdx].items.length) {
      columns[colIdx].items = [{ label: '', href: '' }];
    }
    setForm({ ...form, columns });
  };

  const create = async (e) => {
    e.preventDefault();
    await api.post('/dashboard/menus', form);
    setForm(emptyMenu);
    load();
  };

  const remove = async (id) => {
    await api.delete(`/dashboard/menus/${id}`);
    load();
  };

  return (
    <div>
      <h1 className="text-xl font-semibold text-forest-800">Menus</h1>
      <p className="text-slate-500 mt-1">Add dropdown menus without JSON.</p>
      <form onSubmit={create} className="mt-4 grid gap-4 max-w-3xl">
        <div className="grid md:grid-cols-3 gap-3">
          <input
            className="rounded-full border-slate-200"
            placeholder="Menu label (e.g., Destinations)"
            value={form.label}
            onChange={(e) => setForm({ ...form, label: e.target.value })}
          />
          <select
            className="rounded-full border-slate-200"
            value={form.style}
            onChange={(e) => setForm({ ...form, style: e.target.value })}
          >
            <option value="mega">Mega</option>
            <option value="list">List</option>
          </select>
          <input
            className="rounded-full border-slate-200"
            type="number"
            placeholder="Order"
            value={form.order}
            onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
          />
        </div>

        <div className="space-y-4">
          {form.columns.map((col, colIdx) => (
            <div key={colIdx} className="border rounded-2xl p-4">
              <div className="flex items-center justify-between gap-2">
                <input
                  className="rounded-full border-slate-200 w-full"
                  placeholder="Column title (e.g., Everest Region)"
                  value={col.title}
                  onChange={(e) => updateColumnTitle(colIdx, e.target.value)}
                />
                <button
                  className="text-xs text-sunrise-500"
                  type="button"
                  onClick={() => removeColumn(colIdx)}
                >
                  Remove column
                </button>
              </div>
              <div className="mt-3 space-y-2">
                {col.items.map((item, itemIdx) => (
                  <div key={itemIdx} className="grid md:grid-cols-[1fr_1fr_auto] gap-2 items-center">
                    <input
                      className="rounded-full border-slate-200"
                      placeholder="Item label"
                      value={item.label}
                      onChange={(e) => updateItem(colIdx, itemIdx, 'label', e.target.value)}
                    />
                    <input
                      className="rounded-full border-slate-200"
                      placeholder="Link (e.g., /trips/everest-base-camp-trek-15-days)"
                      value={item.href}
                      onChange={(e) => updateItem(colIdx, itemIdx, 'href', e.target.value)}
                    />
                    <button
                      className="text-xs text-sunrise-500"
                      type="button"
                      onClick={() => removeItem(colIdx, itemIdx)}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
              <button
                className="mt-3 text-xs text-forest-800 font-semibold"
                type="button"
                onClick={() => addItem(colIdx)}
              >
                + Add item
              </button>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button className="px-4 py-2 rounded-full border border-forest-800 text-forest-800" type="button" onClick={addColumn}>
            + Add column
          </button>
          <button className="py-3 px-6 rounded-full bg-forest-800 text-white" type="submit">
            Save Menu
          </button>
        </div>
      </form>

      <div className="mt-6 space-y-3">
        {items.map((item) => (
          <div key={item._id} className="border rounded-xl p-4">
            <div className="font-semibold">{item.label}</div>
            <div className="text-sm text-slate-500">Style: {item.style} · Order: {item.order}</div>
            <button className="mt-2 text-xs text-sunrise-500" onClick={() => remove(item._id)}>
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MenusAdmin;
