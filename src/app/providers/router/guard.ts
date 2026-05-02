import { AUTH_ROUTE, SYSTEM_ROUTE } from "@/shared/router"
import { useAuthStore } from "@/shared/store/auth.store"
import { NavigationGuardReturn, RouteLocationNormalized } from "vue-router"

export async function requireGuest(
  _to: RouteLocationNormalized,
  _from: RouteLocationNormalized,
): Promise<NavigationGuardReturn> {
  const authStore = useAuthStore()

  if (authStore.isAuthenticated === null) {
    const refreshToken = localStorage.getItem('refresh_token')
    if (refreshToken) {
        await authStore.refresh()
    } else {
        authStore.setAuthenticated(false)
    }
  }

  if (authStore.isAuthenticated)
    return { name: SYSTEM_ROUTE.BASE.NAME }
}

export async function requireAuth(
  _to: RouteLocationNormalized,
  _from: RouteLocationNormalized,
): Promise<NavigationGuardReturn> {
  const authStore = useAuthStore()

  if (authStore.isAuthenticated === null) {
    await authStore.refresh()
  }

  if (!authStore.isAuthenticated) {
    return { name: AUTH_ROUTE.BASE.NAME }
  }
}