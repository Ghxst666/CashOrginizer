<script setup lang="ts">
import { ArrowDown } from '@element-plus/icons-vue';

const props = defineProps<{
    title: string
}>()
</script>

<template>
    <ElCard class="w-full">
        <template #header>
            <div class="flex gap-2 items-center">
                {{ props.title }}

                <ElDropdown>
                    <ElButton plain>Промежуток
                        <ElIcon class="ml-2">
                            <ArrowDown />
                        </ElIcon>
                    </ElButton>
                    <template #dropdown>
                        <ElDropdownMenu>
                            <ElDropdownItem>Запланировано на сегодня</ElDropdownItem>
                            <ElDropdownItem>Запланировано на текущий месяц</ElDropdownItem>
                            <ElDropdownItem>Запланировано на следующую неделю</ElDropdownItem>
                            <ElDropdownItem>Запланировано на следующий месяц</ElDropdownItem>
                            <ElDropdownItem>Запланировано на следующие 90 дней</ElDropdownItem>
                        </ElDropdownMenu>
                    </template>
                </ElDropdown>
            </div>
        </template>
        
        <slot />
    </ElCard>
</template>
