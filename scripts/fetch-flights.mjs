const API_KEY = process.env.SERPAPI_KEY
const BASE = 'https://serpapi.com/search.json'

const SEARCHES = [
  // Leg 1: NYC → Dublin (try multiple departure dates across July, from JFK)
  ...['2026-07-01','2026-07-03','2026-07-05','2026-07-08','2026-07-10','2026-07-13','2026-07-15','2026-07-17','2026-07-20','2026-07-22'].map(d => ({
    leg: 'outbound', from: 'JFK', to: 'DUB', date: d
  })),
  // Leg 2: Dublin → Edinburgh
  ...['2026-07-06','2026-07-08','2026-07-11','2026-07-13','2026-07-15','2026-07-18','2026-07-20','2026-07-22','2026-07-25'].map(d => ({
    leg: 'mid', from: 'DUB', to: 'EDI', date: d
  })),
  // Leg 3: Edinburgh → NYC (JFK)
  ...['2026-07-12','2026-07-15','2026-07-17','2026-07-20','2026-07-22','2026-07-25','2026-07-27','2026-07-29','2026-07-31'].map(d => ({
    leg: 'return', from: 'EDI', to: 'JFK', date: d
  })),
]

async function fetchFlight(search) {
  const params = new URLSearchParams({
    engine: 'google_flights',
    departure_id: search.from,
    arrival_id: search.to,
    outbound_date: search.date,
    type: '2', // one-way
    currency: 'USD',
    hl: 'en',
    api_key: API_KEY,
  })

  const url = `${BASE}?${params}`
  console.log(`Fetching ${search.from}→${search.to} on ${search.date}...`)

  const res = await fetch(url)
  if (!res.ok) {
    console.error(`  HTTP ${res.status} for ${search.from}→${search.to} ${search.date}`)
    return null
  }
  const data = await res.json()

  if (data.error) {
    console.error(`  API error: ${data.error}`)
    return null
  }

  const bestFlights = data.best_flights || []
  const otherFlights = data.other_flights || []
  const allFlights = [...bestFlights, ...otherFlights]

  const results = allFlights.slice(0, 8).map(flight => {
    const legs = flight.flights || []
    const first = legs[0] || {}
    const last = legs[legs.length - 1] || {}
    return {
      airline: first.airline || 'Unknown',
      airlineLogo: first.airline_logo || null,
      flightNumber: first.flight_number || '',
      from: first.departure_airport?.id || search.from,
      to: last.arrival_airport?.id || search.to,
      departTime: first.departure_airport?.time || '',
      arriveTime: last.arrival_airport?.time || '',
      duration: flight.total_duration ? `${Math.floor(flight.total_duration/60)}h ${flight.total_duration%60}m` : '',
      durationMin: flight.total_duration || 0,
      stops: legs.length - 1,
      layovers: (flight.layovers || []).map(l => `${l.name} (${l.duration}min)`),
      price: flight.price || null,
      type: flight.type || '',
      carbon_emissions: flight.carbon_emissions?.this_flight ? `${Math.round(flight.carbon_emissions.this_flight / 1000)}kg` : null,
    }
  })

  return {
    leg: search.leg,
    from: search.from,
    to: search.to,
    date: search.date,
    flights: results,
    priceInsights: data.price_insights || null,
  }
}

async function main() {
  if (!API_KEY) {
    console.error('Set SERPAPI_KEY environment variable')
    process.exit(1)
  }

  const results = []
  // Process sequentially to avoid rate limits
  for (const search of SEARCHES) {
    const result = await fetchFlight(search)
    if (result) results.push(result)
    // Small delay between requests
    await new Promise(r => setTimeout(r, 500))
  }

  // Write raw results
  const fs = await import('fs')
  fs.writeFileSync(
    new URL('../src/data/flights-raw.json', import.meta.url),
    JSON.stringify(results, null, 2)
  )
  console.log(`\nSaved ${results.length} search results to flights-raw.json`)

  // Now build the structured flights.json
  const legGroups = { outbound: {}, mid: {}, return: {} }

  for (const result of results) {
    for (const flight of result.flights) {
      const key = `${flight.airline}|${flight.from}|${flight.to}|${flight.stops}`
      if (!legGroups[result.leg][key]) {
        legGroups[result.leg][key] = {
          airline: flight.airline,
          from: flight.from,
          to: flight.to,
          stops: flight.stops,
          departTime: flight.departTime,
          arriveTime: flight.arriveTime,
          duration: flight.duration,
          durationMin: flight.durationMin,
          layovers: flight.layovers,
          prices: {},
          flightNumber: flight.flightNumber,
        }
      }
      if (flight.price) {
        legGroups[result.leg][key].prices[result.date] = flight.price
      }
    }
  }

  // Pick best options per leg (most data points, interesting variety)
  function pickBest(group, maxOptions = 4) {
    return Object.values(group)
      .filter(f => Object.keys(f.prices).length >= 2)
      .sort((a, b) => Object.keys(b.prices).length - Object.keys(a.prices).length)
      .slice(0, maxOptions)
  }

  const legLabels = {
    outbound: { id: 'leg-outbound', label: 'NYC to Dublin', from: 'New York', to: 'Dublin' },
    mid: { id: 'leg-mid', label: 'Dublin to Edinburgh', from: 'Dublin', to: 'Edinburgh' },
    return: { id: 'leg-return', label: 'Edinburgh to NYC', from: 'Edinburgh', to: 'New York' },
  }

  const structured = {
    legs: Object.entries(legGroups).map(([legKey, group]) => {
      const meta = legLabels[legKey]
      const options = pickBest(group)
      return {
        id: meta.id,
        label: meta.label,
        from: meta.from,
        to: meta.to,
        options: options.map((opt, i) => ({
          id: `flt-${legKey.slice(0,3)}-${String(i+1).padStart(3,'0')}`,
          airline: opt.airline,
          from: opt.from,
          to: opt.to,
          departTime: opt.departTime,
          arriveTime: opt.arriveTime,
          duration: opt.duration,
          stops: opt.stops,
          layovers: opt.layovers.length > 0 ? opt.layovers : undefined,
          prices: opt.prices,
          notes: opt.stops === 0 ? 'Direct nonstop.' : `${opt.stops} stop${opt.stops > 1 ? 's' : ''}: ${opt.layovers.join(', ')}`,
          bookingUrl: getBookingUrl(opt.airline),
        }))
      }
    }),
    tips: [
      "Tuesdays and Wednesdays are typically cheapest for transatlantic flights",
      "Booking 2-3 months ahead usually gets the best prices for summer",
      "Prices shown are from Google Flights and may vary — click through to book",
      "Consider one-way tickets — mixing airlines can save money",
      "Aer Lingus offers US preclearance in Dublin, saving time on arrival",
      "Ryanair charges extra for checked bags and seat selection"
    ],
    lastUpdated: new Date().toISOString().split('T')[0],
  }

  fs.writeFileSync(
    new URL('../src/data/flights.json', import.meta.url),
    JSON.stringify(structured, null, 2)
  )
  console.log('Updated flights.json with real prices!')

  // Print summary
  for (const leg of structured.legs) {
    console.log(`\n${leg.label}:`)
    for (const opt of leg.options) {
      const prices = Object.values(opt.prices)
      const min = Math.min(...prices)
      const max = Math.max(...prices)
      console.log(`  ${opt.airline} (${opt.from}→${opt.to}): $${min}-$${max} (${prices.length} dates)`)
    }
  }
}

function getBookingUrl(airline) {
  const urls = {
    'Aer Lingus': 'https://www.aerlingus.com',
    'Delta': 'https://www.delta.com',
    'United': 'https://www.united.com',
    'American': 'https://www.aa.com',
    'British Airways': 'https://www.britishairways.com',
    'Ryanair': 'https://www.ryanair.com',
    'JetBlue': 'https://www.jetblue.com',
    'Lufthansa': 'https://www.lufthansa.com',
    'KLM': 'https://www.klm.com',
    'Air France': 'https://www.airfrance.com',
    'Icelandair': 'https://www.icelandair.com',
    'Norwegian': 'https://www.norwegian.com',
    'Virgin Atlantic': 'https://www.virginatlantic.com',
  }
  return urls[airline] || 'https://www.google.com/travel/flights'
}

main().catch(err => {
  console.error('Fatal error:', err)
  process.exit(1)
})
