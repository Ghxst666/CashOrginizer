import { defineStore } from "pinia"
import { ref, watch } from "vue"

const SEARCH_DEBOUNCE_MS = 300

export const useHeaderSearchStore = defineStore('header-search', () => {
    const query = ref('')
    const debouncedQuery = ref('')
    let debounceTimer: ReturnType<typeof window.setTimeout> | null = null

    watch(
        query,
        (value) => {
            if (debounceTimer) {
                window.clearTimeout(debounceTimer)
            }

            debounceTimer = window.setTimeout(() => {
                debouncedQuery.value = value.trim()
            }, SEARCH_DEBOUNCE_MS)
        },
        { immediate: true },
    )

    function clear(): void {
        if (debounceTimer) {
            window.clearTimeout(debounceTimer)
            debounceTimer = null
        }

        query.value = ''
        debouncedQuery.value = ''
    }

    return {
        clear,
        debouncedQuery,
        query,
    }
})
