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
  const [expandedItinerary, setExpandedItinerary] = useState([]);
  const [expandedFaq, setExpandedFaq] = useState([]);

  useEffect(() => {
    api.get(`/trips/${slug}`).then((res) => setTrip(res.data.data));
  }, [slug]);

  if (!trip) return <div className="max-w-5xl mx-auto px-6 py-16 text-forest-800">Loading...</div>;

  const heroImage =
    trip.heroImage ||
    'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=2000&auto=format&fit=crop';

  const dates = trip.dates?.length
    ? trip.dates
    : [
        { startDate: 'February 24, 2026', endDate: 'March 10, 2026', status: 'Available', price: `US$${trip.price || 1540}` },
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
      {
        day: 1,
        title: 'Arrival in Kathmandu and Transfer to Hotel ✈️🏨',
        details: 'Arrive at Tribhuvan International Airport. Meet your friendly guide and transfer to a comfortable hotel in Kathmandu. Enjoy a welcome dinner with traditional Nepali cuisine and meet fellow travelers. 🍲👋',
      },
      {
        day: 2,
        title: 'UNESCO World Heritage Site Excursion 🏛️🌏',
        details: 'Explore the rich cultural heritage of Kathmandu. Visit the iconic Durbar Square, witness the sacred rituals at Pashupatinath Temple, and marvel at the massive Boudhanath Stupa. Don’t forget your camera for breathtaking shots! 📸✨',
      },
      {
        day: 3,
        title: 'Fly to Lukla & Trek to Phakding 🛫🥾',
        details: 'Take an exciting flight to Lukla, the gateway to Everest. Begin a short trek to Phakding to acclimate. Overnight stay in a cozy tea house surrounded by stunning Himalayan scenery. 🌄🏠',
      },
      {
        day: 4,
        title: 'Trek to Namche Bazaar 🥾🏔️',
        details: 'Continue trekking through pine forests and suspension bridges. Arrive at Namche Bazaar, the bustling Sherpa town. Enjoy panoramic views of Everest and surrounding peaks. Overnight in a tea house with local hospitality. 🏞️🍵',
      },
      {
        day: 5,
        title: 'Acclimatization Day in Namche Bazaar 🏔️🌟',
        details: 'Spend the day exploring Namche Bazaar to acclimatize. Optional short hikes to nearby viewpoints for incredible mountain vistas. Learn about Sherpa culture and shop for local handicrafts. 🛍️🗻',
      },
    ];
const faqs = [
  {
    question: 'What is the best season to trek? 🌤️',
    answer: 'The ideal time to trek is during Spring (March-May) or Autumn (September-November). Expect clear skies, mild temperatures, and vibrant landscapes. Avoid monsoon months to prevent slippery trails and limited visibility. 🌺🍂',
  },
  {
    question: 'What fitness level is required? 💪🥾',
    answer: 'A moderate fitness level is recommended. You should be comfortable walking for several hours a day with a light backpack. Prior hiking experience is helpful but not mandatory. Daily short exercises before the trip will prepare your body for the trek. 🏃‍♂️🏞️',
  },
  {
    question: 'Do I need travel insurance? 🛡️',
    answer: 'Yes! Comprehensive travel insurance covering trekking, flights, and medical emergencies is mandatory. It ensures you are protected for unexpected situations like cancellations, injuries, or emergencies. 🏥✈️',
  },
  {
    question: 'Will I have internet access during the trek? 🌐📶',
    answer: 'Limited internet is available in some teahouses along the route, but expect slow speeds. This is a perfect opportunity to disconnect and immerse yourself in nature! 🌄📵',
  },
  {
    question: 'What type of accommodation is provided? 🏠🛏️',
    answer: 'You will stay in clean, comfortable tea houses along the trekking route. Meals are included, and the rooms typically have shared bathrooms. Expect cozy and warm local hospitality! 🍵✨',
  },
  {
    question: 'Is the food suitable for vegetarians? 🥗🍛',
    answer: 'Yes, vegetarian meals are available. Most teahouses offer a variety of Nepali dishes, including dal bhat, noodles, soups, and fresh vegetables. Always inform your guide about dietary restrictions in advance. 🌿🥘',
  },
];


  const toggleItinerary = (day) => {
    setExpandedItinerary((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const toggleFaq = (index) => {
    setExpandedFaq((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  return (
    <div>
      {/* Hero Section */}
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

      {/* Tabs Navigation */}
      <div className="sticky top-[120px] z-40 bg-white border-b shadow-sm">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-wrap md:flex-nowrap gap-8 text-sm font-semibold tracking-wide text-gray-700 overflow-x-auto no-scrollbar">
            {['overview', 'itinerary', 'expect', 'dates', 'useful', 'faqs', 'reviews'].map((id) => (
              <a
                key={id}
                href={`#${id}`}
                className="relative py-5 transition-all duration-300 border-b-2 border-transparent hover:text-forest-800 hover:border-sunrise-500 after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0 after:bg-sunrise-500 after:transition-all after:duration-300 hover:after:w-full"
              >
                {id.toUpperCase()}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Trip Info & Booking */}
      <section className="max-w-6xl mx-auto px-6 mt-10 grid lg:grid-cols-[1.2fr_0.8fr] gap-6">
        {/* Key Info */}
        <div className="bg-forest-800 text-white rounded-3xl p-6 shadow-lg fade-up">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Key Information</h2>
            <span className="text-xs uppercase tracking-[0.2em] text-white/70">Trip Facts</span>
          </div>
          <div className="mt-6 grid md:grid-cols-3 gap-6 text-sm">
            {[
              { label: 'Duration', value: `${trip.duration} Days` },
              { label: 'Trip Grade', value: trip.tripGrade || 'Strenuous' },
              { label: 'Destination', value: trip.destinationLabel || trip.destination },
              { label: 'Max Altitude', value: trip.maxAltitude || '5,545 m' },
              { label: 'Activity', value: trip.activity || 'Trek, Flight & Tour' },
              { label: 'Group Size', value: trip.groupSize || '1-20' },
            ].map((info) => (
              <div key={info.label}>
                <p className="text-white/70">{info.label}</p>
                <p className="font-semibold">{info.value}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 border-t border-white/10 pt-4 flex items-center gap-4">
            <div className="bg-sunrise-500 text-white font-semibold px-3 py-1 rounded">5.0</div>
            <div>
              <p className="font-semibold">Excellent</p>
              <p className="text-white/70 text-sm">based on {trip.reviews?.count || 82} reviews</p>
            </div>
          </div>
        </div>

        {/* Booking Card */}
        <div className="lg:sticky top-32 bg-white rounded-3xl shadow-lg border p-6 fade-up">
          <div className="flex items-center justify-between">
            <p className="text-sm text-forest-700">Price from</p>
            <span className="px-3 py-1 bg-forest-800 text-white text-xs rounded-full">Traveler's Choice</span>
          </div>
          <div className="mt-2 text-2xl font-semibold text-sunrise-500">
            US${trip.price}
            {trip.oldPrice && <span className="text-forest-500 text-lg line-through ml-2">US${trip.oldPrice}</span>}
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
            <button className="w-full py-3 rounded-xl bg-sunrise-500 text-white font-semibold">Book This Trip</button>
            <button className="w-full py-3 rounded-xl bg-forest-800 text-white font-semibold">Customize Trip</button>
            <button className="w-full py-3 rounded-xl border border-forest-800 text-forest-800 font-semibold">Check Availability</button>
          </div>
        </div>
      </section>

      {/* Overview */}
      <section id="overview" className="max-w-6xl mx-auto px-6 py-12 fade-up">
        <div
          className="prose max-w-none text-forest-700"
          dangerouslySetInnerHTML={{
            __html: sanitizeHtml(trip.longDescription || trip.shortDescription || 'Trip description will appear here.'),
          }}
        />
      </section>

      {/* What to Expect / Gallery */}
      <section id="expect" className="max-w-6xl mx-auto px-6 pb-12 fade-up">
        <h2 className="text-2xl font-semibold text-forest-800">You'll See</h2>
        <div className="mt-6 grid md:grid-cols-4 gap-4">
          {[
            ...trip.gallery,
            'https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=800&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1482192505345-5655af888cc4?q=80&w=800&auto=format&fit=crop',
          ].slice(0, 4).map((img) => (
            <img key={img} src={img} alt="Gallery" className="rounded-2xl h-36 w-full object-cover shadow-sm" />
          ))}
        </div>
        <div className="mt-6">
          <div className="rounded-3xl overflow-hidden shadow-lg">
            <img src={trip.gallery?.[0] || heroImage} alt="Hero" className="w-full h-[360px] object-cover" />
          </div>
        </div>
      </section>

      {/* Itinerary */}
<section id="itinerary" className="max-w-6xl mx-auto px-6 pb-12 fade-up">
  <div className="flex items-center justify-between">
    <h2 className="text-2xl font-semibold text-forest-800">Itinerary</h2>
    <button
      className="text-sunrise-500 font-semibold"
      onClick={() => setExpandedItinerary(itinerary.map((day) => day.day))}
    >
      Expand All
    </button>
  </div>

  <div className="mt-6 space-y-3">
    {itinerary.map((day) => {
      const isOpen = expandedItinerary.includes(day.day);
      return (
        <div
          key={day.day}
          className="border border-forest-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
        >
          <div
            className="flex justify-between items-center cursor-pointer font-semibold p-4 bg-white text-forest-800"
            onClick={() => toggleItinerary(day.day)}
          >
            <span>Day {day.day}: {day.title}</span>
            <span className="text-sunrise-500 text-xl">{isOpen ? '−' : '+'}</span>
          </div>

          {/* Animated details */}
          <div
            className={`transition-all duration-500 ease-in-out bg-forest-50 px-4 ${
              isOpen ? 'max-h-96 py-4' : 'max-h-0 py-0'
            }`}
          >
            <p className="text-forest-700 text-sm">{day.details || 'Detailed itinerary info will appear here.'}</p>
          </div>
        </div>
      );
    })}
  </div>
</section>

      {/* What's Included */}
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

      {/* Dates & Price */}
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

      {/* Booking Modal */}
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

      {/* FAQs */}
      <section id="faqs" className="max-w-6xl mx-auto px-6 pb-16 fade-up">
  <h2 className="text-2xl font-semibold text-forest-800">FAQs</h2>

  <div className="mt-4 space-y-3 text-forest-700">
    {faqs.map((faq, idx) => {
      const isOpen = expandedFaq.includes(idx);
      return (
        <div
          key={idx}
          className="border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
        >
          <div
            className="flex justify-between cursor-pointer font-semibold p-4 bg-white"
            onClick={() => toggleFaq(idx)}
          >
            <span>{faq.question}</span>
            <span className="text-sunrise-500 text-xl">{isOpen ? '−' : '+'}</span>
          </div>

          {/* Animated Answer */}
          <div
            className={`transition-all duration-500 ease-in-out bg-forest-50 px-4 ${
              isOpen ? 'max-h-96 py-4' : 'max-h-0 py-0'
            }`}
          >
            <p className="text-forest-700 text-sm">{faq.answer}</p>
          </div>
        </div>
      );
    })}
  </div>
</section>


      {/* Reviews */}
<section id="reviews" className="max-w-6xl mx-auto px-6 pb-16 fade-up">
  <h2 className="text-3xl font-bold text-forest-800 mb-6">Reviews</h2>

  <div className="overflow-hidden relative">
    <div className="flex gap-6 animate-scroll whitespace-nowrap">
      {[
        {
          name: "John Doe",
          rating: 5,
          comment: "Amazing experience! The trek was well organized and the guide was fantastic.",
          avatar: "https://randomuser.me/api/portraits/men/32.jpg",
        },
        {
          name: "Jane Smith",
          rating: 4,
          comment: "Beautiful scenery and smooth itinerary. Food and lodging were comfortable.",
          avatar: "https://randomuser.me/api/portraits/women/44.jpg",
        },
        {
          name: "Michael Lee",
          rating: 5,
          comment: "Highly recommend! Everything was perfectly arranged, from flights to local tours.",
          avatar: "https://randomuser.me/api/portraits/men/54.jpg",
        },
        {
          name: "Emily Davis",
          rating: 4,
          comment: "Great adventure, loved every moment. The guides were super helpful and friendly.",
          avatar: "https://randomuser.me/api/portraits/women/65.jpg",
        },
        {
          name: "Robert Brown",
          rating: 5,
          comment: "A once-in-a-lifetime trek! Smooth organization and amazing views.",
          avatar: "https://randomuser.me/api/portraits/men/22.jpg",
        },
        // Duplicate reviews to make seamless loop
        {
          name: "John Doe",
          rating: 5,
          comment: "Amazing experience! The trek was well organized and the guide was fantastic.",
          avatar: "https://randomuser.me/api/portraits/men/32.jpg",
        },
        {
          name: "Jane Smith",
          rating: 4,
          comment: "Beautiful scenery and smooth itinerary. Food and lodging were comfortable.",
          avatar: "https://randomuser.me/api/portraits/women/44.jpg",
        },
      ].map((review, idx) => (
        <div
          key={idx}
          className="inline-block w-80 bg-white rounded-3xl shadow-xl p-6 flex flex-col gap-4 transform transition-transform duration-300 hover:scale-105"
        >
          <div className="flex items-center gap-3">
            <img
              src={review.avatar}
              alt={review.name}
              className="w-12 h-12 rounded-full object-cover border-2 border-sunrise-500"
            />
            <div>
              <p className="font-semibold text-forest-800">{review.name}</p>
              <div className="flex gap-1 text-sunrise-500 text-sm">
                {"★".repeat(review.rating)}
                {"☆".repeat(5 - review.rating)}
              </div>
            </div>
          </div>
          <p className="text-forest-700 text-sm">{review.comment}</p>
        </div>
      ))}
    </div>
  </div>

  <style jsx>{`
    @keyframes scroll {
      0% { transform: translateX(0); }
      100% { transform: translateX(-50%); }
    }
    .animate-scroll {
      display: flex;
      gap: 24px;
      animation: scroll 40s linear infinite;
    }
  `}</style>
</section>


    </div>
  );
};

export default TripDetail;
