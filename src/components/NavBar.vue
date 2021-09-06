<template>
  <div style="flex-grow: 1">
    <div
      v-for="route in routes"
      :key="route.name"
      class="nav-item"
      @click="goToRoute(route.name)"
    >{{ route.name }}</div>
  </div>
</template>

<script setup lang="ts">
import router from '@/routes'

const routes = [{ name: 'home' }, { name: 'events' }]

function goToRoute(route: string) {
  router.push({ name: route })
}

</script>

<style lang="scss">
.nav-item {
  cursor: pointer;
  background-color: green;
  color: white;
  font-weight: 700;
  margin: 1em;
}
</style>
