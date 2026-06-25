<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { useCreatePurposes, useDeletePurposes, useUpdatePurposes } from '@/entities/purposes'
import type { createPurposesData, purposesRowData, updatePurposesData } from '@/entities/purposes/types/purposes.types'

interface PurposeFormData {
  title: string
  note: string
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
const deletePurpose = useDeletePurposes()

const emptyForm = (): PurposeFormData => ({
  title: '',
  note: '',
})

const formData = ref<PurposeFormData>(emptyForm())
const isEditMode = computed(() => Boolean(props.purpose?.id))
const dialogTitle = computed(() => (
  isEditMode.value
    ? 'Редактирование названия'
    : 'Новое название'
))
const isPending = computed(() => (
  createPurpose.isPending.value || updatePurpose.isPending.value || deletePurpose.isPending.value
))

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

function hydrateForm() {
  if (!props.purpose) {
    resetForm()
    return
  }

  formData.value = {
    title: props.purpose.title,
    note: props.purpose.note || '',
  }
}

function resetForm() {
  formData.value = emptyForm()
}

function handleClose() {
  isOpen.value = false
  emit('close')
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
  if (formData.value.note.trim()) payload.note = formData.value.note

  return payload
}

function buildUpdatePayload(): updatePurposesData {
  return {
    title: formData.value.title,
    note: formData.value.note || null,
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

async function handleDelete() {
  if (!props.purpose) return

  try {
    await deletePurpose.mutateAsync({ purpose_id: props.purpose.id })
    handleClose()
  } catch {
    // Mutation handlers show user-facing errors.
  }
}
</script>

<template>
  <ElDialog v-model="isOpen" :title="dialogTitle" width="800" @close="handleClose">
    <ElScrollbar>
      <ElForm :model="formData" label-position="top" class="purpose-form">
        <ElFormItem label="Название">
          <ElInput v-model="formData.title" />
        </ElFormItem>
        <ElFormItem label="Примечание">
          <ElInput v-model="formData.note" />
        </ElFormItem>
      </ElForm>
    </ElScrollbar>

    <template #footer>
      <div class="flex justify-between">
        <ElPopconfirm
          v-if="isEditMode"
          width="220"
          :icon="undefined"
          title="Вы хотите удалить название?"
          @confirm="handleDelete"
        >
          <template #reference>
            <ElButton type="danger" :loading="deletePurpose.isPending.value" :disabled="isPending">
              Удалить
            </ElButton>
          </template>
        </ElPopconfirm>
        <span v-else />
        <div class="flex gap-2">
          <ElButton @click="handleClose">
            Отмена
          </ElButton>
          <ElButton type="primary" :loading="isPending" @click="handleSubmit">
            Готово
          </ElButton>
        </div>
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
