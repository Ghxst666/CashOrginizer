<script setup lang="ts">
import { ArrowDown } from '@element-plus/icons-vue'
import type { ReportExportType } from '@/pages/information/report/model/report.types'

defineProps<{
    loading?: boolean
}>()

defineEmits<{
    export: [type: ReportExportType]
}>()
</script>

<template>
    <ElDropdown
        trigger="click"
        :disabled="loading"
        @command="(command: ReportExportType) => $emit('export', command)"
    >
        <ElButton size="small" :loading="loading">
            Сохранить
            <ElIcon class="ml-1">
                <ArrowDown />
            </ElIcon>
        </ElButton>
        <template #dropdown>
            <ElDropdownMenu>
                <ElDropdownItem command="pdf">
                    Сохранить список в PDF
                </ElDropdownItem>
                <ElDropdownItem command="excel">
                    Сохранить в Excel
                </ElDropdownItem>
            </ElDropdownMenu>
        </template>
    </ElDropdown>
</template>
