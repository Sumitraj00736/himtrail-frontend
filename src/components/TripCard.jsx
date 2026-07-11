import { Link } from 'react-router-dom';

/**
 * Shared card component that works with real Trip objects from the database.
 * Real Trip objects have: heroImage, title, slug, price, oldPrice, duration, category, reviews
 */
const TripCard = ({ trip }) => {
  const image = trip.heroImage || trip.image;
  const tag = trip.category || trip.tag || 'Trekking';
  const priceDisplay = trip.price ? `US$${trip.price.toLocaleString()}` : trip.price;
  const oldPriceDisplay = trip.oldPrice ? `US$${trip.oldPrice.toLocaleString()}` : trip.oldPrice;
  const reviewCount = trip.reviews?.count ?? trip.reviews ?? '';
  const ratingDisplay = trip.reviews?.rating ? `★ ${trip.reviews.rating}` : '★ 5.0';
  const durationDisplay = trip.duration ? `${trip.duration} Days` : '';

  const card = (
    <div className="group bg-white rounded-3xl overflow-hidden border border-slate-100 hover:border-brand/20 shadow-premium hover:shadow-premium-hover transition-all duration-350 flex flex-col h-full transform hover:-translate-y-1.5 cursor-pointer">
      <div className="relative h-48 overflow-hidden bg-slate-100">
        {image ? (
          <img src={image} alt={trip.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-200 text-5xl">🏔️</div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <span className="absolute top-4 left-4 bg-brand text-white text-[10px] font-semibold tracking-wider uppercase px-3 py-1 rounded-full shadow-sm">
          {tag}
        </span>
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-center justify-between">
          <div className="text-slate-800 font-bold text-base">
            {priceDisplay}
            {oldPriceDisplay && (
              <span className="text-xs text-slate-400 line-through font-normal ml-2">{oldPriceDisplay}</span>
            )}
          </div>
          <div className="text-amber-500 text-xs font-semibold flex items-center gap-1">
            <span>{ratingDisplay}</span>
            {reviewCount ? (
              <>
                <span className="text-slate-300 font-normal">|</span>
                <span className="text-slate-400 font-medium">{reviewCount} Reviews</span>
              </>
            ) : null}
          </div>
        </div>
        <h3 className="mt-4 font-display text-base font-semibold text-slate-800 leading-snug group-hover:text-brand transition-colors duration-200 flex-grow">
          {trip.title}
        </h3>
        {durationDisplay && (
          <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-500 font-medium flex items-center gap-1.5">
            <span>🕒 {durationDisplay}</span>
          </div>
        )}
      </div>
    </div>
  );

  if (trip.slug) {
    return <Link to={`/trips/${trip.slug}`}>{card}</Link>;
  }
  return card;
};

export default TripCard;
