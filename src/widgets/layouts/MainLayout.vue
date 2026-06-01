<script setup lang="ts">
import { RouterView } from 'vue-router';
import MainHeader from './MainHeader/ui/MainHeader.vue';
import MainMenu from './MainMenu/ui/MainMenu.vue';
</script>

<template>
    <div class="flex flex-col h-full w-full bg-[#eef3f4] overflow-hidden">
        <MainHeader />
        <div class="flex h-full overflow-hidden">
            <MainMenu />
            <div class="h-full w-full min-h-0">
                <RouterView />
            </div>
        </div>
    </div>
</template>