<script setup lang="ts">
import { Delete, EditPen } from '@element-plus/icons-vue';
import { ElPopconfirm } from 'element-plus';
import { ref } from 'vue';
import { accountsResponse } from '../transaction/invoices/types/invoices.types'

const props = defineProps<{
    data: accountsResponse[]
}>()

const clicked = ref(false)
function onCancel() {
  clicked.value = true
}

</script>

<template>
    <div style="height: calc(100vh - 113px);">
        <ElTable height="100%" border :data="data">
            <ElTableColumn width="50" prop="id" label="№"/>
            <ElTableColumn prop="title" label="Название счета" />
            <ElTableColumn width="500" prop="amount" label="Общий баланс" />
            <ElTableColumn
                width="140px"
                align="center"
            >
                <ElButton type="primary" :icon="EditPen" />
                <ElPopconfirm
                    width="220"
                    :icon="undefined"
                    title="Вы хотите удалить счет?"
                    @cancel="onCancel"
                >
                    <template #reference>
                        <ElButton type="danger" :icon="Delete" />
                    </template>

                    <template #actions="{ cancel }">
                        <ElButton size="small" @click="cancel">Нет</ElButton>
                        <ElButton type="danger" size="small">Да</ElButton>
                    </template>
                </ElPopconfirm>
            </ElTableColumn>
        </ElTable>
    </div>
</template>
