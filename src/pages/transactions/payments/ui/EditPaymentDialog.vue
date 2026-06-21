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
import { useCategoriesQuery } from '@/entities/category'
import { useProjectsQuery } from '@/entities/project'
import {
  amountToNumber,
  flattenCategoryOptions,
  formatAmountForPayload,
  formatAmountForType,
  paymentTypeOptions,
  type PaymentCategoryOptionNode,
  type PaymentDialogType,
} from '../lib/payment-dialog-helpers'

interface SelectOptionNode {
  id: number
  title: string
  children?: SelectOptionNode[]
}

interface PaymentEditFormData {
  check: number | null
  date: string
  type: PaymentDialogType
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
  type: 'expenses',
  sum: '',
  note: '',
  category: null,
  project: null,
  number: '',
})
const splits = ref<SplitEditFormData[]>([])
const deletedSplitIds = ref<number[]>([])

const { data: accounts } = useAccountsQuery(false)
const categoriesEnabled = ref(false)
const projectsEnabled = ref(false)
const { data: categories } = useCategoriesQuery(undefined, categoriesEnabled)
const { data: projects } = useProjectsQuery(undefined, projectsEnabled)
const accountOptions = computed(() => accounts.value ?? [])
const categoryOptions = computed(() => (
  flattenCategoryOptions((categories.value?.rows ?? []) as PaymentCategoryOptionNode[])
    .filter(category => category.type === formData.value.type)
))
const projectOptions = computed(() => flattenOptions(projects.value?.rows ?? []))
const hasSplitData = computed(() => splits.value.some(split => Boolean(split.id) || isSplitFilled(split)))
const firstSplitProject = computed(() => splits.value[0]?.project ?? null)
const splitTotalAmount = computed(() => (
  splits.value.reduce((total, split) => total + amountToNumber(split.sum, formData.value.type), 0)
))
const splitTotalAmountText = computed(() => String(splitTotalAmount.value))
const paymentAmountValue = computed(() => (
  hasSplitData.value ? splitTotalAmountText.value : formData.value.sum
))
const paymentNoteValue = computed(() => (
  hasSplitData.value ? 'Смотрите во вкладке Сплиты' : formData.value.note
))
const paymentProjectValue = computed(() => (
  hasSplitData.value ? firstSplitProject.value : formData.value.project
))

const isPending = computed(() => (
  editPayment.isPending.value
  || createPaymentSplit.isPending.value
  || editPaymentSplit.isPending.value
  || deletePaymentSplit.isPending.value
))

watch(
  () => formData.value.type,
  (type) => {
    formData.value.sum = formatAmountForType(formData.value.sum, type)
    splits.value.forEach((split) => {
      split.sum = formatAmountForType(split.sum, type)
    })
    ensureSelectedCategoryMatchesType()
  },
)

watch(categoryOptions, () => {
  ensureSelectedCategoryMatchesType()
})

watch(firstSplitProject, (projectId) => {
  if (projectId !== null) projectsEnabled.value = true
})

watch(
  () => props.payment,
  (payment) => {
    formData.value = {
      check: payment.account_id,
      date: payment.payment_date || '',
      type: payment.type === 'profits' ? 'profits' : 'expenses',
      sum: formatAmountForType(payment.amount || '', payment.type === 'profits' ? 'profits' : 'expenses'),
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
        sum: formatAmountForType(split.amount || '', formData.value.type),
        project: split.project_id || null,
      }))
      : []
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

function flattenOptions(options: SelectOptionNode[]): SelectOptionNode[] {
  return options.flatMap(option => [
    option,
    ...flattenOptions(option.children ?? []),
  ])
}

function handleCategoryVisibleChange(visible: boolean) {
  if (visible) categoriesEnabled.value = true
}

function handleProjectVisibleChange(visible: boolean) {
  if (visible) projectsEnabled.value = true
}

function ensureSelectedCategoryMatchesType() {
  if (!formData.value.category || !categoryOptions.value.length) return

  if (!categoryOptions.value.some(category => category.id === formData.value.category)) {
    formData.value.category = null
  }
}

function buildPaymentPayload(): EditPaymentRequest {
  return {
    account_id: Number(formData.value.check),
    payment_date: formData.value.date || null,
    amount: hasSplitData.value
      ? formatAmountForPayload(splitTotalAmountText.value, formData.value.type)
      : formatAmountForPayload(formData.value.sum, formData.value.type),
    type: formData.value.type,
    note: hasSplitData.value ? 'split' : formData.value.note || null,
    category_id: formData.value.category,
    project_id: hasSplitData.value ? firstSplitProject.value : formData.value.project,
    number: formData.value.number || null,
  }
}

function buildCreateSplitPayload(split: SplitEditFormData): CreatePaymentSplitRequest {
  return {
    note: split.note || null,
    amount: formatAmountForPayload(split.sum, formData.value.type),
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
}

function handlePaymentAmountInput(value: string) {
  formData.value.sum = formatAmountForType(value, formData.value.type)
}

function handlePaymentNoteInput(value: string) {
  formData.value.note = value
}

function handlePaymentProjectInput(value: number | null) {
  formData.value.project = value
}

function handleSplitAmountInput(split: SplitEditFormData, value: string) {
  split.sum = formatAmountForType(value, formData.value.type)
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

          <ElFormItem label="Тип">
            <ElRadioGroup v-model="formData.type">
              <ElRadioButton
                v-for="option in paymentTypeOptions"
                :key="option.value"
                :value="option.value"
              >
                {{ option.label }}
              </ElRadioButton>
            </ElRadioGroup>
          </ElFormItem>

          <ElFormItem label="Сумма">
            <ElInput
              :model-value="paymentAmountValue"
              :disabled="hasSplitData"
              :placeholder="hasSplitData ? 'Смотрите во вкладке Сплиты' : ''"
              @input="handlePaymentAmountInput"
            />
          </ElFormItem>

          <ElFormItem label="Примечание">
            <ElInput
              :model-value="paymentNoteValue"
              :disabled="hasSplitData"
              :placeholder="hasSplitData ? 'Смотрите во вкладке Сплиты' : ''"
              @input="handlePaymentNoteInput"
            />
          </ElFormItem>

          <ElFormItem label="Категория">
            <ElSelect
              v-model="formData.category"
              clearable
              filterable
              @visible-change="handleCategoryVisibleChange"
            >
              <ElOption
                v-for="category in categoryOptions"
                :key="category.id"
                :label="category.title"
                :value="category.id"
              />
            </ElSelect>
          </ElFormItem>

          <ElFormItem label="Проект">
            <ElSelect
              :model-value="paymentProjectValue"
              clearable
              filterable
              :disabled="hasSplitData"
              :placeholder="hasSplitData ? 'Смотрите во вкладке Сплиты' : ''"
              @visible-change="handleProjectVisibleChange"
              @update:model-value="handlePaymentProjectInput"
            >
              <ElOption
                v-for="project in projectOptions"
                :key="project.id"
                :label="project.title"
                :value="project.id"
              />
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
        <div
          v-if="splits.length"
          class="flex flex-col gap-4"
        >
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
              <ElInput
                :model-value="split.sum"
                @input="value => handleSplitAmountInput(split, value)"
              />
            </ElFormItem>

            <ElFormItem label="Проект">
              <ElSelect
                v-model="split.project"
                clearable
                filterable
                @visible-change="handleProjectVisibleChange"
              >
                <ElOption
                  v-for="project in projectOptions"
                  :key="project.id"
                  :label="project.title"
                  :value="project.id"
                />
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
