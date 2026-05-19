export default function SelectedFlights({ selected }) {
  if (!selected) return null

  const { outbound, return: ret, totalPerPerson, fareOptions } = selected

  return (
    <div className="bg-card border border-ireland/30 rounded-lg overflow-hidden">
      <div className="bg-ireland/5 px-4 py-3 border-b border-ireland/20">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-stone-800">Selected Flights</h3>
          <div>
            <span className="text-2xl font-bold text-stone-800">${totalPerPerson}</span>
            <span className="text-sm text-stone-500">/person</span>
            <span className="text-xs text-stone-400 ml-1">(round-trip)</span>
          </div>
        </div>
      </div>

      <div className="divide-y divide-border">
        <FlightLeg flight={outbound} label="Outbound" />
        <FlightLeg flight={ret} label="Return" />
      </div>

      {fareOptions && (
        <div className="px-4 py-3 bg-stone-50 border-t border-border">
          <p className="text-xs font-medium text-stone-600 mb-2">Fare options (per person, round-trip):</p>
          <div className="grid grid-cols-3 gap-2">
            {Object.entries(fareOptions).map(([name, fare]) => (
              <div key={name} className={`text-center p-2 rounded border text-xs ${name === 'Blue Basic' ? 'border-ireland/40 bg-ireland/5' : 'border-border'}`}>
                <div className="font-semibold">{name}</div>
                <div className="text-lg font-bold">${fare.price}</div>
                <div className="text-stone-500 mt-1">
                  Bag: {fare.checkedBag}
                  <br />
                  Changes: {fare.changes}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function FlightLeg({ flight, label }) {
  return (
    <div className="px-4 py-3 flex items-center gap-4">
      <div className="text-xs font-medium text-stone-400 uppercase w-16 shrink-0">{label}</div>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-stone-800">{flight.airline}</span>
          <span className="text-xs text-stone-500">{flight.flight}</span>
          <span className="text-xs px-1.5 py-0.5 rounded bg-green-50 text-green-700">Nonstop</span>
        </div>
        <div className="text-sm text-stone-600 mt-0.5">
          {flight.from} &rarr; {flight.to} &middot; {flight.depart} &rarr; {flight.arrive} &middot; {flight.duration}
        </div>
        <div className="text-xs text-stone-400 mt-0.5">
          {new Date(flight.date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
        </div>
      </div>
    </div>
  )
}
