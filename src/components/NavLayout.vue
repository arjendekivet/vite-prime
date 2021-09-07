<template>
  <div class="p-grid">
    <div :class="direction === 'column' ? '' : 'p-col-12 p-lg-2'">
      <NavBar :direction="direction === 'column' ? 'row' : 'column'" style="flex: 1" />
    </div>
    <div :class="direction === 'column' ? '' : 'p-col-12 p-lg-10'">
      <router-view />
    </div>
  </div>
</template>

<script setup lang="ts">
import NavBar from '@/components/NavBar.vue'
import { PropType } from 'vue';

interface propTypes {
  direction: 'row' | 'column'
}
const props = withDefaults(defineProps<propTypes>(), {
  direction: 'row'
})

// const props = defineProps({
//   direction: {
//     type: String as PropType<'row' | 'column'>,
//     default: 'row',
//   }
// })

</script>
