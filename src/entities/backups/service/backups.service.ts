import { REQUEST_METHODS } from "@/shared/config/api/request.config"
import { api } from "@/shared/service/api"
import { BaseResponse } from "@/shared/types/api/request"
import { BACKUPS_ENDPOINTS, getBackupDownloadEndpoints, getBackupRestoreEndpoints } from "../config/backups.config"
import {
    BackupDownloadResponse,
    ClearDatabaseRequest,
    DownloadBackupRequest,
    GetBackupsResponse,
    RestoreBackupRequest,
} from "../types/backups.types"

export const BackupsService = {
    getBackups(): BaseResponse<GetBackupsResponse> {
        return api.makeRequest<GetBackupsResponse>({
            url: BACKUPS_ENDPOINTS.ME,
            method: REQUEST_METHODS.GET,
        })
    },

    createBackup(): BaseResponse<void> {
        return api.makeRequest<void>({
            url: BACKUPS_ENDPOINTS.CREATE,
            method: REQUEST_METHODS.POST,
        })
    },

    restoreBackup(data: RestoreBackupRequest): BaseResponse<void> {
        return requestWithFallback<void>(
            getBackupRestoreEndpoints(data.backup_id),
            url => ({
                url,
                method: REQUEST_METHODS.POST,
                data,
            }),
        )
    },

    downloadBackup(data: DownloadBackupRequest): BaseResponse<BackupDownloadResponse> {
        return requestWithFallback<BackupDownloadResponse>(
            getBackupDownloadEndpoints(data.backup_id),
            url => ({
                url,
                method: REQUEST_METHODS.POST,
                data,
                responseType: 'blob',
            }),
        )
    },

    clearDatabase(data: ClearDatabaseRequest): BaseResponse<void> {
        return api.makeRequest<void>({
            url: BACKUPS_ENDPOINTS.CLEAR,
            method: REQUEST_METHODS.POST,
            data,
        })
    },
}

async function requestWithFallback<ResponseData>(
    urls: string[],
    createConfig: (url: string) => Parameters<typeof api.makeRequest<ResponseData>>[0],
): BaseResponse<ResponseData> {
    let lastError: unknown

    for (const url of urls) {
        try {
            return await api.makeRequest<ResponseData>(createConfig(url))
        }
        catch (error: any) {
            if (error?.response?.status !== 404) {
                throw error
            }

            lastError = error
        }
    }

    throw lastError
}
