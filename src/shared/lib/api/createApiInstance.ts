import type { ApiInstance } from "@/shared/types/api/createApiInstance"
import type {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  CreateAxiosDefaults,
  InternalAxiosRequestConfig,
} from "axios"
import type { BaseResponse } from "@/shared/types/api/request"
import type { MutexInterface } from "async-mutex"
import axios from "axios"
import { clearEmptyProperties } from "../clearEmptyProperties"
import { Mutex } from "async-mutex"
import { useAuthStore } from "@/shared/store/auth.store"
import { AUTH_ROUTE } from "@/shared/router"

type RetriableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean
}

export function createApiInstance(instanceConfig: CreateAxiosDefaults = {}): ApiInstance {
  const instance: AxiosInstance = axios.create(instanceConfig)
  const mutex = new Mutex()

  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const accessToken = localStorage.getItem('access_token')

      if (accessToken) {
        config.headers.set('Authorization', `Bearer ${accessToken}`)
      }

      config.params = clearEmptyProperties(config.params)

      return config
    },
  )

  instance.interceptors.response.use(
    response => response,
    async (error: AxiosError) => {
      if (!error.config)
        return Promise.reject(error)

      if (error.response?.status !== 401)
        return Promise.reject(error)

      const originalRequest = error.config as RetriableRequestConfig

      if (originalRequest._retry)
        return Promise.reject(error)

      originalRequest._retry = true

      if (mutex.isLocked()) {
        await mutex.waitForUnlock()

        if (!localStorage.getItem('access_token'))
          return Promise.reject(error)

        return instance.request(originalRequest)
      }

      const release: MutexInterface.Releaser = await mutex.acquire()

      try {
        const authStore = useAuthStore()

        await authStore.refresh()

        if (!authStore.isAuthenticated) {
          throw new Error('Refresh failed')
        }

        return await instance.request(originalRequest)
      }
      catch (refreshError) {
        const authStore = useAuthStore()

        authStore.setAuthenticated(false)
        localStorage.clear()
        window.location.href = AUTH_ROUTE.LOGIN.PATH

        return Promise.reject(refreshError)
      }
      finally {
        release()
      }
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
