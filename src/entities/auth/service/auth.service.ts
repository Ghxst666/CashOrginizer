import { REQUEST_METHODS } from "@/shared/config/api/request.config"
import { api } from "@/shared/service/api"
import { auth } from "@/shared/service/auth"
import { BaseResponse } from "@/shared/types/api/request"
import { AUTH_ENDPOINTS } from "../config/auth.config"
import {
    RecoveryCodesReissueRequestData,
    RecoveryCodesResponse,
    RegisterRequestData,
    ResetPasswordRequestData,
} from "../types/auth.types"

export const AuthEntityService = {
    register(data: RegisterRequestData): BaseResponse<RecoveryCodesResponse> {
        return auth.request({
            url: AUTH_ENDPOINTS.REGISTER,
            method: REQUEST_METHODS.POST,
            data,
        })
    },

    resetPassword(data: ResetPasswordRequestData): BaseResponse<void> {
        return auth.request({
            url: AUTH_ENDPOINTS.RESET_PASSWORD,
            method: REQUEST_METHODS.POST,
            data,
        })
    },

    reissueRecoveryCodes(data: RecoveryCodesReissueRequestData): BaseResponse<RecoveryCodesResponse> {
        return api.makeRequest<RecoveryCodesResponse>({
            url: AUTH_ENDPOINTS.RECOVERY_CODES_REISSUE,
            method: REQUEST_METHODS.POST,
            data,
        })
    },
}
