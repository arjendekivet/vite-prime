<template>
  <div class="app__layout">
    <div class="header">
      <AppTopbar @menu-toggle="menuToggle"></AppTopbar>
    </div>
    <div class="body">
      <div v-if="navBar" class="sidebar" :class="navVisible ? '' : 'navHide'">
        <AppNavBar :direction="direction === 'row' ? 'row' : 'column'" />
      </div>
      <div class="main">
        <!-- <div class="page-header">page-header</div> -->
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
import AppNavBar from '@/components/AppNavBar.vue'
import AppTopbar from '@/components/AppTopbar.vue'
import { ref } from 'vue';

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