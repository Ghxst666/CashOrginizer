<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { useCategoriesQuery } from '@/entities/category'
import { useProjectsQuery } from '@/entities/project'
import { useCreatePurposes, useUpdatePurposes } from '@/entities/purposes'
import type { createPurposesData, purposesRowData, updatePurposesData } from '@/entities/purposes/types/purposes.types'

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
}

const props = defineProps<{
  purpose?: purposesRowData | null
}>()

const emit = defineEmits<{
  close: []
}>()

const isOpen = defineModel<boolean>({ required: true })
const createPurpose = useCreatePurposes()
const updatePurpose = useUpdatePurposes()
const categoriesEnabled = ref(false)
const projectsEnabled = ref(false)
const { data: categories } = useCategoriesQuery(undefined, categoriesEnabled)
const { data: projects } = useProjectsQuery(undefined, projectsEnabled)

const emptyForm = (): PurposeFormData => ({
  title: '',
  amount: '',
  note: '',
  category: null,
  project: null
})

const formData = ref<PurposeFormData>(emptyForm())
const isEditMode = computed(() => Boolean(props.purpose?.id))
const dialogTitle = computed(() => (
  isEditMode.value
    ? 'Редактирование названия'
    : 'Новое название'
))
const categoryOptions = computed(() => flattenOptions(categories.value?.rows ?? []))
const projectOptions = computed(() => flattenOptions(projects.value?.rows ?? []))
const isPending = computed(() => createPurpose.isPending.value || updatePurpose.isPending.value)

watch(
  () => [isOpen.value, props.purpose] as const,
  ([opened]) => {
    if (opened) {
      hydrateForm()
      return
    }

    resetForm()
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

function hydrateForm() {
  if (!props.purpose) {
    resetForm()
    return
  }

  if (props.purpose.category_id !== null) categoriesEnabled.value = true
  if (props.purpose.project_id !== null) projectsEnabled.value = true

  formData.value = {
    title: props.purpose.title,
    amount: props.purpose.amount || '',
    note: props.purpose.note || '',
    category: props.purpose.category_id,
    project: props.purpose.project_id,
  }
}

function resetForm() {
  formData.value = emptyForm()
}

function handleClose() {
  isOpen.value = false
  emit('close')
}

function normalizeAmount(amount: string) {
  return amount.replace(',', '.')
}

function validateForm() {
  if (!formData.value.title.trim()) {
    ElMessage.error({ message: 'Укажите название', plain: true })
    return false
  }

  return true
}

function buildCreatePayload(): createPurposesData {
  const payload: createPurposesData = {
    title: formData.value.title,
  }

  if (formData.value.amount.trim()) payload.amount = normalizeAmount(formData.value.amount)
  if (formData.value.note.trim()) payload.note = formData.value.note
  if (formData.value.category !== null) payload.category_id = formData.value.category
  if (formData.value.project !== null) payload.project_id = formData.value.project

  return payload
}

function buildUpdatePayload(): updatePurposesData {
  return {
    title: formData.value.title,
    amount: normalizeAmount(formData.value.amount) || null,
    note: formData.value.note || null,
    category_id: formData.value.category,
    project_id: formData.value.project,
  }
}

async function handleSubmit() {
  if (!validateForm()) return

  try {
    if (props.purpose) {
      await updatePurpose.mutateAsync({
        purpose_id: props.purpose.id,
        data: buildUpdatePayload(),
      })
    } else {
      await createPurpose.mutateAsync(buildCreatePayload())
    }

    handleClose()
  } catch {
    // Mutation handlers show user-facing errors.
  }
}
</script>

<template>
  <ElDialog v-model="isOpen" :title="dialogTitle" width="800" @close="handleClose">
    <ElScrollbar height="400px">
      <ElForm :model="formData" label-position="top" class="purpose-form">
        <ElFormItem label="Название">
          <ElInput v-model="formData.title" />
        </ElFormItem>
        <ElFormItem label="Сумма">
          <ElInput v-model="formData.amount" />
        </ElFormItem>
        <ElFormItem label="Примечание">
          <ElInput v-model="formData.note" />
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
    </ElScrollbar>

    <template #footer>
      <div class="flex justify-between">
        <ElButton @click="handleClose">
          Отмена
        </ElButton>
        <ElButton type="primary" :loading="isPending" @click="handleSubmit">
          Готово
        </ElButton>
      </div>
    </template>
  </ElDialog>
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
