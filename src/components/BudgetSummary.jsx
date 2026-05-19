import { useMemo } from 'react'

export default function BudgetSummary({ favorites, flights, hotels, activities, restaurants }) {
  const breakdown = useMemo(() => {
    const result = { flights: 0, hotels: 0, activities: 0, dining: 0 }

    for (const leg of flights.legs) {
      for (const option of leg.options) {
        if (favorites.has(option.id)) {
          const prices = Object.values(option.prices)
          const avg = Math.round(prices.reduce((a, b) => a + b, 0) / prices.length)
          result.flights += avg * 2
        }
      }
    }

    for (const city of hotels.cities) {
      for (const hotel of city.hotels) {
        if (favorites.has(hotel.id)) {
          result.hotels += hotel.totalPrice || (hotel.pricePerNight * city.nights)
        }
      }
    }

    for (const act of activities.activities) {
      if (favorites.has(act.id)) {
        result.activities += (act.pricePerPerson || 0) * 2
      }
    }

    for (const rest of activities.restaurants) {
      if (favorites.has(rest.id)) {
        result.dining += (rest.avgPerPerson || 0) * 2
      }
    }

    return result
  }, [favorites, flights, hotels, activities])

  const total = breakdown.flights + breakdown.hotels + breakdown.activities + breakdown.dining
  const favCount = favorites.size

  if (favCount === 0) {
    return (
      <div className="bg-card border border-border rounded-lg p-6 text-center text-stone-400">
        <p className="text-sm">Favorite items to build your budget estimate</p>
        <p className="text-xs mt-1">Click the heart icon on flights, hotels, activities, and restaurants</p>
      </div>
    )
  }

  const categories = [
    { label: 'Flights', amount: breakdown.flights, color: 'bg-blue-500', note: '2 travelers, avg price' },
    { label: 'Hotels', amount: breakdown.hotels, color: 'bg-purple-500', note: 'per room' },
    { label: 'Activities', amount: breakdown.activities, color: 'bg-green-500', note: '2 travelers' },
    { label: 'Dining', amount: breakdown.dining, color: 'bg-amber-500', note: '2 travelers' },
  ].filter(c => c.amount > 0)

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex justify-between items-baseline mb-4">
        <h3 className="font-semibold text-stone-800">Estimated Budget</h3>
        <div>
          <span className="text-2xl font-bold text-stone-800">${total.toLocaleString()}</span>
          <span className="text-sm text-stone-500 ml-1">total</span>
        </div>
      </div>

      <div className="h-3 rounded-full overflow-hidden flex mb-4">
        {categories.map(cat => (
          <div
            key={cat.label}
            className={`${cat.color} transition-all`}
            style={{ width: `${(cat.amount / total) * 100}%` }}
          />
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3">
        {categories.map(cat => (
          <div key={cat.label} className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${cat.color}`} />
            <div>
              <div className="text-sm font-medium text-stone-700">
                {cat.label}: ${cat.amount.toLocaleString()}
              </div>
              <div className="text-xs text-stone-400">{cat.note}</div>
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-stone-400 mt-4 border-t border-border pt-3">
        Prices are estimates based on typical July 2026 rates. Actual prices may vary.
        Dining estimate covers only favorited restaurants, not all meals.
      </p>
    </div>
  )
}
