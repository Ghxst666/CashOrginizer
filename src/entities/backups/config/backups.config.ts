export const BACKUPS_ENDPOINTS = {
    ME: 'backups/me',
    CREATE: 'backups/me/create',
    CLEAR: 'backups/me/clear',
} as const

export function getBackupRestoreEndpoint(filename: string): string {
    return `backups/me/restore/${encodeURIComponent(filename)}`
}

export function getBackupDownloadEndpoint(filename: string): string {
    return `backups/me/download/${encodeURIComponent(filename)}`
}
