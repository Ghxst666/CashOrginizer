import { ApiInstance } from "@/shared/types/api/createApiInstance"
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, CreateAxiosDefaults, InternalAxiosRequestConfig } from "axios"
import { clearEmptyProperties } from "../clearEmptyProperties"
import { BaseResponse } from "@/shared/types/api/request"
import { Mutex, MutexInterface } from "async-mutex"
import { authService } from "@/shared/service/auth.service"
import { useAuthStore } from "@/shared/store/auth.store"

export function createApiInstance(instanceConfig: CreateAxiosDefaults = {}): ApiInstance {
  const instance: AxiosInstance = axios.create(instanceConfig)
  const mutex = new Mutex()

  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = localStorage.getItem('access_token')

      if (token) {
        config.headers = config.headers || {}
        config.headers.Authorization = `Bearer ${token}`
      }

      config.params = clearEmptyProperties(config.params)

      return config
    },
  )

  instance.interceptors.response.use(
    undefined,
    async (error: AxiosError) => {
      if (!error.config)
        return Promise.reject(error)

      if (error.response?.status === 401 && !error.config.url?.includes('/auth/refresh') && !window.location.pathname.includes('/auth')) {
        const authStore = useAuthStore()

        if (!authStore.isAuthenticated) {
          return Promise.reject(error)
        }
        if (mutex.isLocked()) {
          await mutex.waitForUnlock()
        }
        else {
          const release: MutexInterface.Releaser = await mutex.acquire()
          try {
            const refreshToken = localStorage.getItem('refresh_token')
            if (!refreshToken) {
              throw new Error('No refresh token')
            }
            const res = await authService.refresh(refreshToken)
            localStorage.setItem('refresh_token', res.data.refresh_token)
            localStorage.setItem('access_token', res.data.access_token)
          }
          catch (refreshError) {
            const authStore = useAuthStore()

            authStore.setAuthenticated(false)
            localStorage.clear()
            window.location.href = '/auth'

            return Promise.reject(refreshError)
          }
          finally {
            release()
          }
        }
        return instance.request(error.config)
      }
      return Promise.reject(error)
    },
  )

  function makeRequest<
    ResponseData = any,
    RequestData = any,
  >(
    config: AxiosRequestConfig<RequestData>,
  ): BaseResponse<ResponseData> {
    return instance.request(config)
  }

  return {
    makeRequest,
  }
}