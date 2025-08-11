import { defineStore } from 'pinia'
import { getGames } from '@/api/rawg'
import type { Game } from '@/types/game'

export const useGamesStore = defineStore('games', {
  state: () => ({
    games: [] as Game[],
    searchQuery: '',
    currentPage: 1,
    totalPages: 1,
    pageSize: 20,
    loading: false,
    error: null as string | null,
  }),

  actions: {
    async fetchGames(page = 1) {
      this.loading = true
      this.currentPage = page
      try {
        const res = await getGames(page, this.pageSize, this.searchQuery)
        this.games = res.results
        this.totalPages = res.count ? Math.ceil(res.count / this.pageSize) : 1
      } catch (err) {
        this.error = 'Failed to load games'
      } finally {
        this.loading = false
      }
    },

    setSearch(query: string) {
      this.searchQuery = query
      this.fetchGames(1)
    },
  },
})
