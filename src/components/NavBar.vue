<template>
  <div class="parent" :class="direction">
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
import { PropType } from 'vue'

const props = defineProps({
  direction: {
    type: String as PropType<'row' | 'column'>,
    default: 'row',
  }
})

const routes = [{ name: 'home' }, { name: 'events' }]

function goToRoute(route: string) {
  router.push({ name: route })
}

</script>

<style lang="scss">
.parent {
  display: flex;
}
.nav-item {
  cursor: pointer;
  background-color: green;
  color: white;
  font-weight: 700;
  margin: 0.5em;
  padding: 0.25em 0.5em;
}
.row {
  flex-direction: row;
  // flex-grow: 1;
  .nav-item {
    min-width: 150px;
    // flex-grow: 1;
  }
}

.column {
  flex-direction: column;
  overflow: hidden;
  .nav-item {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
