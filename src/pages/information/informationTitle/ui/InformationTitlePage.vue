<script setup lang="ts">
import InformationHeader from './InformationHeader.vue';
import InformationTable from './InformationTable.vue';


</script>

<template>
    <div class="h-full flex flex-col bg-[#ffffff]">
        <InformationHeader />
        <div class="flex-1 min-h-0">
            <InformationTable />
        </div>
    </div>
</template>