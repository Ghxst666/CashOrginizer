import { AUTH_ENDPOINTS } from "../config/api/auth.config"
import { REQUEST_METHODS } from "../config/api/request.config"
import { LoginRequestData, LoginResponse, RefreshResponse } from "../types/api/auth.types"
import { BaseResponse } from "../types/api/request"
import { auth } from "./auth"

export const authService = {
  login(data: LoginRequestData): BaseResponse<LoginResponse> {
    return auth.request({
      url: AUTH_ENDPOINTS.LOGIN,
      method: REQUEST_METHODS.POST,
      data,
    })
  },
  refresh(token: string): BaseResponse<RefreshResponse> {
    return auth.request({
      url: AUTH_ENDPOINTS.REFRESH,
      method: REQUEST_METHODS.POST,
      data: { refresh_token: token }
    })
  },
  logout(): BaseResponse<void> {
    return auth.request({
      url: AUTH_ENDPOINTS.LOGOUT,
      method: REQUEST_METHODS.POST,
    })
  },
}