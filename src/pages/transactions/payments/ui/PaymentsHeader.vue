<script setup lang="ts">
import { ArrowDown, Plus, Setting } from '@element-plus/icons-vue'
import { computed, ref } from 'vue'
import type { DropdownInstance } from 'element-plus'
import { useAccountsQuery } from '@/entities/transaction/invoices'
import { useGroupsQuery } from '@/entities/transaction/groups'
import type { PaymentsFilter } from '../payments-filter'

const props = defineProps<{ selectedFilter: PaymentsFilter }>()
const emits = defineEmits<{ openDialog: [], selectFilter: [filter: PaymentsFilter], showProperties: [] }>()

const dropdownRef = ref<DropdownInstance>()
const filterSearch = ref('')
const draftAccountIds = ref<number[]>([])
const draftGroupIds = ref<number[]>([])
const { data: accounts } = useAccountsQuery(true)
const { data: groups } = useGroupsQuery()

const selectedFilterTitle = computed(() => {
  if (props.selectedFilter.type === 'all') return 'Все платежи'
  const count = props.selectedFilter.accountIds.length + props.selectedFilter.groupIds.length
  return count ? `Выбрано: ${count}` : 'Все платежи'
})
const filteredAccounts = computed(() => filterOptions(accounts.value ?? []))
const filteredGroups = computed(() => filterOptions(groups.value ?? []))

function filterOptions<T extends { title: string }>(items: T[]) {
  const query = filterSearch.value.trim().toLocaleLowerCase()
  return query ? items.filter(item => item.title.toLocaleLowerCase().includes(query)) : items
}
function handleDropdownVisibleChange(visible: boolean) {
  if (!visible) return
  filterSearch.value = ''
  draftAccountIds.value = props.selectedFilter.type === 'selection' ? [...props.selectedFilter.accountIds] : []
  draftGroupIds.value = props.selectedFilter.type === 'selection' ? [...props.selectedFilter.groupIds] : []
}
function applySelection() {
  emits('selectFilter', draftAccountIds.value.length || draftGroupIds.value.length
    ? { type: 'selection', accountIds: [...draftAccountIds.value], groupIds: [...draftGroupIds.value] }
    : { type: 'all' })
  dropdownRef.value?.handleClose()
}
function resetSelection() {
  draftAccountIds.value = []
  draftGroupIds.value = []
  emits('selectFilter', { type: 'all' })
}
</script>

<template>
  <div class="flex justify-between bg-[#ffffff] border-b border-[#e2e3e6] py-3 px-4">
    <div class="flex gap-2">
      <ElDropdown ref="dropdownRef" trigger="click" :hide-on-click="false" @visible-change="handleDropdownVisibleChange">
        <ElButton class="h-[40px]">{{ selectedFilterTitle }} <ElIcon class="ml-2"><ArrowDown /></ElIcon></ElButton>
        <template #dropdown>
          <div class="account-filter-dropdown" @click.stop>
            <ElInput v-model="filterSearch" placeholder="Найти" clearable />
            <div class="account-filter-dropdown__section">Счета</div>
            <ElScrollbar max-height="300px">
              <ElCheckboxGroup v-model="draftAccountIds" class="account-filter-dropdown__options">
                <ElCheckbox v-for="account in filteredAccounts" :key="account.id" :value="account.id">{{ account.title }} ({{ account.currency || 'RUB' }})</ElCheckbox>
              </ElCheckboxGroup>
            </ElScrollbar>
            <div class="account-filter-dropdown__section">Группы счетов</div>
            <ElScrollbar max-height="300px">
              <ElCheckboxGroup v-model="draftGroupIds" class="account-filter-dropdown__options">
                <ElCheckbox v-for="group in filteredGroups" :key="group.id" :value="group.id">{{ group.title }}</ElCheckbox>
              </ElCheckboxGroup>
            </ElScrollbar>
            <div class="account-filter-dropdown__actions">
              <ElButton text @click="resetSelection">Сбросить всё</ElButton>
              <ElButton type="primary" round @click="applySelection">ОК</ElButton>
            </div>
          </div>
        </template>
      </ElDropdown>
      <ElButton :icon="Plus" class="h-[40px]" type="primary" round @click="emits('openDialog')">Новый платеж</ElButton>
    </div>
    <ElDropdown @command="command => command === 'show-properties' && emits('showProperties')">
      <ElButton class="h-[40px]"><ElIcon size="18"><Setting /></ElIcon></ElButton>
      <template #dropdown><ElDropdownMenu><ElDropdownItem command="show-properties">Показать свойства</ElDropdownItem></ElDropdownMenu></template>
    </ElDropdown>
  </div>
</template>

<style scoped>
.account-filter-dropdown { width: 300px; padding: 8px 0 0; }
.account-filter-dropdown :deep(.el-input) { padding: 0 8px 8px; }
.account-filter-dropdown__section { padding: 9px 12px; border-top: 1px solid #d9dee5; background: #f3f5f8; color: #6b7280; font-size: 14px; }
.account-filter-dropdown__options { display: flex; flex-direction: column; }
.account-filter-dropdown__options :deep(.el-checkbox) { height: 36px; margin-right: 0; padding: 0 12px; }
.account-filter-dropdown__actions { display: flex; justify-content: space-between; border-top: 1px solid #d9dee5; padding: 8px; }
</style>
