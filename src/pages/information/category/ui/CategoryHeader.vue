<script setup lang="ts">
import { ArrowDown, Plus, Setting } from '@element-plus/icons-vue';
import { computed, ref } from 'vue';
import { ElButton, ElDatePicker, ElDialog, ElDropdown, ElDropdownItem, ElDropdownMenu } from 'element-plus';

type CategoryPeriod = 'all_period' | 'today' | 'yesterday' | 'last_month' | 'current_month' | 'next_month' | 'custom'

interface CategoryPeriodFilter {
    period: CategoryPeriod
    date_from?: string
    date_to?: string
}

const props = defineProps<{
    selectedPeriod: string
    dateFrom?: string
    dateTo?: string
}>()

const emits = defineEmits<{
    addCategory: []
    selectPeriod: [filter: CategoryPeriodFilter]
    showProperties: []
}>()

const periodTitles: Record<CategoryPeriod, string> = {
    all_period: 'Весь период',
    today: 'Сегодня',
    yesterday: 'Вчера',
    last_month: 'Прошедший месяц',
    current_month: 'Текущий месяц',
    next_month: 'Следующий месяц',
    custom: 'Свои даты',
}

const customDateDialog = ref(false)
const customDates = ref<[string, string] | null>(null)

const selectedPeriodTitle = computed(() => {
    if (props.selectedPeriod === 'custom' && props.dateFrom && props.dateTo) {
        return `${formatDate(props.dateFrom)} - ${formatDate(props.dateTo)}`
    }

    return periodTitles[props.selectedPeriod as CategoryPeriod] ?? 'Период'
})

function formatDate(date: string) {
    const [year, month, day] = date.split('-')
    return `${day}.${month}.${year}`
}

function handlePeriodCommand(period: CategoryPeriod) {
    if (period === 'custom') {
        customDates.value = props.dateFrom && props.dateTo
            ? [props.dateFrom, props.dateTo]
            : null
        customDateDialog.value = true
        return
    }

    emits('selectPeriod', { period })
}

function applyCustomDates() {
    if (!customDates.value) return

    emits('selectPeriod', {
        period: 'custom',
        date_from: customDates.value[0],
        date_to: customDates.value[1],
    })
    customDateDialog.value = false
}

function handleSettingsCommand(command: string) {
    if (command === 'show-properties') emits('showProperties')
}
</script>

<template>
    <div class="bg-[#ffffff] border-b border-[#e2e3e6] py-3 px-4 w-full flex justify-between items-center">
        <div class="flex gap-2 items-center">
            <ElDropdown @command="handlePeriodCommand">
                <ElButton plain>{{ selectedPeriodTitle }}
                    <ElIcon class="ml-2">
                        <ArrowDown />
                    </ElIcon>
                </ElButton>
                <template #dropdown>
                    <ElDropdownMenu>
                        <ElDropdownItem command="all_period">Весь период</ElDropdownItem>
                        <ElDropdownItem command="today">Сегодня</ElDropdownItem>
                        <ElDropdownItem command="yesterday">Вчера</ElDropdownItem>
                        <ElDropdownItem command="last_month">Прошедший месяц</ElDropdownItem>
                        <ElDropdownItem command="current_month">Текущий месяц</ElDropdownItem>
                        <ElDropdownItem command="next_month">Следующий месяц</ElDropdownItem>
                        <ElDropdownItem command="custom" divided>Установить свои даты</ElDropdownItem>
                    </ElDropdownMenu>
                </template>
            </ElDropdown>

            <ElButton
                @click="emits('addCategory')"
                :icon="Plus" 
                class="h-[40px]" 
                type="primary" 
                round
            >
                Новая категория
            </ElButton>
        </div>

        <ElDropdown @command="handleSettingsCommand">
            <ElButton class="h-[40px]"> 
                <ElIcon size="18">
                    <Setting />
                </ElIcon>
            </ElButton>
            <template #dropdown>
                <ElDropdownMenu>
                    <ElDropdownItem command="show-properties">Показать свойства</ElDropdownItem>
                    <ElDropdownItem>Отчет для категории</ElDropdownItem>
                    <ElDropdownItem>Отчет по всем категориям</ElDropdownItem>
                </ElDropdownMenu>
            </template>
        </ElDropdown>
    </div>

    <ElDialog v-model="customDateDialog" title="Установить свои даты" width="520px">
        <ElDatePicker
            v-model="customDates"
            type="daterange"
            value-format="YYYY-MM-DD"
            format="DD.MM.YYYY"
            range-separator="-"
            start-placeholder="Дата начала"
            end-placeholder="Дата окончания"
            class="w-full"
        />

        <template #footer>
            <ElButton @click="customDateDialog = false">Отмена</ElButton>
            <ElButton type="primary" :disabled="!customDates" @click="applyCustomDates">
                Применить
            </ElButton>
        </template>
    </ElDialog>
</template>
