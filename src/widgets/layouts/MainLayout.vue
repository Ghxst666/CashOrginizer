<script setup lang="ts">
import { RouterView } from 'vue-router';
import MainHeader from './MainHeader/ui/MainHeader.vue';
import MainMenu from './MainMenu/ui/MainMenu.vue';

</script>

<template>
    <div class="app-shell flex flex-col size-full bg-[#eef3f4] overflow-hidden">
        <MainHeader />
        <div class="app-shell__body flex min-h-0 min-w-0 grow">
            <MainMenu />
            <div class="app-shell__content h-full grow min-w-0">
                <RouterView />
            </div>
        </div>
    </div>
</template>

<style scoped>
@media (max-width: 768px) {
  .app-shell {
    min-height: 100dvh;
  }

  .app-shell__body {
    position: relative;
    flex-direction: column;
    padding-bottom: calc(68px + env(safe-area-inset-bottom));
  }

  .app-shell__content {
    min-height: 0;
    overflow: hidden;
  }
}
</style>
