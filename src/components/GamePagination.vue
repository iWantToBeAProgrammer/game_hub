<template>
  <div class="flex justify-center py-12 gap-2">
    <button
      class="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 disabled:opacity-50 hover:bg-gray-300 dark:hover:bg-gray-600"
      :disabled="currentPage === 1"
      @click="$emit('change-page', currentPage - 1)"
    >
      Prev
    </button>

    <button
      v-for="page in pages"
      :key="page"
      @click="$emit('change-page', page)"
      class="px-3 py-1 rounded"
      :class="
        page === currentPage
          ? 'bg-blue-500 text-white'
          : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
      "
    >
      {{ page }}
    </button>

    <button
      class="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 disabled:opacity-50  hover:bg-gray-300 dark:hover:bg-gray-600"
      :disabled="currentPage === totalPages"
      @click="$emit('change-page', currentPage + 1)"
    >
      Next
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  currentPage: number
  totalPages: number
}>()

const pages = computed(() => {
  // Limit the number of page buttons shown
  const maxButtons = 5
  let start = Math.max(props.currentPage - Math.floor(maxButtons / 2), 1)
  let end = Math.min(start + maxButtons - 1, props.totalPages)

  if (end - start < maxButtons - 1) {
    start = Math.max(end - maxButtons + 1, 1)
  }

  return Array.from({ length: end - start + 1 }, (_, i) => start + i)
})
</script>
