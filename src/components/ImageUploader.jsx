import { useState } from 'react';
import { api } from '../services/api';

const ImageUploader = ({ value, onChange, label = 'Upload Image' }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Local validation
    if (!file.type.startsWith('image/')) {
      setError('Only image files are allowed.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be smaller than 5MB.');
      return;
    }

    setError('');
    setUploading(true);

    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await api.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (res.data?.url) {
        onChange(res.data.url);
      } else {
        setError('Upload failed. Try again.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error uploading file.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {value && (
        <div className="relative w-28 h-28 rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-slate-50 group">
          <img src={value} alt="Preview" className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white font-bold text-xs transition-opacity duration-200"
          >
            Remove ✕
          </button>
        </div>
      )}

      <div className="flex items-center gap-3">
        <label className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 hover:border-brand/40 text-slate-700 hover:text-brand text-xs font-semibold rounded-xl cursor-pointer shadow-sm transition-all">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading}
            className="hidden"
          />
          📁 {uploading ? 'Uploading...' : label}
        </label>
        {uploading && (
          <span className="w-4 h-4 border-2 border-brand/20 border-t-brand rounded-full animate-spin" />
        )}
      </div>

      {error && <p className="text-xs font-semibold text-red-500">{error}</p>}
    </div>
  );
};

export default ImageUploader;
