const TripFilters = ({ filters, onChange }) => (
  <div className="grid md:grid-cols-3 gap-4">
    <select
      className="rounded-full border-forest-200"
      value={filters.destination}
      onChange={(e) => onChange({ ...filters, destination: e.target.value })}
    >
      <option value="">Destination</option>
      <option value="Nepal">Nepal</option>
      <option value="Tanzania">Tanzania</option>
      <option value="Bhutan">Bhutan</option>
      <option value="Tibet">Tibet</option>
    </select>
    <select
      className="rounded-full border-forest-200"
      value={filters.category}
      onChange={(e) => onChange({ ...filters, category: e.target.value })}
    >
      <option value="">Activity</option>
      <option value="Trekking">Trekking</option>
      <option value="Heli Tour">Heli Tour</option>
      <option value="Adventure">Adventure</option>
      <option value="Climbing">Climbing</option>
      <option value="Cultural">Cultural</option>
      <option value="Wildlife">Wildlife</option>
    </select>
    <select
      className="rounded-full border-forest-200"
      value={filters.duration}
      onChange={(e) => onChange({ ...filters, duration: e.target.value })}
    >
      <option value="">Duration</option>
      <option value="7">Up to 7 days</option>
      <option value="10">Up to 10 days</option>
      <option value="14">Up to 14 days</option>
      <option value="18">Up to 18 days</option>
    </select>
  </div>
);

export default TripFilters;
