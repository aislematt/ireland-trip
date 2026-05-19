import FavoriteButton from './FavoriteButton'

const TIER_COLORS = {
  luxury: 'bg-amber-50 text-amber-700 border-amber-200',
  mid: 'bg-blue-50 text-blue-700 border-blue-200',
  budget: 'bg-green-50 text-green-700 border-green-200',
}

const CATEGORY_LABELS = {
  culture: 'Culture',
  outdoors: 'Outdoors',
  tour: 'Tour',
  restaurant: 'Dining',
  transport: 'Transport',
}

const PRICE_RANGE_LABELS = {
  '$': 'Budget-friendly',
  '$$': 'Mid-range',
  '$$$': 'Fine dining',
}

export default function OptionCard({ item, type, favorited, sharedFavorite, onToggleFavorite }) {
  const isHotel = type === 'hotel'
  const isActivity = type === 'activity'
  const isRestaurant = type === 'restaurant'

  return (
    <div className={`relative bg-card border rounded-lg p-4 transition-all ${favorited ? 'border-heart/40 shadow-sm ring-1 ring-heart/10' : 'border-border hover:border-stone-300'}`}>
      <div className="flex justify-between items-start gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-stone-800 text-sm">{item.name}</h3>
            {isHotel && item.tier && (
              <span className={`text-xs px-1.5 py-0.5 rounded border ${TIER_COLORS[item.tier]}`}>
                {item.tier === 'luxury' ? 'Luxury' : item.tier === 'mid' ? 'Mid-range' : 'Budget'}
              </span>
            )}
            {isActivity && item.category && (
              <span className="text-xs px-1.5 py-0.5 rounded bg-stone-100 text-stone-600">
                {CATEGORY_LABELS[item.category] || item.category}
              </span>
            )}
            {isRestaurant && item.priceRange && (
              <span className="text-xs px-1.5 py-0.5 rounded bg-stone-100 text-stone-600">
                {item.priceRange}
              </span>
            )}
          </div>

          <p className="text-sm text-stone-600 mt-1">{item.description}</p>

          <div className="flex items-center gap-3 mt-2 text-xs text-stone-500 flex-wrap">
            {isHotel && (
              <>
                <span>{item.neighborhood}</span>
                <span>&middot;</span>
                <span>{'*'.repeat(item.stars)} ({item.rating}/5)</span>
              </>
            )}
            {isActivity && item.duration && <span>{item.duration}</span>}
            {isRestaurant && item.cuisine && <span>{item.cuisine}</span>}
            {item.bookingRequired && (
              <span className="text-amber-600 font-medium">Booking required</span>
            )}
          </div>

          {item.tips && (
            <p className="text-xs text-stone-500 mt-2 italic">{item.tips}</p>
          )}
        </div>

        <div className="flex flex-col items-end gap-2 shrink-0">
          <FavoriteButton
            active={favorited}
            shared={sharedFavorite}
            onClick={() => onToggleFavorite(item.id)}
          />
          <div className="text-right">
            {isHotel && (
              <div>
                <span className="text-lg font-bold text-stone-800">${item.pricePerNight}</span>
                <span className="text-xs text-stone-500">/night</span>
                {item.totalPrice && (
                  <div className="text-xs text-stone-400">${item.totalPrice.toLocaleString()} total</div>
                )}
              </div>
            )}
            {isActivity && item.pricePerPerson > 0 && (
              <div>
                <span className="text-lg font-bold text-stone-800">${item.pricePerPerson}</span>
                <span className="text-xs text-stone-500">/person</span>
              </div>
            )}
            {isActivity && item.pricePerPerson === 0 && (
              <span className="text-sm font-semibold text-green-600">Free</span>
            )}
            {isRestaurant && (
              <div>
                <span className="text-lg font-bold text-stone-800">${item.avgPerPerson}</span>
                <span className="text-xs text-stone-500">/person</span>
              </div>
            )}
          </div>
          <div className="flex gap-2">
            {item.bookingUrl && (
              <a
                href={item.bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-ireland hover:text-ireland/80 underline"
              >
                Direct &rarr;
              </a>
            )}
            {item.expediaUrl && (
              <a
                href={item.expediaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-scotland hover:text-scotland/80 underline"
              >
                Expedia &rarr;
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
