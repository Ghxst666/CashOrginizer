<script setup lang="ts">
import { ArrowDown, Delete, EditPen, Plus } from '@element-plus/icons-vue';

</script>

<template>
    <div class="bg-[#ffffff] border-b border-[#e2e3e6] py-3 px-4 w-full flex gap-3">
        <ElDropdown>
            <ElButton class="h-[40px]">Все шаблоны
                <ElIcon class="ml-2">
                    <ArrowDown />
                </ElIcon>
            </ElButton>
            <template #dropdown>
                <ElDropdownMenu>
                    <ElDropdownItem>Шаблон 1</ElDropdownItem>
                    <ElDropdownItem>Шаблон 2</ElDropdownItem>
                </ElDropdownMenu>
            </template>
        </ElDropdown>

        <div class="flex gap-2">
            <ElButton :icon="Plus" class="h-[40px]" type="primary" round>
                Создать группу шаблонов
            </ElButton>
            <ElButton :icon="Plus" class="h-[40px]" type="primary" round>
                Новый шаблон
            </ElButton>
        </div>
        <div class="flex gap-2">
            <ElButton :icon="EditPen" class="size-[40px]" type="primary" round />
            <ElButton :icon="Delete" class="size-[40px]" type="danger" round />
        </div>
    </div>
</template>

<style scoped>
:deep(.el-button) {
    margin: 0;
}
</style>
