<template>
  <div
    class="rounded-lg overflow-hidden shadow hover:shadow-lg transition bg-white dark:bg-gray-800 relative border border-gray-200 dark:border-gray-700"
  >
    <div
      class="favorite absolute top-2 right-2 p-2 rounded-full dark:bg-gray-700 bg-gray-300/50 hover:bg-gray-300/80 dark:hover:bg-gray-600 cursor-pointer dark:text-white text-gray-900"
      @click="toggleFavorite"
    >
      <Heart :class="isFav ? 'text-red-500' : 'text-gray-400'" :fill="isFav ? 'red' : 'gray'" />
    </div>

    <img
      :src="game.background_image || fallbackImage"
      :alt="game.name"
      class="w-full h-48 object-cover"
    />
    <div class="p-4 flex flex-col justify-between items-start h-64">
      <h2 class="text-lg font-bold mb-2">{{ game.name }}</h2>
      <p class="text-sm text-gray-600 dark:text-gray-400">
        Released: {{ game.released || 'Unknown' }}
      </p>
      <p class="text-sm text-gray-600 dark:text-gray-400">Rating: {{ game.rating || 'N/A' }} / 5</p>
      <p class="text-sm text-gray-600 dark:text-gray-400">
        Genres: {{ game.genres.map((g) => g.name).join(', ') || 'N/A' }}
      </p>
      <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Platforms: {{ game.parent_platforms.map((p) => p.platform.name).join(', ') || 'N/A' }}
      </p>
      <router-link
        :to="`/game/${game.id}`"
        class="inline-block bg-purple-500 hover:bg-purple-600 text-white rounded-lg px-4 py-2 text-sm"
      >
        View Details
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useFavoritesStore } from '@/stores/favorites'
import type { Game } from '@/types/game'
import { Heart } from 'lucide-vue-next'
import { computed } from 'vue'
import { toast } from 'vue-sonner'

const props = defineProps<{
  game: Game
}>()

const favoriteStore = useFavoritesStore()

const isFav = computed(() => favoriteStore.isFavorite(props.game.id || 0))

function toggleFavorite() {
  if (!props.game) return
  if (isFav.value) {
    favoriteStore.remove(props.game.id)
    toast.success('Removed from favorites', {
      description: props.game.name,
    })
  } else {
    // Pick only fields we need for favorites list
    const favGame: Game = {
      id: props.game.id,
      name: props.game.name,
      released: props.game.released,
      background_image: props.game.background_image,
      genres: props.game.genres,
      parent_platforms: props.game.parent_platforms,
      rating: props.game.rating,
    }
    favoriteStore.add(favGame)
    toast.success('Added to favorites', {
      description: props.game.name,
    })
  }
}

// Optional fallback image
const fallbackImage = 'https://placehold.co/400x225?text=No+Image'
</script>
