export const SYNC_ENDPOINTS = {
    HEALTH: 'health',
    STATUS: 'sync/status',
    RUN: 'sync/run',
    CONFLICTS: 'sync/conflicts',
} as const

export function getSyncConflictResolveEndpoint(conflictId: number | string): string {
    return `${SYNC_ENDPOINTS.CONFLICTS}/${encodeURIComponent(String(conflictId))}/resolve`
}
