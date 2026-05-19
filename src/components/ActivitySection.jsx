import { useState } from 'react'
import OptionCard from './OptionCard'

const CITY_ORDER = ['Dublin', 'Galway', 'Edinburgh']

const PRIORITY_GROUPS = [
  { key: 'must-see', label: "Don't Miss", color: 'bg-red-100 text-red-800 border-red-200' },
  { key: 'should-see', label: 'Really Should See', color: 'bg-amber-100 text-amber-800 border-amber-200' },
  { key: 'if-time', label: 'Nice If There\'s Time', color: 'bg-green-100 text-green-800 border-green-200' },
  { key: 'transport', label: 'Transport & Logistics', color: 'bg-stone-100 text-stone-600 border-stone-200' },
]

export default function ActivitySection({ activities, restaurants, favorited, sharedFavorite, onToggleFavorite }) {
  const [activeCity, setActiveCity] = useState('Dublin')
  const [showType, setShowType] = useState('all')

  const cityActivities = activities.filter(a => a.city === activeCity)
  const cityRestaurants = restaurants.filter(r => r.city === activeCity)

  const showActivities = showType !== 'restaurants'
  const showRestaurants = showType !== 'activities'

  return (
    <div>
      <div className="flex gap-2 mb-4 flex-wrap">
        {CITY_ORDER.map(city => (
          <button
            key={city}
            onClick={() => setActiveCity(city)}
            className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
              activeCity === city
                ? (city === 'Edinburgh' ? 'bg-scotland text-white' : 'bg-ireland text-white')
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            {city}
          </button>
        ))}
        <div className="w-px bg-stone-200 mx-1" />
        {['all', 'activities', 'restaurants'].map(type => (
          <button
            key={type}
            onClick={() => setShowType(type)}
            className={`px-3 py-1.5 rounded-md text-sm capitalize transition-colors ${
              showType === type
                ? 'bg-stone-800 text-white'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      <div className="space-y-6">
        {showActivities && PRIORITY_GROUPS.map(group => {
          const items = cityActivities.filter(a => a.priority === group.key)
          if (items.length === 0) return null
          return (
            <div key={group.key}>
              <div className={`inline-block text-xs font-semibold px-2 py-0.5 rounded border mb-3 ${group.color}`}>
                {group.label}
              </div>
              <div className="grid gap-3">
                {items.map(activity => (
                  <OptionCard
                    key={activity.id}
                    item={activity}
                    type="activity"
                    favorited={favorited(activity.id)}
                    sharedFavorite={sharedFavorite(activity.id)}
                    onToggleFavorite={onToggleFavorite}
                  />
                ))}
              </div>
            </div>
          )
        })}

        {showRestaurants && cityRestaurants.length > 0 && (() => {
          const food = cityRestaurants.filter(r => r.category === 'restaurant')
          const pubs = cityRestaurants.filter(r => r.category === 'pub')
          return (
            <div>
              {showActivities && <div className="border-t border-stone-200 pt-4 mt-2" />}
              {food.length > 0 && (
                <>
                  <h3 className="text-lg font-semibold text-stone-700 mb-3">Restaurants</h3>
                  <div className="grid gap-3">
                    {food.map(restaurant => (
                      <OptionCard
                        key={restaurant.id}
                        item={restaurant}
                        type="restaurant"
                        favorited={favorited(restaurant.id)}
                        sharedFavorite={sharedFavorite(restaurant.id)}
                        onToggleFavorite={onToggleFavorite}
                      />
                    ))}
                  </div>
                </>
              )}
              {pubs.length > 0 && (
                <>
                  <h3 className="text-lg font-semibold text-stone-700 mb-3 mt-6">Pubs & Bars</h3>
                  <div className="grid gap-3">
                    {pubs.map(pub => (
                      <OptionCard
                        key={pub.id}
                        item={pub}
                        type="restaurant"
                        favorited={favorited(pub.id)}
                        sharedFavorite={sharedFavorite(pub.id)}
                        onToggleFavorite={onToggleFavorite}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          )
        })()}

        {!showActivities && cityRestaurants.length === 0 && (
          <p className="text-sm text-stone-400 text-center py-4">No restaurants for {activeCity}</p>
        )}
        {!showRestaurants && cityActivities.length === 0 && (
          <p className="text-sm text-stone-400 text-center py-4">No activities for {activeCity}</p>
        )}
      </div>
    </div>
  )
}
