<script setup lang="ts">
import { useExportPaymentsToCsv } from '@/entities/transaction/payments';
import { useAccountsQuery } from '@/entities/transaction/invoices';
import { computed, ref } from 'vue';

const visible = defineModel<boolean>({ required: true })

const selectedAccountIds = ref<number[]>([])
const exportPaymentsToCsv = useExportPaymentsToCsv()
const { data: accounts } = useAccountsQuery(true, computed(() => visible.value))

const accountOptions = computed(() => (accounts.value ?? []).map(account => ({
    label: account.title,
    value: account.id,
})))

async function submit() {
    await exportPaymentsToCsv.mutateAsync({
        accounts_ids: selectedAccountIds.value,
    })
    visible.value = false
}
</script>

<template>
    <ElDialog
        v-model="visible"
        title="Экспорт в QIF"
        width="520px"
    >
        <ElForm label-position="top">
            <ElFormItem label="Счета">
                <ElSelect
                    v-model="selectedAccountIds"
                    class="w-full"
                    multiple
                    collapse-tags
                    clearable
                    filterable
                    placeholder="Выберите счета"
                >
                    <ElOption
                        v-for="option in accountOptions"
                        :key="option.value"
                        :label="option.label"
                        :value="option.value"
                    />
                </ElSelect>
            </ElFormItem>
        </ElForm>
        <template #footer>
            <ElButton @click="visible = false">
                Отмена
            </ElButton>
            <ElButton
                type="primary"
                :disabled="selectedAccountIds.length === 0"
                :loading="exportPaymentsToCsv.isPending.value"
                @click="submit"
            >
                Экспорт
            </ElButton>
        </template>
    </ElDialog>
</template>
