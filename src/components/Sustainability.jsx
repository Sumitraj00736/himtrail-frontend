const Sustainability = () => (
  <section className="reveal reveal-up bg-[#f8fafc]">
    <div className="max-w-6xl mx-auto px-6 py-20">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand/5 border border-brand/10 text-brand text-xs font-bold uppercase tracking-wider">
          🌱 VOLUNTEER COMMUNITY
        </div>
        <h2 className="section-title mt-4 text-slate-800 font-display">Responsible Travel & Giving Back</h2>
        <p className="text-sm text-slate-500 mt-2 max-w-xl mx-auto">We believe in travel that enriches the soul while preserving local ecosystems and uplift communities.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-10 items-start">
        {/* Initiatives column */}
        <div className="space-y-6">
          <p className="text-xs uppercase font-bold tracking-[0.25em] text-sunrise-500">
            We Are Involved In
          </p>
          
          <div className="space-y-4">
            {[
              {
                icon: '🤝',
                title: 'Ukhubaari School Support',
                desc: 'Supporting government schools in Ukhubaari with computer labs, library books, and direct student sponsorships for underprivileged children.'
              },
              {
                icon: '🌿',
                title: 'Village Independence Initiatives',
                desc: 'Skills development workshops and financial independence training for women in remote rural villages across Nepal.'
              }
            ].map((initiative, idx) => (
              <div 
                key={idx} 
                className="bg-white rounded-3xl border border-slate-100 hover:border-slate-200/50 shadow-premium hover:shadow-premium-hover p-6 flex gap-5 transition-all duration-300 transform hover:-translate-y-0.5"
              >
                <div className="w-12 h-12 rounded-2xl bg-brand/5 text-brand flex items-center justify-center text-xl shrink-0">
                  {initiative.icon}
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">{initiative.title}</h4>
                  <p className="text-slate-500 text-xs mt-2 leading-relaxed">
                    {initiative.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Volunteering info panel */}
        <div className="bg-brand text-white rounded-3xl p-8 border border-brand-800 relative overflow-hidden shadow-premium">
          {/* Subtle design element */}
          <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-white/5 rounded-full blur-2xl" />

          <h3 className="text-xl font-bold font-display text-white">
            Volunteering Options
          </h3>
          <div className="w-12 h-0.5 bg-sunrise-400 mt-3 rounded-full" />
          
          <p className="text-slate-200 text-xs md:text-sm mt-5 leading-relaxed">
            Our volunteer program connects experts from around the world with matching community needs. Volunteers share their knowledge while experiencing authentic Nepali livelihood and cultural exchange.
          </p>
          <p className="text-slate-200 text-xs md:text-sm mt-4 leading-relaxed">
            Contribute to critical areas: school education, rural healthcare, local farming practices, eco-tourism projects, and fresh drinking water development.
          </p>
          
          <button className="mt-8 px-6 py-3 rounded-full bg-sunrise-500 hover:bg-sunrise-600 text-white font-semibold text-xs tracking-wider uppercase transition-all duration-300 shadow-glow hover:shadow-lg">
            Enquire About Volunteering
          </button>
        </div>
      </div>
    </div>
  </section>
);

export default Sustainability;
