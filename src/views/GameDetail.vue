<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { getGameDetails } from '@/api/rawg'
import type { Game, GameDetails } from '@/types/game'
import { useFavoritesStore } from '@/stores/favorites'
import { toast } from 'vue-sonner'
import { Heart } from 'lucide-vue-next'

const route = useRoute()
const favoritesStore = useFavoritesStore()

const game = ref<GameDetails | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)
const fallbackImage = 'https://via.placeholder.com/800x400?text=No+Image'

const isFav = computed(() => favoritesStore.isFavorite(game.value?.id || 0))

async function fetchGameDetail() {
  try {
    const res = await getGameDetails(route.params.id as string)
    if (!res) {
      error.value = 'Game not found'
      return
    }
    game.value = res
  } catch (err) {
    error.value = 'Failed to load game details'
  } finally {
    loading.value = false
  }
}

function toggleFavorite() {
  if (!game.value) return
  if (isFav.value) {
    favoritesStore.remove(game.value.id)
    toast.success('Removed from favorites', {
      description: game.value.name,
    })
  } else {
    // Pick only fields we need for favorites list
    const favGame: Game = {
      id: game.value.id,
      name: game.value.name,
      released: game.value.released,
      background_image: game.value.background_image,
      genres: game.value.genres,
      parent_platforms: game.value.parent_platforms,
      rating: game.value.rating,
    }
    favoritesStore.add(favGame)
    toast.success('Added to favorites', {
      description: game.value.name,
    })
  }
}

const isExpanded = ref(false)

onMounted(() => {
  fetchGameDetail()
})
</script>

<template>
  <div class="min-h-screen w-full">
    <div v-if="loading" class="text-center py-32">Loading game details...</div>
    <div v-else-if="error" class="text-red-500 py-32">{{ error }}</div>
    <div
      v-else-if="game"
      class="container pt-24 mx-auto bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-lg"
    >
      <h1 class="text-3xl font-bold font-ethnocentric mb-6">{{ game.name }}</h1>
      <img
        :src="game.background_image || fallbackImage"
        :alt="game.name"
        class="w-full object-cover rounded mb-4 h-96 object-center"
      />
      <div class="content-wrapper w-full flex justify-between sm:flex-row flex-col">
        <div class="left-content w-3/4 sm:w-full">
          <p class="developer">Developer:</p>
          <p class="text-2xl font-semibold mb-2">{{ game.developers[0].name }}</p>
          <div class="released text-pretty mb-2">
            <strong>Released:</strong> {{ game.released }}
          </div>
          <div class="rating text-pretty mb-2"><strong>Rating:</strong> {{ game.rating }} / 5</div>
          <div
            v-for="value in game.genres"
            :key="value.id"
            class="mb-4 inline-block dark:bg-gray-900 rounded-full px-3 py-1 text-sm font-semibold bg-gray-300 text-gray-900 dark:text-white mr-2"
          >
            {{ value.name }}
          </div>
        </div>
        <div class="content-right">
          <div class="platforms text-pretty mb-4">
            <strong class="me-2">Platforms:</strong>
            <span v-for="(platform, index) in game.parent_platforms" :key="index">
              {{ platform.platform.name
              }}<span v-if="index < game.parent_platforms.length - 1">, </span>
            </span>
          </div>

          <button
            @click="toggleFavorite"
            class="text-purple-500 hover:underline text-sm font-medium mb-4"
          >
            <Heart class="inline-block mr-1" />
            {{ isFav ? 'Remove from favorites' : 'Add to favorites' }}
          </button>
        </div>
      </div>
      <div>
        <p
          class="description text-pretty mb-1"
          :class="isExpanded ? '' : 'line-clamp-3 sm:line-clamp-none'"
        >
          {{ game.description_raw }}
        </p>
        <button
          @click="isExpanded = !isExpanded"
          class="text-blue-500 hover:underline text-sm font-medium sm:hidden inline-block"
        >
          {{ isExpanded ? 'Read less' : 'Read more' }}
        </button>
      </div>
    </div>
  </div>
</template>
