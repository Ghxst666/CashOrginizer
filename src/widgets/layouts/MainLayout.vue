<script setup lang="ts">
import { RouterView } from 'vue-router';
import MainHeader from './MainHeader/ui/MainHeader.vue';
import MainMenu from './MainMenu/ui/MainMenu.vue';
</script>

<template>
    <div class="flex flex-col size-full bg-[#eef3f4] overflow-hidden">
        <MainHeader />
        <div class="flex min-h-0 min-w-0 grow">
            <MainMenu />
            <div class="h-full grow min-w-0">
                <RouterView />
            </div>
        </div>
    </div>
</template>