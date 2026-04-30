import { AxiosRequestConfig } from "axios"
import { BaseResponse } from "./request"

export type MakeRequest = <ResponseData = any, RequestData = any>(
  config: AxiosRequestConfig<RequestData>,
) => BaseResponse<ResponseData>

export interface ApiInstance {
  makeRequest: MakeRequest
}