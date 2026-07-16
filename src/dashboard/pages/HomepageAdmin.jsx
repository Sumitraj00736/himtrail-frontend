import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import ImageUploader from '../../components/ImageUploader';

const emptyForm = () => ({
  heroTitle: '',
  heroSubtitle: '',
  heroCtaLabel: '',
  heroCtaUrl: '',
  heroImage: '',
  aboutTitle: '',
  aboutBody: '',
});

const Field = ({ label, hint, children }) => (
  <div>
    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
      {label}
    </label>
    {children}
    {hint && <p className="text-[11px] text-slate-400 mt-1.5">{hint}</p>}
  </div>
);

const inputCls =
  'w-full px-4 py-3 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-brand/20 bg-white';

const HomepageAdmin = () => {
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [section, setSection] = useState('hero'); // hero | about | preview

  useEffect(() => {
    setLoading(true);
    api
      .get('/dashboard/homepage')
      .then((res) => {
        if (res.data.data) {
          setForm({ ...emptyForm(), ...res.data.data });
        }
      })
      .catch(() => setError('Could not load homepage settings'))
      .finally(() => setLoading(false));
  }, []);

  const set = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const save = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    const required = [
      'heroTitle',
      'heroSubtitle',
      'heroCtaLabel',
      'heroCtaUrl',
      'heroImage',
      'aboutTitle',
      'aboutBody',
    ];
    const missing = required.find((k) => !String(form[k] || '').trim());
    if (missing) {
      setError('Please fill all required fields before saving');
      return;
    }

    setSaving(true);
    try {
      await api.put('/dashboard/homepage', {
        heroTitle: form.heroTitle.trim(),
        heroSubtitle: form.heroSubtitle.trim(),
        heroCtaLabel: form.heroCtaLabel.trim(),
        heroCtaUrl: form.heroCtaUrl.trim(),
        heroImage: form.heroImage.trim(),
        aboutTitle: form.aboutTitle.trim(),
        aboutBody: form.aboutBody.trim(),
      });
      setMessage('Homepage settings saved');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-10 w-64 bg-slate-100 rounded-xl animate-pulse" />
        <div className="h-64 bg-slate-100 rounded-3xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Homepage Settings</h1>
          <p className="text-slate-500 mt-1 text-sm font-medium">
            Edit the hero banner and about section on the public homepage.
          </p>
        </div>
        <Link
          to="/"
          target="_blank"
          rel="noreferrer"
          className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50"
        >
          ↗ View site
        </Link>
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

      <div className="flex gap-2 flex-wrap">
        {[
          { key: 'hero', label: '🏔️ Hero banner', desc: 'Title, CTA, image' },
          { key: 'about', label: '📖 About section', desc: 'Company intro' },
          { key: 'preview', label: '👁 Preview', desc: 'Live look' },
        ].map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => setSection(key)}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
              section === key ? 'bg-slate-800 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <form onSubmit={save} className="space-y-6">
        {section === 'hero' && (
          <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-brand/5 to-transparent">
              <h2 className="font-bold text-slate-800 text-sm">Hero banner</h2>
              <p className="text-[11px] text-slate-400 mt-0.5">
                First thing visitors see at the top of the homepage
              </p>
            </div>
            <div className="p-6 space-y-5">
              <Field label="Hero title">
                <input
                  className={inputCls}
                  value={form.heroTitle}
                  onChange={(e) => set('heroTitle', e.target.value)}
                  placeholder="Everest Base Camp Trek - 15 Days"
                  required
                />
              </Field>
              <Field label="Hero subtitle">
                <input
                  className={inputCls}
                  value={form.heroSubtitle}
                  onChange={(e) => set('heroSubtitle', e.target.value)}
                  placeholder="Short supporting line under the title"
                  required
                />
              </Field>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="CTA button label">
                  <input
                    className={inputCls}
                    value={form.heroCtaLabel}
                    onChange={(e) => set('heroCtaLabel', e.target.value)}
                    placeholder="Book Now"
                    required
                  />
                </Field>
                <Field label="CTA button URL" hint="e.g. /trips or /booking">
                  <input
                    className={inputCls}
                    value={form.heroCtaUrl}
                    onChange={(e) => set('heroCtaUrl', e.target.value)}
                    placeholder="/trips"
                    required
                  />
                </Field>
              </div>
              <Field label="Hero image">
                <ImageUploader
                  value={form.heroImage}
                  onChange={(url) => set('heroImage', url)}
                  label="Upload hero image"
                />
                <input
                  className={`${inputCls} mt-3 font-mono text-xs`}
                  value={form.heroImage}
                  onChange={(e) => set('heroImage', e.target.value)}
                  placeholder="Or paste image URL…"
                />
              </Field>
              {form.heroImage && (
                <div className="rounded-2xl overflow-hidden border border-slate-200 h-40 bg-slate-100">
                  <img src={form.heroImage} alt="Hero preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>
        )}

        {section === 'about' && (
          <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-brand/5 to-transparent">
              <h2 className="font-bold text-slate-800 text-sm">About section</h2>
              <p className="text-[11px] text-slate-400 mt-0.5">Company introduction block on the homepage</p>
            </div>
            <div className="p-6 space-y-5">
              <Field label="About title">
                <input
                  className={inputCls}
                  value={form.aboutTitle}
                  onChange={(e) => set('aboutTitle', e.target.value)}
                  placeholder="Himtrail Adventure — Leading Adventure Company in Nepal"
                  required
                />
              </Field>
              <Field label="About body">
                <textarea
                  rows={8}
                  className={`${inputCls} resize-y leading-relaxed`}
                  value={form.aboutBody}
                  onChange={(e) => set('aboutBody', e.target.value)}
                  placeholder="Tell visitors who you are and what makes your trips special…"
                  required
                />
              </Field>
            </div>
          </div>
        )}

        {section === 'preview' && (
          <div className="space-y-6">
            <div className="relative rounded-3xl overflow-hidden border border-slate-200 shadow-sm min-h-[220px] bg-slate-900 text-white">
              {form.heroImage && (
                <img
                  src={form.heroImage}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover opacity-50"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />
              <div className="relative z-10 p-8 md:p-10 flex flex-col justify-end min-h-[220px]">
                <p className="text-[10px] uppercase tracking-[0.25em] text-white/60 font-bold mb-2">
                  Hero preview
                </p>
                <h2 className="font-display text-2xl md:text-3xl font-bold leading-tight">
                  {form.heroTitle || 'Hero title'}
                </h2>
                <p className="text-white/70 text-sm mt-2 max-w-lg">
                  {form.heroSubtitle || 'Hero subtitle'}
                </p>
                {form.heroCtaLabel && (
                  <span className="inline-flex mt-5 self-start px-5 py-2.5 rounded-full bg-brand text-white text-xs font-bold">
                    {form.heroCtaLabel}
                  </span>
                )}
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
              <p className="text-[10px] uppercase tracking-[0.25em] text-slate-400 font-bold mb-3">
                About preview
              </p>
              <h3 className="font-display text-xl font-bold text-slate-800">
                {form.aboutTitle || 'About title'}
              </h3>
              <p className="text-slate-600 text-sm mt-3 leading-relaxed whitespace-pre-wrap">
                {form.aboutBody || 'About body will appear here…'}
              </p>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between gap-3 flex-wrap sticky bottom-4 bg-white/90 backdrop-blur border border-slate-200 rounded-2xl px-5 py-3 shadow-lg">
          <p className="text-xs text-slate-400 font-medium">
            Changes go live on the homepage after you save.
          </p>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-brand text-white text-sm font-bold shadow-md shadow-brand/25 hover:shadow-lg disabled:opacity-60 transition-all"
          >
            {saving ? 'Saving…' : '💾 Save homepage'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default HomepageAdmin;
