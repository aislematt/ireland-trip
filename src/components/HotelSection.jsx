import OptionCard from './OptionCard'

export default function HotelSection({ cities, favorited, sharedFavorite, onToggleFavorite }) {
  return (
    <div className="space-y-8">
      {cities.map(city => (
        <div key={city.city}>
          <div className="mb-3">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-stone-800">{city.city}</h3>
              <span className="text-xs text-stone-500">{city.nights} nights</span>
            </div>
            {city.note && (
              <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded px-2 py-1 mt-1.5">{city.note}</p>
            )}
          </div>
          <div className="grid gap-3">
            {city.hotels.map(hotel => (
              <OptionCard
                key={hotel.id}
                item={hotel}
                type="hotel"
                favorited={favorited(hotel.id)}
                sharedFavorite={sharedFavorite(hotel.id)}
                onToggleFavorite={onToggleFavorite}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
