<script setup lang="ts">
withDefaults(defineProps<{
  balance: number
}>(), {
})

function formatMoney(value: number) {
  return `${value.toLocaleString('ru-RU', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} р`
}
</script>

<template>
  <footer class="transaction-balance-bar">
    <strong>Общий баланс: {{ formatMoney(balance) }}</strong>
  </footer>
</template>

<style scoped>
.transaction-balance-bar {
  display: flex;
  min-height: 45px;
  flex: 0 0 auto;
  align-items: center;
  justify-content: flex-end;
  gap: 20px;
  border-top: 1px solid #aeb7c2;
  background: linear-gradient(#f7f9fb, #d5dbe2);
  padding: 5px 18px;
  color: #18232d;
  font-size: 13px;
  line-height: 17px;
}

.transaction-balance-bar__operations {
  min-width: 126px;
}

.transaction-balance-bar strong {
  font-size: 16px;
  white-space: nowrap;
}

@media (max-width: 620px) {
  .transaction-balance-bar {
    gap: 10px;
    padding-inline: 10px;
  }

  .transaction-balance-bar strong {
    font-size: 14px;
  }
}
</style>
