<script setup lang="ts">
import { Calendar, Menu, Search } from '@element-plus/icons-vue';
import CalculatorIcon from '../../../../shared/assets/icons/CalculatorIcon.vue';
import { ref } from 'vue';
import { MenuItem } from '../types/menu.types';

const input = ref('')
const value = ref('')

const MainMenuSelect: MenuItem[] = [
    {
        id: "rename",
        label: "Переименовать",
    },
    {
        id: "changePassword",
        label: "Изменить пароль",
    },
    {
        id: "move",
        label: "Переместить базу данных на онлайн сервер",
    },
    {
        id: "settings",
        label: "Настроки учетных записей",
    },
]
</script>

<template>
    <div class="flex flex-row items-center w-full bg-[#009ae0]">
        <ElButton
            class="!size-10 !px-8"
            link
        >
            <ElIcon size="30px">
                <Menu />
            </ElIcon>
        </ElButton>
        <div class="flex justify-between w-full items-center px-3">
            <span>
                2026 Cash Organiser
            </span>
            <div class="flex gap-1 items-center">
                <ElButton
                    link
                    class="!size-10"
                >
                    <ElIcon size="30px">
                        <Calendar />
                    </ElIcon>
                </ElButton>
                <ElButton
                    class="!m-0 !size-10"
                    link
                >
                    <ElIcon size="30px">
                        <CalculatorIcon />
                    </ElIcon>
                </ElButton>
            </div>
        </div>
        <div class="max-w-60 w-full flex items-center px-3 py-2">
            <ElInput
                v-model="input"
                placeholder="Найти"
            >
                <template #prefix>
                    <ElIcon>
                        <Search />
                    </ElIcon>
                </template>
            </ElInput>
        </div>
        <!-- TODO: потом в placeholder передать название бд -->
        <div class="max-w-60 w-full flex items-center px-3 py-2 border-l-[#831919] border-1">
            <ElSelect 
                 v-model="value"
                 placeholder="Моя база данных"
            >
                <ElOption 
                     v-for="item in MainMenuSelect"
                     :key="item.id"
                     :label="item.label"
                     :value="item.id"
                />
            </ElSelect>
        </div>
    </div>
</template>