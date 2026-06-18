export interface SyncCounts {
    pending?: number
    failed?: number
}

export interface SyncStatusResponse {
    enabled: boolean
    cloud_enabled: boolean
    counts?: SyncCounts
    unresolved_conflicts?: number
    last_error?: string | null
}

export interface SyncRunPartResult {
    failed?: number
    conflicts?: number
    skipped?: number
}

export interface SyncRunResponse {
    skipped?: boolean
    push?: SyncRunPartResult
    pull?: SyncRunPartResult
}

export interface SyncConflict {
    id: number | string
    entity_type?: string
    entity_id?: number | string
    local?: unknown
    remote?: unknown
    message?: string
    created_at?: string
}

export type SyncConflictResolution = 'local' | 'remote'

export interface ResolveSyncConflictRequest {
    resolution: SyncConflictResolution
}
