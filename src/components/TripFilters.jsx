const TripFilters = ({ filters, onChange }) => (
  <div className="grid md:grid-cols-3 gap-4">
    <div className="flex flex-col">
      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 pl-1">Destination</label>
      <select
        className="rounded-xl border-slate-200 bg-slate-50/50 hover:bg-slate-50 text-slate-700 text-sm focus:border-brand focus:ring-brand py-2.5 transition-colors duration-200 cursor-pointer"
        value={filters.destination}
        onChange={(e) => onChange({ ...filters, destination: e.target.value })}
      >
        <option value="">All Destinations</option>
        <option value="Nepal">Nepal</option>
        <option value="Tanzania">Tanzania</option>
        <option value="Bhutan">Bhutan</option>
        <option value="Tibet">Tibet</option>
      </select>
    </div>

    <div className="flex flex-col">
      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 pl-1">Activity Type</label>
      <select
        className="rounded-xl border-slate-200 bg-slate-50/50 hover:bg-slate-50 text-slate-700 text-sm focus:border-brand focus:ring-brand py-2.5 transition-colors duration-200 cursor-pointer"
        value={filters.category}
        onChange={(e) => onChange({ ...filters, category: e.target.value })}
      >
        <option value="">All Activities</option>
        <option value="Trekking">Trekking</option>
        <option value="Heli Tour">Heli Tour</option>
        <option value="Adventure">Adventure</option>
        <option value="Climbing">Climbing</option>
        <option value="Cultural">Cultural</option>
        <option value="Wildlife">Wildlife</option>
      </select>
    </div>

    <div className="flex flex-col">
      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 pl-1">Max Duration</label>
      <select
        className="rounded-xl border-slate-200 bg-slate-50/50 hover:bg-slate-50 text-slate-700 text-sm focus:border-brand focus:ring-brand py-2.5 transition-colors duration-200 cursor-pointer"
        value={filters.duration}
        onChange={(e) => onChange({ ...filters, duration: e.target.value })}
      >
        <option value="">Any Duration</option>
        <option value="7">Up to 7 days</option>
        <option value="10">Up to 10 days</option>
        <option value="14">Up to 14 days</option>
        <option value="18">Up to 18 days</option>
      </select>
    </div>
  </div>
);

export default TripFilters;
