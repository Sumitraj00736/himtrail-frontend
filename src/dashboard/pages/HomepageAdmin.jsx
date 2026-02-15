import { useEffect, useState } from 'react';
import { api } from '../../services/api';

const HomepageAdmin = () => {
  const [form, setForm] = useState({
    heroTitle: '',
    heroSubtitle: '',
    heroCtaLabel: '',
    heroCtaUrl: '',
    heroImage: '',
    aboutTitle: '',
    aboutBody: '',
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    api.get('/dashboard/homepage').then((res) => {
      if (res.data.data) setForm(res.data.data);
    });
  }, []);

  const save = async (e) => {
    e.preventDefault();
    await api.put('/dashboard/homepage', form);
    setMessage('Homepage updated.');
  };

  return (
    <div>
      <h1 className="text-xl font-semibold text-[#243b75]">Homepage Content</h1>
      <form onSubmit={save} className="mt-4 grid gap-3 max-w-2xl">
        <input className="rounded-full border-slate-200" placeholder="Hero title" value={form.heroTitle || ''} onChange={(e) => setForm({ ...form, heroTitle: e.target.value })} />
        <input className="rounded-full border-slate-200" placeholder="Hero subtitle" value={form.heroSubtitle || ''} onChange={(e) => setForm({ ...form, heroSubtitle: e.target.value })} />
        <input className="rounded-full border-slate-200" placeholder="Hero CTA label" value={form.heroCtaLabel || ''} onChange={(e) => setForm({ ...form, heroCtaLabel: e.target.value })} />
        <input className="rounded-full border-slate-200" placeholder="Hero CTA URL" value={form.heroCtaUrl || ''} onChange={(e) => setForm({ ...form, heroCtaUrl: e.target.value })} />
        <input className="rounded-full border-slate-200" placeholder="Hero image URL" value={form.heroImage || ''} onChange={(e) => setForm({ ...form, heroImage: e.target.value })} />
        <input className="rounded-full border-slate-200" placeholder="About title" value={form.aboutTitle || ''} onChange={(e) => setForm({ ...form, aboutTitle: e.target.value })} />
        <textarea className="rounded-2xl border-slate-200" placeholder="About body" value={form.aboutBody || ''} onChange={(e) => setForm({ ...form, aboutBody: e.target.value })} />
        <button className="py-3 rounded-full bg-[#243b75] text-white" type="submit">Save</button>
        {message && <p className="text-sm text-slate-500">{message}</p>}
      </form>
    </div>
  );
};

export default HomepageAdmin;
