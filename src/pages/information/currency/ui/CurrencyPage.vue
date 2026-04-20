<script setup lang="ts">
import CurrencyHeader from './CurrencyHeader.vue';
import CurrencyTable from './CurrencyTable.vue';

</script>

<template>
    <div class="h-full flex flex-col bg-[#ffffff]">
        <CurrencyHeader />
        <div class="flex-1 min-h-0">
            <CurrencyTable />
        </div>
    </div>
</template>