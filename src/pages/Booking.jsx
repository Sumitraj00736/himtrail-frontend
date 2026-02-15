import { useState } from 'react';
import { useSelector } from 'react-redux';
import { api } from '../services/api';

const Booking = () => {
  const { user } = useSelector((state) => state.auth);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ trip: '', groupSize: 2, notes: '' });
  const [message, setMessage] = useState('');

  const submitBooking = async () => {
    try {
      await api.post('/bookings', form);
      setMessage('Enquiry sent. Our team will respond within 24 hours.');
    } catch (err) {
      setMessage('Please login to complete your enquiry.');
    }
  };

  return (
    <section className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="section-title">Enquire Now</h1>
      <p className="text-forest-600 mt-2">
        Tailor your journey with our travel designers.
      </p>
      {!user && (
        <p className="mt-4 text-sm text-forest-700">
          Create an account or login to submit an enquiry.
        </p>
      )}
      <div className="mt-8 bg-white rounded-3xl p-6 border">
        <div className="flex gap-3 text-xs uppercase tracking-[0.2em] text-forest-600">
          <span className={step === 1 ? 'text-forest-900' : ''}>Trip</span>
          <span className={step === 2 ? 'text-forest-900' : ''}>Group</span>
          <span className={step === 3 ? 'text-forest-900' : ''}>Details</span>
        </div>
        {step === 1 && (
          <div className="mt-6 space-y-4">
            <input
              className="w-full rounded-full border-forest-200"
              placeholder="Trip ID or name"
              value={form.trip}
              onChange={(e) => setForm({ ...form, trip: e.target.value })}
            />
            <button
              className="px-6 py-3 rounded-full bg-forest-900 text-white"
              onClick={() => setStep(2)}
              type="button"
            >
              Next
            </button>
          </div>
        )}
        {step === 2 && (
          <div className="mt-6 space-y-4">
            <input
              className="w-full rounded-full border-forest-200"
              type="number"
              min="1"
              value={form.groupSize}
              onChange={(e) => setForm({ ...form, groupSize: e.target.value })}
            />
            <div className="flex gap-3">
              <button
                className="px-6 py-3 rounded-full border"
                onClick={() => setStep(1)}
                type="button"
              >
                Back
              </button>
              <button
                className="px-6 py-3 rounded-full bg-forest-900 text-white"
                onClick={() => setStep(3)}
                type="button"
              >
                Next
              </button>
            </div>
          </div>
        )}
        {step === 3 && (
          <div className="mt-6 space-y-4">
            <textarea
              className="w-full rounded-2xl border-forest-200 min-h-[120px]"
              placeholder="Tell us about your goals, preferred dates, or any custom requests."
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />
            <div className="flex gap-3">
              <button
                className="px-6 py-3 rounded-full border"
                onClick={() => setStep(2)}
                type="button"
              >
                Back
              </button>
              <button
                className="px-6 py-3 rounded-full bg-sunrise-400 text-white font-semibold"
                onClick={submitBooking}
                type="button"
              >
                Submit Enquiry
              </button>
            </div>
          </div>
        )}
        {message && <p className="mt-4 text-sm text-forest-700">{message}</p>}
      </div>
    </section>
  );
};

export default Booking;
