<script setup lang="ts">
import TagHeader from './TagHeader.vue';
import TagTable from './TagTable.vue';


</script>

<template>
    <div class="h-full flex flex-col bg-[#ffffff]">
        <TagHeader />
        <div class="flex-1 min-h-0">
            <TagTable />
        </div>
    </div>
</template>