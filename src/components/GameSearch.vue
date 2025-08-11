<script setup lang="ts">
import { ref, watch } from 'vue'

const emit = defineEmits<{
  (e: 'search', query: string): void
}>()

const searchTerm = ref('')

// Debounce search
let timeout: ReturnType<typeof setTimeout>
watch(searchTerm, () => {
  clearTimeout(timeout)
  timeout = setTimeout(() => {
    emit('search', searchTerm.value)
  }, 500)
})
</script>

<template>
  <div
    class="pt-56 bg-[url('@/assets/images/background.jpg')] relative bg-cover bg-center bg-no-repeat w-full"
  >
    <div class="absolute inset-0 bg-black/70 rounded-lg"></div>

    <form class="max-w-5xl w-full mx-auto font-sans relative z-10">
      <h1 class="font-ethnocentric text-4xl text-center mb-12 text-white">Find Your Game</h1>
      <label
        for="default-search"
        class="mb-2 text-lg font-medium text-gray-900 sr-only dark:text-white"
        >Search</label
      >
      <div class="flex w-full justify-center gap-4 translate-y-10">
        <div class="relative flex-1">
          <div class="absolute inset-y-0 start-0 flex items-center ps-5 pointer-events-none">
            <svg
              class="w-8 h-8 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>
          <input
            v-model="searchTerm"
            type="search"
            autocomplete="off"
            id="default-search"
            class="block w-full p-4 py-6 ps-16 text-xl text-gray-900 border border-gray-300 rounded-full bg-gray-50 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-purple-500 dark:focus:border-purple-500"
            placeholder="Search games..."
            required
          />
        </div>
      </div>
    </form>
  </div>
</template>
