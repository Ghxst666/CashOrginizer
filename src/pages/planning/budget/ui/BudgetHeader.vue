<script setup lang="ts">
import { Plus, Setting } from '@element-plus/icons-vue';
import { ref } from 'vue';

const value = ref('')
</script>

<template>
    <div class="bg-[#ffffff] border-b border-[#e2e3e6] py-3 px-4 w-full flex justify-between items-center">
        <div class="flex gap-3 items-center">
            <ElDatePicker
                v-model="value"
                type="daterange"
                range-separator="До"
                start-placeholder="Начало"
                end-placeholder="Конец"
                class="max-w-[300px] w-full"
            />

            <ElButton
                :icon="Plus" 
                class="h-[40px]" 
                type="primary" 
                round
            >
                Добавить категорию в группу
            </ElButton>
            <ElButton
                :icon="Plus" 
                class="h-[40px]" 
                type="primary" 
                round
            >
                Добавить бюджетную группу
            </ElButton>
        </div>

        <ElDropdown>
            <ElButton class="h-[40px]"> 
                <ElIcon size="18">
                    <Setting/>
                </ElIcon>
            </ElButton>
            <template #dropdown>
                <ElDropdownMenu>
                    <ElDropdownItem>Включить запланированные</ElDropdownItem>
                    <ElDropdownItem>Показать свойства</ElDropdownItem>
                    <ElDropdownItem>Показать платежи</ElDropdownItem>
                    <ElDropdownItem>Рассчитать бюджет</ElDropdownItem>
                </ElDropdownMenu>
            </template>
        </ElDropdown>
    </div>
</template>

<style scoped>
:deep(.el-button) {
    margin: 0;
}
</style>
