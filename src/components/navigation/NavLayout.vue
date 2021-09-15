<template>
  <div class="p-grid">
    <div class="p-col-12" :class="direction === 'row' ? 'p-lg-2' : ''">
      <NavBar :direction="direction === 'row' ? 'row' : 'column'" style="flex: 1" />
    </div>
    <div class="p-col-12" :class="direction === 'row' ? 'p-lg-10' : ''">
      <router-view />
    </div>
  </div>
</template>

<script setup lang="ts">
import NavBar from '@/components/navigation/NavBar.vue'
import { PropType } from 'vue';

type propTypes = {
  direction: 'row' | 'column'
}
const props = withDefaults(defineProps<propTypes>(), {
  direction: 'row'
})

</script>
