<script setup lang="ts">
import { ref } from 'vue';
import ProjectHeader from './ProjectHeader.vue';
import ProjectTable from './ProjectTable.vue';
import { useProjectsQuery } from '@/entities/project';
import NewProject from '@/shared/ui/NewProject.vue';
import SidePropertiesPanel from '@/shared/ui/SidePropertiesPanel.vue';
import type { projectsRowData } from '@/entities/project/types/project.types';
import { useRouter } from 'vue-router';
import { TRANSACTION_ROUTE } from '@/shared/router';

interface ProjectPeriodFilter {
    period: string
    date_from?: string
    date_to?: string
}

const periodFilter = ref<ProjectPeriodFilter>({ period: 'all_period' })
const { data } = useProjectsQuery(periodFilter)

const newProject = ref<boolean>(false)
const isPropertiesOpen = ref(false)
const selectedProject = ref<projectsRowData | null>(null)
const router = useRouter()

function handleOpenProjectDialog() {
    newProject.value = true
}

function handleShowProperties() {
    isPropertiesOpen.value = true
}

function handleSelectProject(project: projectsRowData) {
    selectedProject.value = project
}

function handleOpenPayments(project: projectsRowData) {
    router.push({
        name: TRANSACTION_ROUTE.PAYMENTS.NAME,
        query: {
            project_id: String(project.id),
            project_title: project.title,
        },
    })
}

function handleSelectPeriod(filter: ProjectPeriodFilter) {
    periodFilter.value = filter
}

function formatMoney(value?: string | number | null) {
    const numericValue = Number(value || 0)

    return `${numericValue.toLocaleString('ru-RU', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })} р`
}

function projectStatusTitle(status: string) {
    return status === 'closed'
        ? 'Закрыт'
        : 'Открыт'
}

function periodTitle() {
    return data.value?.period.label || 'Весь период'
}

function childrenTitles(project: projectsRowData) {
    return project.children?.map(child => child.title).join(', ') || 'Подпроектов нет'
}
</script>

<template>
    <NewProject 
        v-model="newProject"
        title="Новый проект"
        v-if="data"
        :projects="data.rows"
    />
    <div class="h-full flex bg-[#ffffff]">
        <div class="flex-1 min-w-0 flex flex-col">
            <ProjectHeader
                :selected-period="periodFilter.period"
                :date-from="periodFilter.date_from"
                :date-to="periodFilter.date_to"
                @open-dialog="handleOpenProjectDialog"
                @select-period="handleSelectPeriod"
                @show-properties="handleShowProperties"
            />
            <div class="flex-1 min-h-0">
                <ProjectTable
                    v-if="data"
                    :data="data"
                    @select="handleSelectProject"
                    @open-payments="handleOpenPayments"
                />
            </div>
        </div>

        <SidePropertiesPanel
            v-model="isPropertiesOpen"
            title="Свойства проекта"
            width="400px"
        >
            <template v-if="selectedProject">
                <ElForm
                    :model="selectedProject"
                    label-position="top"
                    class="project-properties-form"
                >
                    <ElFormItem label="Название">
                        <span class="text-[#374151] font-semibold">{{ selectedProject.title }}</span>
                    </ElFormItem>
                    <ElFormItem label="Период">
                        <span class="text-[#374151] font-semibold">{{ periodTitle() }}</span>
                    </ElFormItem>
                    <ElFormItem label="Итого">
                        <span class="text-[#374151] font-semibold">{{ selectedProject.total_formatted }}</span>
                    </ElFormItem>
                    <ElFormItem label="Доход">
                        <span class="text-[#6b7280]">{{ selectedProject.income_formatted }}</span>
                    </ElFormItem>
                    <ElFormItem label="Расход">
                        <span class="text-[#6b7280]">{{ selectedProject.expense_formatted }}</span>
                    </ElFormItem>
                    <ElFormItem label="Включенные подпроекты">
                        <span class="text-[#374151] font-semibold">{{ childrenTitles(selectedProject) }}</span>
                    </ElFormItem>
                    <ElFormItem label="Лимит по проекту">
                        <span class="text-[#374151] font-semibold">{{ formatMoney(selectedProject.money_limit) }}</span>
                    </ElFormItem>
                    <ElFormItem label="Состояние">
                        <span class="text-[#374151] font-semibold">{{ projectStatusTitle(selectedProject.status) }}</span>
                    </ElFormItem>
                    <ElFormItem label="Примечание">
                        <span class="text-[#6b7280]">{{ selectedProject.note || 'Примечание не задано' }}</span>
                    </ElFormItem>
                </ElForm>
            </template>

            <template v-else>
                <div class="h-full flex items-center justify-center text-[#9ca3af] text-sm">
                    Выбери проект в таблице, чтобы посмотреть свойства
                </div>
            </template>
        </SidePropertiesPanel>
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

:deep(.project-properties-form .el-form-item__label) {
  color: #000;
  font-size: 16px;
}
</style>
