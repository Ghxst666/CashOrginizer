<script setup lang="ts">
import { ArrowDown, Filter, Plus, Setting } from '@element-plus/icons-vue'
import { computed, ref } from 'vue'
import type { DropdownInstance } from 'element-plus'
import { useGroupsQuery } from '@/entities/transaction/groups'
import type { InvoicesAccountsFilter } from '../invoices-filter'

type SortMode = 'default' | 'type' | 'group'

const props = defineProps<{
  activeSort: SortMode
  showClosedAccounts: boolean
  selectedFilter: InvoicesAccountsFilter
}>()

const emits = defineEmits<{
  newInvoice: []
  selectFilter: [filter: InvoicesAccountsFilter]
  sortByType: []
  sortDefault: []
  showProperties: []
  showGroupSettings: []
  showCloseAccounts: []
  sortGroup: []
}>()

const dropdownRef = ref<DropdownInstance>()
const filterSearch = ref('')
const draftGroupIds = ref<number[]>([])
const { data: groups } = useGroupsQuery()

const selectedFilterTitle = computed(() => {
  if (props.selectedFilter.type === 'all') return 'Все счета'

  const count = props.selectedFilter.groupIds.length
  return count ? `Выбрано: ${count}` : 'Все счета'
})

const filteredGroups = computed(() => filterOptions(groups.value ?? []))

function filterOptions<T extends { title: string }>(items: T[]) {
  const query = filterSearch.value.trim().toLocaleLowerCase()
  return query ? items.filter(item => item.title.toLocaleLowerCase().includes(query)) : items
}

function syncDraftSelection() {
  if (props.selectedFilter.type === 'selection') {
    draftGroupIds.value = [...props.selectedFilter.groupIds]
    return
  }

  draftGroupIds.value = []
}

function handleDropdownVisibleChange(visible: boolean) {
  if (visible) {
    filterSearch.value = ''
    syncDraftSelection()
  }
}

function applySelection() {
  if (!draftGroupIds.value.length) {
    emits('selectFilter', { type: 'all' })
  } else {
    emits('selectFilter', {
      type: 'selection',
      accountIds: [],
      groupIds: [...draftGroupIds.value],
    })
  }

  dropdownRef.value?.handleClose()
}

function resetSelection() {
  draftGroupIds.value = []
  emits('selectFilter', { type: 'all' })
}

function handleFilterCommand(command: string) {
  if (command === 'type') emits('sortByType')
  if (command === 'default') emits('sortDefault')
  if (command === 'group') emits('sortGroup')
}

function handleSettingsCommand(command: string) {
  if (command === 'show-properties') emits('showProperties')
  if (command === 'show-close-accounts') emits('showCloseAccounts')
  if (command === 'show-group-settings') emits('showGroupSettings')
}
</script>

<template>
  <div class="page-toolbar">
    <div class="page-toolbar__group">
      <ElDropdown ref="dropdownRef" trigger="click" :hide-on-click="false" @visible-change="handleDropdownVisibleChange">
        <ElButton class="h-[40px]">
          {{ selectedFilterTitle }} <ElIcon class="ml-2"><ArrowDown /></ElIcon>
        </ElButton>
        <template #dropdown>
          <div class="account-filter-dropdown" @click.stop>
            <ElInput v-model="filterSearch" placeholder="Найти" clearable />
            <div class="account-filter-dropdown__section">Группы счетов</div>
            <ElCheckboxGroup v-model="draftGroupIds" class="account-filter-dropdown__options">
              <ElCheckbox v-for="group in filteredGroups" :key="group.id" :value="group.id">{{ group.title }}</ElCheckbox>
            </ElCheckboxGroup>
            <div class="account-filter-dropdown__actions">
              <ElButton text @click="resetSelection">Сбросить всё</ElButton>
              <ElButton type="primary" round @click="applySelection">ОК</ElButton>
            </div>
          </div>
        </template>
      </ElDropdown>
      <ElButton :icon="Plus" class="h-[40px]" type="primary" round @click="emits('newInvoice')">Новый счет</ElButton>
    </div>
    <div class="page-toolbar__actions">
      <ElDropdown @command="handleFilterCommand">
        <ElButton class="h-[40px]"><ElIcon size="18"><Filter /></ElIcon></ElButton>
        <template #dropdown><ElDropdownMenu>
          <ElDropdownItem command="default">Сортировка вручную</ElDropdownItem>
          <ElDropdownItem command="type">Сортировка по типу</ElDropdownItem>
          <ElDropdownItem command="group">Сортировка по группам</ElDropdownItem>
        </ElDropdownMenu></template>
      </ElDropdown>
      <ElDropdown @command="handleSettingsCommand">
        <ElButton class="h-[40px]"><ElIcon size="18"><Setting /></ElIcon></ElButton>
        <template #dropdown><ElDropdownMenu>
          <ElDropdownItem command="show-properties">Показать свойства</ElDropdownItem>
          <ElDropdownItem command="show-close-accounts">Показать закрытые счета</ElDropdownItem>
          <ElDropdownItem command="show-group-settings">Управление группами счетов и сортировка</ElDropdownItem>
        </ElDropdownMenu></template>
      </ElDropdown>
    </div>
  </div>
</template>

<style scoped>
.account-filter-dropdown { width: 300px; padding: 8px 0 0; }
.account-filter-dropdown :deep(.el-input) { padding: 0 8px 8px; }
.account-filter-dropdown__section { padding: 9px 12px; border-top: 1px solid #d9dee5; background: #f3f5f8; color: #6b7280; font-size: 14px; }
.account-filter-dropdown__options { display: flex; max-height: 180px; flex-direction: column; overflow-y: auto; }
.account-filter-dropdown__options :deep(.el-checkbox) { height: 36px; margin-right: 0; padding: 0 12px; }
.account-filter-dropdown__actions { display: flex; justify-content: space-between; border-top: 1px solid #d9dee5; padding: 8px; }
</style>
