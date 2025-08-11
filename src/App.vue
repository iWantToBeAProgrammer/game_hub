<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { Heart, Moon, Sun } from 'lucide-vue-next'
import { useThemeStore } from '@/stores/theme'
import { Toaster } from 'vue-sonner'
import 'vue-sonner/style.css'
const theme = useThemeStore()
</script>

<template>
  <Toaster position="top-right" />
  <div class="wrapper w-full relative min-h-screen">
    <nav
      class="w-full flex absolute top-0 z-50 justify-between items-center py-4 gap-8 px-4 font-ethnocentric bg-transparent border-b border-gray-200 dark:border-gray-700"
    >
      <div
        class="logo bg-gradient-to-r from-yellow-500 to-purple-500 px-4 py-2 rounded-md bg-clip-text"
      >
        <RouterLink to="/" class="flex items-center gap-2 text-transparent text-xl">
          GameHub
        </RouterLink>
      </div>

      <div class="user-actions flex items-center gap-4">
        <RouterLink
          to="/favorites"
          class="bg-red-500 px-4 py-2 rounded-md flex items-center gap-2 text-gray-300 cursor-pointer hover:bg-red-600 transition-[colors, transform] duration-200 ease-in hover:-translate-y-1"
        >
          <Heart :size="24" fill="currentColor" /> <span>Favorites</span>
        </RouterLink>

        <button
          @click="theme.toggleTheme()"
          class="dark-toggle rounded-full p-2 bg-gray-700 text-white cursor-pointer"
        >
          <component :is="theme.isDark ? Sun : Moon" :size="24" />
        </button>
      </div>
    </nav>

    <div class="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-200">
      <RouterView />
    </div>
  </div>
</template>
