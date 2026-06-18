import { SyncConflict, SyncConflictResolution, SyncRunResponse, SyncService, SyncStatusResponse } from "@/entities/sync"
import { defineStore } from "pinia"
import { computed, ref } from "vue"

const STATUS_POLL_INTERVAL_MS = 45_000
const RUN_COOLDOWN_MS = 20_000

export const useSyncStore = defineStore('sync', () => {
    const status = ref<SyncStatusResponse | null>(null)
    const lastRunResult = ref<SyncRunResponse | null>(null)
    const conflicts = ref<SyncConflict[]>([])
    const isHealthChecked = ref(false)
    const isCheckingStatus = ref(false)
    const isSyncing = ref(false)
    const isLoadingConflicts = ref(false)
    const isResolvingConflict = ref(false)
    const errorMessage = ref<string | null>(null)
    const lastRunAt = ref<number | null>(null)
    const lastCompletedAt = ref<number | null>(null)
    const started = ref(false)

    let pollTimer: ReturnType<typeof window.setInterval> | null = null

    const isCloudConfigured = computed(() => Boolean(status.value?.enabled && status.value?.cloud_enabled))
    const pendingCount = computed(() => status.value?.counts?.pending ?? 0)
    const failedCount = computed(() => status.value?.counts?.failed ?? 0)
    const unresolvedConflictsCount = computed(() => status.value?.unresolved_conflicts ?? 0)
    const hasRunCooldown = computed(() => {
        if (!lastRunAt.value)
            return false

        return Date.now() - lastRunAt.value < RUN_COOLDOWN_MS
    })

    async function checkHealth(): Promise<void> {
        await SyncService.health()
        isHealthChecked.value = true
    }

    async function refreshStatus(): Promise<void> {
        if (isCheckingStatus.value)
            return

        try {
            isCheckingStatus.value = true
            const response = await SyncService.getStatus()

            status.value = response.data
            errorMessage.value = null

            if ((response.data.unresolved_conflicts ?? 0) > 0) {
                void loadConflicts()
            }
        }
        catch {
            errorMessage.value = 'Не удалось получить состояние синхронизации'
        }
        finally {
            isCheckingStatus.value = false
        }
    }

    async function runSync(): Promise<void> {
        if (isSyncing.value)
            return

        try {
            isSyncing.value = true
            lastRunResult.value = null
            lastRunAt.value = Date.now()
            const response = await SyncService.run()

            lastRunResult.value = response.data
            await refreshStatus()

            if (unresolvedConflictsCount.value > 0) {
                await loadConflicts()
            }

            lastCompletedAt.value = Date.now()
            errorMessage.value = null
        }
        catch {
            await refreshStatus()
            errorMessage.value = 'Не удалось выполнить синхронизацию'
        }
        finally {
            isSyncing.value = false
        }
    }

    async function runSyncWithCooldown(): Promise<void> {
        if (!isCloudConfigured.value || hasRunCooldown.value)
            return

        await runSync()
    }

    async function loadConflicts(): Promise<void> {
        if (isLoadingConflicts.value)
            return

        try {
            isLoadingConflicts.value = true
            const response = await SyncService.getConflicts()

            conflicts.value = response.data
            errorMessage.value = null
        }
        catch {
            errorMessage.value = 'Не удалось загрузить конфликты синхронизации'
        }
        finally {
            isLoadingConflicts.value = false
        }
    }

    async function resolveConflict(conflictId: number | string, resolution: SyncConflictResolution): Promise<void> {
        try {
            isResolvingConflict.value = true
            await SyncService.resolveConflict(conflictId, { resolution })
            conflicts.value = conflicts.value.filter(conflict => conflict.id !== conflictId)
            await runSync()
        }
        finally {
            isResolvingConflict.value = false
        }
    }

    async function handleFocus(): Promise<void> {
        if (document.visibilityState !== 'visible')
            return

        await refreshStatus()
        await runSyncWithCooldown()
    }

    async function handleOnline(): Promise<void> {
        await refreshStatus()
        await runSyncWithCooldown()
    }

    async function start(): Promise<void> {
        if (started.value)
            return

        started.value = true

        try {
            await checkHealth()
            await refreshStatus()
        }
        catch {
            errorMessage.value = 'Локальный backend недоступен'
        }

        pollTimer = window.setInterval(() => {
            if (document.visibilityState === 'visible') {
                void refreshStatus()
            }
        }, STATUS_POLL_INTERVAL_MS)

        document.addEventListener('visibilitychange', handleFocus)
        window.addEventListener('focus', handleFocus)
        window.addEventListener('online', handleOnline)
    }

    function stop(): void {
        if (pollTimer) {
            window.clearInterval(pollTimer)
            pollTimer = null
        }

        document.removeEventListener('visibilitychange', handleFocus)
        window.removeEventListener('focus', handleFocus)
        window.removeEventListener('online', handleOnline)
        started.value = false
    }

    return {
        conflicts,
        errorMessage,
        failedCount,
        isCheckingStatus,
        isCloudConfigured,
        isHealthChecked,
        isLoadingConflicts,
        isResolvingConflict,
        isSyncing,
        lastCompletedAt,
        lastRunResult,
        loadConflicts,
        pendingCount,
        refreshStatus,
        resolveConflict,
        runSync,
        runSyncWithCooldown,
        start,
        status,
        stop,
        unresolvedConflictsCount,
    }
})
