<template>
  <component
    :is="getComponent(direction)"
    :model="menuitems"
    v-model:expandedKeys="expandedKeys"
    class="layout-sidebar"
  ></component>
</template>

<script setup lang="ts">
import router from '@/router/routes'
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
.layout-sidebar {
  background: #0388e5;
  background: -webkit-gradient(linear, top, bottom, from(#0388e5), to(#07bdf4));
  background: linear-gradient(180deg, #0388e5 0, #07bdf4);

  &.p-panelmenu .p-panelmenu-header > a:focus {
    box-shadow: 0 0 0 0.2rem rgb(0, 0, 22);
  }
  &.p-panelmenu .p-panelmenu-content .p-menuitem .p-menuitem-link:focus {
    box-shadow: inset 0 0 0 0.15rem gray;
  }
}
</style>