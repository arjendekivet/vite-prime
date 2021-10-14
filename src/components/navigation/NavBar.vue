<template>
  <div class="navbar">
    <div class="navbar--title">Cynapps</div>
    <component
      :is="getComponent(direction)"
      :model="menuitems"
      v-model:expandedKeys="expandedKeys"
      class="layout-sidebar"
    ></component>
  </div>
</template>

<script setup lang="ts">
import router from '@/router/routes'
import { ref, PropType } from 'vue'
import menuitems from '@/data/MenuItems'

const props = defineProps({
  direction: {
    type: String as PropType<'row' | 'column'>,
    default: 'row',
  }
})

const expandedKeys = ref({ 1: true });

function getComponent(direction: string) {
  return direction === 'row' ? 'PanelMenu' : 'Menubar'
}
</script>

<style lang="scss">
.navbar {
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
}

.navbar--title {
  font-family: fantasy;
  font-size: 1.5rem;
  letter-spacing: 0.5em;
  font-weight: 900;
  height: 68px;
  line-height: 68px;
}

.layout-sidebar {
  overflow: auto;

  &.p-panelmenu .p-panelmenu-header > a:focus {
    box-shadow: 0 0 0 0.2rem rgb(0, 0, 22);
  }
  &.p-panelmenu .p-panelmenu-content .p-menuitem .p-menuitem-link:focus {
    box-shadow: inset 0 0 0 0.15rem gray;
  }
}
</style>