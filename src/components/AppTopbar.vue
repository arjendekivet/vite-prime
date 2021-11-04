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
            <SelectButton v-model="locale" :options="availableLocales" />
            <Button type="button" icon="pi pi-sliders-h" @click="router.push({ name: 'admin' })" />
            <Button type="button" icon="pi pi-home" @click="router.push({ name: 'home' })" />
            <Button type="button" icon="pi pi-cog" />
            <SplitButton icon="pi pi-user" :model="items"></SplitButton>
            <Avatar
                :image-url="logo"
                image-size="cover"
                color="#007bff"
                width="36px"
                label=" "
                font-size=".75em"
                font-color="white"
                radius="20%"
                border-color="#007bff"
                border-width="0px"
                :inline="true"
                v-tooltip="user?.username"
            ></Avatar>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import router from '@/router/routes';
import { getUser } from '@/modules/globalState'
import { computed, ref, watch } from 'vue';
import { indexOf } from 'lodash';
import { usePrimeVue } from "primevue/config";

import Avatar from '@/components/Avatar.vue';
import logo from '@/assets/harry.jpeg'

const primevue = usePrimeVue()
const { t, locale, availableLocales } = useI18n({
    inheritLocale: true, useScope: 'global'
})

watch(
    () => locale.value,
    (value, prevValue) => {
        changePrimeLocale(value)
    }
)

const changePrimeLocale = async (locale: any) => {
    if (indexOf(availableLocales, locale) > -1) {
        const { default: primeLocale } = await import(`../locales/prime_${locale}`)
        if (primeLocale) {
            primevue.config.locale = primeLocale
        }
    }
}

const items = ref()
const user = computed(() => getUser())

const emit = defineEmits<{
    (event: 'menuToggle'): void
}>()

// On locale change, recalculate item label using I18n
watch(
    () => locale.value,
    (value, prevValue) => {
        setItems()
        if (value === 'ne') {
            // const primevue = usePrimeVue()
            // primevue.config.locale.dayNamesMin = ["Zo", "Mo", "Tu", "We", "Th", "Fr", "Sa"]
            // PrimeVue.config.locale = primeLocaleNe;
        }

    }
)

// initial item calculation
setItems()

function setItems() {
    items.value = [
        {
            label: t('SignIn'),
            icon: 'pi pi-sign-in',
            visible: user.value ? false : true,
            command: () => {
                router.push({ name: 'signin' })
            }
        },
        {
            label: t('CreateAccount'),
            icon: 'pi pi-user-plus',
            visible: indexOf(user.value?.roles, 'ROLE_ADMIN') > -1 ? true : false,
            command: () => {
                router.push({ name: 'signup' })
            }
        },
        {
            label: t('SignOut'),
            icon: 'pi pi-sign-out',
            visible: user.value ? true : false,
            command: () => {
                router.push({ name: 'signout' })
            }
        }
    ]
}

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

    .p-selectbutton {
        display: inline-flex;
    }

    .left {
        .p-button,
        > div {
            margin-right: 0.5em;
        }
    }

    .right {
        > .p-button,
        > div {
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