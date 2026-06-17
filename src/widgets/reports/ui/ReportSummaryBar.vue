<script setup lang="ts">
import type { ReportSummaryView } from '@/pages/information/report/model/report.types'

defineProps<{
    summary: ReportSummaryView
}>()
</script>

<template>
    <div class="report-summary">
        <span>
            Приход: {{ summary.income }}<br>
            Расход: {{ summary.expense }}
        </span>
        <strong>
            Итого: {{ summary.total }}
        </strong>
    </div>
</template>

<style scoped>
.report-summary {
  display: flex;
  min-height: 45px;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid #c5ccd3;
  background: linear-gradient(#f4f6f8, #d9dee4);
  padding: 6px 12px;
  color: #2d3a45;
  font-size: 14px;
}

.report-summary strong {
  font-size: 16px;
}
</style>
