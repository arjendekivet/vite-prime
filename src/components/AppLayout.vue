<template>
  <div class="app__layout">
    <div class="header">
      <AppTopbar />
    </div>
    <div class="body">
      <div v-if="navBar && leftSidebar" class="sidebar" :class="getNavVisible() ? '' : 'navHide'">
        <router-view name="LeftSidebar"></router-view>
      </div>
      <div class="main">
        <div class="content">
          <div class="column">
            <router-view :key="$route.fullPath" />
          </div>
          <!-- <div class="column">Additional column if needed</div> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getNavVisible } from '@/modules/globalState'
import AppTopbar from '@/components/AppTopbar.vue'
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute()
// Calculate if the LeftSidebar router-view is actual filled with a component
const leftSidebar = computed(
  () => {
    if (route.matched && route.matched.length > 0) {
      const match = route.matched[route.matched.length - 1]
      if (match && match.components) {
        return match.components['LeftSidebar']
      }
      return
    }
  }
)

let navVisible = ref(true)

type propTypes = {
  direction?: 'row' | 'column'
  navBar?: boolean
}
const props = withDefaults(defineProps<propTypes>(), {
  direction: 'row',
  navBar: true
})

function menuToggle() {
  navVisible.value = !navVisible.value
}
</script>

<style lang="scss">
.app__layout {
  .header {
    height: 4.5em;
  }

  .body {
    position: absolute;
    top: 4.5em;
    right: 0;
    bottom: 0;
    left: 0;
    display: flex;

    .navHide {
      display: none !important;
    }

    .sidebar {
      width: 225px;
      overflow: auto;
    }

    .main {
      flex: 1;
      display: flex;
      flex-direction: column;

      > .content {
        flex: 1;
        display: flex;
        overflow: hidden;

        .column {
          padding: 20px;
          flex: 1;
          overflow-y: scroll;
          overflow-x: auto;
        }
      }
    }
  }
}
</style>