<template>
  <PanelMenu :model="menuitems" v-model:expandedKeys="expandedKeys" class="layout-sidebar" />
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { setNavVisible } from '@/modules/globalState'
import menuitems from '@/data/MenuItems'

const expandedKeys = ref({ 1: true });

onMounted(() => {
  // reset left sidebar visibility
  setNavVisible(true)
})

</script>
