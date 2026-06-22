<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { NewPayDialog } from '@/shared/ui'
import OverflowTooltip from '@/shared/ui/OverflowTooltip.vue'
import { useCreatePayment } from '@/entities/transaction/payments'
import { useCreatePaymentSplit } from '@/entities/transaction/payments-split'
import type { CreatePaymentRequest } from '@/entities/transaction/payments/types/payments.types'
import type { CreatePaymentSplitRequest } from '@/entities/transaction/payments-split/types/payments-split.types'
import { useAccountsQuery } from '@/entities/transaction/invoices'
import { useCategoriesQuery } from '@/entities/category'
import { useProjectsQuery } from '@/entities/project'
import { useCreatePurposes, usePurposesQuery } from '@/entities/purposes'
import type { purposesRowData } from '@/entities/purposes/types/purposes.types'
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
  toAccount: number | null
  date: string
  type: PaymentDialogType
  purpose: number | null
  sum: string
  note: string
  category: number | null
  project: number | null
  tag: string
  metca: string
}

interface SplitFormData {
  note: string
  sum: string
  project: number | null
}

type PickerField = 'account' | 'to_account' | 'purpose' | 'category' | 'project' | 'note'

interface PickerOption {
  id: number
  title: string
  note?: string | null
}

const emit = defineEmits<{
  close: []
}>()

const newPayDialogVisible = defineModel<boolean>('newPay', { required: true })

const createPayment = useCreatePayment()
const createPaymentSplit = useCreatePaymentSplit()
const createPurpose = useCreatePurposes()

const emptyPaymentForm = (): PaymentFormData => ({
  check: null,
  toAccount: null,
  date: '',
  type: 'expenses',
  purpose: null,
  sum: '',
  note: '',
  category: null,
  project: null,
  tag: '',
  metca: '',
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
const { data: purposesData } = usePurposesQuery()
const formData = ref<PaymentFormData>(emptyPaymentForm())
const splits = ref<SplitFormData[]>([])
const activePicker = ref<PickerField>('purpose')
const pickerSearch = ref('')
const isNewPurposeDialogOpen = ref(false)
const newPurposeTitle = ref('')

const accountOptions = computed(() => accounts.value ?? [])
const categoryOptions = computed(() => (
  flattenCategoryOptions((categories.value?.rows ?? []) as PaymentCategoryOptionNode[])
    .filter(category => category.type === formData.value.type)
))
const projectOptions = computed(() => flattenOptions(projects.value?.rows ?? []))
const purposeOptions = computed(() => purposesData.value?.rows ?? [])
const pickerOptions = computed<PickerOption[]>(() => {
  let options: PickerOption[] = []

  if (activePicker.value === 'account' || activePicker.value === 'to_account') options = accountOptions.value
  if (activePicker.value === 'purpose') options = purposeOptions.value
  if (activePicker.value === 'category') options = categoryOptions.value
  if (activePicker.value === 'project') options = projectOptions.value

  const query = pickerSearch.value.trim().toLocaleLowerCase()
  if (!query) return options

  return options.filter(option => (
    option.title.toLocaleLowerCase().includes(query)
    || option.note?.toLocaleLowerCase().includes(query)
  ))
})
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

const isPending = computed(() => (
  createPayment.isPending.value
  || createPaymentSplit.isPending.value
  || createPurpose.isPending.value
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

function resetForm() {
  formData.value = emptyPaymentForm()
  splits.value = []
  pickerSearch.value = ''
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

function setActivePicker(field: PickerField) {
  activePicker.value = field
  pickerSearch.value = ''

  if (field === 'category') categoriesEnabled.value = true
  if (field === 'project') projectsEnabled.value = true
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
    to_account_id: formData.value.type === 'transfers' ? formData.value.toAccount : null,
    purpose_id: formData.value.purpose,
    note: hasSplitData.value ? 'split' : formData.value.note || null,
    category_id: formData.value.category,
    project_id: hasSplitData.value ? firstSplitProject.value : formData.value.project,
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

function handlePurposeSelection(purposeId: number | null) {
  formData.value.purpose = purposeId
}

function handlePickerOptionSelect(optionId: number) {
  if (activePicker.value === 'account') formData.value.check = optionId
  if (activePicker.value === 'to_account') formData.value.toAccount = optionId
  if (activePicker.value === 'purpose') handlePurposeSelection(optionId)
  if (activePicker.value === 'category') formData.value.category = optionId
  if (activePicker.value === 'project') formData.value.project = optionId
}

function handleOpenNewPurposeDialog() {
  newPurposeTitle.value = ''
  isNewPurposeDialogOpen.value = true
}

function getPurposeLabel(purpose: purposesRowData) {
  return purpose.title
}

async function handleCreatePurpose() {
  const title = newPurposeTitle.value.trim()

  if (!title) {
    ElMessage.error({ message: 'Укажите название', plain: true })
    return
  }

  try {
    const note = formData.value.note.trim() || 'new'
    const response = await createPurpose.mutateAsync({ title, note })

    handlePurposeSelection(response.data.data.id)
    isNewPurposeDialogOpen.value = false
  } catch {
    // Mutation handlers show user-facing errors.
  }
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

  if (formData.value.type === 'transfers' && formData.value.category !== null && formData.value.toAccount === null) {
    ElMessage.error({ message: 'Выберите счет назначения', plain: true })
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
      <div class="payment-create-layout">
        <ElScrollbar height="400px" class="payment-create-layout__form">
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
              @focus="setActivePicker('account')"
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
            <ElSelect
              v-model="formData.purpose"
              clearable
              filterable
              placeholder="Выберите название"
              @focus="setActivePicker('purpose')"
              @change="handlePurposeSelection"
            >
              <ElOption
                v-for="purpose in purposeOptions"
                :key="purpose.id"
                :label="getPurposeLabel(purpose)"
                :value="purpose.id"
              />
            </ElSelect>
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
              @focus="setActivePicker('note')"
              @input="handlePaymentNoteInput"
            />
          </ElFormItem>

          <ElFormItem label="Категория">
            <ElSelect
              v-model="formData.category"
              clearable
              filterable
              @focus="setActivePicker('category')"
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

          <ElFormItem
            v-if="formData.type === 'transfers' && formData.category !== null"
            label="В счет"
            required
          >
            <ElSelect
              v-model="formData.toAccount"
              clearable
              filterable
              placeholder="Выберите счет"
              @focus="setActivePicker('to_account')"
            >
              <ElOption
                v-for="account in accountOptions.filter(account => account.id !== formData.check)"
                :key="account.id"
                :label="account.title"
                :value="account.id"
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
              @focus="setActivePicker('project')"
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

        </ElForm>
        </ElScrollbar>

        <aside class="purpose-picker">
          <div v-if="activePicker !== 'note'" class="purpose-picker__toolbar">
            <ElInput
              v-model="pickerSearch"
              clearable
              placeholder="Название"
            />
            <ElButton
              v-if="activePicker === 'purpose'"
              type="primary"
              @click="handleOpenNewPurposeDialog"
            >
              Новый
            </ElButton>
          </div>

          <div v-else class="purpose-picker__note-editor">
            <label for="payment-note-editor">Примечание</label>
            <ElInput
              id="payment-note-editor"
              v-model="formData.note"
              type="textarea"
              :rows="8"
              placeholder="Введите примечание"
            />
          </div>

          <ElScrollbar v-if="activePicker !== 'note'" class="purpose-picker__list">
            <button
              v-for="option in pickerOptions"
              :key="option.id"
              class="purpose-picker__option"
              :class="{
                'purpose-picker__option--selected': (
                  (activePicker === 'account' && formData.check === option.id)
                  || (activePicker === 'to_account' && formData.toAccount === option.id)
                  || (activePicker === 'purpose' && formData.purpose === option.id)
                  || (activePicker === 'category' && formData.category === option.id)
                  || (activePicker === 'project' && formData.project === option.id)
                ),
              }"
              type="button"
              @click="handlePickerOptionSelect(option.id)"
            >
              <OverflowTooltip :content="option.title">
                <span class="purpose-picker__title">{{ option.title }}</span>
              </OverflowTooltip>
              <OverflowTooltip v-if="option.note" :content="option.note">
                <span class="purpose-picker__note">{{ option.note }}</span>
              </OverflowTooltip>
            </button>

            <div v-if="!pickerOptions.length" class="purpose-picker__empty">
              Ничего не найдено
            </div>
          </ElScrollbar>
        </aside>
      </div>
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

  <ElDialog
    v-model="isNewPurposeDialogOpen"
    title="Новое название"
    width="420px"
    append-to-body
  >
    <ElForm label-position="top">
      <ElFormItem label="Название">
        <ElInput
          v-model="newPurposeTitle"
          placeholder="Введите название"
          @keyup.enter="handleCreatePurpose"
        />
      </ElFormItem>
    </ElForm>

    <template #footer>
      <ElButton @click="isNewPurposeDialogOpen = false">
        Отмена
      </ElButton>
      <ElButton
        type="primary"
        :loading="createPurpose.isPending.value"
        @click="handleCreatePurpose"
      >
        Создать
      </ElButton>
    </template>
  </ElDialog>
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

.payment-create-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 280px;
  min-height: 400px;
}

.payment-create-layout__form {
  min-width: 0;
  padding-right: 16px;
}

.purpose-picker {
  display: flex;
  min-width: 0;
  flex-direction: column;
  border-left: 1px solid #d7dde3;
}

.purpose-picker__toolbar {
  display: flex;
  gap: 8px;
  padding: 0 0 10px 12px;
}

.purpose-picker__toolbar :deep(.el-input) {
  min-width: 0;
}

.purpose-picker__list {
  height: 350px;
  border-top: 1px solid #d7dde3;
}

.purpose-picker__note-editor {
  padding: 0 0 0 12px;
}

.purpose-picker__note-editor label {
  display: block;
  margin-bottom: 8px;
  color: #374151;
  font-size: 14px;
  font-weight: 600;
}

.purpose-picker__option {
  display: block;
  width: 100%;
  padding: 10px 12px;
  border: 0;
  border-bottom: 1px solid #e5e7eb;
  background: #fff;
  color: #374151;
  cursor: pointer;
  text-align: left;
}

.purpose-picker__option:hover,
.purpose-picker__option--selected {
  background: #e8f4fb;
}

.purpose-picker__title,
.purpose-picker__note {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.purpose-picker__title {
  font-weight: 600;
}

.purpose-picker__note {
  margin-top: 3px;
  color: #6b7280;
  font-size: 12px;
}

.purpose-picker__empty {
  padding: 18px 12px;
  color: #9ca3af;
  font-size: 13px;
}

@media (max-width: 760px) {
  .payment-create-layout {
    grid-template-columns: 1fr;
  }

  .payment-create-layout__form {
    padding-right: 0;
  }

  .purpose-picker {
    margin-top: 16px;
    border-top: 1px solid #d7dde3;
    border-left: 0;
    padding-top: 12px;
  }

  .purpose-picker__toolbar {
    padding-left: 0;
  }
}
</style>
