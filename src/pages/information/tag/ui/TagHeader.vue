<script setup lang="ts">
import { ArrowDown, Plus, Setting } from '@element-plus/icons-vue';
import { ElButton } from 'element-plus';

</script>

<template>
    <div class="bg-[#ffffff] border-b border-[#e2e3e6] py-3 px-4 w-full flex justify-between items-center">
        <div class="flex gap-2 items-center">
            <ElDropdown>
                <ElButton plain>Период
                    <ElIcon class="ml-2">
                        <ArrowDown />
                    </ElIcon>
                </ElButton>
                <template #dropdown>
                    <ElDropdownMenu>
                        <ElDropdownItem>Весь период</ElDropdownItem>
                        <ElDropdownItem>Сегодня</ElDropdownItem>
                        <ElDropdownItem>Вчера</ElDropdownItem>
                        <ElDropdownItem>Прошедший месяц</ElDropdownItem>
                        <ElDropdownItem>Текущий месяц</ElDropdownItem>
                        <ElDropdownItem>Текущий год</ElDropdownItem>
                        <ElDropdownItem>Следующий месяц</ElDropdownItem>
                        <ElDropdownItem>Установить свои даты</ElDropdownItem>
                    </ElDropdownMenu>
                </template>
            </ElDropdown>

            <ElButton
                :icon="Plus" 
                class="h-[40px]" 
                type="primary" 
                round
            >
                Новый тег
            </ElButton>
        </div>

        <ElDropdown>
            <ElButton class="h-[40px]"> 
                <ElIcon size="18">
                    <Setting />
                </ElIcon>
            </ElButton>
            <template #dropdown>
                <ElDropdownMenu>
                    <ElDropdownItem>Показать свойства</ElDropdownItem>
                    <ElDropdownItem>Отчеты</ElDropdownItem>
                </ElDropdownMenu>
            </template>
        </ElDropdown>
    </div>
</template>