<script setup lang="ts">
import BudgetFooter from './BudgetFooter.vue';
import BudgetHeader from './BudgetHeader.vue';
import BudgetTable from './BudgetTable.vue';

</script>

<template>
    <div class="h-full flex flex-col bg-[#ffffff]">
        <BudgetHeader />
        <div class="flex-1 min-h-0">
            <BudgetTable />
        </div>
        <BudgetFooter/>
    </div>
</template>