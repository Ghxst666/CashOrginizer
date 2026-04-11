<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{
    title: string
}>()
const value = ref('')
</script>

<template>
    <ElCard class="w-full">
        <template #header>
            <div class="flex gap-2 items-center">
                {{ props.title }}

                <ElDatePicker
                    v-model="value"
                    type="daterange"
                    range-separator="До"
                    start-placeholder="Начало"
                    end-placeholder="Конец"
                    class="max-w-[300px] w-full"
                />
            </div>
        </template>
        
        <slot />
    </ElCard>
</template>
