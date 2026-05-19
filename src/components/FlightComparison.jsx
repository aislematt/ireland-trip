import { useState, useMemo } from 'react'
import FavoriteButton from './FavoriteButton'

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T12:00:00')
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
}

function getDayOfWeek(dateStr) {
  const d = new Date(dateStr + 'T12:00:00')
  return d.getDay()
}

export default function FlightComparison({ legs, favorited, sharedFavorite, onToggleFavorite }) {
  const [expandedLeg, setExpandedLeg] = useState(null)

  return (
    <div className="space-y-6">
      {legs.map(leg => {
        const isExpanded = expandedLeg === leg.id
        return (
          <div key={leg.id} className="bg-card border border-border rounded-lg overflow-hidden">
            <button
              onClick={() => setExpandedLeg(isExpanded ? null : leg.id)}
              className="w-full px-4 py-3 flex items-center justify-between hover:bg-stone-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">
                  {leg.id === 'leg-outbound' ? '1' : leg.id === 'leg-mid' ? '2' : '3'}
                </span>
                <div className="text-left">
                  <h3 className="font-semibold text-stone-800">{leg.label}</h3>
                  <p className="text-xs text-stone-500">{leg.options.length} options</p>
                </div>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                className={`w-5 h-5 text-stone-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                <path fillRule="evenodd" d="M12.53 16.28a.75.75 0 01-1.06 0l-7.5-7.5a.75.75 0 011.06-1.06L12 14.69l6.97-6.97a.75.75 0 111.06 1.06l-7.5 7.5z" clipRule="evenodd" />
              </svg>
            </button>

            {isExpanded && (
              <div className="border-t border-border">
                {leg.options.map(option => (
                  <FlightOption
                    key={option.id}
                    option={option}
                    favorited={favorited(option.id)}
                    sharedFavorite={sharedFavorite(option.id)}
                    onToggleFavorite={onToggleFavorite}
                  />
                ))}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

function FlightOption({ option, favorited, sharedFavorite, onToggleFavorite }) {
  const [showPrices, setShowPrices] = useState(false)

  const prices = Object.entries(option.prices)
  const minPrice = Math.min(...prices.map(([, p]) => p))
  const maxPrice = Math.max(...prices.map(([, p]) => p))

  const cheapDays = useMemo(() => {
    return prices
      .filter(([, p]) => p <= minPrice + 20)
      .sort(([, a], [, b]) => a - b)
  }, [prices, minPrice])

  return (
    <div className={`p-4 border-t border-border ${favorited ? 'bg-red-50/30' : ''}`}>
      <div className="flex justify-between items-start gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-stone-800">{option.airline}</h4>
            <span className="text-xs px-1.5 py-0.5 rounded bg-stone-100 text-stone-600">
              {option.from} &rarr; {option.to}
            </span>
            {option.stops === 0 && (
              <span className="text-xs px-1.5 py-0.5 rounded bg-green-50 text-green-700">Direct</span>
            )}
            {option.stops > 0 && (
              <span className="text-xs px-1.5 py-0.5 rounded bg-amber-50 text-amber-700">{option.stops} stop</span>
            )}
          </div>
          <div className="flex items-center gap-3 mt-1 text-sm text-stone-500">
            <span>{option.departTime} &rarr; {option.arriveTime}</span>
            <span>&middot;</span>
            <span>{option.duration}</span>
            {option.aircraft && (
              <>
                <span>&middot;</span>
                <span>{option.aircraft}</span>
              </>
            )}
          </div>
          {option.notes && (
            <p className="text-xs text-stone-500 mt-1 italic">{option.notes}</p>
          )}
        </div>

        <div className="flex flex-col items-end gap-1 shrink-0">
          <FavoriteButton
            active={favorited}
            shared={sharedFavorite}
            onClick={() => onToggleFavorite(option.id)}
          />
          <div className="text-right">
            <span className="text-lg font-bold text-stone-800">${minPrice}</span>
            {minPrice !== maxPrice && (
              <span className="text-xs text-stone-500"> - ${maxPrice}</span>
            )}
          </div>
          <a href={option.bookingUrl} target="_blank" rel="noopener noreferrer"
            className="text-xs text-ireland hover:text-ireland/80 underline">
            Book &rarr;
          </a>
        </div>
      </div>

      <div className="mt-3">
        <button
          onClick={() => setShowPrices(!showPrices)}
          className="text-xs text-stone-500 hover:text-stone-700 flex items-center gap-1"
        >
          {showPrices ? 'Hide' : 'Show'} price calendar
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
            className={`w-3 h-3 transition-transform ${showPrices ? 'rotate-180' : ''}`}>
            <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
          </svg>
        </button>

        {showPrices && (
          <div className="mt-2 grid grid-cols-4 sm:grid-cols-5 md:grid-cols-7 gap-1.5">
            {prices.map(([date, price]) => {
              const dow = getDayOfWeek(date)
              const isCheap = price <= minPrice + 15
              const isWeekend = dow === 0 || dow === 5 || dow === 6
              return (
                <div
                  key={date}
                  className={`text-center p-1.5 rounded text-xs border ${
                    isCheap
                      ? 'bg-green-50 border-green-200 text-green-800'
                      : isWeekend
                        ? 'bg-amber-50 border-amber-200 text-amber-800'
                        : 'bg-stone-50 border-stone-200 text-stone-700'
                  }`}
                >
                  <div className="font-medium">{formatDate(date)}</div>
                  <div className="font-bold">${price}</div>
                </div>
              )
            })}
          </div>
        )}

        {!showPrices && cheapDays.length > 0 && (
          <div className="mt-1 text-xs text-green-700">
            Cheapest: {cheapDays.slice(0, 3).map(([date, price]) => `${formatDate(date)} ($${price})`).join(', ')}
          </div>
        )}
      </div>
    </div>
  )
}
