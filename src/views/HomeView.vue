<script setup lang="ts">
import GameSearch from '@/components/GameSearch.vue'
import GameCard from '@/components/GameCard.vue'
import GamePagination from '@/components/GamePagination.vue'
import { useGamesStore } from '@/stores/games'
import { onMounted } from 'vue'
import { Flame } from 'lucide-vue-next'

const gamesStore = useGamesStore()

onMounted(() => {
  gamesStore.fetchGames()
})
</script>

<template>
  <GameSearch @search="gamesStore.setSearch" />
  <div class="container mx-auto min-h-screen">
    <div class="game-list mt-12">
      <div class="flex items-center gap-2">
        <Flame class="text-2xl font-bold" fill="red" />
        <h1 class="text-2xl font-bold">Games List</h1>
      </div>
      <div class="game-items mt-6">
        <!-- Loading state -->
        <div v-if="gamesStore.loading" class="text-center py-10">Loading games...</div>

        <!-- Error state -->
        <div v-else-if="gamesStore.error" class="text-red-500">{{ gamesStore.error }}</div>

        <!-- Games grid -->
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <GameCard v-for="game in gamesStore.games" :key="game.id" :game="game" />
        </div>
      </div>

      <!-- Pagination -->
    </div>
    <GamePagination
      v-if="gamesStore.totalPages > 1"
      :currentPage="gamesStore.currentPage"
      :totalPages="gamesStore.totalPages"
      @change-page="gamesStore.fetchGames"
    />
  </div>
</template>
