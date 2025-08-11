import { defineStore } from 'pinia'
import type { Game } from '@/types/game'

export const useFavoritesStore = defineStore('favorites', {
  state: () => ({
    games: JSON.parse(localStorage.getItem('favorites') || '[]') as Game[],
  }),
  actions: {
    add(game: Game) {
      if (!this.games.find((g) => g.id === game.id)) {
        this.games.push(game)
        localStorage.setItem('favorites', JSON.stringify(this.games))
      }
    },
    remove(id: number) {
      this.games = this.games.filter((g) => g.id !== id)
      localStorage.setItem('favorites', JSON.stringify(this.games))
    },
    isFavorite(id: number) {
      return !!this.games.find((g) => g.id === id)
    },
  },
})
