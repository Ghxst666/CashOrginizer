<script lang="ts" setup>
import { ElTabPane, ElTabs } from 'element-plus';
import { ref } from 'vue';
import PlanShablonTable from '../ui/PlanShablonTable.vue';
import PlanWorkListTable from '../ui/PlanWorkListTable.vue';

const activeName = ref<'shablon' | 'workList'>('workList')
</script>

<template>
    <div class="h-full w-full p-5">
        <ElTabs v-model="activeName" class="h-full">
            <ElTabPane label="Шаблон" name="shablon">
                <div class="h-full w-full">
                    <PlanShablonTable />
                </div>
            </ElTabPane>
            <ElTabPane label="Список дел" name="workList">
                <div class="h-full">
                    <PlanWorkListTable />
                </div>
            </ElTabPane>
        </ElTabs>
    </div>
</template>