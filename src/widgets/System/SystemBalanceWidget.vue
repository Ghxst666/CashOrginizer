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
                    <ElButton plain>Счета
                        <ElIcon class="ml-2">
                            <ArrowDown />
                        </ElIcon>
                    </ElButton>
                    <template #dropdown>
                        <ElDropdownMenu>
                            <ElDropdownItem>Все счета</ElDropdownItem>
                            <ElDropdownItem>Группы счетов</ElDropdownItem>
                        </ElDropdownMenu>
                    </template>
                </ElDropdown>

                <ElDropdown>
                    <ElButton plain>Промежуток
                        <ElIcon class="ml-2">
                            <ArrowDown />
                        </ElIcon>
                    </ElButton>
                    <template #dropdown>
                        <ElDropdownMenu>
                            <ElDropdownItem>Сегодня</ElDropdownItem>
                            <ElDropdownItem>Вчера</ElDropdownItem>
                            <ElDropdownItem>Текущий месяц</ElDropdownItem>
                            <ElDropdownItem>За последние 7 дней</ElDropdownItem>
                            <ElDropdownItem>За последние 30 дней</ElDropdownItem>
                            <ElDropdownItem>Следующие 7 дней</ElDropdownItem>
                            <ElDropdownItem>Следующие 30 дней</ElDropdownItem>
                        </ElDropdownMenu>
                    </template>
                </ElDropdown>
            </div>
        </template>
        
        <slot />
    </ElCard>
</template>
