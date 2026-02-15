import { Link } from 'react-router-dom';

const TripCard = ({ trip }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-forest-100 overflow-hidden">
    <div className="p-5">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase tracking-[0.2em] text-forest-600">
          {trip.destination} · {trip.region}
        </p>
        {trip.statusBadge && (
          <span className="text-xs px-2 py-1 bg-sunrise-200 rounded-full text-forest-800">
            {trip.statusBadge}
          </span>
        )}
      </div>
      <h3 className="font-display text-xl mt-2">{trip.title}</h3>
      <p className="text-sm text-forest-600 mt-1">
        {trip.duration} days · {trip.category}
      </p>
      <div className="mt-4 flex items-center justify-between">
        <p className="font-semibold">${trip.price}</p>
        <Link
          to={`/trips/${trip.slug}`}
          className="text-sm text-forest-700 hover:text-forest-900"
        >
          View Details
        </Link>
      </div>
    </div>
  </div>
);

export default TripCard;
