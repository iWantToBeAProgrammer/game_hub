import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import GameDetail from '@/views/GameDetail.vue'
import GameFavorite from '@/views/GameFavorite.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    { path: '/game/:id', name: 'GameDetail', component: GameDetail },
    { path: '/favorites', name: 'GameFavorites', component: GameFavorite },
  ],
})

export default router
