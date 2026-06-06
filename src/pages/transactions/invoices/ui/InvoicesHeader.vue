<script setup lang="ts">
import { ArrowDown, Check, Filter, Plus, Setting } from '@element-plus/icons-vue'
import { ElButton, ElDropdown, ElDropdownItem, ElDropdownMenu } from 'element-plus'

type SortMode = 'default' | 'type' | 'group'

const props = defineProps<{
    activeSort: SortMode
    showClosedAccounts: boolean
}>()

const emits = defineEmits<{
    newInvoice: []
    sortByType: []
    sortDefault: []
    showProperties: []
    showGroupSettings: []
    showCloseAccounts: []
    sortGroup: []
}>()

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
            <ElDropdown @command="handleSettingsCommand">
                <ElButton class="h-[40px]">Все счета
                    <ElIcon class="ml-2">
                        <ArrowDown />
                    </ElIcon>
                </ElButton>
                <template #dropdown>
                    <ElDropdownMenu>
                        <ElDropdownItem>Все счета</ElDropdownItem>
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
