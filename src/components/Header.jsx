export default function Header({ onShare, navItems = [] }) {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-stone-200">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-stone-800">
            <span className="text-ireland">Ireland</span>
            {' & '}
            <span className="text-scotland">Scotland</span>
          </h1>
          <p className="text-xs text-stone-500">Jul 14-25, 2026 &middot; 11 days</p>
        </div>
        <div className="flex items-center gap-4">
          <nav className="hidden md:flex gap-1">
            {navItems.map(item => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="px-2 py-1.5 text-xs text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-md transition-colors"
              >
                {item.label}
              </a>
            ))}
          </nav>
          <button
            onClick={onShare}
            className="text-sm bg-ireland text-white px-3 py-1.5 rounded-md hover:bg-ireland/90 transition-colors"
          >
            Share Picks
          </button>
        </div>
      </div>
    </header>
  )
}
