<script setup lang="ts">
import SystemBalanceWidget from '@/widgets/System/SystemBalanceWidget.vue';
import SystemHeader from './SystemHeader.vue';
import SystemPlanningWidget from '@/widgets/System/SystemPlanningWidget.vue';
import SystemBudgetWidget from '@/widgets/System/SystemBudgetWidget.vue';
import SystemExpenses from '@/widgets/System/SystemExpenses.vue';
import { ElEmpty } from 'element-plus';

const flag = <boolean>(false)
</script>

<template>
  <SystemHeader />
  <div class="p-5">
    <div class="grid grid-cols-2 gap-4">
      <SystemBalanceWidget title="Баланс счетов">
        <ElEmpty v-if="!flag" description="Информации нет" />
      </SystemBalanceWidget>
      <SystemPlanningWidget title="Запланировано">
        <ElEmpty v-if="!flag" description="Информации нет" />
      </SystemPlanningWidget>
      <SystemBudgetWidget title="Бюджет">
        <ElEmpty v-if="!flag" description="Информации нет" />
      </SystemBudgetWidget>
      <SystemExpenses title="Расходы по категориям">
        <ElEmpty v-if="!flag" description="Информации нет" />
      </SystemExpenses>
    </div>
  </div>
</template>
