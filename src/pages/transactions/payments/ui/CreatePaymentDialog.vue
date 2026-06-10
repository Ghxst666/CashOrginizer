<script setup lang="ts">
import { computed, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { NewPayDialog } from '@/shared/ui'
import { useCreatePayment } from '@/entities/transaction/payments'
import { useCreatePaymentSplit } from '@/entities/transaction/payments-split'
import type { CreatePaymentRequest } from '@/entities/transaction/payments/types/payments.types'
import type { CreatePaymentSplitRequest } from '@/entities/transaction/payments-split/types/payments-split.types'
import { useAccountsQuery } from '@/entities/transaction/invoices'

interface PaymentFormData {
  check: number | null
  date: string
  name: string
  sum: string
  note: string
  category: number | null
  project: number | null
  tag: string
  metca: string
  number: string
}

interface SplitFormData {
  note: string
  sum: string
  project: number | null
}

const emit = defineEmits<{
  close: []
}>()

const newPayDialogVisible = defineModel<boolean>('newPay', { required: true })

const createPayment = useCreatePayment()
const createPaymentSplit = useCreatePaymentSplit()

const emptyPaymentForm = (): PaymentFormData => ({
  check: null,
  date: '',
  name: '',
  sum: '',
  note: '',
  category: null,
  project: null,
  tag: '',
  metca: '',
  number: '',
})

const emptySplitForm = (): SplitFormData => ({
  note: '',
  sum: '',
  project: null,
})

const { data: accounts } = useAccountsQuery(false)
const formData = ref<PaymentFormData>(emptyPaymentForm())
const splits = ref<SplitFormData[]>([emptySplitForm()])

const accountOptions = computed(() => accounts.value ?? [])

const isPending = computed(() => createPayment.isPending.value || createPaymentSplit.isPending.value)

function resetForm() {
  formData.value = emptyPaymentForm()
  splits.value = [emptySplitForm()]
}

function handleCloseDialog() {
  resetForm()
  emit('close')
}

function addSplit() {
  splits.value.push(emptySplitForm())
}

function removeSplit(index: number) {
  splits.value.splice(index, 1)

  if (!splits.value.length) {
    splits.value.push(emptySplitForm())
  }
}

function buildPaymentPayload(): CreatePaymentRequest {
  return {
    account_id: Number(formData.value.check),
    payment_date: formData.value.date,
    amount: formData.value.sum || null,
    note: formData.value.note || null,
    category_id: formData.value.category,
    project_id: formData.value.project,
    number: formData.value.number || null,
  }
}

function buildSplitPayload(split: SplitFormData): CreatePaymentSplitRequest {
  return {
    note: split.note || null,
    amount: split.sum || null,
    project_id: split.project,
  }
}

function isSplitFilled(split: SplitFormData) {
  return Boolean(split.note || split.sum || split.project)
}

async function handleCreatePayment() {
  if (formData.value.check === null) {
    ElMessage.error({
      message: 'Выберите счет',
      plain: true,
    })
    return
  }

  try {
    const paymentResponse = await createPayment.mutateAsync(buildPaymentPayload())
    const paymentId = paymentResponse.data.data.id
    const filledSplits = splits.value.filter(isSplitFilled)

    await Promise.all(
      filledSplits.map(split => createPaymentSplit.mutateAsync({
        payment_id: paymentId,
        data: buildSplitPayload(split),
      })),
    )

    handleCloseDialog()
  } catch {
    // Mutation handlers show user-facing errors.
  }
}
</script>

<template>
  <NewPayDialog
    v-model:new-pay="newPayDialogVisible"
    title="Новый платеж"
    first-step-title="Свойства"
    second-step-title="Сплит"
    @close="handleCloseDialog"
  >
    <template #step-1>
      <ElScrollbar height="400px">
        <ElForm
          :model="formData"
          label-position="top"
          class="payment-form"
        >
          <ElFormItem label="Счет">
            <ElSelect
              v-model="formData.check"
              placeholder="Выберите счет"
              clearable
              filterable
            >
              <ElOption
                v-for="account in accountOptions"
                :key="account.id"
                :label="account.title"
                :value="account.id"
              />
            </ElSelect>
          </ElFormItem>

          <ElFormItem label="Дата">
            <ElDatePicker
              v-model="formData.date"
              value-format="YYYY-MM-DD"
            />
          </ElFormItem>

          <ElFormItem label="Название">
            <ElInput v-model="formData.name" />
          </ElFormItem>

          <ElFormItem label="Сумма">
            <ElInput v-model="formData.sum" />
          </ElFormItem>

          <ElFormItem label="Примечание">
            <ElInput v-model="formData.note" />
          </ElFormItem>

          <ElFormItem label="Категория">
            <!-- TODO: Подвязать реальные категории -->
            <ElSelect v-model="formData.category">
              <ElOption label="Категория 1" :value="1" />
              <ElOption label="Категория 2" :value="2" />
            </ElSelect>
          </ElFormItem>

          <ElFormItem label="Проект">
            <!-- TODO: Подвязать реальные проекты -->
            <ElSelect v-model="formData.project">
              <ElOption label="Проект 1" :value="1" />
              <ElOption label="Проект 2" :value="2" />
            </ElSelect>
          </ElFormItem>

          <ElFormItem label="Метка">
            <!-- TODO: Подвязать реальные метки -->
            <ElSelect v-model="formData.metca">
              <ElOption label="Несогласованный" value="metca 1" />
              <ElOption label="Чистый" value="metca 2" />
              <ElOption label="Согласованный" value="metca 3" />
            </ElSelect>
          </ElFormItem>

          <ElFormItem label="Номер">
            <ElInput v-model="formData.number" />
          </ElFormItem>
        </ElForm>
      </ElScrollbar>
    </template>

    <template #step-2>
      <ElScrollbar height="400px">
        <div class="flex flex-col gap-4">
          <ElForm
            v-for="(split, index) in splits"
            :key="index"
            :model="split"
            label-position="top"
            class="payment-form"
          >
            <div class="mb-3 flex items-center justify-between">
              <span class="font-bold text-[#2f3a3d]">
                Сплит {{ index + 1 }}
              </span>

              <ElButton
                v-if="splits.length > 1"
                type="danger"
                text
                @click="removeSplit(index)"
              >
                Удалить
              </ElButton>
            </div>

            <ElFormItem label="Примечание">
              <ElInput v-model="split.note" />
            </ElFormItem>

            <ElFormItem label="Сумма">
              <ElInput v-model="split.sum" />
            </ElFormItem>

            <ElFormItem label="Проект">
              <!-- TODO: Подвязать реальные проекты -->
              <ElSelect v-model="split.project">
                <ElOption label="Проект 1" :value="1" />
                <ElOption label="Проект 2" :value="2" />
              </ElSelect>
            </ElFormItem>
          </ElForm>
        </div>

        <div class="flex justify-center pt-4">
          <ElButton
            type="primary"
            @click="addSplit"
          >
            Добавить сплит
          </ElButton>
        </div>
      </ElScrollbar>
    </template>

    <template #actions>
      <ElButton
        type="primary"
        :loading="isPending"
        @click="handleCreatePayment"
      >
        Готово
      </ElButton>
    </template>
  </NewPayDialog>
</template>

<style scoped>
.payment-form {
  padding: 16px;
  border-radius: 12px;
  background: #eef3f4;

  box-shadow:
    0 2px 8px rgba(0, 0, 0, 0.06),
    0 8px 24px rgba(0, 0, 0, 0.04);
}

.payment-form :deep(.el-form-item__label) {
  font-weight: 700;
  color: #2f3a3d;
  margin-bottom: 6px;
}

.payment-form :deep(.el-input__wrapper),
.payment-form :deep(.el-select__wrapper),
.payment-form :deep(.el-date-editor.el-input__wrapper) {
  border-radius: 8px;
  box-shadow: 0 0 0 1px rgba(120, 140, 145, 0.18) inset;
}
</style>
