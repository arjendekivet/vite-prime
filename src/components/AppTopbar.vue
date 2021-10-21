<template>
    <div class="layout-topbar p-d-flex p-jc-between">
        <div class="left">
            <Button type="button" icon="pi pi-bars" @click="emit('menuToggle')" />
            <!-- <Button type="button" icon="pi pi-directions-alt" @click="router.back()" /> -->
            <!-- <Button type="button" icon="pi pi-directions" @click="router.forward()" /> -->
        </div>
        <div class="navbar--title">
            Cynapps
            <div style="font-size: 0.75rem;">{{ user?.username }}</div>
        </div>

        <div class="right">
            <Button type="button" icon="pi pi-sliders-h" @click="router.push({ name: 'admin' })" />
            <Button type="button" icon="pi pi-home" @click="router.push({ name: 'home' })" />
            <Button type="button" icon="pi pi-cog" />
            <SplitButton icon="pi pi-user" :model="items"></SplitButton>
        </div>
    </div>
</template>

<script setup lang="ts">
import router from '@/router/routes';
import { getUser } from '@/modules/globalState'
import { computed } from 'vue';
import { indexOf } from 'lodash';

const user = computed(() => getUser())

const emit = defineEmits<{
    (event: 'menuToggle'): void
}>()

const items = [
    {
        label: 'Sign In',
        icon: 'pi pi-sign-in',
        visible: user.value ? false : true,
        command: () => {
            router.push({ name: 'signin' })
        }
    },
    {
        label: 'Create Account',
        icon: 'pi pi-user-plus',
        visible: indexOf(user.value?.roles, 'ROLE_ADMIN') > -1 ? true : false,
        command: () => {
            router.push({ name: 'signup' })
        }
    },
    {
        label: 'Sign out',
        icon: 'pi pi-sign-out',
        visible: user.value ? true : false,
        command: () => {
            router.push({ name: 'signout' })
        }
    }
]
</script>

<style lang="scss">
.layout-topbar {
    // position: fixed;
    height: 4.5em;
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

    .p-splitbutton {
        margin: 0;
    }

    .left {
        .p-button {
            margin-right: 0.5em;
        }
    }

    .right {
        > .p-button,
        .p-splitbutton {
            margin-left: 0.5em;
        }
    }
}

.navbar--title {
    font-family: fantasy;
    font-size: 1.5rem;
    letter-spacing: 0.5em;
    font-weight: 900;
    color: #ffffff;
}
</style>