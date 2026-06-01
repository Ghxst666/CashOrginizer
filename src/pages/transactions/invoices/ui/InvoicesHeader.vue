<script setup lang="ts">
import { ArrowDown, Filter, Plus, Setting } from '@element-plus/icons-vue';
import { ElButton, ElDropdown, ElDropdownItem, ElDropdownMenu } from 'element-plus';

const emits = defineEmits<{
    newInvoice: []
    sortByType: []
    sortDefault: []
    showProperties: []
}>()

function handleFilterCommand(command: string) {
  if (command === 'type') emits('sortByType')
  if (command === 'default') emits('sortDefault')
}

function handleSettingsCommand(command: string) {
  if (command === 'show-properties') emits('showProperties')
}
</script>

<template>
    <div class="flex justify-between bg-[#ffffff] border-b border-[#e2e3e6] py-3 px-4">
        <div class="flex gap-2">
            <ElDropdown>
                <ElButton class="h-[40px]">Все счета
                    <ElIcon class="ml-2">
                        <ArrowDown />
                    </ElIcon>
                </ElButton>
                <template #dropdown>
                    <ElDropdownMenu>
                        <ElDropdownItem>Все счета</ElDropdownItem>
                        <ElDropdownItem>Управление группами счетов и сортировка</ElDropdownItem>
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
                        <ElDropdownItem command="type">Сортировка по типу</ElDropdownItem>
                        <ElDropdownItem command="default">Сортировка по вручную</ElDropdownItem>
                        <ElDropdownItem command="group">Сортировка по группам</ElDropdownItem>
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
                        <ElDropdownItem command="reports">Отчеты</ElDropdownItem>
                    </ElDropdownMenu>
                </template>
            </ElDropdown>
        </div>
    </div>
</template>
