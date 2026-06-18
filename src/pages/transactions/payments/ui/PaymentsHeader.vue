<script setup lang="ts">
import { ArrowDown, ArrowRight, Check, Plus, Setting } from '@element-plus/icons-vue'
import { computed, ref } from 'vue'
import { ElButton, ElDropdown, ElDropdownItem, ElDropdownMenu } from 'element-plus'
import type { DropdownInstance } from 'element-plus'
import { useAccountsQuery } from '@/entities/transaction/invoices'
import { useGroupsQuery } from '@/entities/transaction/groups'
import type { PaymentsFilter } from '../payments-filter'

const props = defineProps<{
    selectedFilter: PaymentsFilter
}>()

const emits = defineEmits<{
    openDialog: []
    selectFilter: [filter: PaymentsFilter]
    showProperties: []
}>()

const dropdownRef = ref<DropdownInstance>()
const showAccounts = ref(false)
const showGroups = ref(false)
const { data: accounts } = useAccountsQuery(true, showAccounts)
const { data: groups  } = useGroupsQuery(showGroups)

const selectedFilterTitle = computed(() => {
    if (props.selectedFilter.type === 'account') return props.selectedFilter.title
    if (props.selectedFilter.type === 'group') return props.selectedFilter.title

    return 'Все платежи'
})

function isSelected(type: PaymentsFilter['type'], id?: number) {
    if (props.selectedFilter.type !== type) return false
    if (type === 'all') return true

    return 'id' in props.selectedFilter && props.selectedFilter.id === id
}

function handleFilterCommand(command: string) {
    if (command === 'toggle-accounts') {
        showAccounts.value = !showAccounts.value
        showGroups.value = false
        return
    }

    if (command === 'toggle-groups') {
        showGroups.value = !showGroups.value
        showAccounts.value = false
        return
    }

    if (command === 'all') {
        emits('selectFilter', { type: 'all' })
        dropdownRef.value?.handleClose()
        return
    }

    const [type, rawId] = command.split(':')
    const id = Number(rawId)

    if (type === 'account') {
        const account = accounts.value?.find(item => item.id === id)
        if (account) emits('selectFilter', { type: 'account', id, title: account.title })
    }

    if (type === 'group') {
        const group = groups.value?.find(item => item.id === id)
        if (group) emits('selectFilter', { type: 'group', id, title: group.title })
    }

    dropdownRef.value?.handleClose()
}

function handleSettingsCommand(command: string) {
    if (command === 'show-properties') emits('showProperties')
}
</script>

<template>
    <div class="flex justify-between bg-[#ffffff] border-b border-[#e2e3e6] py-3 px-4">
        <div class="flex gap-2">
            <ElDropdown
                ref="dropdownRef"
                :hide-on-click="false"
                @command="handleFilterCommand"
            >
                <ElButton class="h-[40px]">{{ selectedFilterTitle }}
                    <ElIcon class="ml-2">
                        <ArrowDown />
                    </ElIcon>
                </ElButton>
                <template #dropdown>
                    <ElDropdownMenu>
                        <ElDropdownItem command="toggle-accounts">
                            <span class="flex w-full items-center justify-between gap-4">
                                Все счета
                                <ElIcon :class="{ 'rotate-90': showAccounts }"><ArrowRight /></ElIcon>
                            </span>
                        </ElDropdownItem>
                        <template v-if="showAccounts">
                            <ElDropdownItem
                                v-for="account in accounts"
                                :key="account.id"
                                :command="`account:${account.id}`"
                            >
                                <span class="flex w-full items-center justify-between gap-4 pl-4">
                                    {{ account.title }}
                                    <ElIcon v-if="isSelected('account', account.id)"><Check /></ElIcon>
                                </span>
                            </ElDropdownItem>
                        </template>

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
                                    <ElIcon v-if="isSelected('group', group.id)"><Check /></ElIcon>
                                </span>
                            </ElDropdownItem>
                        </template>

                        <ElDropdownItem command="all" divided>
                            <span class="flex w-full items-center justify-between gap-4">
                                Все платежи
                                <ElIcon v-if="isSelected('all')"><Check /></ElIcon>
                            </span>
                        </ElDropdownItem>
                    </ElDropdownMenu>
                </template>
            </ElDropdown>

            <ElButton @click="emits('openDialog')" :icon="Plus" class="h-[40px]" type="primary" round>
                Новый платеж
            </ElButton>
        </div>

        <div class="flex gap-2">
            <ElDropdown @command="handleSettingsCommand">
                <ElButton class="h-[40px]"> 
                    <ElIcon size="18">
                        <Setting/>
                    </ElIcon>
                </ElButton>
                <template #dropdown>
                    <ElDropdownMenu>
                        <ElDropdownItem command="show-properties">Показать свойства</ElDropdownItem>
                        <ElDropdownItem>Отчет по платежам</ElDropdownItem>
                    </ElDropdownMenu>
                </template>
            </ElDropdown>
        </div>
    </div>
</template>
