import { REQUEST_METHODS } from "@/shared/config/api/request.config"
import { api } from "@/shared/service/api"
import { auth } from '@/shared/service/auth'
import { BaseResponse } from "@/shared/types/api/request"
import { SYNC_ENDPOINTS, getSyncConflictResolveEndpoint } from "../config/sync.config"
import {
    ResolveSyncConflictRequest,
    PairingCreateRequest,
    PairingCreateResponse,
    PairingJoinRequest,
    PairingJoinResponse,
    RecoveryCreateRequest,
    RecoveryCreateResponse,
    RecoveryRestoreRequest,
    RecoveryRestoreResponse,
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

    push(): BaseResponse<SyncRunResponse> {
        return api.makeRequest<SyncRunResponse>({
            url: SYNC_ENDPOINTS.PUSH,
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

    createPairing(data: PairingCreateRequest): BaseResponse<PairingCreateResponse> {
        return api.makeRequest<PairingCreateResponse>({
            url: SYNC_ENDPOINTS.PAIRING_CREATE,
            method: REQUEST_METHODS.POST,
            data,
        })
    },

    joinPairing(data: PairingJoinRequest): BaseResponse<PairingJoinResponse> {
        return auth.request<PairingJoinResponse>({
            url: SYNC_ENDPOINTS.PAIRING_JOIN,
            method: REQUEST_METHODS.POST,
            data,
        })
    },

    createRecovery(data: RecoveryCreateRequest): BaseResponse<RecoveryCreateResponse> {
        return api.makeRequest<RecoveryCreateResponse>({
            url: SYNC_ENDPOINTS.RECOVERY_CREATE,
            method: REQUEST_METHODS.POST,
            data,
        })
    },

    restoreRecovery(data: RecoveryRestoreRequest): BaseResponse<RecoveryRestoreResponse> {
        return auth.request<RecoveryRestoreResponse>({
            url: SYNC_ENDPOINTS.RECOVERY_RESTORE,
            method: REQUEST_METHODS.POST,
            data,
        })
    },
}
