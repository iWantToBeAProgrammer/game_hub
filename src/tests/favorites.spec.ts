import { useFavoritesStore } from '../stores/favorites'
import { setActivePinia, createPinia } from 'pinia'
import { beforeEach, describe, it, expect } from 'vitest'

beforeEach(() => {
  setActivePinia(createPinia())
  // ensure clean localStorage
  localStorage.removeItem('favorites')
})

describe('favorites store', () => {
  it('adds and removes a favorite', () => {
    const store = useFavoritesStore()
    const g = { id: 1, name: 'Game A' } as any
    store.add(g)
    expect(store.isFavorite(1)).toBe(true)
    expect(store.games.length).toBe(1)

    store.remove(1)
    expect(store.isFavorite(1)).toBe(false)
    expect(store.games.length).toBe(0)
  })
})
