<script setup lang="ts">
import { RouterView } from 'vue-router';
import MainHeader from './MainHeader/ui/MainHeader.vue';
import MainMenu from './MainMenu/ui/MainMenu.vue';
</script>

<template>
    <div class="flex flex-col h-screen w-full bg-[#eef3f4]">
        <MainHeader />
        <div class="flex h-full">
            <MainMenu />
            <div class="h-full w-full">
                <RouterView />
            </div>
        </div>
    </div>
</template>