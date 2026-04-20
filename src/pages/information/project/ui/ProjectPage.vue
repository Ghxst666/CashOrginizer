<script setup lang="ts">
import ProjectHeader from './ProjectHeader.vue';
import ProjectTable from './ProjectTable.vue';

</script>

<template>
    <div class="h-full flex flex-col bg-[#ffffff]">
        <ProjectHeader />
        <div class="flex-1 min-h-0">
            <ProjectTable />
        </div>
    </div>
</template>