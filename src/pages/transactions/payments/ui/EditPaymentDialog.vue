<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { computed, ref, watch } from 'vue'
import { NewPayDialog } from '@/shared/ui'
import { useEditPayment } from '@/entities/transaction/payments'
import {
  useCreatePaymentSplit,
  useDeletePaymentSplit,
  useEditPaymentSplit,
  usePaymentSplitsQuery,
} from '@/entities/transaction/payments-split'
import type { EditPaymentRequest, PaymentListItemResponse } from '@/entities/transaction/payments/types/payments.types'
import type { CreatePaymentSplitRequest, EditPaymentSplitRequest } from '@/entities/transaction/payments-split/types/payments-split.types'
import { useAccountsQuery } from '@/entities/transaction/invoices'

interface PaymentEditFormData {
  check: number | null
  date: string
  sum: string
  note: string
  category: number | null
  project: number | null
  number: string
}

interface SplitEditFormData {
  id?: number
  note: string
  sum: string
  project: number | null
}

const props = defineProps<{
  payment: PaymentListItemResponse
}>()

const isOpen = defineModel<boolean>({ required: true })

const editPayment = useEditPayment()
const paymentSplitsQuery = usePaymentSplitsQuery(props.payment.id)
const createPaymentSplit = useCreatePaymentSplit()
const editPaymentSplit = useEditPaymentSplit()
const deletePaymentSplit = useDeletePaymentSplit()

const formData = ref<PaymentEditFormData>({
  check: null,
  date: '',
  sum: '',
  note: '',
  category: null,
  project: null,
  number: '',
})
const splits = ref<SplitEditFormData[]>([])
const deletedSplitIds = ref<number[]>([])

const { data: accounts } = useAccountsQuery(false)
const accountOptions = computed(() => accounts.value ?? [])

const isPending = computed(() => (
  editPayment.isPending.value
  || createPaymentSplit.isPending.value
  || editPaymentSplit.isPending.value
  || deletePaymentSplit.isPending.value
))

watch(
  () => props.payment,
  (payment) => {
    formData.value = {
      check: payment.account_id,
      date: payment.payment_date || '',
      sum: payment.amount || '',
      note: payment.note || '',
      category: payment.category_id || null,
      project: payment.project_id || null,
      number: payment.number || '',
    }
  },
  { immediate: true },
)

watch(
  () => paymentSplitsQuery.data.value,
  (paymentSplits) => {
    deletedSplitIds.value = []
    splits.value = paymentSplits?.length
      ? paymentSplits.map(split => ({
        id: split.id,
        note: split.note || '',
        sum: split.amount || '',
        project: split.project_id || null,
      }))
      : [emptySplitForm()]
  },
  { immediate: true },
)

function emptySplitForm(): SplitEditFormData {
  return {
    note: '',
    sum: '',
    project: null,
  }
}

function buildPaymentPayload(): EditPaymentRequest {
  return {
    account_id: Number(formData.value.check),
    payment_date: formData.value.date || null,
    amount: formData.value.sum || null,
    note: formData.value.note || null,
    category_id: formData.value.category,
    project_id: formData.value.project,
    number: formData.value.number || null,
  }
}

function buildCreateSplitPayload(split: SplitEditFormData): CreatePaymentSplitRequest {
  return {
    note: split.note || null,
    amount: split.sum || null,
    project_id: split.project,
  }
}

function buildEditSplitPayload(split: SplitEditFormData): EditPaymentSplitRequest {
  return buildCreateSplitPayload(split)
}

function isSplitFilled(split: SplitEditFormData) {
  return Boolean(split.note || split.sum || split.project)
}

function handleClose() {
  isOpen.value = false
}

function addSplit() {
  splits.value.push(emptySplitForm())
}

function removeSplit(index: number) {
  const split = splits.value[index]

  if (split?.id) {
    deletedSplitIds.value.push(split.id)
  }

  splits.value.splice(index, 1)

  if (!splits.value.length) {
    splits.value.push(emptySplitForm())
  }
}

async function savePaymentFields() {
  if (formData.value.check === null) {
    ElMessage.error({
      message: 'Выберите счет',
      plain: true,
    })
    throw new Error('account_required')
  }

  await editPayment.mutateAsync({
    payment_id: props.payment.id,
    data: buildPaymentPayload(),
  })
}

async function savePaymentSplits() {
  await Promise.all(
    deletedSplitIds.value.map(split_id => deletePaymentSplit.mutateAsync({
      payment_id: props.payment.id,
      split_id,
    })),
  )

  await Promise.all(
    splits.value
      .filter(split => split.id || isSplitFilled(split))
      .map((split) => {
        if (split.id) {
          return editPaymentSplit.mutateAsync({
            payment_id: props.payment.id,
            split_id: split.id,
            data: buildEditSplitPayload(split),
          })
        }

        return createPaymentSplit.mutateAsync({
          payment_id: props.payment.id,
          data: buildCreateSplitPayload(split),
        })
      }),
  )
}

async function handleEditPayment() {
  try {
    await savePaymentFields()
    await savePaymentSplits()
    handleClose()
  } catch {
    // Mutation handlers show user-facing errors.
  }
}
</script>

<template>
  <NewPayDialog
    v-model:new-pay="isOpen"
    title="Редактирование платежа"
    first-step-title="Свойства"
    second-step-title="Сплит"
    @close="handleClose"
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
            :key="split.id || index"
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
        @click="handleEditPayment"
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
