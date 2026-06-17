<script setup lang="ts">
import type { ReportProperty } from '@/pages/information/report/model/report.types'

defineProps<{
    properties: ReportProperty[]
}>()
</script>

<template>
    <aside class="report-side">
        <div class="report-side__header">
            Свойства
        </div>
        <div class="report-side__body">
            <template v-if="properties.length">
                <div
                    v-for="property in properties"
                    :key="property.key"
                    class="property-row"
                >
                    <span>{{ property.label }}</span>
                    <strong>{{ property.value }}</strong>
                </div>
            </template>
        </div>
    </aside>
</template>

<style scoped>
.report-side {
  min-width: 0;
  background: #fff;
}

.report-side__header {
  display: flex;
  min-height: 45px;
  align-items: center;
  background: #cfd5d6;
  padding: 0 12px;
}

.report-side__body {
  padding: 12px 18px;
}

.property-row {
  margin-bottom: 14px;
}

.property-row span {
  display: block;
  color: #7b8794;
  font-size: 13px;
}

.property-row strong {
  display: block;
  overflow-wrap: anywhere;
  color: #2f3b46;
  font-size: 16px;
}
</style>
