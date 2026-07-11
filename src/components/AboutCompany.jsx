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
    <section className="reveal reveal-up bg-[#f8fafc]">
      <div className="max-w-6xl mx-auto px-6 py-20 text-center">
        <p className="text-xs uppercase font-bold tracking-[0.25em] text-sunrise-500">
          Dream · Explore · Discover
        </p>
        <h2 className="text-3xl md:text-4xl font-display font-semibold text-slate-800 mt-3 max-w-2xl mx-auto leading-tight">
          {content?.aboutTitle || 'Himtrail Adventure - A Leading Adventure Company in Nepal'}
        </h2>
        <div className="mt-6 h-1 w-16 bg-sunrise-500 mx-auto rounded-full" />
        
        <p className="mt-8 text-slate-600 max-w-3xl mx-auto leading-relaxed text-sm md:text-base">
          {content?.aboutBody ||
            'At Himtrail Adventure, we live by one simple idea: “Leave only footprints, take only memories.” We craft premium experiences that let you explore the Himalayas and beyond while practicing zero-waste trekking.'}
        </p>

        {/* Dynamic Statistics Grid */}
        <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          {[
            { value: '15+', label: 'Years Experience' },
            { value: '99.4%', label: 'Success Rate' },
            { value: '5K+', label: 'Happy Travelers' },
            { value: '100%', label: 'Carbon Neutral' }
          ].map((stat, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-premium hover:shadow-premium-hover transition-all duration-300">
              <p className="text-2xl md:text-3xl font-bold font-display text-brand">{stat.value}</p>
              <p className="text-slate-400 text-xs mt-1 font-semibold tracking-wider uppercase">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Benefits Grid */}
        <div className="mt-14 grid md:grid-cols-3 gap-8">
          {[
            {
              icon: '✈️',
              title: 'Travel - Learn - Share',
              desc: 'For every traveler, the world is full of choices. We curate personal, meaningful journeys that foster deep cultural connections.'
            },
            {
              icon: '🤝',
              title: 'Enthusiastic Team',
              desc: 'Our greatest strength is our team of passionate, licensed Sherpas, guides, and medical professionals trained in high-altitude safety.'
            },
            {
              icon: '⏱️',
              title: 'Flexible Customizations',
              desc: 'Travel at your own pace. Whether tailormade private routes or fixed departures, we match your pace and priorities.'
            }
          ].map((item, i) => (
            <div 
              key={i} 
              className="bg-brand text-white rounded-3xl p-8 text-left shadow-premium hover:shadow-premium-hover transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="text-4xl bg-white/10 w-14 h-14 rounded-2xl flex items-center justify-center border border-white/10 shadow-inner">
                {item.icon}
              </div>
              <h3 className="mt-6 text-lg font-bold font-display tracking-wide">{item.title}</h3>
              <p className="text-sm text-slate-200 mt-3 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutCompany;
