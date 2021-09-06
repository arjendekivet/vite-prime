<template>
  <div style="display: flex">
    <NavBar />
    <div style="flex: 8">
      <router-view />
    </div>
  </div>
</template>

<script setup lang="ts">
import NavBar from '@/components/NavBar.vue'

</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 10px;
}
</style>
