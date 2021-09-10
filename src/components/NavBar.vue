<template>
  <component :is="getComponent(direction)" :model="menuitems" v-model:expandedKeys="expandedKeys"></component>
</template>

<script setup lang="ts">
import router from '@/routes'
import { ref, PropType } from 'vue'
import routes from '@/data/NavigationItems'
import menuitems from '@/data/MenuItems'

const props = defineProps({
  direction: {
    type: String as PropType<'row' | 'column'>,
    default: 'row',
  }
})

const expandedKeys = ref({});

function getComponent(direction: string) {
  return direction === 'row' ? 'PanelMenu' : 'Menubar'
}

</script>

<style lang="scss">
.p-menubar {
  overflow: auto;
}
</style>