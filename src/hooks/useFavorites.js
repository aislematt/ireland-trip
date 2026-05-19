import { useState, useCallback, useEffect } from 'react'

const STORAGE_KEY = 'ireland-trip-favorites'

function loadFavorites() {
  try {
    const hash = window.location.hash.slice(1)
    if (hash.startsWith('shared=')) {
      const shared = JSON.parse(atob(hash.slice(7)))
      return { own: new Set(), shared: new Set(shared) }
    }
  } catch {}

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) return { own: new Set(JSON.parse(stored)), shared: new Set() }
  } catch {}

  return { own: new Set(), shared: new Set() }
}

export function useFavorites() {
  const [favorites, setFavorites] = useState(() => loadFavorites())

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...favorites.own]))
  }, [favorites.own])

  const toggleFavorite = useCallback((id) => {
    setFavorites(prev => {
      const next = new Set(prev.own)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return { ...prev, own: next }
    })
  }, [])

  const isFavorited = useCallback((id) => favorites.own.has(id), [favorites.own])
  const isSharedFavorite = useCallback((id) => favorites.shared.has(id), [favorites.shared])

  const shareUrl = useCallback(() => {
    const encoded = btoa(JSON.stringify([...favorites.own]))
    const url = `${window.location.origin}${window.location.pathname}#shared=${encoded}`
    navigator.clipboard.writeText(url)
    return url
  }, [favorites.own])

  return { favorites: favorites.own, toggleFavorite, isFavorited, isSharedFavorite, shareUrl }
}
