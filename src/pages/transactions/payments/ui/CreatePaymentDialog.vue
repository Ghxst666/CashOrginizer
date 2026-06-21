<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { NewPayDialog } from '@/shared/ui'
import { useCreatePayment } from '@/entities/transaction/payments'
import { useCreatePaymentSplit } from '@/entities/transaction/payments-split'
import type { CreatePaymentRequest } from '@/entities/transaction/payments/types/payments.types'
import type { CreatePaymentSplitRequest } from '@/entities/transaction/payments-split/types/payments-split.types'
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

interface PaymentFormData {
  check: number | null
  date: string
  type: PaymentDialogType
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
  type: 'expenses',
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
const categoriesEnabled = ref(false)
const projectsEnabled = ref(false)
const { data: categories } = useCategoriesQuery(undefined, categoriesEnabled)
const { data: projects } = useProjectsQuery(undefined, projectsEnabled)
const formData = ref<PaymentFormData>(emptyPaymentForm())
const splits = ref<SplitFormData[]>([])

const accountOptions = computed(() => accounts.value ?? [])
const categoryOptions = computed(() => (
  flattenCategoryOptions((categories.value?.rows ?? []) as PaymentCategoryOptionNode[])
    .filter(category => category.type === formData.value.type)
))
const projectOptions = computed(() => flattenOptions(projects.value?.rows ?? []))
const hasSplitData = computed(() => splits.value.some(isSplitFilled))
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

const isPending = computed(() => createPayment.isPending.value || createPaymentSplit.isPending.value)

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

function resetForm() {
  formData.value = emptyPaymentForm()
  splits.value = []
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

function handleCloseDialog() {
  resetForm()
  emit('close')
}

function addSplit() {
  splits.value.push(emptySplitForm())
}

function removeSplit(index: number) {
  splits.value.splice(index, 1)
}

function buildPaymentPayload(): CreatePaymentRequest {
  return {
    account_id: Number(formData.value.check),
    payment_date: formData.value.date,
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

function buildSplitPayload(split: SplitFormData): CreatePaymentSplitRequest {
  return {
    note: split.note || null,
    amount: formatAmountForPayload(split.sum, formData.value.type),
    project_id: split.project,
  }
}

function isSplitFilled(split: SplitFormData) {
  return Boolean(split.note || split.sum || split.project)
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

function handleSplitAmountInput(split: SplitFormData, value: string) {
  split.sum = formatAmountForType(value, formData.value.type)
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

          <ElFormItem label="Название">
            <ElInput v-model="formData.name" />
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
