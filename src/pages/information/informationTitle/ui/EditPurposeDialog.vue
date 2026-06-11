<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { useCategoriesQuery } from '@/entities/category'
import { useProjectsQuery } from '@/entities/project'
import { useUpdatePurposes } from '@/entities/purposes'
import type { purposesRowData, updatePurposesData } from '@/entities/purposes/types/purposes.types'
import {
  useCreatePurposeSplit,
  useDeletePurposeSplit,
  useEditPurposeSplit,
  usePurposeSplitsQuery,
} from '@/entities/purposes-split'
import type { CreatePurposeSplitRequest, EditPurposeSplitRequest } from '@/entities/purposes-split/types/purposes-split.types'
import { NewPayDialog } from '@/shared/ui'

interface SelectOptionNode {
  id: number
  title: string
  children?: SelectOptionNode[]
}

interface PurposeEditFormData {
  title: string
  amount: string
  note: string
  category: number | null
  project: number | null
  isAutoUpdate: boolean
}

interface PurposeSplitEditFormData {
  id?: number
  note: string
  amount: string
  project: number | null
}

const props = defineProps<{
  purpose: purposesRowData
}>()

const isOpen = defineModel<boolean>({ required: true })
const updatePurpose = useUpdatePurposes()
const createPurposeSplit = useCreatePurposeSplit()
const editPurposeSplit = useEditPurposeSplit()
const deletePurposeSplit = useDeletePurposeSplit()
const purposeSplitsQuery = usePurposeSplitsQuery(props.purpose.id)
const categoriesEnabled = ref(false)
const projectsEnabled = ref(false)
const { data: categories } = useCategoriesQuery(undefined, categoriesEnabled)
const { data: projects } = useProjectsQuery(undefined, projectsEnabled)

const formData = ref<PurposeEditFormData>({
  title: '',
  amount: '',
  note: '',
  category: null,
  project: null,
  isAutoUpdate: false,
})
const splits = ref<PurposeSplitEditFormData[]>([])
const deletedSplitIds = ref<number[]>([])

const categoryOptions = computed(() => flattenOptions(categories.value?.rows ?? []))
const projectOptions = computed(() => flattenOptions(projects.value?.rows ?? []))
const hasSplitData = computed(() => splits.value.some(split => Boolean(split.id) || isSplitStarted(split)))
const isPending = computed(() => (
  updatePurpose.isPending.value
  || createPurposeSplit.isPending.value
  || editPurposeSplit.isPending.value
  || deletePurposeSplit.isPending.value
))

watch(hasSplitData, (hasSplits) => {
  if (!hasSplits) return

  formData.value.amount = ''
  formData.value.note = ''
  formData.value.project = null
})

watch(
  () => props.purpose,
  (purpose) => {
    formData.value = {
      title: purpose.title,
      amount: purpose.amount || '',
      note: purpose.note || '',
      category: purpose.category_id,
      project: purpose.project_id,
      isAutoUpdate: purpose.is_auto_update,
    }
  },
  { immediate: true },
)

watch(
  () => purposeSplitsQuery.data.value,
  (purposeSplits) => {
    deletedSplitIds.value = []
    splits.value = purposeSplits?.length
      ? purposeSplits.map(split => ({
        id: split.id,
        note: split.note,
        amount: split.amount || '',
        project: split.project_id,
      }))
      : [emptySplitForm()]
  },
  { immediate: true },
)

function flattenOptions(options: SelectOptionNode[]): SelectOptionNode[] {
  return options.flatMap(option => [option, ...flattenOptions(option.children ?? [])])
}

function handleCategoryVisibleChange(visible: boolean) {
  if (visible) categoriesEnabled.value = true
}

function handleProjectVisibleChange(visible: boolean) {
  if (visible) projectsEnabled.value = true
}

function emptySplitForm(): PurposeSplitEditFormData {
  return { note: '', amount: '', project: null }
}

function addSplit() {
  splits.value.push(emptySplitForm())
}

function removeSplit(index: number) {
  const split = splits.value[index]
  if (split?.id) deletedSplitIds.value.push(split.id)

  splits.value.splice(index, 1)
  if (!splits.value.length) splits.value.push(emptySplitForm())
}

function buildPurposePayload(): updatePurposesData {
  return {
    title: formData.value.title,
    amount: hasSplitData.value ? null : normalizeAmount(formData.value.amount) || null,
    note: hasSplitData.value ? null : formData.value.note || null,
    category_id: formData.value.category,
    project_id: hasSplitData.value ? null : formData.value.project,
    is_auto_update: formData.value.isAutoUpdate,
  }
}

function buildCreateSplitPayload(split: PurposeSplitEditFormData): CreatePurposeSplitRequest {
  return { note: split.note, amount: normalizeAmount(split.amount), project_id: split.project }
}

function buildEditSplitPayload(split: PurposeSplitEditFormData): EditPurposeSplitRequest {
  return {
    note: split.note || null,
    amount: normalizeAmount(split.amount) || null,
    project_id: split.project,
  }
}

function normalizeAmount(amount: string) {
  return amount.replace(',', '.')
}

function isSplitStarted(split: PurposeSplitEditFormData) {
  return Boolean(split.note || split.amount || split.project)
}

function validateForm() {
  if (!formData.value.title.trim()) {
    ElMessage.error({ message: 'Укажите название', plain: true })
    return false
  }

  const invalidNewSplit = splits.value.find(split => !split.id && isSplitStarted(split) && (!split.note.trim() || !split.amount.trim()))
  if (invalidNewSplit) {
    ElMessage.error({ message: 'Для нового сплита укажите примечание и сумму', plain: true })
    return false
  }

  return true
}

async function saveSplits() {
  await Promise.all(deletedSplitIds.value.map(split_id => deletePurposeSplit.mutateAsync({
    purpose_id: props.purpose.id,
    split_id,
  })))

  await Promise.all(splits.value
    .filter(split => split.id || isSplitStarted(split))
    .map((split) => {
      if (split.id) {
        return editPurposeSplit.mutateAsync({
          purpose_id: props.purpose.id,
          split_id: split.id,
          data: buildEditSplitPayload(split),
        })
      }

      return createPurposeSplit.mutateAsync({
        purpose_id: props.purpose.id,
        data: buildCreateSplitPayload(split),
      })
    }))
}

async function handleEdit() {
  if (!validateForm()) return

  try {
    await updatePurpose.mutateAsync({ purpose_id: props.purpose.id, data: buildPurposePayload() })
    await saveSplits()
    isOpen.value = false
  } catch {
    // Mutation handlers show user-facing errors.
  }
}
</script>

<template>
  <NewPayDialog
    v-model:new-pay="isOpen"
    title="Редактирование названия"
    first-step-title="Свойства"
    second-step-title="Сплит"
    @close="isOpen = false"
  >
    <template #step-1>
      <ElScrollbar height="400px">
        <ElForm :model="formData" label-position="top" class="purpose-form">
          <ElFormItem label="Название"><ElInput v-model="formData.title" /></ElFormItem>
          <ElFormItem label="Сумма">
            <ElInput
              v-model="formData.amount"
              :disabled="hasSplitData"
              :placeholder="hasSplitData ? 'Смотрите во вкладке Сплиты' : ''"
            />
          </ElFormItem>
          <ElFormItem label="Примечание">
            <ElInput
              v-model="formData.note"
              :disabled="hasSplitData"
              :placeholder="hasSplitData ? 'Смотрите во вкладке Сплиты' : ''"
            />
          </ElFormItem>
          <ElFormItem label="Категория">
            <ElSelect
              v-model="formData.category"
              clearable
              filterable
              @visible-change="handleCategoryVisibleChange"
            >
              <ElOption v-for="category in categoryOptions" :key="category.id" :label="category.title" :value="category.id" />
            </ElSelect>
          </ElFormItem>
          <ElFormItem label="Проект">
            <ElSelect
              v-model="formData.project"
              clearable
              filterable
              :disabled="hasSplitData"
              :placeholder="hasSplitData ? 'Смотрите во вкладке Сплиты' : ''"
              @visible-change="handleProjectVisibleChange"
            >
              <ElOption v-for="project in projectOptions" :key="project.id" :label="project.title" :value="project.id" />
            </ElSelect>
          </ElFormItem>
          <ElFormItem label="Обновлять">
            <ElSelect v-model="formData.isAutoUpdate">
              <ElOption label="Да - из платежа" :value="true" />
              <ElOption label="Нет - вручную" :value="false" />
            </ElSelect>
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
            class="purpose-form"
          >
            <div class="mb-3 flex items-center justify-between">
              <span class="font-bold text-[#2f3a3d]">Сплит {{ index + 1 }}</span>
              <ElButton v-if="splits.length > 1" type="danger" text @click="removeSplit(index)">Удалить</ElButton>
            </div>
            <ElFormItem label="Примечание"><ElInput v-model="split.note" /></ElFormItem>
            <ElFormItem label="Сумма"><ElInput v-model="split.amount" /></ElFormItem>
            <ElFormItem label="Проект">
              <ElSelect
                v-model="split.project"
                clearable
                filterable
                @visible-change="handleProjectVisibleChange"
              >
                <ElOption v-for="project in projectOptions" :key="project.id" :label="project.title" :value="project.id" />
              </ElSelect>
            </ElFormItem>
          </ElForm>
        </div>
        <div class="flex justify-center pt-4">
          <ElButton type="primary" @click="addSplit">Добавить сплит</ElButton>
        </div>
      </ElScrollbar>
    </template>

    <template #actions>
      <ElButton type="primary" :loading="isPending" @click="handleEdit">Готово</ElButton>
    </template>
  </NewPayDialog>
</template>

<style scoped>
.purpose-form {
  padding: 16px;
  border-radius: 12px;
  background: #eef3f4;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06), 0 8px 24px rgba(0, 0, 0, 0.04);
}

.purpose-form :deep(.el-form-item__label) {
  font-weight: 700;
  color: #2f3a3d;
  margin-bottom: 6px;
}

.purpose-form :deep(.el-input__wrapper),
.purpose-form :deep(.el-select__wrapper) {
  border-radius: 8px;
  box-shadow: 0 0 0 1px rgba(120, 140, 145, 0.18) inset;
}
</style>
