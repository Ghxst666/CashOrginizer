<script setup lang="ts">
import { ArrowDown, ArrowRight, Check, Filter, Plus, Setting } from '@element-plus/icons-vue'
import { computed, ref } from 'vue'
import { ElButton, ElDropdown, ElDropdownItem, ElDropdownMenu } from 'element-plus'
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
const showGroups = ref(false)
const { data: groups } = useGroupsQuery(showGroups)

const selectedFilterTitle = computed(() => {
  if (props.selectedFilter.type === 'group') return props.selectedFilter.title

  return 'Все счета'
})

function isGroupSelected(groupId: number) {
  return props.selectedFilter.type === 'group' && props.selectedFilter.id === groupId
}

function isAllAccountsSelected() {
  return props.selectedFilter.type === 'all'
}

function handleAccountsCommand(command: string) {
  if (command === 'toggle-groups') {
    showGroups.value = !showGroups.value
    return
  }

  if (command === 'all') {
    emits('selectFilter', { type: 'all' })
    dropdownRef.value?.handleClose()
    return
  }

  if (command === 'show-group-settings') {
    emits('showGroupSettings')
    dropdownRef.value?.handleClose()
    return
  }

  const [type, rawId] = command.split(':')
  const id = Number(rawId)

  if (type === 'group') {
    const group = groups.value?.find(item => item.id === id)
    if (group) emits('selectFilter', { type: 'group', id, title: group.title })
  }

  dropdownRef.value?.handleClose()
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

function isSortActive(sortMode: SortMode) {
  return props.activeSort === sortMode
}

function isClosedAccountsActive() {
  return props.showClosedAccounts
}
</script>

<template>
    <div class="flex justify-between bg-[#ffffff] border-b border-[#e2e3e6] py-3 px-4">
        <div class="flex gap-2">
            <ElDropdown
                ref="dropdownRef"
                :hide-on-click="false"
                @command="handleAccountsCommand"
            >
                <ElButton class="h-[40px]">{{ selectedFilterTitle }}
                    <ElIcon class="ml-2">
                        <ArrowDown />
                    </ElIcon>
                </ElButton>
                <template #dropdown>
                    <ElDropdownMenu>
                        <ElDropdownItem command="all">
                            <span class="flex w-full items-center justify-between gap-4">
                                Все счета
                                <ElIcon v-if="isAllAccountsSelected()"><Check /></ElIcon>
                            </span>
                        </ElDropdownItem>
                        <ElDropdownItem command="toggle-groups">
                            <span class="flex w-full items-center justify-between gap-4">
                                Группы счетов
                                <ElIcon :class="{ 'rotate-90': showGroups }"><ArrowRight /></ElIcon>
                            </span>
                        </ElDropdownItem>
                        <template v-if="showGroups">
                            <ElDropdownItem
                                v-for="group in groups"
                                :key="group.id"
                                :command="`group:${group.id}`"
                            >
                                <span class="flex w-full items-center justify-between gap-4 pl-4">
                                    {{ group.title }}
                                    <ElIcon v-if="isGroupSelected(group.id)"><Check /></ElIcon>
                                </span>
                            </ElDropdownItem>
                        </template>
                        <ElDropdownItem command="show-group-settings">Управление группами счетов и сортировка</ElDropdownItem>
                    </ElDropdownMenu>
                </template>
            </ElDropdown>

            <ElButton @click="emits('newInvoice')" :icon="Plus" class="h-[40px]" type="primary" round>
                Новый счет
            </ElButton>
        </div>

        <div class="flex gap-2">
            <ElDropdown @command="handleFilterCommand">
                <ElButton class="h-[40px]">
                    <ElIcon size="18">
                        <Filter/>
                    </ElIcon>
                </ElButton>
                <template #dropdown>
                    <ElDropdownMenu>
                        <ElDropdownItem command="default">
                            <span class="flex w-full items-center justify-between gap-3">
                                Сортировка вручную
                                <ElIcon v-if="isSortActive('default')"><Check /></ElIcon>
                            </span>
                        </ElDropdownItem>
                        <ElDropdownItem command="type">
                            <span class="flex w-full items-center justify-between gap-3">
                                Сортировка по типу
                                <ElIcon v-if="isSortActive('type')"><Check /></ElIcon>
                            </span>
                        </ElDropdownItem>
                        <ElDropdownItem command="group">
                            <span class="flex w-full items-center justify-between gap-3">
                                Сортировка по группам
                                <ElIcon v-if="isSortActive('group')"><Check /></ElIcon>
                            </span>
                        </ElDropdownItem>
                    </ElDropdownMenu>
                </template>
            </ElDropdown>
            <ElDropdown @command="handleSettingsCommand">
                <ElButton class="h-[40px]">
                    <ElIcon size="18">
                        <Setting/>
                    </ElIcon>
                </ElButton>
                <template #dropdown>
                    <ElDropdownMenu>
                        <ElDropdownItem command="show-properties">Показать свойства</ElDropdownItem>
                        <ElDropdownItem command="show-close-accounts">
                            <span class="flex w-full items-center justify-between gap-3">
                                Показать закрытые счета
                                <ElIcon v-if="isClosedAccountsActive()"><Check /></ElIcon>
                            </span>
                        </ElDropdownItem>
                        <ElDropdownItem command="show-group-settings">Управление группами счетов и сортировка</ElDropdownItem>
                        <ElDropdownItem command="reports">Отчеты</ElDropdownItem>
                    </ElDropdownMenu>
                </template>
            </ElDropdown>
        </div>
    </div>
</template>
