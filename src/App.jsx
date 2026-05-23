import { useState, useCallback } from 'react'
import Header from './components/Header'
import SelectedFlights from './components/SelectedFlights'
import FlightComparison from './components/FlightComparison'
import DayCard from './components/DayCard'
import HotelSection from './components/HotelSection'
import ActivitySection from './components/ActivitySection'
import BudgetSummary from './components/BudgetSummary'
import BookingChecklist from './components/BookingChecklist'
import { WeatherSection, PackingList, PreTripChecklist } from './components/TripInfo'
import { useFavorites } from './hooks/useFavorites'

import flights from './data/flights.json'
import hotels from './data/hotels.json'
import itinerary from './data/itinerary.json'
import activitiesData from './data/activities.json'
import checklistData from './data/checklist.json'

const activityMap = Object.fromEntries(activitiesData.activities.map(a => [a.id, a]))
const restaurantMap = Object.fromEntries(activitiesData.restaurants.map(r => [r.id, r]))

const NAV_ITEMS = [
  { id: 'checklist', label: 'Checklist' },
  { id: 'flights', label: 'Flights' },
  { id: 'itinerary', label: 'Itinerary' },
  { id: 'hotels', label: 'Hotels' },
  { id: 'activities', label: 'Activities' },
  { id: 'budget', label: 'Budget' },
  { id: 'prep', label: 'Trip Prep' },
]

export default function App() {
  const { favorites, toggleFavorite, isFavorited, isSharedFavorite, shareUrl } = useFavorites()
  const [shareToast, setShareToast] = useState(false)

  const handleShare = useCallback(() => {
    shareUrl()
    setShareToast(true)
    setTimeout(() => setShareToast(false), 2500)
  }, [shareUrl])

  return (
    <div className="min-h-screen">
      <Header onShare={handleShare} navItems={NAV_ITEMS} />

      {shareToast && (
        <div className="fixed top-16 right-4 z-50 bg-stone-800 text-white text-sm px-4 py-2 rounded-lg shadow-lg animate-pulse">
          Link copied to clipboard!
        </div>
      )}

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-12">
        {/* Hero */}
        <section className="text-center py-8">
          <h2 className="text-4xl font-bold text-stone-800 mb-2">
            <span className="text-ireland">Ireland</span> & <span className="text-scotland">Scotland</span>
          </h2>
          <p className="text-lg text-stone-500">July 14&ndash;25, 2026 &middot; 11 Days</p>
          <p className="text-sm text-stone-400 mt-1">NYC &rarr; Dublin &rarr; Galway &rarr; Edinburgh &rarr; NYC</p>
          <div className="flex justify-center gap-6 mt-4 text-sm text-stone-500">
            <span>Cities & Culture</span>
            <span>&middot;</span>
            <span>Nature & Cliffs</span>
            <span>&middot;</span>
            <span>Food & Whiskey</span>
          </div>
        </section>

        {/* Booking Checklist */}
        <section id="checklist">
          <SectionHeader title="Booking Checklist" subtitle="What to book and when — check items off as you go" />
          <BookingChecklist items={checklistData.bookingChecklist} />
        </section>

        {/* Selected Flights */}
        {itinerary.selectedFlights && (
          <section id="booked-flights">
            <SectionHeader title="Flights" subtitle="JetBlue round-trip: JFK &rarr; Dublin &middot; Edinburgh &rarr; JFK" />
            <SelectedFlights selected={itinerary.selectedFlights} />
          </section>
        )}

        {/* Flight Alternatives */}
        <section id="flights">
          <SectionHeader title="Flight Alternatives" subtitle="Other options from Google Flights for comparison" />
          <FlightComparison
            legs={flights.legs}
            favorited={isFavorited}
            sharedFavorite={isSharedFavorite}
            onToggleFavorite={toggleFavorite}
          />
        </section>

        {/* Itinerary */}
        <section id="itinerary">
          <SectionHeader title="Day-by-Day Itinerary" subtitle="July 14-25 — your 11-day journey through Ireland and Scotland" />
          <div className="grid gap-3">
            {itinerary.days.map(day => {
              const dayActivities = (day.activities || [])
                .map(id => activityMap[id])
                .filter(Boolean)
              const dayRestaurants = (day.activities || [])
                .map(id => restaurantMap[id])
                .filter(Boolean)
              return (
                <DayCard
                  key={day.day}
                  day={day}
                  activities={dayActivities}
                  restaurants={dayRestaurants}
                />
              )
            })}
          </div>
        </section>

        {/* Hotels */}
        <section id="hotels">
          <SectionHeader title="Hotels" subtitle="Mid-range and luxury options with real July 2026 pricing" />
          <HotelSection
            cities={hotels.cities}
            favorited={isFavorited}
            sharedFavorite={isSharedFavorite}
            onToggleFavorite={toggleFavorite}
          />
        </section>

        {/* Activities & Restaurants */}
        <section id="activities">
          <SectionHeader title="Activities & Dining" subtitle="Things to do and places to eat in each city" />
          <ActivitySection
            activities={activitiesData.activities}
            restaurants={activitiesData.restaurants}
            favorited={isFavorited}
            sharedFavorite={isSharedFavorite}
            onToggleFavorite={toggleFavorite}
          />
        </section>

        {/* Budget */}
        <section id="budget">
          <SectionHeader title="Budget Estimate" subtitle="Based on your favorited items" />
          <BudgetSummary
            favorites={favorites}
            flights={flights}
            hotels={hotels}
            activities={activitiesData}
            restaurants={activitiesData}
          />
        </section>

        {/* Trip Prep */}
        <section id="prep" className="space-y-8">
          <div>
            <SectionHeader title="July Weather" subtitle="What to expect in each city" />
            <WeatherSection weather={checklistData.weather} />
          </div>

          <div>
            <SectionHeader title="Packing List" subtitle="Based on your activities and July weather" />
            <PackingList list={checklistData.packingList} />
          </div>

          <div>
            <SectionHeader title="Pre-Trip Checklist" subtitle="Things to do before you leave" />
            <PreTripChecklist items={checklistData.preTripChecklist} />
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center py-8 border-t border-border text-xs text-stone-400">
          <p>Prices from Google Flights and Google Hotels &middot; Always verify before booking</p>
          <p className="mt-1">Built with love for an epic summer trip</p>
        </footer>
      </main>
    </div>
  )
}

function SectionHeader({ title, subtitle }) {
  return (
    <div className="mb-4">
      <h2 className="text-2xl font-bold text-stone-800">{title}</h2>
      {subtitle && <p className="text-sm text-stone-500">{subtitle}</p>}
    </div>
  )
}
