const Sustainability = () => (
  <section className="bg-white">
    <div className="max-w-6xl mx-auto px-6 py-16">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#e6efff] text-[#243b75] text-sm font-semibold">
          VOLUNTEER COMMUNITY
        </div>
      </div>
      <div className="grid lg:grid-cols-2 gap-10 items-start">
        <div>
          <p className="text-[#243b75] text-sm uppercase tracking-[0.2em]">
            We Are Involved In
          </p>
          <div className="mt-6 space-y-4">
            <div className="bg-white rounded-2xl border shadow-sm p-5 flex gap-4">
              <div className="w-12 h-12 rounded-full bg-[#e6efff] text-[#243b75] flex items-center justify-center text-xl">
                🤝
              </div>
              <div>
                <p className="font-semibold text-[#243b75]">Ukhubaari</p>
                <p className="text-slate-600 text-sm mt-1">
                  Helping a government school in Ukhubaari with computers and other
                  school supplies and sponsoring students who are economically
                  backward.
                </p>
              </div>
            </div>
            <div className="bg-white rounded-2xl border shadow-sm p-5 flex gap-4">
              <div className="w-12 h-12 rounded-full bg-[#e6efff] text-[#243b75] flex items-center justify-center text-xl">
                🌿
              </div>
              <div>
                <p className="font-semibold text-[#243b75]">Different Villages</p>
                <p className="text-slate-600 text-sm mt-1">
                  Skills training and support to women in villages of Nepal to
                  build independence and uplift their economic standard.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-slate-50 rounded-2xl border p-6">
          <h2 className="text-2xl font-semibold text-[#243b75]">
            Volunteering Options
          </h2>
          <p className="text-slate-600 mt-4">
            The volunteer program brings synchronized efforts of experts across
            sectors. Volunteers share a common platform to move the mission
            forward while experiencing Nepali livelihood and culture.
          </p>
          <p className="text-slate-600 mt-4">
            School education, health, community development, forest conservation,
            agriculture, culture preservation, and safe drinking water resources
            are the main sections where volunteers can contribute.
          </p>
          <button className="mt-6 px-6 py-3 rounded-full border border-[#243b75] text-[#243b75] font-semibold">
            Ask More
          </button>
        </div>
      </div>
    </div>
  </section>
);

export default Sustainability;
