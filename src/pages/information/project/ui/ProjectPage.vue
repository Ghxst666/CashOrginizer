<script setup lang="ts">
import { ref } from 'vue';
import ProjectHeader from './ProjectHeader.vue';
import ProjectTable from './ProjectTable.vue';
import { NewShablonGroupDialog } from '@/shared/ui';

const newProject = ref<boolean>(false)
const newProjectData = ref({
    name: '',
    podProject: '',
    limit: '',
    note: '',
    conditions: ''
})
function handleOpenProjectDialog() {
    newProject.value = true
}
function handleCloseProjectDialog() {
    newProject.value = false
    newProjectData.value = {
        name: '',
        podProject: '',
        limit: '',
        note: '',
        conditions: ''
    }
}
</script>

<template>
    <NewShablonGroupDialog
        v-model:new-pay="newProject"
        title="Новый проект"
        @close="handleCloseProjectDialog"
    >
        <ElForm 
            :model="newProjectData" 
            label-position="top"
            class="payment-form"
        >
            <ElFormItem label="Название">
                <ElInput v-model="newProjectData.name" />
            </ElFormItem>
            <ElFormItem label="Подпроект в">
                <ElSelect v-model="newProjectData.podProject">
                    <ElOption label="что то 1" value="podProject 1" />
                    <ElOption label="что то 1" value="podProject 2" />
                    <ElOption label="что то 1" value="podProject 3" />
                </ElSelect>
            </ElFormItem> 
            <ElFormItem label="Лимит">
                <ElInput v-model="newProjectData.limit" />
            </ElFormItem>
            <ElFormItem label="Примечание">
                <ElInput v-model="newProjectData.note" />
            </ElFormItem>
            <ElFormItem label="Состояние">
                <ElSelect v-model="newProjectData.conditions">
                    <ElOption label="Открыт" value="open" />
                    <ElOption label="Закрыт" value="close" />
                </ElSelect>
            </ElFormItem>           
        </ElForm>
    </NewShablonGroupDialog>
    <div class="h-full flex flex-col bg-[#ffffff]">
        <ProjectHeader @open-dialog="handleOpenProjectDialog" />
        <div class="flex-1 min-h-0">
            <ProjectTable />
        </div>
    </div>
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