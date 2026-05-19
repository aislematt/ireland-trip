import { useState, useEffect } from 'react'

const STORAGE_KEY = 'ireland-trip-pretripchecklist'

export function WeatherSection({ weather }) {
  const cities = Object.entries(weather)
  return (
    <div className="grid sm:grid-cols-3 gap-4">
      {cities.map(([city, w]) => (
        <div key={city} className={`p-4 rounded-lg border ${city === 'Edinburgh' ? 'border-scotland/30 bg-scotland-light/30' : 'border-ireland/30 bg-ireland-light/30'}`}>
          <h4 className="font-semibold text-stone-800 mb-2">{city}</h4>
          <div className="space-y-1 text-xs text-stone-600">
            <div><span className="font-medium">High:</span> {w.avgHigh}</div>
            <div><span className="font-medium">Low:</span> {w.avgLow}</div>
            <div><span className="font-medium">Rain:</span> {w.rain}</div>
            <div><span className="font-medium">Daylight:</span> {w.daylight}</div>
          </div>
          <p className="text-xs text-stone-500 mt-2 italic">{w.note}</p>
        </div>
      ))}
    </div>
  )
}

export function PackingList({ list }) {
  return (
    <div className="grid sm:grid-cols-2 gap-4">
      {list.map(cat => (
        <div key={cat.category} className="bg-card border border-border rounded-lg p-4">
          <h4 className="font-semibold text-stone-800 text-sm mb-2">{cat.category}</h4>
          <ul className="space-y-1">
            {cat.items.map((item, i) => (
              <li key={i} className="text-xs text-stone-600 flex items-start gap-1.5">
                <span className="text-stone-300 mt-0.5">-</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

export function PreTripChecklist({ items }) {
  const [checked, setChecked] = useState(() => {
    try {
      return new Set(JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'))
    } catch { return new Set() }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...checked]))
  }, [checked])

  const toggle = (idx) => {
    setChecked(prev => {
      const next = new Set(prev)
      if (next.has(idx)) next.delete(idx)
      else next.add(idx)
      return next
    })
  }

  const doneCount = items.filter((_, i) => checked.has(i)).length

  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <span className="text-sm text-stone-500">{doneCount} of {items.length} done</span>
        <div className="w-32 h-2 bg-stone-200 rounded-full overflow-hidden">
          <div className="h-full bg-ireland rounded-full transition-all" style={{ width: `${(doneCount / items.length) * 100}%` }} />
        </div>
      </div>
      <div className="space-y-1.5">
        {items.map((item, i) => (
          <label
            key={i}
            className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
              checked.has(i) ? 'bg-green-50/50 border-green-200' : 'bg-card border-border hover:border-stone-300'
            }`}
          >
            <input
              type="checkbox"
              checked={checked.has(i)}
              onChange={() => toggle(i)}
              className="mt-0.5 w-4 h-4 rounded border-stone-300 text-ireland focus:ring-ireland"
            />
            <div className="flex-1">
              <div className={`text-sm font-medium ${checked.has(i) ? 'text-stone-400 line-through' : 'text-stone-800'}`}>
                {item.item}
              </div>
              <p className="text-xs text-stone-500 mt-0.5">{item.notes}</p>
            </div>
          </label>
        ))}
      </div>
    </div>
  )
}
