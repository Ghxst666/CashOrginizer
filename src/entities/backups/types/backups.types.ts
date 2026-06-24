export interface BackupCreateResponse {
    user_id: number
    provider: string
    storage_path: string
    filename: string
    created_at: string
    size_bytes: number
    tables_count: Record<string, number>
}

export interface BackupListItem {
    filename: string
    storage_path: string
    size_bytes: number
    last_modified: string
}

export type GetBackupsResponse = BackupListItem[]
export type BackupRestoreMode = 'replace' | 'merge'

export interface BackupRestoreTableSummary {
    existing_count: number
    backup_count: number
    would_insert: number
    would_skip: number
    would_delete: number
}

export interface BackupRestoreResponse {
    user_id: number
    filename: string
    mode: BackupRestoreMode
    dry_run: boolean
    applied: boolean
    summary: Record<string, BackupRestoreTableSummary>
}

export interface RestoreBackupRequest {
    mode: BackupRestoreMode
    dry_run: boolean
    confirm?: boolean
    current_password?: string
}

export interface DownloadBackupRequest {
    current_password: string
}

export type BackupDownloadResponse = Blob

export interface BackupClearTableSummary {
    existing_count: number
    would_delete: number
}

export interface BackupClearResponse {
    user_id: number
    dry_run: boolean
    applied: boolean
    summary: Record<string, BackupClearTableSummary>
}

export interface ClearDatabaseRequest {
    dry_run: boolean
    confirm?: boolean
    current_password?: string
}
