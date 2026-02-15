import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../services/api';
import { sanitizeHtml } from '../utils/richText';

const TripDetail = () => {
  const { slug } = useParams();
  const [trip, setTrip] = useState(null);
  const [tab, setTab] = useState('included');
  const [bookingOpen, setBookingOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [bookingForm, setBookingForm] = useState({
    travelerName: '',
    travelerEmail: '',
    travelerPhone: '',
    groupSize: 2,
    notes: '',
  });
  const [bookingMessage, setBookingMessage] = useState('');

  useEffect(() => {
    api.get(`/trips/${slug}`).then((res) => setTrip(res.data.data));
  }, [slug]);

  if (!trip) {
    return <div className="max-w-5xl mx-auto px-6 py-16 text-forest-800">Loading...</div>;
  }

  const heroImage =
    trip.heroImage ||
    'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=2000&auto=format&fit=crop';

  const dates = trip.dates?.length
    ? trip.dates
    : [
        {
          startDate: 'February 24, 2026',
          endDate: 'March 10, 2026',
          status: 'Available',
          price: `US$${trip.price || 1540}`,
        },
      ];

  const included = trip.included?.length
    ? trip.included
    : [
        'Airport pick-up and drop by private vehicles',
        'Kathmandu City Tour with a tour guide',
        'Full board meals during the trek',
        'All necessary permits and entrance fees',
      ];

  const excluded = trip.excluded?.length
    ? trip.excluded
    : ['International flights', 'Personal expenses', 'Travel insurance'];

  const itinerary = trip.itinerary?.length
    ? trip.itinerary
    : [
        { day: 1, title: 'Arrival in Kathmandu and Transfer to Hotel' },
        { day: 2, title: 'UNESCO World Heritage Site Excursion' },
        { day: 3, title: 'Fly to Lukla & Trek to Phakding' },
      ];

  return (
    <div>
      <section
        className="relative h-[460px] bg-cover bg-center text-white"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/30 to-black/60" />
        <div className="relative max-w-6xl mx-auto px-6 h-full flex flex-col justify-end pb-12 fade-up">
          <p className="text-sm text-white/80">
            Home &gt; Destinations &gt; {trip.destination} &gt; {trip.region}
          </p>
          <h1 className="text-4xl md:text-5xl font-semibold mt-2">{trip.title}</h1>
        </div>
      </section>

      <div className="sticky top-[96px] z-40 bg-white border-b shadow-sm">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-wrap gap-6 text-sm font-semibold text-forest-700">
            {[
              { id: 'overview', label: 'OVERVIEW' },
              { id: 'itinerary', label: 'ITINERARY' },
              { id: 'expect', label: 'WHAT TO EXPECT' },
              { id: 'dates', label: 'DATES & PRICE' },
              { id: 'useful', label: 'USEFUL INFO' },
              { id: 'faqs', label: 'FAQS' },
              { id: 'reviews', label: 'REVIEWS' },
            ].map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="py-4 border-b-2 border-transparent hover:text-forest-800 hover:border-sunrise-500 transition-colors"
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      <section className="max-w-6xl mx-auto px-6 -mt-10">
        <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-6">
          <div className="bg-forest-800 text-white rounded-3xl p-6 shadow-lg fade-up">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Key Information</h2>
              <span className="text-xs uppercase tracking-[0.2em] text-white/70">Trip Facts</span>
            </div>
            <div className="mt-6 grid md:grid-cols-3 gap-6 text-sm">
              <div>
              <p className="text-white/70">Duration</p>
              <p className="font-semibold">{trip.duration} Days</p>
              </div>
              <div>
                <p className="text-white/70">Trip Grade</p>
                <p className="font-semibold">{trip.tripGrade || 'Strenuous'}</p>
              </div>
              <div>
                <p className="text-white/70">Destination</p>
                <p className="font-semibold">{trip.destinationLabel || trip.destination}</p>
              </div>
              <div>
                <p className="text-white/70">Max Altitude</p>
                <p className="font-semibold">{trip.maxAltitude || '5,545 m'}</p>
              </div>
              <div>
                <p className="text-white/70">Activity</p>
                <p className="font-semibold">{trip.activity || 'Trek, Flight & Tour'}</p>
              </div>
              <div>
                <p className="text-white/70">Group Size</p>
                <p className="font-semibold">{trip.groupSize || '1-20'}</p>
              </div>
            </div>
            <div className="mt-6 border-t border-white/10 pt-4 flex items-center gap-4">
              <div className="bg-sunrise-500 text-white font-semibold px-3 py-1 rounded">5.0</div>
              <div>
                <p className="font-semibold">Excellent</p>
                <p className="text-white/70 text-sm">based on {trip.reviews?.count || 82} reviews</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-lg border p-6 fade-up">
            <div className="flex items-center justify-between">
              <p className="text-sm text-forest-700">Price from</p>
              <span className="px-3 py-1 bg-forest-800 text-white text-xs rounded-full">
                Traveler's Choice
              </span>
            </div>
            <div className="mt-2 text-2xl font-semibold text-sunrise-500">
              US${trip.price}
              {trip.oldPrice && (
                <span className="text-forest-500 text-lg line-through ml-2">US${trip.oldPrice}</span>
              )}
            </div>
            <p className="text-sm text-forest-700 mt-2">Group Price Available</p>
            <select className="mt-3 w-full rounded-xl border-forest-200">
              <option>Group Price Available</option>
            </select>
            <ul className="mt-4 text-sm text-forest-700 space-y-2">
              <li>Best Price Guarantee</li>
              <li>No booking or Credit Card Fee</li>
              <li>Free Cancellation</li>
            </ul>
            <div className="mt-4 space-y-3">
              <button className="w-full py-3 rounded-xl bg-sunrise-500 text-white font-semibold">
                Book This Trip
              </button>
              <button className="w-full py-3 rounded-xl bg-forest-800 text-white font-semibold">
                Customize Trip
              </button>
              <button className="w-full py-3 rounded-xl border border-forest-800 text-forest-800 font-semibold">
                Check Availability
              </button>
            </div>
          </div>
        </div>
      </section>

      <section id="overview" className="max-w-6xl mx-auto px-6 py-12 fade-up">
        <div
          className="prose max-w-none text-forest-700"
          dangerouslySetInnerHTML={{
            __html: sanitizeHtml(
              trip.longDescription || trip.shortDescription || 'Trip description will appear here.'
            ),
          }}
        />
      </section>

      <section id="expect" className="max-w-6xl mx-auto px-6 pb-12 fade-up">
        <h2 className="text-2xl font-semibold text-forest-800">You'll See</h2>
        <div className="mt-6 grid md:grid-cols-4 gap-4">
          {[
            ...trip.gallery,
            'https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=800&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1482192505345-5655af888cc4?q=80&w=800&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?q=80&w=800&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=800&auto=format&fit=crop',
          ].slice(0, 4).map((img) => (
            <img key={img} src={img} alt="Gallery" className="rounded-2xl h-36 w-full object-cover shadow-sm" />
          ))}
        </div>
        <div className="mt-6">
          <div className="rounded-3xl overflow-hidden shadow-lg">
            <img
              src={trip.gallery?.[0] || heroImage}
              alt="Hero"
              className="w-full h-[360px] object-cover"
            />
          </div>
        </div>
      </section>

      <section id="itinerary" className="max-w-6xl mx-auto px-6 pb-12 fade-up">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-forest-800">Itinerary</h2>
          <button className="text-sunrise-500 font-semibold">Expand All</button>
        </div>
        <div className="mt-4 bg-forest-50 border-l-4 border-forest-800 p-4 rounded-2xl">
          <p className="text-forest-700 text-sm">
            We offer opportunities to customize your trip. Consider adding a Kathmandu sightseeing tour or other
            adventure activities before or after your trek.
          </p>
        </div>
        <div className="mt-6 space-y-3">
          {itinerary.map((day) => (
            <div key={day.day} className="border border-forest-100 rounded-2xl p-4 hover:shadow-sm transition-shadow">
              <div className="font-semibold text-forest-800">Day {day.day}: {day.title}</div>
            </div>
          ))}
        </div>
      </section>

      <section id="useful" className="max-w-6xl mx-auto px-6 pb-12 fade-up">
        <h2 className="text-2xl font-semibold text-forest-800">What's Included</h2>
        <div className="mt-4 flex gap-3">
          <button
            className={`px-4 py-2 rounded-full border ${tab === 'included' ? 'bg-forest-800 text-white' : 'text-forest-800 border-forest-800'}`}
            onClick={() => setTab('included')}
            type="button"
          >
            Included
          </button>
          <button
            className={`px-4 py-2 rounded-full border ${tab === 'excluded' ? 'bg-forest-800 text-white' : 'text-forest-800 border-forest-800'}`}
            onClick={() => setTab('excluded')}
            type="button"
          >
            Excluded
          </button>
        </div>
        <div className="mt-4 bg-forest-50 rounded-2xl p-6 shadow-sm">
          {(tab === 'included' ? included : excluded).map((item) => (
            <div key={item} className="flex items-start gap-3 text-forest-700 mb-3">
              <span className="text-sunrise-500">✓</span>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </section>

      <section id="dates" className="max-w-6xl mx-auto px-6 pb-16 fade-up">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-forest-800">Dates & Price</h2>
          <button className="px-4 py-2 rounded-full border border-sunrise-500 text-sunrise-500">Private Trip</button>
        </div>
        <div className="mt-4 bg-forest-50 border-l-4 border-forest-800 p-4 rounded-2xl text-forest-700 text-sm">
          Start Dates refer to your arrival date in Nepal and End Dates refer to your return date from Nepal.
        </div>
        <div className="mt-6 bg-white rounded-3xl border shadow-sm">
          <div className="grid grid-cols-12 px-6 py-4 text-sm text-forest-600 font-semibold">
            <div className="col-span-4">Departure Date</div>
            <div className="col-span-4">Trip Status</div>
            <div className="col-span-2">Price</div>
            <div className="col-span-2"></div>
          </div>
          {dates.map((row, idx) => (
            <div key={idx} className="grid grid-cols-12 px-6 py-4 border-t text-sm text-forest-700">
              <div className="col-span-4">{row.startDate} - {row.endDate}</div>
              <div className="col-span-4 font-semibold">{row.status}</div>
              <div className="col-span-2 font-semibold">{row.price}</div>
              <div className="col-span-2">
                <button
                  className="px-4 py-2 rounded-full border border-sunrise-500 text-sunrise-500 text-xs"
                  onClick={() => {
                    setSelectedDate(row);
                    setBookingOpen(true);
                    setBookingMessage('');
                  }}
                >
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {bookingOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-forest-800">Booking Enquiry</h3>
              <button className="text-slate-500" onClick={() => setBookingOpen(false)}>✕</button>
            </div>
            <p className="text-sm text-forest-700 mt-2">
              {trip.title} · {selectedDate?.startDate} - {selectedDate?.endDate} · {selectedDate?.price}
            </p>
            <div className="mt-4 grid gap-3">
              <input className="rounded-full border-forest-200" placeholder="Full name" value={bookingForm.travelerName} onChange={(e) => setBookingForm({ ...bookingForm, travelerName: e.target.value })} />
              <input className="rounded-full border-forest-200" placeholder="Email" value={bookingForm.travelerEmail} onChange={(e) => setBookingForm({ ...bookingForm, travelerEmail: e.target.value })} />
              <input className="rounded-full border-forest-200" placeholder="Phone" value={bookingForm.travelerPhone} onChange={(e) => setBookingForm({ ...bookingForm, travelerPhone: e.target.value })} />
              <input className="rounded-full border-forest-200" type="number" min="1" value={bookingForm.groupSize} onChange={(e) => setBookingForm({ ...bookingForm, groupSize: e.target.value })} />
              <textarea className="rounded-2xl border-forest-200 min-h-[100px]" placeholder="Notes" value={bookingForm.notes} onChange={(e) => setBookingForm({ ...bookingForm, notes: e.target.value })} />
              <button
                className="py-3 rounded-full bg-sunrise-500 text-white font-semibold"
                onClick={async () => {
                  try {
                    await api.post('/bookings', {
                      trip: trip._id,
                      groupSize: bookingForm.groupSize,
                      notes: bookingForm.notes,
                      travelerName: bookingForm.travelerName,
                      travelerEmail: bookingForm.travelerEmail,
                      travelerPhone: bookingForm.travelerPhone,
                      tripStartDate: selectedDate?.startDate,
                      tripEndDate: selectedDate?.endDate,
                      tripPrice: selectedDate?.price,
                    });
                    setBookingMessage('Enquiry submitted successfully.');
                  } catch (err) {
                    setBookingMessage('Failed to submit enquiry.');
                  }
                }}
              >
                Submit Enquiry
              </button>
              {bookingMessage && <p className="text-sm text-forest-700">{bookingMessage}</p>}
            </div>
          </div>
        </div>
      )}

      <section id="faqs" className="max-w-6xl mx-auto px-6 pb-12 fade-up">
        <h2 className="text-2xl font-semibold text-forest-800">FAQs</h2>
        <div className="mt-4 space-y-3 text-forest-700">
          <div className="border rounded-2xl p-4 hover:shadow-sm transition-shadow">What is the best season to trek?</div>
          <div className="border rounded-2xl p-4 hover:shadow-sm transition-shadow">What fitness level is required?</div>
          <div className="border rounded-2xl p-4 hover:shadow-sm transition-shadow">Do I need travel insurance?</div>
        </div>
      </section>

      <section id="reviews" className="max-w-6xl mx-auto px-6 pb-16 fade-up">
        <h2 className="text-2xl font-semibold text-forest-800">Reviews</h2>
        <div className="mt-4 text-forest-700">Reviews will appear here.</div>
      </section>
    </div>
  );
};

export default TripDetail;
