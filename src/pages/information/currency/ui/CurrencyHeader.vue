<script setup lang="ts">
import { Plus, Refresh, Setting } from '@element-plus/icons-vue';
import { ElButton } from 'element-plus';

</script>

<template>
    <div class="bg-[#ffffff] border-b border-[#e2e3e6] py-3 px-4 w-full flex justify-between items-center">
        <div class="flex gap-2 items-center">
            <ElButton
                :icon="Refresh" 
                class="h-[40px]" 
                type="info" 
                round
            >
                Обновить курсы
            </ElButton>

            <ElButton
                :icon="Plus" 
                class="h-[40px]" 
                type="primary" 
                round
            >
                Новая валюта
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
                    <ElDropdownItem>Установить главной валютой</ElDropdownItem>
                    <ElDropdownItem>Показать свойства</ElDropdownItem>
                </ElDropdownMenu>
            </template>
        </ElDropdown>
    </div>
</template>