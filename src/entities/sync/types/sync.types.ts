export interface SyncCounts {
    pending?: number
    failed?: number
    uploaded?: number
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
    remaining?: number
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

export interface PairingCreateRequest {
    current_password: string
    device_name?: string
}

export interface PairingCreateResponse {
    protocol: 'cashorg-device-pairing'
    version: 3
    pairing_code: string
    expires_at: string
    sync_account_id: string
}

export interface PairingJoinRequest {
    pairing_code: string
    device_name?: string
}

export interface PairingJoinResponse {
    status: 'OK'
    protocol: 'cashorg-device-pairing'
    version: 3
    user_id: number
    nickname: string
    sync_account_id: string
    device_id: string
    login_required: true
}

export interface RecoveryCreateRequest {
    current_password: string
}

export interface RecoveryCreateResponse {
    status: 'OK'
    protocol: 'cashorg-account-recovery'
    version: 1
    recovery_code: string
    sync_account_id: string
}

export interface RecoveryRestoreRequest {
    recovery_code: string
    device_name?: string
}

export interface RecoveryRestoreResponse {
    status: 'OK'
    protocol: 'cashorg-account-recovery'
    version: 1
    user_id: number
    nickname: string
    sync_account_id: string
    device_id: string
    login_required: true
    sync_completed: boolean
}
