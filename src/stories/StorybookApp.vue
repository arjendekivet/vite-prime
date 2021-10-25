<template>
  <div class="app">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { provide } from 'vue'

provide('pushToRouter', pushToRouter)

function pushToRouter(routerConfig: RouteLocationRaw) {
  console.info(routerConfig)
}

</script>

<style lang="scss">
html,
body {
  margin: 0;
  height: 100%;
  overflow: hidden;
}

.app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin: 0;
}
</style>