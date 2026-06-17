<script setup lang="ts">
import { METHOD_OPTIONS, PERIOD_OPTIONS } from '@/pages/information/report/model/report.config'
import type { ReportDefinition, ReportFilters, SelectOption } from '@/pages/information/report/model/report.types'

defineProps<{
    report: ReportDefinition
    groupOptions: SelectOption[]
    accountOptions: SelectOption[]
    purposeOptions: SelectOption[]
    categoryOptions: SelectOption[]
    projectOptions: SelectOption[]
}>()

const emit = defineEmits<{
    loadOptions: [type: 'groups' | 'accounts' | 'purposes' | 'categories' | 'projects']
}>()

const filters = defineModel<ReportFilters>('filters', { required: true })
const selectedGroupId = defineModel<number | null>('selectedGroupId', { required: true })
const customDateRange = defineModel<string[]>('customDateRange', { required: true })

function handleVisibleChange(visible: boolean, ...types: Array<'groups' | 'accounts' | 'purposes' | 'categories' | 'projects'>) {
    if (!visible) return

    types.forEach(type => emit('loadOptions', type))
}
</script>

<template>
    <div class="settings-panel">
        <div class="settings-row">
            <span>Название</span>
            <strong>{{ report.title }}</strong>
        </div>
        <div class="settings-row">
            <span>Метод учета</span>
            <ElSelect v-model="filters.method" class="settings-control">
                <ElOption
                    v-for="option in METHOD_OPTIONS"
                    :key="option.value"
                    :label="option.label"
                    :value="option.value"
                />
            </ElSelect>
        </div>
        <div class="settings-row">
            <span>Дата</span>
            <div class="settings-control settings-control--stack">
                <ElSelect v-model="filters.period">
                    <ElOption
                        v-for="option in PERIOD_OPTIONS"
                        :key="option.value"
                        :label="option.label"
                        :value="option.value"
                    />
                </ElSelect>
                <ElDatePicker
                    v-if="filters.period === 'custom'"
                    v-model="customDateRange"
                    type="daterange"
                    value-format="YYYY-MM-DD"
                    start-placeholder="Дата с"
                    end-placeholder="Дата по"
                />
            </div>
        </div>
        <div class="settings-row">
            <span>Группа счетов</span>
            <ElSelect
                v-model="selectedGroupId"
                class="settings-control"
                clearable
                placeholder="Все группы"
                @visible-change="visible => handleVisibleChange(visible, 'groups', 'accounts')"
            >
                <ElOption
                    v-for="option in groupOptions"
                    :key="option.value"
                    :label="option.label"
                    :value="option.value"
                />
            </ElSelect>
        </div>
        <div class="settings-row">
            <span>Счет</span>
            <ElSelect
                v-model="filters.accounts_ids"
                class="settings-control"
                multiple
                collapse-tags
                clearable
                placeholder="Все счета"
                @visible-change="visible => handleVisibleChange(visible, 'accounts')"
            >
                <ElOption
                    v-for="option in accountOptions"
                    :key="option.value"
                    :label="option.label"
                    :value="option.value"
                />
            </ElSelect>
        </div>
        <div class="settings-row">
            <span>Название</span>
            <ElSelect
                v-model="filters.purposes_ids"
                class="settings-control"
                multiple
                collapse-tags
                clearable
                placeholder="Все названия"
                @visible-change="visible => handleVisibleChange(visible, 'purposes')"
            >
                <ElOption
                    v-for="option in purposeOptions"
                    :key="option.value"
                    :label="option.label"
                    :value="option.value"
                />
            </ElSelect>
        </div>
        <div class="settings-row">
            <span>Категория</span>
            <ElSelect
                v-model="filters.categories_ids"
                class="settings-control"
                multiple
                collapse-tags
                clearable
                placeholder="Все категории"
                @visible-change="visible => handleVisibleChange(visible, 'categories')"
            >
                <ElOption
                    v-for="option in categoryOptions"
                    :key="option.value"
                    :label="option.label"
                    :value="option.value"
                />
            </ElSelect>
        </div>
        <div class="settings-row">
            <span>Проект</span>
            <ElSelect
                v-model="filters.projects_ids"
                class="settings-control"
                multiple
                collapse-tags
                clearable
                placeholder="Все проекты"
                @visible-change="visible => handleVisibleChange(visible, 'projects')"
            >
                <ElOption
                    v-for="option in projectOptions"
                    :key="option.value"
                    :label="option.label"
                    :value="option.value"
                />
            </ElSelect>
        </div>
        <div class="settings-row">
            <span>Текст</span>
            <ElInput
                v-model="filters.text"
                class="settings-control"
                clearable
            />
        </div>
        <div class="settings-row">
            <span>Сумма</span>
            <div class="settings-control settings-control--inline">
                <ElInput v-model="filters.amount_from" placeholder="От" clearable />
                <ElInput v-model="filters.amount_to" placeholder="До" clearable />
            </div>
        </div>
        <div class="settings-row">
            <span>Номер</span>
            <div class="settings-control settings-control--inline">
                <ElInput v-model="filters.number_from" placeholder="От" clearable />
                <ElInput v-model="filters.number_to" placeholder="До" clearable />
            </div>
        </div>
    </div>
</template>

<style scoped>
.settings-panel {
  flex: 1;
  min-height: 0;
  overflow: auto;
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

.settings-control--stack,
.settings-control--inline {
  display: flex;
  gap: 8px;
}

.settings-control--stack {
  flex-direction: column;
}
</style>
