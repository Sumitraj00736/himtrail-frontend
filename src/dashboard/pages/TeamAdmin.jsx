import { useEffect, useState } from 'react';
import { api } from '../../services/api';
import ImageUploader from '../../components/ImageUploader';

const emptyMember = {
  name: '',
  role: '',
  image: '',
  bio: '',
  order: 0,
  isActive: true,
  socialLinks: {
    facebook: '',
    instagram: '',
    linkedin: '',
    twitter: '',
  },
};

const TeamAdmin = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyMember);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState({ text: '', type: '' });

  const load = async () => {
    try {
      setLoading(true);
      const res = await api.get('/dashboard/team');
      setItems(res.data.data || []);
    } catch (err) {
      console.error(err);
      showMsg('Failed to load team members.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const showMsg = (text, type = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 4000);
  };

  const handleEditClick = (member) => {
    setEditingId(member._id);
    setForm({
      name: member.name || '',
      role: member.role || '',
      image: member.image || '',
      bio: member.bio || '',
      order: member.order ?? 0,
      isActive: member.isActive ?? true,
      socialLinks: {
        facebook: member.socialLinks?.facebook || '',
        instagram: member.socialLinks?.instagram || '',
        linkedin: member.socialLinks?.linkedin || '',
        twitter: member.socialLinks?.twitter || '',
      },
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setForm(emptyMember);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.role) {
      showMsg('Name and Role are required.', 'error');
      return;
    }

    if (!form.image) {
      showMsg('Please upload a profile photo.', 'error');
      return;
    }

    try {
      if (editingId) {
        await api.put(`/dashboard/team/${editingId}`, form);
        showMsg('Team member updated successfully!');
      } else {
        await api.post('/dashboard/team', form);
        showMsg('Team member created successfully!');
      }
      setForm(emptyMember);
      setEditingId(null);
      load();
    } catch (err) {
      console.error(err);
      showMsg(err.response?.data?.message || 'Something went wrong.', 'error');
    }
  };

  const remove = async (id) => {
    if (!window.confirm('Are you sure you want to delete this team member?')) return;
    try {
      await api.delete(`/dashboard/team/${id}`);
      showMsg('Team member deleted.');
      if (editingId === id) {
        handleCancelEdit();
      }
      load();
    } catch (err) {
      console.error(err);
      showMsg('Failed to delete team member.', 'error');
    }
  };

  const handleSocialChange = (platform, val) => {
    setForm((prev) => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [platform]: val,
      },
    }));
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-800 tracking-tight">Team Management</h1>
        <p className="text-slate-500 text-sm mt-1">
          Manage your team profiles, roles, and order of display on the public website.
        </p>
      </div>

      {message.text && (
        <div
          className={`p-4 rounded-2xl border text-sm font-semibold tracking-wide shadow-sm flex items-center gap-2 animate-float ${
            message.type === 'error'
              ? 'bg-red-50 border-red-200 text-red-600'
              : 'bg-emerald-50 border-emerald-200 text-emerald-600'
          }`}
        >
          {message.type === 'error' ? '⚠️' : '✅'} {message.text}
        </div>
      )}

      <div className="grid lg:grid-cols-[1fr_400px] gap-8 items-start">
        {/* List of Team Members */}
        <div className="bg-white/50 border border-slate-100 rounded-3xl p-6 shadow-sm min-h-[400px]">
          <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            👥 Active Team ({items.length})
          </h2>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
              <div className="w-8 h-8 border-2 border-brand/20 border-t-brand rounded-full animate-spin mb-3" />
              <p className="text-xs font-semibold">Loading members...</p>
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-slate-200 rounded-2xl text-slate-400">
              <p className="text-sm">No team members added yet.</p>
              <p className="text-xs mt-1">Use the panel on the right to add your first team member.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item._id}
                  className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border rounded-2xl transition-all ${
                    editingId === item._id
                      ? 'border-brand bg-brand/5 shadow-inner'
                      : 'border-slate-100 hover:border-slate-200 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-14 h-14 rounded-2xl object-cover shadow-sm bg-slate-50 border border-slate-100 flex-shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-800 text-sm">{item.name}</span>
                        {!item.isActive && (
                          <span className="bg-slate-100 text-slate-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-slate-200">
                            Inactive
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-brand font-semibold">{item.role}</p>
                      <p className="text-[10px] text-slate-400 font-semibold mt-1">
                        Order: {item.order} {item.bio ? '· Has Bio' : ''}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <button
                      onClick={() => handleEditClick(item)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                        editingId === item._id
                          ? 'bg-brand text-white border-brand'
                          : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => remove(item._id)}
                      className="px-3 py-1.5 rounded-xl border border-red-100 hover:border-red-200 bg-red-50/50 hover:bg-red-50 text-red-600 text-xs font-bold transition-all"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Form Container */}
        <aside className="bg-slate-50/80 border border-slate-100/60 rounded-3xl p-6 shadow-premium sticky top-24">
          <h2 className="text-lg font-bold text-slate-800 mb-5 flex items-center gap-2">
            {editingId ? '✏️ Edit Profile' : '➕ Add Team Member'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Image Uploader */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Photo (1:1 Ratio Recommended)
              </label>
              <ImageUploader
                value={form.image}
                onChange={(url) => setForm({ ...form, image: url })}
                label="Choose Photo"
              />
            </div>

            {/* Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Name</label>
              <input
                className="w-full rounded-2xl border-slate-200 text-sm focus:border-brand focus:ring-brand"
                placeholder="Full Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>

            {/* Role */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Role</label>
              <input
                className="w-full rounded-2xl border-slate-200 text-sm focus:border-brand focus:ring-brand"
                placeholder="e.g. Lead Guide / MD"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
              />
            </div>

            {/* Bio */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Brief Biography</label>
              <textarea
                className="w-full rounded-2xl border-slate-200 text-sm focus:border-brand focus:ring-brand min-h-[80px]"
                placeholder="Write a short summary..."
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
              />
            </div>

            {/* Order & Active Toggle */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Display Order</label>
                <input
                  type="number"
                  className="w-full rounded-2xl border-slate-200 text-sm focus:border-brand focus:ring-brand"
                  placeholder="0"
                  value={form.order}
                  onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
                />
              </div>

              <div className="flex items-center gap-2 mt-6">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={form.isActive}
                  onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                  className="rounded text-brand border-slate-200 focus:ring-brand w-5 h-5 cursor-pointer"
                />
                <label htmlFor="isActive" className="text-xs font-bold text-slate-600 cursor-pointer">
                  Is Active?
                </label>
              </div>
            </div>

            {/* Social Handles */}
            <div className="border-t border-slate-200/60 pt-4 space-y-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Social Links (URLs)</h3>
              
              <div className="space-y-2">
                {['linkedin', 'instagram', 'facebook', 'twitter'].map((platform) => (
                  <div key={platform} className="relative flex items-center">
                    <span className="absolute left-4 text-xs text-slate-400 capitalize font-bold">
                      {platform === 'twitter' ? 'X / Twitter' : platform}
                    </span>
                    <input
                      className="w-full pl-28 rounded-2xl border-slate-200 text-xs focus:border-brand focus:ring-brand py-2"
                      placeholder="https://..."
                      value={form.socialLinks[platform]}
                      onChange={(e) => handleSocialChange(platform, e.target.value)}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                className="flex-1 py-3 px-6 rounded-2xl bg-brand text-white font-bold text-sm shadow-md hover:shadow-lg transition-all"
              >
                {editingId ? 'Save Profile' : 'Add Profile'}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="py-3 px-4 rounded-2xl border border-slate-200 text-slate-500 text-sm hover:bg-slate-100 font-bold transition-all"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </aside>
      </div>
    </div>
  );
};

export default TeamAdmin;
