<template>
  <PanelMenu :model="menuitems" v-model:expandedKeys="expandedKeys" class="layout-sidebar" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import menuitems from '@/data/MenuItems'

const expandedKeys = ref({ 1: true });

</script>
