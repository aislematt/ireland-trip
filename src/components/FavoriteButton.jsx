export default function FavoriteButton({ active, shared, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`p-1 rounded transition-colors ${active ? 'text-heart' : 'text-stone-300 hover:text-stone-400'}`}
      title={active ? 'Remove from favorites' : 'Add to favorites'}
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
      </svg>
      {shared && (
        <span className="absolute -top-1 -right-1 w-2 h-2 bg-scotland rounded-full" />
      )}
    </button>
  )
}
