import { useEffect, useState } from 'react';
import { api } from '../services/api';

const AboutCompany = () => {
  const [content, setContent] = useState(null);

  useEffect(() => {
    api.get('/content/homepage').then((res) => {
      setContent(res.data.data);
    });
  }, []);

  return (
    <section className="bg-slate-50">
      <div className="max-w-6xl mx-auto px-6 py-16 text-center">
        <p className="text-sm text-slate-500">Dream . Explore . Discover</p>
        <h2 className="text-2xl md:text-3xl font-semibold text-[#243b75] mt-2">
          {content?.aboutTitle || 'Himtrail Adventure - A Leading Adventure Company in Nepal'}
        </h2>
        <div className="mt-4 h-1 w-12 bg-[#243b75] mx-auto" />
        <p className="mt-6 text-slate-600 max-w-3xl mx-auto">
          {content?.aboutBody ||
            'At Himtrail Adventure, we live by one simple idea: “Leave only footprints, take only memories.” We craft experiences that let you explore the Himalayas and beyond.'}
        </p>

        <div className="mt-10 bg-[#243b75] text-white rounded-2xl p-8 grid md:grid-cols-3 gap-6">
          <div className="text-left">
            <div className="text-3xl">✈️</div>
            <h3 className="mt-3 font-semibold">Travel - Learn - Share</h3>
            <p className="text-sm text-white/80 mt-2">
              For every traveler, the world is full of choices. We curate journeys
              that feel personal and meaningful.
            </p>
          </div>
          <div className="text-left">
            <div className="text-3xl">🤝</div>
            <h3 className="mt-3 font-semibold">Enthusiastic Team</h3>
            <p className="text-sm text-white/80 mt-2">
              Our greatest strength is our team of passionate, trained professionals
              who live and breathe the Himalaya.
            </p>
          </div>
          <div className="text-left">
            <div className="text-3xl">⏱️</div>
            <h3 className="mt-3 font-semibold">Customize Itineraries & Fixed Departure</h3>
            <p className="text-sm text-white/80 mt-2">
              Travel plans work best when they match your pace and priorities.
            </p>
          </div>
        </div>
        <div className="mt-6 flex items-center justify-center gap-2">
          <span className="w-3 h-3 rounded-full bg-white border border-[#243b75]" />
          <span className="w-3 h-3 rounded-full bg-[#243b75]" />
          <span className="w-3 h-3 rounded-full bg-white border border-[#243b75]" />
        </div>
      </div>
    </section>
  );
};

export default AboutCompany;
