import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

const Booking = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ trip: '', groupSize: 2, notes: '' });
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitBooking = async () => {
    setIsSubmitting(true);
    try {
      await api.post('/bookings', form);
      setStep(4); // Success step
    } catch (err) {
      setMessage('Please login to complete your booking enquiry.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="max-w-xl mx-auto px-6 py-16">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-display font-semibold text-slate-800 tracking-tight">Plan Your Journey</h1>
        <p className="text-slate-500 text-xs mt-2">
          Tailor your custom trekking adventure with our team of Himalayan travel designers.
        </p>
      </div>

      {!user && (
        <div className="bg-amber-50 text-amber-700 rounded-2xl p-4 border border-amber-100 text-xs font-semibold mb-6 flex justify-between items-center">
          <span>⚠️ You are not signed in. Log in to save and track your booking details.</span>
          <button 
            onClick={() => navigate('/login')}
            className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors font-bold uppercase tracking-wider text-[10px]"
          >
            Log In
          </button>
        </div>
      )}

      {/* Booking Form Wrapper */}
      <div className="bg-white rounded-3xl shadow-premium border border-slate-100 p-6 md:p-8">
        
        {/* Step Progress indicators */}
        {step < 4 && (
          <div className="flex justify-between items-center border-b border-slate-100 pb-5 mb-6">
            {[
              { num: 1, label: 'Trip' },
              { num: 2, label: 'Group' },
              { num: 3, label: 'Details' }
            ].map((s) => (
              <div key={s.num} className="flex items-center gap-2">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${step >= s.num ? 'bg-brand text-white' : 'bg-slate-100 text-slate-400'}`}>
                  {s.num}
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-wider ${step === s.num ? 'text-brand' : 'text-slate-400'}`}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Step 1: Trip Name Selection */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 pl-1">
                Which trip are you interested in?
              </label>
              <input
                className="w-full rounded-xl border-slate-200 bg-slate-50/50 py-3 text-sm focus:border-brand focus:ring-brand"
                placeholder="e.g. Everest Base Camp, Mera Peak, Heli Tour..."
                required
                value={form.trip}
                onChange={(e) => setForm({ ...form, trip: e.target.value })}
              />
            </div>
            <button
              className="w-full py-3 bg-brand hover:bg-brand-600 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 hover:shadow-lg mt-4 disabled:opacity-50"
              onClick={() => setStep(2)}
              type="button"
              disabled={!form.trip.trim()}
            >
              Continue to Group Size
            </button>
          </div>
        )}

        {/* Step 2: Group size selection */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 pl-1">
                Estimated Group Size
              </label>
              <input
                className="w-full rounded-xl border-slate-200 bg-slate-50/50 py-3 text-sm focus:border-brand focus:ring-brand"
                type="number"
                min="1"
                required
                value={form.groupSize}
                onChange={(e) => setForm({ ...form, groupSize: parseInt(e.target.value) || 2 })}
              />
            </div>
            
            <div className="flex gap-3 pt-2">
              <button
                className="w-1/3 py-3 border border-slate-200 text-slate-600 text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-slate-50 transition-colors duration-200"
                onClick={() => setStep(1)}
                type="button"
              >
                Back
              </button>
              <button
                className="w-2/3 py-3 bg-brand hover:bg-brand-600 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 hover:shadow-lg"
                onClick={() => setStep(3)}
                type="button"
              >
                Next Step
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Special notes details */}
        {step === 3 && (
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 pl-1">
                Custom requirements / preferences
              </label>
              <textarea
                className="w-full rounded-xl border-slate-200 bg-slate-50/50 py-3 text-sm focus:border-brand focus:ring-brand min-h-[120px]"
                placeholder="Tell us about your goals, preferred travel dates, high-altitude experience level, or any dietary modifications needed..."
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
              />
            </div>
            
            <div className="flex gap-3 pt-2">
              <button
                className="w-1/3 py-3 border border-slate-200 text-slate-600 text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-slate-50 transition-colors duration-200"
                onClick={() => setStep(2)}
                type="button"
              >
                Back
              </button>
              <button
                className="w-2/3 py-3 bg-sunrise-500 hover:bg-sunrise-600 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 hover:shadow-lg"
                onClick={submitBooking}
                type="button"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Booking'}
              </button>
            </div>
            {message && <p className="text-xs text-red-500 mt-2 font-medium">⚠️ {message}</p>}
          </div>
        )}

        {/* Step 4: Success confirmation */}
        {step === 4 && (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center text-3xl mx-auto border border-emerald-100">
              ✓
            </div>
            <h4 className="font-bold text-slate-800 text-lg">Enquiry Received!</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
              We have successfully received your custom enquiry. One of our local travel designers will review your preferences and get back to you with custom details within 24 hours.
            </p>
            <div className="flex gap-3 justify-center pt-4">
              <button
                className="px-6 py-2.5 bg-brand hover:bg-brand-600 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors duration-200"
                onClick={() => navigate('/trips')}
              >
                View More Trips
              </button>
              <button
                className="px-6 py-2.5 border border-slate-200 text-slate-600 text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-slate-50 transition-colors duration-200"
                onClick={() => navigate('/')}
              >
                Home
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Booking;
