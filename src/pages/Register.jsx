import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
    <section className="max-w-md mx-auto px-6 py-16">
      <h1 className="section-title">Create an Account</h1>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <input
          className="w-full rounded-full border-forest-200"
          placeholder="Full name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          className="w-full rounded-full border-forest-200"
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          className="w-full rounded-full border-forest-200"
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <button
          className="w-full py-3 rounded-full bg-forest-900 text-white"
          type="submit"
        >
          {status === 'loading' ? 'Creating...' : 'Create Account'}
        </button>
        {error && <p className="text-sm text-red-600">{error}</p>}
      </form>
    </section>
  );
};

export default Register;
