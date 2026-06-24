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

const FormData = ref<projectCreateData>({
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
        data: FormData.value
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

        <ElForm 
            :model="FormData" 
            label-position="top"
            class="payment-form"
        >
            <ElFormItem label="Название">
                <ElInput v-model="FormData.title" />
            </ElFormItem>
            <ElFormItem label="Подпроект в">
                <ElSelect v-model="FormData.parent_id">
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
