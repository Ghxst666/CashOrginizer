<script setup lang="ts">
import { useDeleteProject, useUpdateProject } from '@/entities/project';
import { projectCreateData, projectsResponseData } from '@/entities/project/types/project.types';
import { ElButton, ElDialog, ElForm, ElFormItem, ElInput, ElOption, ElSelect } from 'element-plus';
import { computed, ref, watch } from 'vue';
const props = defineProps<{
    title: string
    updateData: projectCreateData
    projects: projectsResponseData['rows']
    id: number | null
}>()

const { mutate, isPending } = useUpdateProject()
const { mutate: deleteProject, isPending: isDeleting } = useDeleteProject()

type ProjectFormData = Omit<projectCreateData, 'parent_id'> & {
    parent_id: number | '' | null
}

const FormData = ref<ProjectFormData>({
    title: '',
    parent_id: null,
    money_limit: 0,
    note: '',
    status: '',
})

const isOpen = defineModel<boolean>({ default: false })
const disabled = computed(() => isPending.value)

function handleUpdate() {
    if (!props.id) return

    mutate({
        project_id: props.id,
        data: {
            ...FormData.value,
            parent_id: FormData.value.parent_id || null,
        }
    }, {
        onSuccess: () => {
            isOpen.value = false
        }
    })
}

function handleClose() {
    isOpen.value = false
}

function handleDelete() {
    if (!props.id) return

    deleteProject(
        { project_id: props.id },
        { onSuccess: () => { isOpen.value = false } },
    )
}

function flattenProjects(projects: any[]): any {
    return projects.flatMap(project => [
        project,
        ...flattenProjects(project.children || [])
    ])
}

const flatProjects = computed(() =>
    flattenProjects(props.projects)
)

watch(
  () => props.updateData,
  (val) => {
    if (val) {
      FormData.value = { ...val }
    }
  },
  { immediate: true }
)
</script>

<template>
    <ElDialog :title="props.title" v-model="isOpen" width="800">
        <ElScrollbar>
            <ElForm 
                :model="FormData" 
                label-position="top"
                class="purpose-form"
            >
                <ElFormItem label="Название">
                    <ElInput v-model="FormData.title" />
                </ElFormItem>
                <ElFormItem label="Подпроект в">
                    <ElSelect v-model="FormData.parent_id">
                        <ElOption label="Без проекта" value="" />
                        <ElOption
                            v-for="category in flatProjects"
                            :key="category.id"
                            :label="category.title"
                            :value="category.id"
                        />
                    </ElSelect>
                </ElFormItem> 
                <ElFormItem label="Лимит">
                    <ElInput v-model="FormData.money_limit" />
                </ElFormItem>
                <ElFormItem label="Примечание">
                    <ElInput v-model="FormData.note" />
                </ElFormItem>
                <ElFormItem label="Состояние">
                    <ElSelect v-model="FormData.status">
                        <ElOption label="Открыт" value="open" />
                        <ElOption label="Закрыт" value="closed" />
                    </ElSelect>
                </ElFormItem>           
            </ElForm>
        </ElScrollbar>

        <template #footer>
            <div class="flex justify-between">
              <ElPopconfirm
                width="220"
                :icon="undefined"
                title="Вы хотите удалить проект?"
                @confirm="handleDelete"
              >
                <template #reference>
                  <ElButton type="danger" :loading="isDeleting" :disabled="disabled">
                    Удалить
                  </ElButton>
                </template>
              </ElPopconfirm>
              <div class="flex gap-2">
                <ElButton @click="handleClose">
                  Отмена
                </ElButton>
                <ElButton @click="handleUpdate" type="primary" :disabled="disabled">
                  Сохранить
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