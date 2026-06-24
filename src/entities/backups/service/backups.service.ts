import { REQUEST_METHODS } from '@/shared/config/api/request.config'
import { api } from '@/shared/service/api'
import type { BaseResponse } from '@/shared/types/api/request'
import { BACKUPS_ENDPOINTS, getBackupDownloadEndpoint, getBackupRestoreEndpoint } from '../config/backups.config'
import type {
    BackupClearResponse,
    BackupCreateResponse,
    BackupDownloadResponse,
    BackupRestoreResponse,
    ClearDatabaseRequest,
    DownloadBackupRequest,
    GetBackupsResponse,
    RestoreBackupRequest,
} from '../types/backups.types'

export const BackupsService = {
    getBackups(limit?: number): BaseResponse<GetBackupsResponse> {
        return api.makeRequest<GetBackupsResponse>({
            url: BACKUPS_ENDPOINTS.ME,
            method: REQUEST_METHODS.GET,
            params: { limit },
        })
    },

    createBackup(): BaseResponse<BackupCreateResponse> {
        return api.makeRequest<BackupCreateResponse>({
            url: BACKUPS_ENDPOINTS.CREATE,
            method: REQUEST_METHODS.POST,
        })
    },

    restoreBackup(filename: string, data: RestoreBackupRequest): BaseResponse<BackupRestoreResponse> {
        return api.makeRequest<BackupRestoreResponse>({
            url: getBackupRestoreEndpoint(filename),
            method: REQUEST_METHODS.POST,
            data,
        })
    },

    downloadBackup(filename: string, data: DownloadBackupRequest): BaseResponse<BackupDownloadResponse> {
        return api.makeRequest<BackupDownloadResponse>({
            url: getBackupDownloadEndpoint(filename),
            method: REQUEST_METHODS.POST,
            data,
            responseType: 'blob',
        })
    },

    clearDatabase(data: ClearDatabaseRequest): BaseResponse<BackupClearResponse> {
        return api.makeRequest<BackupClearResponse>({
            url: BACKUPS_ENDPOINTS.CLEAR,
            method: REQUEST_METHODS.POST,
            data,
        })
    },
}
