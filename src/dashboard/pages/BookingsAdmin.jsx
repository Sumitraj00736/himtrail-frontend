import { useEffect, useState } from 'react';
import { api } from '../../services/api';

const BookingsAdmin = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    api.get('/bookings').then((res) => setBookings(res.data.data));
  }, []);

  const updateStatus = async (id, status) => {
    await api.put(`/bookings/${id}`, { status });
    setBookings((prev) => prev.map((b) => (b._id === id ? { ...b, status } : b)));
  };

  return (
    <div>
      <h1 className="text-xl font-semibold text-[#243b75]">Bookings</h1>
      <div className="mt-4 space-y-3">
        {bookings.map((booking) => (
          <div key={booking._id} className="border rounded-xl p-4">
            <div className="font-semibold">{booking.trip?.title}</div>
            <div className="text-sm text-slate-500">
              {booking.user?.email || booking.travelerEmail || 'Guest'}
            </div>
            <div className="text-sm text-slate-500">
              {booking.tripStartDate ? `${booking.tripStartDate} - ${booking.tripEndDate}` : ''}
            </div>
            <div className="text-sm text-slate-500">Price: {booking.tripPrice}</div>
            <div className="mt-2 flex items-center gap-3">
              <span className="text-sm">Status: {booking.status}</span>
              <button
                className="px-3 py-1 rounded-full border text-xs"
                onClick={() => updateStatus(booking._id, 'Confirmed')}
              >
                Confirm
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookingsAdmin;
