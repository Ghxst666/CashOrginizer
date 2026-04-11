<script setup lang="ts">
import { Plus } from '@element-plus/icons-vue';

</script>

<template>
    <div class="bg-[#ffffff] border-b border-[#e2e3e6] py-3 px-4 w-full">
        <ElButton :icon="Plus" type="primary" round>
            Новый платеж
        </ElButton>
    </div>
</template>
