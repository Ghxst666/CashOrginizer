import { REQUEST_METHODS } from "@/shared/config/api/request.config"
import { api } from "@/shared/service/api"
import { BaseResponse } from "@/shared/types/api/request"
import { SYNC_ENDPOINTS, getSyncConflictResolveEndpoint } from "../config/sync.config"
import {
    ResolveSyncConflictRequest,
    SyncConflict,
    SyncRunResponse,
    SyncStatusResponse,
} from "../types/sync.types"

export const SyncService = {
    health(): BaseResponse<void> {
        return api.makeRequest<void>({
            url: SYNC_ENDPOINTS.HEALTH,
            method: REQUEST_METHODS.GET,
        })
    },

    getStatus(): BaseResponse<SyncStatusResponse> {
        return api.makeRequest<SyncStatusResponse>({
            url: SYNC_ENDPOINTS.STATUS,
            method: REQUEST_METHODS.GET,
        })
    },

    run(): BaseResponse<SyncRunResponse> {
        return api.makeRequest<SyncRunResponse>({
            url: SYNC_ENDPOINTS.RUN,
            method: REQUEST_METHODS.POST,
        })
    },

    getConflicts(): BaseResponse<SyncConflict[]> {
        return api.makeRequest<SyncConflict[]>({
            url: SYNC_ENDPOINTS.CONFLICTS,
            method: REQUEST_METHODS.GET,
        })
    },

    resolveConflict(conflictId: number | string, data: ResolveSyncConflictRequest): BaseResponse<void> {
        return api.makeRequest<void>({
            url: getSyncConflictResolveEndpoint(conflictId),
            method: REQUEST_METHODS.POST,
            data,
        })
    },
}
