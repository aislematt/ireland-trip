import { useState, useEffect } from 'react'

const URGENCY = {
  now: { label: 'Book Now', color: 'bg-red-100 text-red-800 border-red-200' },
  soon: { label: 'Book Soon', color: 'bg-amber-100 text-amber-800 border-amber-200' },
  later: { label: 'Can Wait', color: 'bg-green-100 text-green-800 border-green-200' },
}

const STORAGE_KEY = 'ireland-trip-booked'

export default function BookingChecklist({ items }) {
  const [booked, setBooked] = useState(() => {
    try {
      return new Set(JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'))
    } catch { return new Set() }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...booked]))
  }, [booked])

  const toggle = (id) => {
    setBooked(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const bookedCount = items.filter(i => booked.has(i.id)).length

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-stone-500">{bookedCount} of {items.length} booked</span>
        <div className="w-32 h-2 bg-stone-200 rounded-full overflow-hidden">
          <div className="h-full bg-ireland rounded-full transition-all" style={{ width: `${(bookedCount / items.length) * 100}%` }} />
        </div>
      </div>
      {['now', 'soon', 'later'].map(urgency => {
        const group = items.filter(i => i.urgency === urgency)
        if (group.length === 0) return null
        const u = URGENCY[urgency]
        return (
          <div key={urgency}>
            <div className={`inline-block text-xs font-semibold px-2 py-0.5 rounded border mb-2 ${u.color}`}>
              {u.label}
            </div>
            <div className="space-y-1.5">
              {group.map(item => (
                <label
                  key={item.id}
                  className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                    booked.has(item.id) ? 'bg-green-50/50 border-green-200' : 'bg-card border-border hover:border-stone-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={booked.has(item.id)}
                    onChange={() => toggle(item.id)}
                    className="mt-0.5 w-4 h-4 rounded border-stone-300 text-ireland focus:ring-ireland"
                  />
                  <div className="flex-1 min-w-0">
                    <div className={`text-sm font-medium ${booked.has(item.id) ? 'text-stone-400 line-through' : 'text-stone-800'}`}>
                      {item.item}
                    </div>
                    <p className="text-xs text-stone-500 mt-0.5">{item.notes}</p>
                  </div>
                  {item.url && (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={e => e.stopPropagation()}
                      className="text-xs text-ireland hover:text-ireland/80 underline shrink-0"
                    >
                      Book &rarr;
                    </a>
                  )}
                </label>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
