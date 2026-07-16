import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../services/api';
import { sanitizeHtml } from '../utils/richText';

const TripDetail = ({ apiPath = '/trips' }) => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [tab, setTab] = useState('included');
  const [bookingOpen, setBookingOpen] = useState(false);
  const [bookingStep, setBookingStep] = useState(1);
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
    setTrip(null);
    setNotFound(false);
    api
      .get(`${apiPath}/${slug}`)
      .then((res) => setTrip(res.data.data))
      .catch(() => setNotFound(true));
  }, [slug, apiPath]);

  if (notFound) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-24 flex flex-col items-center justify-center min-h-[50vh]">
        <p className="text-4xl mb-3">📍</p>
        <p className="text-slate-700 font-bold text-lg">Page not found</p>
        <p className="mt-2 text-slate-500 text-sm">This destination or trip does not exist.</p>
        <button
          onClick={() => navigate('/')}
          className="mt-6 px-5 py-2.5 rounded-full bg-brand text-white text-sm font-bold"
        >
          Back to Home
        </button>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-24 flex flex-col items-center justify-center min-h-[50vh]">
        <div className="w-12 h-12 rounded-full border-4 border-slate-200 border-t-brand animate-spin" />
        <p className="mt-4 text-slate-500 text-sm font-semibold">Loading adventure details...</p>
      </div>
    );
  }

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

  const submitEnquiry = async () => {
    try {
      await api.post('/bookings', {
        trip: trip._id,
        groupSize: bookingForm.groupSize,
        notes: bookingForm.notes,
        travelerName: bookingForm.travelerName,
        travelerEmail: bookingForm.travelerEmail,
        travelerPhone: bookingForm.travelerPhone,
        tripStartDate: selectedDate?.startDate || dates[0].startDate,
        tripEndDate: selectedDate?.endDate || dates[0].endDate,
        tripPrice: selectedDate?.price || `US$${trip.price}`,
      });
      setBookingStep(3);
    } catch (err) {
      setBookingMessage('Please sign in or double check inputs to complete your request.');
    }
  };

  return (
    <div className="bg-[#f8fafc]">
      {/* Banner / Hero Section */}
      <section
        className="relative h-[480px] bg-cover bg-center text-white"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent z-0" />
        <div className="relative z-10 max-w-6xl mx-auto px-6 h-full flex flex-col justify-end pb-16">
          <div className="text-xs uppercase tracking-[0.25em] text-slate-300 font-semibold mb-3">
            Destinations &gt; {trip.destination} &gt; {trip.region}
          </div>
          <h1 className="text-3xl md:text-5xl font-display font-bold leading-tight tracking-tight max-w-3xl">
            {trip.title}
          </h1>
        </div>
      </section>

      {/* Tabs Navigation */}
      <div className="sticky top-[110px] z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/50 shadow-sm">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex gap-8 text-[11px] font-bold uppercase tracking-wider text-slate-500 overflow-x-auto no-scrollbar py-4">
            {['overview', 'itinerary', 'expect', 'dates', 'faqs', 'reviews'].map((id) => (
              <a
                key={id}
                href={`#${id}`}
                className="transition-colors duration-200 hover:text-brand"
              >
                {id}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Grid Layout: Main info & Sidebar */}
      <section className="max-w-6xl mx-auto px-6 py-12 grid lg:grid-cols-[1.3fr_0.7fr] gap-10 items-start">
        {/* Main Column */}
        <div className="space-y-10">
          {/* Key facts card */}
          <div className="bg-brand text-white rounded-3xl p-8 shadow-premium relative overflow-hidden">
            <div className="absolute -right-12 -top-12 w-32 h-32 bg-white/5 rounded-full blur-2xl" />
            <h2 className="text-lg font-bold font-display uppercase tracking-wider mb-6">Trip Key Facts</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-sm">
              {[
                { label: 'Duration', value: `${trip.duration} Days`, icon: '🕒' },
                { label: 'Trip Grade', value: trip.tripGrade || 'Strenuous', icon: '⛰️' },
                { label: 'Destination', value: trip.destinationLabel || trip.destination, icon: '📍' },
                { label: 'Max Altitude', value: trip.maxAltitude || '5,545 m', icon: '🏔️' },
                { label: 'Activity', value: trip.activity || 'Trek & Tour', icon: '🥾' },
                { label: 'Group Size', value: trip.groupSize || '1-16 pax', icon: '👥' },
              ].map((info, idx) => (
                <div key={idx} className="flex gap-3 items-start">
                  <span className="text-xl bg-white/10 w-9 h-9 rounded-xl flex items-center justify-center border border-white/10 shrink-0">
                    {info.icon}
                  </span>
                  <div>
                    <p className="text-slate-300 text-[10px] uppercase font-bold tracking-wider">{info.label}</p>
                    <p className="font-semibold text-white mt-0.5 text-sm">{info.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Overview */}
          <div id="overview" className="bg-white rounded-3xl p-8 border border-slate-100 shadow-premium">
            <h3 className="text-xl font-bold text-slate-800 font-display mb-6">Overview</h3>
            <div
              className="prose max-w-none text-slate-600 text-sm md:text-base leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: sanitizeHtml(trip.longDescription || trip.shortDescription || 'Trip description will appear here.'),
              }}
            />
          </div>

          {/* Gallery / You'll See */}
          <div id="expect" className="bg-white rounded-3xl p-8 border border-slate-100 shadow-premium">
            <h3 className="text-xl font-bold text-slate-800 font-display mb-6">Gallery</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                ...trip.gallery,
                'https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=800&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1482192505345-5655af888cc4?q=80&w=800&auto=format&fit=crop',
              ].slice(0, 3).map((img, i) => (
                <div key={i} className="relative h-28 md:h-36 rounded-2xl overflow-hidden group">
                  <img src={img} alt="Gallery view" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                </div>
              ))}
            </div>
          </div>

          {/* Itinerary Accordion with Timeline styling */}
          <div id="itinerary" className="bg-white rounded-3xl p-8 border border-slate-100 shadow-premium">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-800 font-display">Itinerary</h3>
              <button
                className="text-xs font-bold text-brand hover:underline"
                onClick={() => setExpandedItinerary(itinerary.map((day) => day.day))}
              >
                Expand All Days
              </button>
            </div>

            <div className="space-y-4 relative">
              {itinerary.map((day, idx) => {
                const isOpen = expandedItinerary.includes(day.day);
                return (
                  <div
                    key={day.day}
                    className="relative pl-8"
                  >
                    {/* Vertical Connecting Line */}
                    <div className={`timeline-line ${idx === itinerary.length - 1 ? 'timeline-line-last' : ''}`} />

                    {/* Timeline Node Badge */}
                    <div className="absolute left-0 top-1 w-10 h-10 rounded-full bg-brand/5 border border-brand/20 text-brand flex items-center justify-center font-bold text-xs shadow-sm">
                      D{day.day}
                    </div>

                    <div className="border border-slate-100 hover:border-slate-200/50 rounded-2xl overflow-hidden shadow-sm transition-all duration-300">
                      <div
                        className="flex justify-between items-center cursor-pointer p-4 bg-slate-50/50 hover:bg-slate-50 text-slate-800"
                        onClick={() => toggleItinerary(day.day)}
                      >
                        <span className="font-bold text-sm">{day.title}</span>
                        <span className="text-brand text-lg font-bold">{isOpen ? '−' : '+'}</span>
                      </div>

                      <div
                        className={`transition-all duration-300 ease-in-out bg-white px-5 overflow-hidden ${
                          isOpen ? 'max-h-96 py-5 border-t border-slate-100' : 'max-h-0 py-0'
                        }`}
                      >
                        <p className="text-slate-600 text-xs md:text-sm leading-relaxed">{day.details || day.description || 'Details coming soon.'}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Included / Excluded tabs panel */}
          <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-premium">
            <div className="flex gap-4 border-b border-slate-100 pb-4">
              <button
                className={`pb-2 text-xs font-bold uppercase tracking-wider border-b-2 transition-all duration-200 ${
                  tab === 'included' ? 'border-sunrise-500 text-brand' : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
                onClick={() => setTab('included')}
              >
                What's Included
              </button>
              <button
                className={`pb-2 text-xs font-bold uppercase tracking-wider border-b-2 transition-all duration-200 ${
                  tab === 'excluded' ? 'border-sunrise-500 text-brand' : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
                onClick={() => setTab('excluded')}
              >
                What's Excluded
              </button>
            </div>
            
            <div className="mt-6 space-y-3">
              {(tab === 'included' ? included : excluded).map((item, idx) => (
                <div key={idx} className="flex gap-3 items-start text-slate-600 text-xs md:text-sm">
                  <span className={tab === 'included' ? 'text-emerald-500 font-bold' : 'text-red-500 font-bold'}>
                    {tab === 'included' ? '✓' : '✕'}
                  </span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Dates & Price section */}
          <div id="dates" className="bg-white rounded-3xl p-8 border border-slate-100 shadow-premium">
            <h3 className="text-xl font-bold text-slate-800 font-display mb-6">Upcoming Dates</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    <th className="py-3 px-4">Departure Window</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Price</th>
                    <th className="py-3 px-4"></th>
                  </tr>
                </thead>
                <tbody>
                  {dates.map((row, idx) => (
                    <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors duration-150">
                      <td className="py-4 px-4 font-semibold text-slate-700">{row.startDate} - {row.endDate}</td>
                      <td className="py-4 px-4">
                        <span className="inline-block px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                          {row.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 font-bold text-slate-850">{row.price}</td>
                      <td className="py-4 px-4 text-right">
                        <button
                          className="px-4 py-1.5 rounded-full bg-brand text-white font-bold text-[10px] uppercase tracking-wider transition-colors duration-200"
                          onClick={() => {
                            setSelectedDate(row);
                            setBookingStep(1);
                            setBookingOpen(true);
                            setBookingMessage('');
                          }}
                        >
                          Book Now
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* FAQs Accordion */}
          <div id="faqs" className="bg-white rounded-3xl p-8 border border-slate-100 shadow-premium">
            <h3 className="text-xl font-bold text-slate-800 font-display mb-6">Frequently Asked Questions</h3>
            <div className="space-y-3">
              {faqs.map((faq, idx) => {
                const isOpen = expandedFaq.includes(idx);
                return (
                  <div key={idx} className="border border-slate-100 hover:border-slate-200/50 rounded-2xl overflow-hidden shadow-sm transition-all duration-300">
                    <div
                      className="flex justify-between items-center cursor-pointer p-4 bg-slate-50/50 text-slate-800 font-semibold text-sm"
                      onClick={() => toggleFaq(idx)}
                    >
                      <span>{faq.question}</span>
                      <span className="text-brand font-bold">{isOpen ? '−' : '+'}</span>
                    </div>
                    <div
                      className={`transition-all duration-300 bg-white px-5 overflow-hidden ${
                        isOpen ? 'max-h-96 py-5 border-t border-slate-100' : 'max-h-0 py-0'
                      }`}
                    >
                      <p className="text-slate-600 text-xs md:text-sm leading-relaxed">{faq.answer}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sticky Sidebar (Booking detail summary) */}
        <div className="lg:sticky lg:top-36 bg-white rounded-3xl shadow-premium border border-slate-100 p-6 space-y-6">
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Starting From</p>
            <div className="text-2xl font-bold text-sunrise-500 mt-1 flex items-baseline gap-2">
              US${trip.price}
              {trip.oldPrice && <span className="text-slate-400 text-sm line-through font-normal">US${trip.oldPrice}</span>}
            </div>
          </div>

          <div className="space-y-3 border-t border-b border-slate-100 py-4 text-xs text-slate-500 font-semibold space-y-2.5">
            <div className="flex gap-2.5 items-center">
              <span className="text-emerald-500 text-sm">✓</span>
              <span>Best Price Guarantee</span>
            </div>
            <div className="flex gap-2.5 items-center">
              <span className="text-emerald-500 text-sm">✓</span>
              <span>No Hidden Booking Fees</span>
            </div>
            <div className="flex gap-2.5 items-center">
              <span className="text-emerald-500 text-sm">✓</span>
              <span>Free Modification up to 30 Days</span>
            </div>
          </div>

          <div className="space-y-3">
            <button 
              onClick={() => {
                setSelectedDate(dates[0]);
                setBookingStep(1);
                setBookingOpen(true);
                setBookingMessage('');
              }}
              className="w-full py-3 bg-brand hover:bg-brand-600 text-white font-bold text-xs rounded-xl uppercase tracking-wider transition-all duration-300 shadow-md"
            >
              Book Adventure
            </button>
            <button 
              onClick={() => navigate('/booking')}
              className="w-full py-3 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl uppercase tracking-wider transition-colors duration-200 border border-slate-150"
            >
              Custom Enquiry
            </button>
          </div>
        </div>
      </section>

      {/* Testimonials loop banner */}
      <section id="reviews" className="reveal reveal-up bg-slate-100/50 py-16 overflow-hidden border-t border-slate-200/40">
        <div className="max-w-6xl mx-auto px-6 mb-8 text-center sm:text-left">
          <h2 className="text-2xl font-bold font-display text-slate-800">What travelers say</h2>
        </div>
        
        <div className="relative">
          <div className="flex gap-6 animate-scroll whitespace-nowrap">
            {[
              { name: "John Doe", rating: 5, comment: "Amazing experience! The trek was well organized and the guide was fantastic.", avatar: "https://randomuser.me/api/portraits/men/32.jpg" },
              { name: "Jane Smith", rating: 4, comment: "Beautiful scenery and smooth itinerary. Food and lodging were comfortable.", avatar: "https://randomuser.me/api/portraits/women/44.jpg" },
              { name: "Michael Lee", rating: 5, comment: "Highly recommend! Everything was perfectly arranged, from flights to local tours.", avatar: "https://randomuser.me/api/portraits/men/54.jpg" },
              { name: "Emily Davis", rating: 5, comment: "Great adventure, loved every moment. The guides were super helpful and friendly.", avatar: "https://randomuser.me/api/portraits/women/65.jpg" },
              { name: "Robert Brown", rating: 5, comment: "A once-in-a-lifetime trek! Smooth organization and amazing views.", avatar: "https://randomuser.me/api/portraits/men/22.jpg" },
            ].map((review, idx) => (
              <div
                key={idx}
                className="inline-block w-80 bg-white rounded-3xl shadow-premium border border-slate-100 p-6 whitespace-normal"
              >
                <div className="flex items-center gap-4">
                  <img src={review.avatar} alt={review.name} className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <h5 className="font-bold text-slate-800 text-xs">{review.name}</h5>
                    <div className="text-amber-500 text-[10px] mt-0.5">{"★".repeat(review.rating)}</div>
                  </div>
                </div>
                <p className="text-slate-500 text-xs mt-3 leading-relaxed">"{review.comment}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stepped Booking Modal */}
      <AnimatePresence>
        {bookingOpen && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl w-full max-w-lg shadow-premium overflow-hidden border border-slate-100"
            >
              {/* Header */}
              <div className="px-6 py-5 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider">Booking Enquiry</h3>
                  <p className="text-[10px] text-slate-400 font-semibold uppercase mt-0.5">{trip.title}</p>
                </div>
                <button className="text-slate-400 hover:text-slate-600 font-bold" onClick={() => setBookingOpen(false)}>✕</button>
              </div>

              {/* Step Progress Connector */}
              <div className="px-6 pt-5 pb-2 flex justify-between items-center">
                <div className="flex gap-2 items-center">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${bookingStep >= 1 ? 'bg-brand text-white' : 'bg-slate-100 text-slate-400'}`}>1</div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Contact</span>
                </div>
                <div className="h-px bg-slate-200 flex-grow mx-4" />
                <div className="flex gap-2 items-center">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${bookingStep >= 2 ? 'bg-brand text-white' : 'bg-slate-100 text-slate-400'}`}>2</div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Preferences</span>
                </div>
                <div className="h-px bg-slate-200 flex-grow mx-4" />
                <div className="flex gap-2 items-center">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${bookingStep >= 3 ? 'bg-brand text-white' : 'bg-slate-100 text-slate-400'}`}>3</div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Confirm</span>
                </div>
              </div>

              <div className="p-6">
                {/* Step 1 Form */}
                {bookingStep === 1 && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Full Name</label>
                      <input className="w-full rounded-xl border-slate-200 text-sm focus:border-brand focus:ring-brand py-2.5" placeholder="Jane Doe" value={bookingForm.travelerName} onChange={(e) => setBookingForm({ ...bookingForm, travelerName: e.target.value })} />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Email Address</label>
                      <input className="w-full rounded-xl border-slate-200 text-sm focus:border-brand focus:ring-brand py-2.5" placeholder="you@example.com" type="email" value={bookingForm.travelerEmail} onChange={(e) => setBookingForm({ ...bookingForm, travelerEmail: e.target.value })} />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Phone Number</label>
                      <input className="w-full rounded-xl border-slate-200 text-sm focus:border-brand focus:ring-brand py-2.5" placeholder="+1 (555) 012-3456" value={bookingForm.travelerPhone} onChange={(e) => setBookingForm({ ...bookingForm, travelerPhone: e.target.value })} />
                    </div>
                    <button
                      className="w-full py-3 bg-brand hover:bg-brand-600 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all duration-300 mt-4"
                      onClick={() => setBookingStep(2)}
                    >
                      Next: Preferences
                    </button>
                  </div>
                )}

                {/* Step 2 Form */}
                {bookingStep === 2 && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Group Size</label>
                      <input className="w-full rounded-xl border-slate-200 text-sm focus:border-brand focus:ring-brand py-2.5" type="number" min="1" value={bookingForm.groupSize} onChange={(e) => setBookingForm({ ...bookingForm, groupSize: parseInt(e.target.value) || 2 })} />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Special Notes / Requirements</label>
                      <textarea className="w-full rounded-xl border-slate-200 text-sm focus:border-brand focus:ring-brand min-h-[100px] py-2.5" placeholder="Let us know about food preferences, medical conditions, or flight additions..." value={bookingForm.notes} onChange={(e) => setBookingForm({ ...bookingForm, notes: e.target.value })} />
                    </div>
                    
                    <div className="flex gap-3 pt-2">
                      <button
                        className="w-1/3 py-3 border border-slate-200 text-slate-600 text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-slate-50 transition-colors duration-200"
                        onClick={() => setBookingStep(1)}
                      >
                        Back
                      </button>
                      <button
                        className="w-2/3 py-3 bg-brand hover:bg-brand-600 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all duration-300"
                        onClick={submitEnquiry}
                      >
                        Submit Enquiry
                      </button>
                    </div>
                    {bookingMessage && <p className="text-xs text-red-500 mt-2 font-medium">⚠️ {bookingMessage}</p>}
                  </div>
                )}

                {/* Step 3 Confirmation */}
                {bookingStep === 3 && (
                  <div className="text-center py-6 space-y-4">
                    <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center text-3xl mx-auto border border-emerald-100">✓</div>
                    <h4 className="font-bold text-slate-800 text-lg">Enquiry Submitted!</h4>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                      We have received your details for the {trip.title}. One of our local travel designers will review your preference notes and get back to you with details within 24 hours.
                    </p>
                    <button
                      className="px-6 py-2.5 bg-brand hover:bg-brand-600 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors duration-200 mt-4"
                      onClick={() => setBookingOpen(false)}
                    >
                      Close Window
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TripDetail;
