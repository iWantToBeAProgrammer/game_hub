<template>
  <div class="p-6 pt-28 min-h-screen">
    <h1 class="text-2xl font-bold mb-4">My Favorites</h1>

    <div v-if="favoritesStore.games.length === 0" class="text-gray-500">
      You haven't added any favorites yet.
    </div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <GameCard v-for="game in favoritesStore.games" :key="game.id" :game="game" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useFavoritesStore } from '@/stores/favorites'
import GameCard from '@/components/GameCard.vue'

const favoritesStore = useFavoritesStore()
</script>
