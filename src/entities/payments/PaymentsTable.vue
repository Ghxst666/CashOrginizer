<script setup lang="ts">
import { Delete, EditPen } from '@element-plus/icons-vue'
import { computed, ref } from 'vue'
import EditPaymentDialog from '@/pages/transactions/payments/ui/EditPaymentDialog.vue'
import { useDeletePayment, usePaymentsInfiniteScrollQuery } from '@/entities/transaction/payments'
import type { PaymentListItemResponse } from '@/entities/transaction/payments/types/payments.types'

const {
    data,
    target,
    isLoading,
    isFetchingNextPage,
} = usePaymentsInfiniteScrollQuery()

const deletePayment = useDeletePayment()
const selectedPayment = ref<PaymentListItemResponse | null>(null)
const isOpenEdit = ref(false)

const tableData = computed(() => data.value?.pages.flat() ?? [])

function handleOpenEditPayment(row: PaymentListItemResponse) {
    selectedPayment.value = { ...row }
    isOpenEdit.value = true
}

function handleDeletePayment(payment_id: number) {
    deletePayment.mutate({ payment_id })
}
</script>

<template>
    <div style="height: calc(100vh - 113px);">
        <EditPaymentDialog
            v-if="selectedPayment && isOpenEdit"
            :key="selectedPayment.id"
            v-model="isOpenEdit"
            :payment="selectedPayment"
        />

        <ElTable
            v-loading="isLoading"
            height="100%"
            border
            :data="tableData"
        >
            <ElTableColumn width="100" prop="payment_date" label="Дата" />
            <ElTableColumn prop="account_title" label="Счет" />
            <ElTableColumn prop="project" label="Проект" />
            <ElTableColumn prop="amount" label="Сумма/Баланс" />
            <ElTableColumn
                width="140px"
                align="center"
            >
                <template #default="{ row }">
                    <ElButton
                        type="primary"
                        :icon="EditPen"
                        @click="handleOpenEditPayment(row)"
                    />
                    <ElPopconfirm
                        width="220"
                        :icon="undefined"
                        title="Вы хотите удалить платеж?"
                    >
                        <template #reference>
                            <ElButton
                                type="danger"
                                :icon="Delete"
                                :loading="deletePayment.isPending.value"
                            />
                        </template>

                        <template #actions="{ cancel }">
                            <ElButton
                                size="small"
                                @click="cancel"
                            >
                                Нет
                            </ElButton>
                            <ElButton
                                type="danger"
                                size="small"
                                :loading="deletePayment.isPending.value"
                                @click="handleDeletePayment(row.id)"
                            >
                                Да
                            </ElButton>
                        </template>
                    </ElPopconfirm>
                </template>
            </ElTableColumn>

            <template #append>
                <div
                    ref="target"
                    class="h-px"
                />
                <div
                    v-if="isFetchingNextPage"
                    class="py-2 text-center text-sm text-gray-500"
                >
                    Загрузка...
                </div>
            </template>
        </ElTable>
    </div>
</template>
