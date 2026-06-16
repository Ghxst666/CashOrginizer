<script setup lang="ts">
import { Delete, EditPen } from '@element-plus/icons-vue';
import { ElPopconfirm } from 'element-plus';
import { accountsResponse } from '../transaction/invoices/types/invoices.types'

defineProps<{
    data: accountsResponse[]
}>()

const emit = defineEmits<{
  edit: [row: accountsResponse]
  delete: [accountId: number]
  select: [row: accountsResponse]
  openPayments: [row: accountsResponse]
}>()

function handleRowClick(row: accountsResponse) {
  emit('select', row)
}

function handleRowDblClick(row: accountsResponse) {
  emit('openPayments', row)
}
</script>

<template>
    <div class="h-full min-h-0 min-w-0 flex overflow-hidden">
        <ElTable height="100%" border :data="data" @row-click="handleRowClick" @row-dblclick="handleRowDblClick">
            <ElTableColumn width="50" type="index" label="№"/>
            <ElTableColumn prop="title" label="Название счета" />
            <ElTableColumn width="500" prop="amount" label="Общий баланс" />
            <ElTableColumn
                width="140px"
                align="center"
            >
                <template #default="{ row }">
                    <ElButton type="primary" :icon="EditPen" @click="emit('edit', row)" />
                    <ElPopconfirm
                        width="220"
                        :icon="undefined"
                        title="Вы хотите удалить счет?"
                    >
                        <template #reference>
                            <ElButton type="danger" :icon="Delete" />
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
</template>
