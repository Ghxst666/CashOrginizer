<script setup lang="ts">
import { api } from '@/shared/service/api';
import { onMounted } from 'vue';


const tableData = [
    {
        id: 1,
        name: "jopa",
        balance: -1000,
    },
    {
        id: 2,
        name: "popa",
        balance: -2000,
    },
    {
        id: 3,
        name: "dopa",
        balance: -500,
    },
    {
        id: 4,
        name: "pipa",
        balance: -1000,
    },
    {
        id: 3,
        name: "dopa",
        balance: -500,
    },
    {
        id: 3,
        name: "dopa",
        balance: -500,
    },
    {
        id: 3,
        name: "dopa",
        balance: -500,
    },
    {
        id: 3,
        name: "dopa",
        balance: -500,
    },
    {
        id: 3,
        name: "dopa",
        balance: -500,
    },
    {
        id: 3,
        name: "dopa",
        balance: -500,
    },
    {
        id: 3,
        name: "dopa",
        balance: -500,
    },
    {
        id: 3,
        name: "dopa",
        balance: -500,
    },

    {
        id: 3,
        name: "dopa",
        balance: -500,
    },
    {
        id: 3,
        name: "dopa",
        balance: -500,
    },
    {
        id: 3,
        name: "dopa",
        balance: -500,
    },

    {
        id: 3,
        name: "dopa",
        balance: -500,
    },

    {
        id: 3,
        name: "dopa",
        balance: -500,
    },
    {
        id: 3,
        name: "dopa",
        balance: -500,
    },
    {
        id: 3,
        name: "dopa",
        balance: -500,
    },

    {
        id: 3,
        name: "dopa",
        balance: -500,
    },
    {
        id: 3,
        name: "dopa",
        balance: -500,
    },
    {
        id: 3,
        name: "dopa",
        balance: -500,
    },
    {
        id: 3,
        name: "dopa",
        balance: -500,
    },
    {
        id: 3,
        name: "dopa",
        balance: -500,
    },
    {
        id: 3,
        name: "dopa",
        balance: -500,
    },
    {
        id: 3,
        name: "dopa",
        balance: -500,
    },
    {
        id: 3,
        name: "dopa",
        balance: -500,
    },
    {
        id: 3,
        name: "dopa",
        balance: -500,
    },
    {
        id: 2,
        name: "opa",
        balance: -500,
    },
]

onMounted(() => {
    const res = api.get('/accounts')
    console.log(res.data)
})
</script>

<template>
    <div style="height: calc(100vh - 113px);">
        <ElTable height="100%" border :data="tableData">
            <ElTableColumn width="50" prop="id" label="№"/>
            <ElTableColumn prop="name" label="Название счета" />
            <ElTableColumn width="500" prop="balance" label="Общий баланс" />
        </ElTable>
    </div>
</template>
