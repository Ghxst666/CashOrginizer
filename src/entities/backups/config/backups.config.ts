export const BACKUPS_ENDPOINTS = {
    BASE: 'backups',
    ME: 'backups/me',
    CREATE: 'backups/me/create',
    RESTORE: 'backups/me/restore',
    DOWNLOAD: 'backups/me/download',
    CLEAR: 'backups/me/clear',
} as const

export function getBackupRestoreEndpoints(backupId: number | string): string[] {
    const id = encodeURIComponent(String(backupId))

    return [
        `backups/me/${id}/restore`,
        `backups/me/restore/${id}`,
        BACKUPS_ENDPOINTS.RESTORE,
    ]
}

export function getBackupDownloadEndpoints(backupId: number | string): string[] {
    const id = encodeURIComponent(String(backupId))

    return [
        `backups/me/${id}/download`,
        `backups/me/download/${id}`,
        BACKUPS_ENDPOINTS.DOWNLOAD,
    ]
}
