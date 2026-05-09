<script setup lang="ts">
import { Delete, EditPen } from '@element-plus/icons-vue';
import { ElPopconfirm } from 'element-plus';
import { ref } from 'vue';

// import { api } from '@/shared/service/api';
// import { onMounted } from 'vue';


const tableData = [
    {
        id: 1,
        name: "test1",
        balance: -1000,
    },
    {
        id: 2,
        name: "test2",
        balance: -2000,
    },
    {
        id: 3,
        name: "test3",
        balance: -500,
    },
    {
        id: 3,
        name: "test3",
        balance: -500,
    },
    {
        id: 3,
        name: "test3",
        balance: -500,
    },
    {
        id: 3,
        name: "test3",
        balance: -500,
    },
    {
        id: 3,
        name: "test3",
        balance: -500,
    },
]

const emits = defineEmits<{
    edit: [],
    delete: []
}>()

const clicked = ref(false)
function onCancel() {
  clicked.value = true
}

// onMounted(() => {
//     const res = api.get('/accounts')
//     console.log(res.data)
// })
</script>

<template>
    <div style="height: calc(100vh - 113px);">
        <ElTable height="100%" border :data="tableData">
            <ElTableColumn width="50" prop="id" label="№"/>
            <ElTableColumn prop="name" label="Название счета" />
            <ElTableColumn width="500" prop="balance" label="Общий баланс" />
            <ElTableColumn
                width="140px"
                align="center"
            >
                <ElButton @click="emits('edit')" type="primary" :icon="EditPen" />
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
                        <ElButton type="danger" size="small" @click="emits('delete')">Да</ElButton>
                    </template>
                </ElPopconfirm>
            </ElTableColumn>
        </ElTable>
    </div>
</template>
