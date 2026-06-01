<script setup lang="ts">
import { computed, ref } from 'vue'

type Account = {
  id: number
  title: string
  type: string
  amount: number
}

const mockAccounts = ref<Account[]>([
  { id: 1, title: 'Тинькофф', type: 'bank', amount: 125000 },
  { id: 2, title: 'Наличные дом', type: 'cash', amount: 18000 },
  { id: 3, title: 'Альфа кредитка', type: 'creditcard', amount: -32000 },
  { id: 4, title: 'Сбер дебет', type: 'debitcard', amount: 54000 },
  { id: 5, title: 'Кошелек', type: 'cash', amount: 3500 },
])

const typeTitleMap: Record<string, string> = {
  bank: 'Банк',
  cash: 'Наличные',
  creditcard: 'Кредитные карты',
  debitcard: 'Дебетовые карты',
  property: 'Имущество',
  investments: 'Инвестиции',
  debt: 'Долги',
  loan: 'Займы',
  receivable: 'Дебиторка',
  tax: 'Налоговые',
}

const grouped = computed(() => {
  const dict: Record<string, Account[]> = {}

  for (const acc of mockAccounts.value) {
    if (!dict[acc.type]) dict[acc.type] = []
    dict[acc.type].push(acc)
  }

  return Object.entries(dict).map(([type, accounts]) => ({
    type,
    title: typeTitleMap[type] ?? type,
    accounts,
  }))
})
</script>

<template>
  <div class="h-[calc(100vh-113px)] overflow-y-auto bg-white p-4">
    <div v-for="group in grouped" :key="group.type" class="mb-6">
      <h3 class="mb-2 text-lg font-semibold">{{ group.title }}</h3>

      <ElTable :data="group.accounts" border>
        <ElTableColumn width="60" prop="id" label="№" />
        <ElTableColumn prop="title" label="Счет" />
        <ElTableColumn label="Баланс">
          <template #default="{ row }">
            {{ Number(row.amount).toLocaleString('ru-RU') }} ₽
          </template>
        </ElTableColumn>
      </ElTable>
    </div>
  </div>
</template>