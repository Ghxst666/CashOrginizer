import { ApiInstance } from "@/shared/types/api/createApiInstance"
import axios, { AxiosInstance, AxiosRequestConfig, CreateAxiosDefaults, InternalAxiosRequestConfig } from "axios"
import { clearEmptyProperties } from "../clearEmptyProperties"
import { BaseResponse } from "@/shared/types/api/request"

export function createApiInstance(instanceConfig: CreateAxiosDefaults = {}): ApiInstance {
  const instance: AxiosInstance = axios.create(instanceConfig)

  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      config.params = clearEmptyProperties(config.params)
      return config
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