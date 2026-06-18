export interface BackupResponse {
    id?: number | string
    backup_id?: number | string
    filename?: string | null
    name?: string | null
    created_at?: string | null
    size?: number | string | null
    [key: string]: unknown
}

export type GetBackupsResponse = BackupResponse[]

export interface BackupActionRequest {
    backup_id: number | string
}

export interface RestoreBackupRequest extends BackupActionRequest {
    current_password: string
    dry_run: boolean
    confirm: boolean
    mode: 'replace'
}

export interface DownloadBackupRequest extends BackupActionRequest {
    current_password: string
}

export type BackupDownloadResponse = Blob

export interface ClearDatabaseRequest {
    current_password: string
    dry_run: boolean
    confirm: boolean
}
