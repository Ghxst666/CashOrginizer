<script setup lang="ts">
import CategoryHeader from './CategoryHeader.vue';
import CategoryTable from './CategoryTable.vue';

</script>

<template>
    <div class="h-full flex flex-col bg-[#ffffff]">
        <CategoryHeader />
        <div class="flex-1 min-h-0">
            <CategoryTable />
        </div>
    </div>
</template>