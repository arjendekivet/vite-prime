<template>
  <div class="navigation">
    <Splitter style="height: 100%;">
      <SplitterPanel
        class="p-d-flex"
        :size="20"
        style="padding: 10px;"
        :class="navVisible ? '' : 'navHide'"
      >
        <NavBar :direction="direction === 'row' ? 'row' : 'column'" style="flex: 1" />
      </SplitterPanel>
      <SplitterPanel class="p-d-flex" :size="80" style="flex-direction: column; padding: 10px;">
        <AppTopbar @menu-toggle="menuToggle"></AppTopbar>
        <router-view />
      </SplitterPanel>
    </Splitter>
  </div>
</template>

<script setup lang="ts">
import NavBar from '@/components/navigation/NavBar.vue'
import AppTopbar from '@/components/navigation/AppTopbar.vue'
import { PropType, ref } from 'vue';

let navVisible = ref(true)

type propTypes = {
  direction: 'row' | 'column'
}
const props = withDefaults(defineProps<propTypes>(), {
  direction: 'row'
})

function menuToggle() {
  navVisible.value = !navVisible.value
}
</script>

<style lang="scss">
.navigation {
  height: 100%;

  .navHide {
    display: none !important;
  }
}
</style>