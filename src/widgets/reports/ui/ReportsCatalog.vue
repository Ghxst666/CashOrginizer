<script setup lang="ts">
import type { ReportDefinition } from '@/pages/information/report/model/report.types'

defineProps<{
    reports: ReportDefinition[]
}>()

defineEmits<{
    select: [report: ReportDefinition]
}>()
</script>

<template>
    <div class="h-full bg-white">
        <div class="report-list">
            <button
                v-for="report in reports"
                :key="report.code"
                class="report-list__item"
                type="button"
                @click="$emit('select', report)"
            >
                <ElIcon class="report-list__icon" size="28">
                    <component :is="report.icon" />
                </ElIcon>
                <span class="min-w-0">
                    <span class="report-list__title">{{ report.listTitle }}</span>
                    <span class="report-list__description">{{ report.description }}</span>
                </span>
            </button>
        </div>
    </div>
</template>

<style scoped>
.report-list {
  border-top: 1px solid #dcdfe6;
}

.report-list__item {
  display: flex;
  width: 100%;
  align-items: center;
  gap: 12px;
  border: 0;
  border-bottom: 1px solid #e4e7ed;
  background: #fff;
  padding: 8px 16px;
  text-align: left;
  cursor: pointer;
}

.report-list__item:hover {
  background: #f4f8fb;
}

.report-list__icon {
  color: #7d3fb3;
}

.report-list__title,
.report-list__description {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.report-list__title {
  color: #1f2d3d;
  font-size: 14px;
}

.report-list__description {
  color: #7b8794;
  font-size: 12px;
}
</style>
