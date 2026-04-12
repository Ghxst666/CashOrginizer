<script setup lang="ts">
import { ArrowDown, Filter, Plus, Setting } from '@element-plus/icons-vue';
import { ElButton, ElDropdown, ElDropdownItem, ElDropdownMenu } from 'element-plus';


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
                        <ElDropdownItem>Счет 1</ElDropdownItem>
                        <ElDropdownItem>Счет 2</ElDropdownItem>
                        <ElDropdownItem>Счет 3</ElDropdownItem>
                        <ElDropdownItem>Счет 4</ElDropdownItem>
                        <ElDropdownItem>Все платежи</ElDropdownItem>
                    </ElDropdownMenu>
                </template>
            </ElDropdown>

            <ElButton class="h-[40px]"> 
                <ElIcon size="18">
                    <Filter/>
                </ElIcon>
            </ElButton>

            <ElButton :icon="Plus" class="h-[40px]" type="primary" round>
                Новый платеж
            </ElButton>
        </div>

        <div class="flex gap-2">
            <ElDropdown>
                <ElButton class="h-[40px]"> 
                    <ElIcon size="18">
                        <Setting/>
                    </ElIcon>
                </ElButton>
                <template #dropdown>
                    <ElDropdownMenu>
                        <ElDropdownItem>Создать шаблон</ElDropdownItem>
                        <ElDropdownItem>Согласовать</ElDropdownItem>
                        <ElDropdownItem>Показать запланированные</ElDropdownItem>
                        <ElDropdownItem>Показать только несогласованные</ElDropdownItem>
                        <ElDropdownItem>Отчет по платежам</ElDropdownItem>
                        <ElDropdownItem>Настройка колонок списка</ElDropdownItem>
                    </ElDropdownMenu>
                </template>
            </ElDropdown>
        </div>
    </div>
</template>
