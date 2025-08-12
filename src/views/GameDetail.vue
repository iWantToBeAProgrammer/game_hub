<script setup lang="ts">
import { onMounted, ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { getGameDetails } from '@/api/rawg'
import type { Game, GameDetails, PlatformRequirement } from '@/types/game'
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

interface Tab {
  id: string
  label: string
  content: string
  icon: string
  requirements?: any
  visible: boolean
}

// Platform detection computed properties
const isWindows = computed(() => {
  return game.value?.platforms.some(
    (p) => p.platform.name === 'PC' || p.platform.name === 'Windows',
  )
})

const isMac = computed(() => {
  return game.value?.platforms.some((p) => p.platform.name === 'macOS')
})

// Get Windows requirements
const windowsRequirements = computed(() => {
  const windowsPlatform = game.value?.platforms.find(
    (p) => p.platform.name === 'PC' || p.platform.name === 'Windows',
  )
  return {
    minimum: windowsPlatform?.requirements?.minimum || null,
    recommended: windowsPlatform?.requirements?.recommended || null,
  }
})

// Get Mac requirements
const macRequirements = computed(() => {
  const macPlatform = game.value?.platforms.find((p) => p.platform.name === 'macOS')
  return {
    minimum: macPlatform?.requirements?.minimum || null,
    recommended: macPlatform?.requirements?.recommended || null,
  }
})

const formatRequirements = (requirements: string): string => {
  if (!requirements) return 'Not specified'

  return requirements
    .replace(/\n/g, '<br>')
    .replace(/OS:/g, '<br><strong>OS:</strong>')
    .replace(/Processor:/g, '<strong>Processor:</strong>')
    .replace(/Memory:/g, '<strong>Memory:</strong>')
    .replace(/Graphics:/g, '<strong>Graphics:</strong>')
    .replace(/DirectX:/g, '<strong>DirectX:</strong>')
    .replace(/Storage:/g, '<strong>Storage:</strong>')
    .replace(/Sound Card:/g, '<strong>Sound Card:</strong>')
    .replace(/Network:/g, '<strong>Network:</strong>')
    .replace(/Additional Notes:/g, '<strong>Additional Notes:</strong>')
}

const tabs = computed<Tab[]>(() => {
  const availableTabs: Tab[] = []

  if (isWindows.value) {
    availableTabs.push({
      id: 'windows-tab',
      label: 'Windows',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
        viewBox="0 0 24 24" fill="none" stroke="currentColor"
        stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
        <line x1="8" y1="21" x2="16" y2="21"/>
        <line x1="12" y1="17" x2="12" y2="21"/>
      </svg>`,
      content: '',
      requirements: windowsRequirements.value,
      visible: true,
    })
  }

  if (isMac.value && (macRequirements.value.minimum || macRequirements.value.recommended)) {
    availableTabs.push({
      id: 'mac-tab',
      label: 'macOS',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
        viewBox="0 0 24 24" fill="none" stroke="currentColor"
        stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
        <line x1="8" y1="21" x2="16" y2="21"/>
        <line x1="12" y1="17" x2="12" y2="21"/>
        <circle cx="12" cy="9" r="2"/>
      </svg>`,
      content: '',
      requirements: macRequirements.value,
      visible: true,
    })
  }

  return availableTabs
})

const currentRequirements = computed(() => {
  const currentTab = tabsWithIcons.value[activeTab.value]
  return currentTab?.requirements || { minimum: null, recommended: null }
})

const activeTab = ref<number>(0)

watch(
  tabs,
  (newTabs) => {
    if (newTabs.length > 0 && activeTab.value >= newTabs.length) {
      activeTab.value = 0
    }
  },
  { immediate: true },
)

const shouldShowTabs = computed(() => {
  return tabs.value.length > 0
})

const platformDetails = computed(() => {
  if (!game.value?.platforms) return []

  return game.value.platforms
    .filter(
      (p) =>
        p.platform.name === 'PC' || p.platform.name === 'Windows' || p.platform.name === 'macOS',
    )
    .map((platformData) => ({
      name: platformData.platform.name,
      slug: platformData.platform.slug,
      requirements: platformData.requirements,
      hasRequirements: !!platformData.requirements?.minimum,
    }))
})

// Function to get platform icon
const getPlatformIcon = (platformName: string): string => {
  const icons: Record<string, string> = {
    Windows: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-13.051-1.351"/>
    </svg>`,
    PC: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-13.051-1.351"/>
    </svg>`,
    macOS: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
    </svg>`,
  }

  return icons[platformName] || icons['PC']
}

// Update tabs with proper icons
const tabsWithIcons = computed<Tab[]>(() => {
  return tabs.value.map((tab) => ({
    ...tab,
    icon: getPlatformIcon(tab.label),
  }))
})

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
      class="container pt-24 mx-auto dark:bg-gray-800 rounded-lg dark:shadow p-6 text-lg"
    >
      <h1 class="text-3xl font-bold font-ethnocentric mb-6">{{ game.name }}</h1>
      <img
        :src="game.background_image || fallbackImage"
        :alt="game.name"
        class="w-full object-cover mb-4 h-96 object-center rounded-xl"
        loading="lazy"
      />
      <div class="content-wrapper w-full flex justify-between sm:flex-row flex-col">
        <div class="left-content w-3/4 sm:w-full">
          <p class="developer">Developer:</p>
          <p class="text-2xl font-semibold mb-2">{{ game.developers[0].name }}</p>
          <div class="released text-pretty mb-2">
            <strong>Released:</strong> {{ game.released }}
          </div>
          <div class="rating text-pretty mb-2">
            <strong>Rating:</strong> {{ game.rating }} / 5 ⭐
          </div>
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
            class="hover:underline text-sm font-medium mb-4 dark:text-white text-gray-900"
          >
            <Heart
              class="inline-block mr-1"
              :class="
                isFav
                  ? 'text-red-500 fill-red-500'
                  : 'dark:text-white dark:fill-white text-gray-400 fill-gray-400'
              "
            />
            {{ isFav ? 'Remove from favorites' : 'Add to favorites' }}
          </button>
        </div>
      </div>
      <div class="description-container mb-4">
        <p
          class="description text-pretty mb-1"
          :class="isExpanded ? '' : 'line-clamp-3 sm:line-clamp-none'"
        >
          {{ game.description_raw }}
        </p>
        <button
          @click="isExpanded = !isExpanded"
          class="text-purple-500 hover:underline text-sm font-medium sm:hidden inline-block"
        >
          {{ isExpanded ? 'Read less' : 'Read more' }}
        </button>
      </div>

      <div v-if="shouldShowTabs">
        <h1 class="text-2xl font-bold mb-6 mt-24 sm:text-start text-center">Requirements</h1>
        <div class="border-b border-gray-200 dark:border-neutral-700">
          <nav
            class="flex gap-x-1 sm:justify-start justify-between"
            aria-label="Tabs"
            role="tablist"
          >
            <button
              v-for="(tab, index) in tabsWithIcons"
              :key="tab.id"
              type="button"
              @click="activeTab = index"
              :class="[
                'py-4 px-8 inline-flex items-center gap-x-2 border-b-2 text-sm whitespace-nowrap disabled:opacity-50 disabled:pointer-events-none',
                activeTab === index
                  ? 'border-purple-500 text-purple-500 font-semibold'
                  : 'border-transparent text-gray-500 hover:text-purple-500',
              ]"
              :aria-selected="activeTab === index"
              :aria-controls="tab.id"
              role="tab"
            >
              <span v-html="tab.icon"></span>
              {{ tab.label }}
            </button>
          </nav>

          <div class="mt-4">
            <div
              v-for="(tab, index) in tabsWithIcons"
              :key="tab.id + '-panel'"
              v-show="activeTab === index"
              :id="tab.id"
              role="tabpanel"
            >
              <div class="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg flex justify-between w-full">
                <div class="minimum-requirement w-1/2" v-if="currentRequirements.minimum">
                  <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                    Minimum Requirements
                  </h3>
                  <div
                    class="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border-l-4 border-blue-400"
                  >
                    <div
                      class="text-sm text-blue-700 dark:text-blue-300"
                      v-html="formatRequirements(currentRequirements.minimum)"
                    ></div>
                  </div>
                </div>

                <div
                  class="recommended-requirement w-1/2 ml-4"
                  v-if="currentRequirements.recommended"
                >
                  <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                    Recommended Requirements
                  </h3>
                  <div
                    class="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border-l-4 border-green-400"
                  >
                    <div
                      class="text-sm text-green-700 dark:text-green-300"
                      v-html="formatRequirements(currentRequirements.recommended)"
                    ></div>
                  </div>
                </div>

                <div
                  class="full-width-requirement w-full"
                  v-if="currentRequirements.minimum && !currentRequirements.recommended"
                >
                  <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                    Minimum Requirements
                  </h3>
                  <div
                    class="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border-l-4 border-blue-400"
                  >
                    <div
                      class="text-sm text-blue-700 dark:text-blue-300"
                      v-html="formatRequirements(currentRequirements.minimum)"
                    ></div>
                  </div>
                </div>

                <div
                  class="full-width-requirement w-full"
                  v-else-if="currentRequirements.recommended && !currentRequirements.minimum"
                >
                  <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                    Recommended Requirements
                  </h3>
                  <div
                    class="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border-l-4 border-green-400"
                  >
                    <div
                      class="text-sm text-green-700 dark:text-green-300"
                      v-html="formatRequirements(currentRequirements.recommended)"
                    ></div>
                  </div>
                </div>

                <!-- No requirements message -->
                <div
                  class="no-requirements-message w-full text-center py-8"
                  v-if="!currentRequirements.minimum && !currentRequirements.recommended"
                >
                  <p class="text-gray-500 dark:text-gray-400">
                    No system requirements specified for this platform
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="no-requirements mt-24 text-center">
        <h1 class="text-2xl font-bold mb-6">Requirements</h1>
        <p class="text-gray-500">No system requirements available for this game.</p>
      </div>
    </div>
  </div>
</template>
