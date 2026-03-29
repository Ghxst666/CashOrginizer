<script setup lang="ts">
import { Calendar, Menu } from '@element-plus/icons-vue';
import CalculatorIcon from '../../../../shared/assets/icons/CalculatorIcon.vue';

</script>

<template>
    <div class="flex flex-row">
        <ElButton
            :icon="Menu" 
            size="large"
        />
        <div class="flex space-beetwen">
            <span>
                2026 Cash Organiser
            </span>
            <div class="flex gap-1">
                <ElButton
                    :icon="Calendar" 
                    size="large"
                />
                <ElButton
                    class="!m-0"
                    :icon="CalculatorIcon" 
                    size="large"
                />
            </div>
        </div>
    </div>
</template>