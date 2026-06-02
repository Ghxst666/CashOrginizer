<script setup lang="ts">
import { computed, ref } from 'vue'
import { Delete, EditPen, Plus } from '@element-plus/icons-vue'
import {
  ElButton,
  ElDialog,
  ElDivider,
  ElForm,
  ElFormItem,
  ElInput,
  ElPopconfirm,
  ElTable,
  ElTableColumn,
} from 'element-plus'
import {
  useCreateGroup,
  useDeleteGroup,
  useEditGroup,
  useGroupsQuery,
} from '@/entities/transaction/groups'
import type { createGroupsRequest, groupsResponse } from '@/entities/transaction/groups/types/groups.types'

const isOpen = defineModel<boolean>({ default: false })

const groupDialogVisible = ref(false)
const groupDialogMode = ref<'create' | 'edit'>('create')
const editingGroupId = ref<number | null>(null)
const groupForm = ref<createGroupsRequest>({
  title: '',
})

const { data: groups } = useGroupsQuery()
const { mutate: createGroup, isPending: isCreatePending } = useCreateGroup()
const { mutate: editGroup, isPending: isEditPending } = useEditGroup()
const { mutate: deleteGroup, isPending: isDeletePending } = useDeleteGroup()

const isSaving = computed(() => isCreatePending.value || isEditPending.value)
const dialogTitle = computed(() =>
  groupDialogMode.value === 'create' ? 'Создать новую группу' : 'Редактировать группу',
)

function handleClose() {
  closeGroupDialog()
  isOpen.value = false
}

function openCreateDialog() {
  groupDialogMode.value = 'create'
  editingGroupId.value = null
  groupForm.value = { title: '' }
  groupDialogVisible.value = true
}

function openEditDialog(group: groupsResponse) {
  groupDialogMode.value = 'edit'
  editingGroupId.value = group.id
  groupForm.value = { title: group.title }
  groupDialogVisible.value = true
}

function closeGroupDialog() {
  groupDialogVisible.value = false
  groupForm.value = { title: '' }
  editingGroupId.value = null
  groupDialogMode.value = 'create'
}

function handleSubmit() {
  const title = groupForm.value.title.trim()

  if (!title) return

  if (groupDialogMode.value === 'create') {
    createGroup(
      { title },
      {
        onSuccess: closeGroupDialog,
      },
    )
    return
  }

  if (!editingGroupId.value) return

  editGroup(
    {
      group_id: editingGroupId.value,
      data: { title },
    },
    {
      onSuccess: closeGroupDialog,
    },
  )
}

function handleDelete(groupId: number) {
  deleteGroup({ group_id: groupId })
}
</script>

<template>
  <ElDialog
    v-model="isOpen"
    align-center
    width="760px"
    :close-on-click-modal="false"
    :close-on-press-escape="true"
  >
    <template #header>
      <div class="text-[20px] font-semibold text-[#111827]">
        Управление группами счетов и сортировка
      </div>
    </template>

    <div class="rounded-2xl border border-[#e2e3e6] bg-[#f8fafc] p-4">
      <div class="flex items-center justify-between gap-3">
        <div class="text-sm font-medium text-[#111827]">
          Группы счетов
        </div>
        <ElButton type="primary" :icon="Plus" @click="openCreateDialog">
          Создать новую группу
        </ElButton>
      </div>

      <ElDivider class="!my-4" />

      <ElTable
        :data="groups ?? []"
        border
        class="w-full"
      >
        <ElTableColumn type="index" label="№" width="70" />
        <ElTableColumn prop="title" label="Название" min-width="220" />
        <ElTableColumn label="Действия" width="140" align="center">
          <template #default="{ row }">
            <div class="flex justify-center gap-2">
              <ElButton
                type="primary"
                :icon="EditPen"
                circle
                size="small"
                @click="openEditDialog(row)"
              />

              <ElPopconfirm
                title="Удалить группу?"
                confirm-button-text="Да"
                cancel-button-text="Нет"
                @confirm="handleDelete(row.id)"
              >
                <template #reference>
                  <ElButton
                    type="danger"
                    :icon="Delete"
                    circle
                    size="small"
                    :loading="isDeletePending"
                  />
                </template>
              </ElPopconfirm>
            </div>
          </template>
        </ElTableColumn>
      </ElTable>
    </div>

    <template #footer>
      <div class="flex justify-end">
        <ElButton @click="handleClose">
          Закрыть
        </ElButton>
      </div>
    </template>
  </ElDialog>

  <ElDialog
    v-model="groupDialogVisible"
    align-center
    width="420px"
    :close-on-click-modal="false"
    :close-on-press-escape="true"
  >
    <template #header>
      <div class="text-[20px] font-semibold text-[#111827]">
        {{ dialogTitle }}
      </div>
    </template>

    <ElForm
      :model="groupForm"
      label-position="top"
      class="group-form"
    >
      <ElFormItem label="Название">
        <ElInput
          v-model="groupForm.title"
          placeholder="Введите название группы"
          maxlength="80"
          show-word-limit
        />
      </ElFormItem>
    </ElForm>

    <template #footer>
      <div class="flex justify-between gap-3">
        <ElButton @click="closeGroupDialog">
          Отмена
        </ElButton>
        <ElButton
          type="primary"
          :loading="isSaving"
          @click="handleSubmit"
        >
          {{ groupDialogMode === 'create' ? 'Создать' : 'Сохранить' }}
        </ElButton>
      </div>
    </template>
  </ElDialog>
</template>

<style scoped>
.group-form {
  padding-top: 4px;
}

:deep(.group-form .el-form-item__label) {
  color: #000;
  font-size: 16px;
}
</style>
