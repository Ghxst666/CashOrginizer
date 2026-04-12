<script setup lang="ts">
import InvoicesTable from '@/entities/Invoices/InvoicesTable.vue';
import InvoicesHeader from './InvoicesHeader.vue';

</script>

<template>
  <div class="h-full">
    <InvoicesHeader />
    <InvoicesTable />
  </div>
</template>
