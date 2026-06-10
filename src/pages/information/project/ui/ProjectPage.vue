<script setup lang="ts">
import { ref } from 'vue';
import ProjectHeader from './ProjectHeader.vue';
import ProjectTable from './ProjectTable.vue';
import { useProjectsQuery } from '@/entities/project';
import NewProject from '@/shared/ui/NewProject.vue';

interface ProjectPeriodFilter {
    period: string
    date_from?: string
    date_to?: string
}

const periodFilter = ref<ProjectPeriodFilter>({ period: 'all_period' })
const { data } = useProjectsQuery(periodFilter)

const newProject = ref<boolean>(false)

function handleOpenProjectDialog() {
    newProject.value = true
}

function handleSelectPeriod(filter: ProjectPeriodFilter) {
    periodFilter.value = filter
}
</script>

<template>
    <NewProject 
        v-model="newProject"
        title="Новый проект"
        v-if="data"
        :projects="data.rows"
    />
    <div class="h-full flex flex-col bg-[#ffffff]">
        <ProjectHeader
            :selected-period="periodFilter.period"
            :date-from="periodFilter.date_from"
            :date-to="periodFilter.date_to"
            @open-dialog="handleOpenProjectDialog"
            @select-period="handleSelectPeriod"
        />
        <div class="flex-1 min-h-0">
            <ProjectTable v-if="data" :data="data" />
        </div>
    </div>
</template>

<style scoped>
.payment-form {
  padding: 16px;
  border-radius: 12px;
  background: #eef3f4;

  box-shadow: 
    0 2px 8px rgba(0, 0, 0, 0.06),
    0 8px 24px rgba(0, 0, 0, 0.04);
}

.payment-form :deep(.el-form-item__label) {
  font-weight: 700;
  color: #2f3a3d;
  margin-bottom: 6px;
}

.payment-form :deep(.el-input__wrapper),
.payment-form :deep(.el-select__wrapper),
.payment-form :deep(.el-date-editor.el-input__wrapper) {
  border-radius: 8px;
  box-shadow: 0 0 0 1px rgba(120, 140, 145, 0.18) inset;
}
</style>
