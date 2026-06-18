import { defineStore } from "pinia"
import { ref } from "vue"
import { useRouter } from "vue-router"
import { LoginRequestData } from "../types/api/auth.types"
import { authService } from "../service/auth.service"
import { TRANSACTION_ROUTE } from "../router"
import axios from "axios"
import { ApiErrorResponse } from "../types/api/error"
import { errorMessageHandler } from "../lib/api/errorMessageHandler"

export const useAuthStore = defineStore('auth', () => {
  const router = useRouter()

  const isAuthenticated = ref<boolean | null>(null)

  function setAuthenticated(value: boolean | null): void {
    isAuthenticated.value = value
  }

  async function login(data: LoginRequestData): Promise<void> {
    try {
      const response = await authService.login(data)
      localStorage.setItem('refresh_token', response.data.refresh_token)
      localStorage.setItem('access_token', response.data.access_token)
      setAuthenticated(true)
      router.push({ name: TRANSACTION_ROUTE.BASE.NAME })
    }
    catch (error) {
      setAuthenticated(false)
      if (axios.isAxiosError<ApiErrorResponse>(error)) {
        errorMessageHandler(error)
      }
    }
  }

  async function refresh(): Promise<void> {
    try {
        const refreshToken = localStorage.getItem('refresh_token')
        if (!refreshToken) throw new Error('No refresh token')

        const res = await authService.refresh(refreshToken)
        localStorage.setItem('refresh_token', res.data.refresh_token)
        localStorage.setItem('access_token', res.data.access_token)

        setAuthenticated(true)
    }
    catch (error) {
      setAuthenticated(false)
      if (axios.isAxiosError<ApiErrorResponse>(error)) {
        errorMessageHandler(error)
      }
    }
  }

  async function logout(): Promise<void> {
    try {
      await authService.logout()
    }
    finally {
      setAuthenticated(false)
      window.location.href = '/auth'
    }
  }

  return {
    login,
    refresh,
    logout,
    isAuthenticated,
    setAuthenticated,
  }
})
