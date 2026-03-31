<script setup lang="ts">
import { MainHeader } from '../widgets/layouts/MainHeader';
import { MainMenu } from '../widgets/layouts/MainMenu';
</script>

<template>
    <div class="flex flex-col h-screen w-full bg-[#eef3f4]">
        <MainHeader />
        <div class="flex h-full">
            <MainMenu />
        </div>
    </div>
</template>