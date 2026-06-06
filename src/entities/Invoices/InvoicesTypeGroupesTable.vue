<script setup lang="ts">
import { Delete, EditPen } from '@element-plus/icons-vue'
import { ElPopconfirm } from 'element-plus'
import { computed } from 'vue'
import {
  accountsResponse,
  accountsSortedByGroupsResponse,
  accountsSortedByTypeResponse,
} from '../transaction/invoices/types/invoices.types'

type AccountsGroup = accountsSortedByTypeResponse | accountsSortedByGroupsResponse

const props = defineProps<{
  data: AccountsGroup[]
}>()

const groups = computed(() => props.data)

const emit = defineEmits<{
  edit: [row: accountsResponse]
  delete: [accountId: number]
  select: [row: accountsResponse]
}>()

function getGroupKey(group: AccountsGroup) {
  return 'group_id' in group ? group.group_id : group.type
}

function handleRowClick(row: accountsResponse) {
  emit('select', row)
}
</script>

<template>
  <div class="h-full min-h-0 overflow-y-auto bg-white p-4">
    <div
      v-for="group in groups"
      :key="getGroupKey(group)"
      class="mb-6"
    >
      <h3 class="mb-2 text-lg font-semibold">{{ group.title }}</h3>

      <ElTable
        :data="group.accounts"
        border
        @row-click="handleRowClick"
      >
        <ElTableColumn width="50" type="index" label="№" />
        <ElTableColumn prop="title" label="Название счета" />
        <ElTableColumn width="500" prop="amount" label="Общий баланс">
          <template #default="{ row }">
            {{ Number(row.amount).toLocaleString('ru-RU') }} ₽
          </template>
        </ElTableColumn>
        <ElTableColumn
          width="140px"
          align="center"
        >
          <template #default="{ row }">
            <ElButton type="primary" :icon="EditPen" @click.stop="emit('edit', row)" />
            <ElPopconfirm
              width="220"
              :icon="undefined"
              title="Вы хотите удалить счет?"
            >
              <template #reference>
                <ElButton type="danger" :icon="Delete" @click.stop />
              </template>

              <template #actions="{ cancel }">
                <ElButton size="small" @click="cancel">Нет</ElButton>
                <ElButton type="danger" size="small" @click="emit('delete', row.id)">Да</ElButton>
              </template>
            </ElPopconfirm>
          </template>
        </ElTableColumn>
      </ElTable>
    </div>
  </div>
</template>
