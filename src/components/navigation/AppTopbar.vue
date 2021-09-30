<template>
    <div class="layout-topbar p-d-flex p-jc-between">
        <div class="left">
            <Button type="button" icon="pi pi-bars" @click="emit('menuToggle')" />
            <Button type="button" icon="pi pi-directions-alt" @click="router.back()" />
            <Button type="button" icon="pi pi-directions" @click="router.forward()" />
        </div>
        <div class="right">
            <Button type="button" icon="pi pi-sliders-h" @click="router.push({ name: 'admin' })" />
            <Button type="button" icon="pi pi-home" @click="router.push({ name: 'home' })" />
            <Button type="button" icon="pi pi-cog" />
            <Button type="button" icon="pi pi-user" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { defineEmits } from 'vue'
import router from '@/router/routes';

const emit = defineEmits<{
    (event: 'menuToggle'): void
}>()
</script>

<style lang="scss">
.layout-topbar {
    // position: fixed;
    padding: 1em;
    z-index: 999;
    background: #0388e5;
    background: -webkit-gradient(
        linear,
        left top,
        right top,
        from(#0388e5),
        to(#07bdf4)
    );
    background: linear-gradient(90deg, #0388e5 0, #07bdf4);

    .left .p-button {
        margin-right: 0.5em;
    }

    .right .p-button {
        margin-left: 0.5em;
    }
}
</style>