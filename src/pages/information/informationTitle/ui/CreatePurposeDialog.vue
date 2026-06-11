<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { useCategoriesQuery } from '@/entities/category'
import { useProjectsQuery } from '@/entities/project'
import { useCreatePurposes } from '@/entities/purposes'
import type { createPurposesData } from '@/entities/purposes/types/purposes.types'
import { useCreatePurposeSplit } from '@/entities/purposes-split'
import type { CreatePurposeSplitRequest } from '@/entities/purposes-split/types/purposes-split.types'
import { NewPayDialog } from '@/shared/ui'

interface SelectOptionNode {
  id: number
  title: string
  children?: SelectOptionNode[]
}

interface PurposeFormData {
  title: string
  amount: string
  note: string
  category: number | null
  project: number | null
  isAutoUpdate: boolean
}

interface PurposeSplitFormData {
  note: string
  amount: string
  project: number | null
}

const emit = defineEmits<{
  close: []
}>()

const isOpen = defineModel<boolean>({ required: true })
const createPurpose = useCreatePurposes()
const createPurposeSplit = useCreatePurposeSplit()
const categoriesEnabled = ref(false)
const projectsEnabled = ref(false)
const { data: categories } = useCategoriesQuery(undefined, categoriesEnabled)
const { data: projects } = useProjectsQuery(undefined, projectsEnabled)

const emptyPurposeForm = (): PurposeFormData => ({
  title: '',
  amount: '',
  note: '',
  category: null,
  project: null,
  isAutoUpdate: false,
})

const emptySplitForm = (): PurposeSplitFormData => ({
  note: '',
  amount: '',
  project: null,
})

const formData = ref<PurposeFormData>(emptyPurposeForm())
const splits = ref<PurposeSplitFormData[]>([emptySplitForm()])

const categoryOptions = computed(() => flattenOptions(categories.value?.rows ?? []))
const projectOptions = computed(() => flattenOptions(projects.value?.rows ?? []))
const hasSplitData = computed(() => splits.value.some(isSplitStarted))
const isPending = computed(() => createPurpose.isPending.value || createPurposeSplit.isPending.value)

watch(hasSplitData, (hasSplits) => {
  if (!hasSplits) return

  formData.value.amount = ''
  formData.value.note = ''
  formData.value.project = null
})

function flattenOptions(options: SelectOptionNode[]): SelectOptionNode[] {
  return options.flatMap(option => [option, ...flattenOptions(option.children ?? [])])
}

function handleCategoryVisibleChange(visible: boolean) {
  if (visible) categoriesEnabled.value = true
}

function handleProjectVisibleChange(visible: boolean) {
  if (visible) projectsEnabled.value = true
}

function resetForm() {
  formData.value = emptyPurposeForm()
  splits.value = [emptySplitForm()]
}

function handleClose() {
  isOpen.value = false
  resetForm()
  emit('close')
}

function addSplit() {
  splits.value.push(emptySplitForm())
}

function removeSplit(index: number) {
  splits.value.splice(index, 1)
  if (!splits.value.length) splits.value.push(emptySplitForm())
}

function buildPurposePayload(): createPurposesData {
  const payload: createPurposesData = {
    title: formData.value.title,
    is_auto_update: formData.value.isAutoUpdate,
  }

  if (formData.value.category !== null) payload.category_id = formData.value.category

  if (!hasSplitData.value) {
    if (formData.value.amount.trim()) payload.amount = normalizeAmount(formData.value.amount)
    if (formData.value.note.trim()) payload.note = formData.value.note
    if (formData.value.project !== null) payload.project_id = formData.value.project
  }

  return payload
}

function buildSplitPayload(split: PurposeSplitFormData): CreatePurposeSplitRequest {
  return {
    note: split.note,
    amount: normalizeAmount(split.amount),
    project_id: split.project,
  }
}

function normalizeAmount(amount: string) {
  return amount.replace(',', '.')
}

function isSplitStarted(split: PurposeSplitFormData) {
  return Boolean(split.note || split.amount || split.project)
}

function validateForm() {
  if (!formData.value.title.trim()) {
    ElMessage.error({ message: 'Укажите название', plain: true })
    return false
  }

  const invalidSplit = splits.value.find(split => isSplitStarted(split) && (!split.note.trim() || !split.amount.trim()))
  if (invalidSplit) {
    ElMessage.error({ message: 'Для сплита укажите примечание и сумму', plain: true })
    return false
  }

  return true
}

async function handleCreate() {
  if (!validateForm()) return

  try {
    const response = await createPurpose.mutateAsync(buildPurposePayload())
    const purposeId = response.data.data.id
    const filledSplits = splits.value.filter(isSplitStarted)

    await Promise.all(filledSplits.map(split => createPurposeSplit.mutateAsync({
      purpose_id: purposeId,
      data: buildSplitPayload(split),
    })))

    handleClose()
  } catch {
    // Mutation handlers show user-facing errors.
  }
}
</script>

<template>
  <NewPayDialog
    v-model:new-pay="isOpen"
    title="Новое название"
    first-step-title="Свойства"
    second-step-title="Сплит"
    @close="handleClose"
  >
    <template #step-1>
      <ElScrollbar height="400px">
        <ElForm :model="formData" label-position="top" class="purpose-form">
          <ElFormItem label="Название">
            <ElInput v-model="formData.title" />
          </ElFormItem>
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
              v-model="formData.project"
              clearable
              filterable
              :disabled="hasSplitData"
              :placeholder="hasSplitData ? 'Смотрите во вкладке Сплиты' : ''"
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
            :key="index"
            :model="split"
            label-position="top"
            class="purpose-form"
          >
            <div class="mb-3 flex items-center justify-between">
              <span class="font-bold text-[#2f3a3d]">Сплит {{ index + 1 }}</span>
              <ElButton v-if="splits.length > 1" type="danger" text @click="removeSplit(index)">
                Удалить
              </ElButton>
            </div>
            <ElFormItem label="Примечание">
              <ElInput v-model="split.note" />
            </ElFormItem>
            <ElFormItem label="Сумма">
              <ElInput v-model="split.amount" />
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
          <ElButton type="primary" @click="addSplit">Добавить сплит</ElButton>
        </div>
      </ElScrollbar>
    </template>

    <template #actions>
      <ElButton type="primary" :loading="isPending" @click="handleCreate">Готово</ElButton>
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
