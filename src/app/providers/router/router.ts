import { createRouter, createWebHistory } from 'vue-router'
import { routes } from './routes'

export const routerProvider = createRouter({
  history: createWebHistory(),
  routes,
})