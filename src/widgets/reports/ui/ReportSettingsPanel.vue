<script setup lang="ts">
import { computed } from 'vue'
import { PERIOD_OPTIONS } from '@/pages/information/report/model/report.config'
import type { ReportDefinition, ReportFilters, SelectOption } from '@/pages/information/report/model/report.types'

const props = defineProps<{
    report: ReportDefinition
    accountOptions: SelectOption[]
    purposeOptions: SelectOption[]
    categoryOptions: SelectOption[]
    projectOptions: SelectOption[]
}>()

const emit = defineEmits<{
    loadOptions: [type: 'accounts' | 'purposes' | 'categories' | 'projects']
}>()

const filters = defineModel<ReportFilters>('filters', { required: true })
const customDateRange = defineModel<string[]>('customDateRange', { required: true })
const activeField = defineModel<string>('activeField', { required: true })

const periodLabel = computed(() => {
    const [dateFrom, dateTo] = customDateRange.value

    if (filters.value.period === 'custom' && dateFrom && dateTo) {
        return `${formatDate(dateFrom)} - ${formatDate(dateTo)}`
    }

    return PERIOD_OPTIONS.find(option => option.value === filters.value.period)?.label ?? 'Период'
})

const accountLabels = computed(() => selectedOptionsLabel(filters.value.accounts_ids, props.accountOptions, 'Все счета'))
const purposeLabels = computed(() => selectedOptionsLabel(filters.value.purposes_ids, props.purposeOptions, 'Все названия'))
const categoryLabels = computed(() => selectedOptionsLabel(filters.value.categories_ids, props.categoryOptions, 'Все категории'))
const projectLabels = computed(() => selectedOptionsLabel(filters.value.projects_ids, props.projectOptions, 'Все проекты'))

function activateField(field: string, type?: 'accounts' | 'purposes' | 'categories' | 'projects') {
    activeField.value = field
    if (type) emit('loadOptions', type)
}

function selectedOptionsLabel(ids: number[], options: SelectOption[], emptyLabel: string) {
    if (!ids.length) return emptyLabel

    const optionById = new Map(options.map(option => [Number(option.value), option.label]))

    return ids.map(id => optionById.get(id) ?? String(id)).join(', ')
}

function formatDate(value: string) {
    const [year, month, day] = value.split('-')
    if (!year || !month || !day) return value

    return `${day}.${month}.${year}`
}
</script>

<template>
    <ElScrollbar class="settings-panel">
      <div class="settings-panel__content">
        <div class="settings-row">
            <span>Название отчета</span>
            <ElInput v-model="filters.title" class="settings-control" clearable @focus="activeField = 'title'" />
        </div>
        <div class="settings-row">
            <span>Примечание</span>
            <ElInput v-model="filters.note" class="settings-control" type="textarea" :rows="2" clearable @focus="activeField = 'note'" />
        </div>
        <div class="settings-row">
            <span>Дата</span>
            <ElInput
                :model-value="periodLabel"
                class="settings-control settings-control--picker"
                readonly
                @focus="activateField('period')"
                @click="activateField('period')"
            />
        </div>
        <div class="settings-row">
            <span>Счет</span>
            <ElInput
                :model-value="accountLabels"
                class="settings-control settings-control--picker"
                readonly
                @focus="activateField('accounts_ids', 'accounts')"
                @click="activateField('accounts_ids', 'accounts')"
            />
        </div>
        <div class="settings-row">
            <span>Название</span>
            <ElInput
                :model-value="purposeLabels"
                class="settings-control settings-control--picker"
                readonly
                @focus="activateField('purposes_ids', 'purposes')"
                @click="activateField('purposes_ids', 'purposes')"
            />
        </div>
        <div class="settings-row">
            <span>Категория</span>
            <ElInput
                :model-value="categoryLabels"
                class="settings-control settings-control--picker"
                readonly
                @focus="activateField('categories_ids', 'categories')"
                @click="activateField('categories_ids', 'categories')"
            />
        </div>
        <div class="settings-row">
            <span>Проект</span>
            <ElInput
                :model-value="projectLabels"
                class="settings-control settings-control--picker"
                readonly
                @focus="activateField('projects_ids', 'projects')"
                @click="activateField('projects_ids', 'projects')"
            />
        </div>
        <div class="settings-row">
            <span>Текст</span>
            <ElInput
                v-model="filters.text"
                class="settings-control"
                clearable
                @focus="activeField = 'text'"
            />
        </div>
        <div class="settings-row">
            <span>Сумма</span>
            <div class="settings-control settings-control--inline">
                <ElInput v-model="filters.amount_from" placeholder="От" clearable @focus="activeField = 'amount'" />
                <ElInput v-model="filters.amount_to" placeholder="До" clearable @focus="activeField = 'amount'" />
            </div>
        </div>
      </div>
    </ElScrollbar>
</template>

<style scoped>
.settings-panel {
  flex: 1;
  min-height: 0;
}

.settings-row {
  display: grid;
  min-height: 50px;
  grid-template-columns: 170px minmax(0, 1fr);
  align-items: center;
  border-bottom: 1px solid #dcdfe6;
  padding: 6px 22px;
}

.settings-row > span {
  color: #6f7782;
  text-align: right;
}

.settings-row > strong,
.settings-control {
  margin-left: 22px;
}

.settings-control {
  max-width: 520px;
}

.settings-control--picker :deep(.el-input__wrapper) {
  cursor: pointer;
}

.settings-control--inline {
  display: flex;
  gap: 8px;
}
</style>
