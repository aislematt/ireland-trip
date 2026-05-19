const ICONS = {
  plane: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
    </svg>
  ),
  city: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path fillRule="evenodd" d="M3 2.25a.75.75 0 01.75.75v.54l1.838-.46a9.75 9.75 0 016.725.738l.108.054a8.25 8.25 0 005.58.652l3.109-.732a.75.75 0 01.917.81 47.784 47.784 0 00.005 10.337.75.75 0 01-.574.812l-3.114.733a9.75 9.75 0 01-6.594-.77l-.108-.054a8.25 8.25 0 00-5.69-.625l-1.81.452A.75.75 0 013 14.175V3a.75.75 0 01.75-.75z" clipRule="evenodd" />
    </svg>
  ),
  culture: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M11.25 4.533A9.707 9.707 0 006 3a9.735 9.735 0 00-3.25.555.75.75 0 00-.5.707v14.25a.75.75 0 001 .707A8.237 8.237 0 016 18.75c1.995 0 3.823.707 5.25 1.886V4.533zM12.75 20.636A8.214 8.214 0 0118 18.75c.966 0 1.89.166 2.75.47a.75.75 0 001-.708V4.262a.75.75 0 00-.5-.707A9.735 9.735 0 0018 3a9.707 9.707 0 00-5.25 1.533v16.103z" />
    </svg>
  ),
  nature: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM6.262 6.072a8.25 8.25 0 1010.562-.766 4.5 4.5 0 01-1.318 1.357L14.25 7.5l.165.33a.809.809 0 01-1.086 1.085l-.604-.302a1.125 1.125 0 00-1.298.21l-.132.131c-.439.44-.439 1.152 0 1.591l.296.296c.256.257.622.374.98.314l1.17-.195c.323-.054.654.036.905.245l1.33 1.108c.32.267.46.694.358 1.1a8.7 8.7 0 01-2.288 4.04l-.723.724a1.125 1.125 0 01-1.298.21l-.153-.076a1.125 1.125 0 01-.622-1.006v-1.089c0-.298-.119-.585-.33-.796l-1.347-1.347a1.125 1.125 0 01-.21-1.298L9.75 12l-1.64-1.64a6 6 0 01-1.676-3.257l-.172-1.03z" clipRule="evenodd" />
    </svg>
  ),
  train: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path fillRule="evenodd" d="M8.161 2.58a1.875 1.875 0 011.678 0l4.993 2.498c.106.052.23.052.336 0l3.869-1.935A1.875 1.875 0 0121.75 4.82v12.485c0 .71-.401 1.36-1.037 1.677l-4.875 2.437a1.875 1.875 0 01-1.676 0L9.17 18.92a.375.375 0 00-.336 0l-3.869 1.935A1.875 1.875 0 012.25 19.18V6.695c0-.71.401-1.36 1.037-1.677l4.875-2.437zM9 6a.75.75 0 01.75.75V15a.75.75 0 01-1.5 0V6.75A.75.75 0 019 6zm6.75 3a.75.75 0 00-1.5 0v8.25a.75.75 0 001.5 0V9z" clipRule="evenodd" />
    </svg>
  ),
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr + 'T12:00:00')
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
}

export default function DayCard({ day, activities, restaurants }) {
  const isIreland = day.country === 'ireland'
  const borderColor = isIreland ? 'border-l-ireland' : 'border-l-scotland'
  const iconColor = isIreland ? 'text-ireland' : 'text-scotland'
  const items = [...(activities || []), ...(restaurants || [])]

  return (
    <div className={`bg-card border border-border rounded-lg border-l-4 ${borderColor} overflow-hidden`}>
      <div className="p-4">
        <div className="flex items-center gap-3">
          <div className={`${iconColor}`}>
            {ICONS[day.icon] || ICONS.city}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-stone-400 uppercase tracking-wide">Day {day.day}</span>
              {day.date && (
                <span className="text-xs text-stone-400">{formatDate(day.date)}</span>
              )}
              <span className={`text-xs px-1.5 py-0.5 rounded ${isIreland ? 'bg-ireland-light text-ireland' : 'bg-scotland-light text-scotland'}`}>
                {day.city}
              </span>
            </div>
            <h3 className="font-semibold text-stone-800">{day.label}</h3>
          </div>
        </div>
        <p className="text-sm text-stone-600 mt-2 ml-8">{day.summary}</p>

        {items.length > 0 && (
          <div className="mt-3 ml-8 flex flex-wrap gap-1.5">
            {items.map(item => (
              <span key={item.id} className="text-xs px-2 py-1 rounded-full bg-stone-100 text-stone-600">
                {item.name}
                {item.pricePerPerson > 0 && ` ($${item.pricePerPerson})`}
                {item.avgPerPerson && ` (~$${item.avgPerPerson})`}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
