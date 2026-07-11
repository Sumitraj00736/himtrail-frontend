import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../features/auth/authSlice';

const Register = () => {
  const dispatch = useDispatch();
  const { status, error } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(register(form));
  };

  return (
    <section className="min-h-[80vh] flex items-center justify-center py-12 px-6">
      <div className="max-w-4xl w-full bg-white rounded-3xl overflow-hidden shadow-premium border border-slate-100 grid md:grid-cols-2">
        {/* Cover illustration (left pane) */}
        <div className="relative hidden md:block bg-brand">
          <img 
            src="https://images.unsplash.com/photo-1516426122078-c23e76319801?q=80&w=800&auto=format&fit=crop" 
            alt="Adventure Safari" 
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-900 via-brand/40 to-transparent" />
          <div className="absolute bottom-10 left-10 right-10">
            <h3 className="font-display text-2xl font-bold text-white">Join a global community of explorers</h3>
            <p className="text-xs text-slate-200 mt-2 leading-relaxed">Unlock custom itinerary builders, group discounts, and real-time trek tracker updates.</p>
          </div>
        </div>

        {/* Form panel (right pane) */}
        <div className="p-8 md:p-12 flex flex-col justify-center">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Create an Account</h1>
            <p className="text-slate-400 text-xs mt-1">Get started with Himtrail and start planning your bucket list trips.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Full Name
              </label>
              <input
                className="w-full rounded-xl border-slate-200 bg-slate-50/50 py-3 text-sm focus:border-brand focus:ring-brand"
                placeholder="Jane Doe"
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Email Address
              </label>
              <input
                className="w-full rounded-xl border-slate-200 bg-slate-50/50 py-3 text-sm focus:border-brand focus:ring-brand"
                placeholder="you@example.com"
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Password
              </label>
              <input
                className="w-full rounded-xl border-slate-200 bg-slate-50/50 py-3 text-sm focus:border-brand focus:ring-brand"
                placeholder="Minimum 6 characters"
                type="password"
                required
                minLength={6}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>

            <button
              className="w-full py-3 bg-brand hover:bg-brand-600 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 hover:shadow-lg mt-2 flex items-center justify-center"
              type="submit"
              disabled={status === 'loading'}
            >
              {status === 'loading' ? 'Creating Account...' : 'Create Account'}
            </button>

            {error && (
              <div className="bg-red-50 text-red-600 rounded-xl p-3 border border-red-100 text-xs font-medium mt-2">
                ⚠️ {error}
              </div>
            )}
          </form>

          <p className="text-xs text-slate-400 mt-8 text-center">
            Already have an account?{' '}
            <Link to="/login" className="text-brand font-bold hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Register;
