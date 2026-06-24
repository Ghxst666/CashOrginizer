export const SYNC_ENDPOINTS = {
    HEALTH: 'health',
    STATUS: 'sync/status',
    RUN: 'sync/run',
    PUSH: 'sync/push',
    CONFLICTS: 'sync/conflicts',
    PAIRING_CREATE: 'sync/pairing/create',
    PAIRING_JOIN: 'sync/pairing/join',
    RECOVERY_CREATE: 'sync/recovery/create',
    RECOVERY_RESTORE: 'sync/recovery/restore',
} as const

export function getSyncConflictResolveEndpoint(conflictId: number | string): string {
    return `${SYNC_ENDPOINTS.CONFLICTS}/${encodeURIComponent(String(conflictId))}/resolve`
}
