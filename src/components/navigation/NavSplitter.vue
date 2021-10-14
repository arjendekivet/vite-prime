<template>
  <div class="router-frame p-grid">
    <div v-if="navBar" class="p-col-2 navigation" :class="navVisible ? '' : 'navHide'">
      <NavBar :direction="direction === 'row' ? 'row' : 'column'" />
    </div>
    <div class="body-panel" :class="navBar && navVisible ? 'p-col-10' : 'p-col-12'">
      <div>
        <AppTopbar @menu-toggle="menuToggle"></AppTopbar>
        <div class="content">
          <router-view :key="$route.fullPath" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import NavBar from '@/components/navigation/NavBar.vue'
import AppTopbar from '@/components/navigation/AppTopbar.vue'
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
.router-frame {
  height: 100vh;
  overflow: hidden;
  margin: 0px !important;

  .navHide {
    display: none !important;
  }

  .body-panel,
  .navigation {
    height: 100vh;
    overflow: hidden;
    padding: 0px;
  }

  .navigation {
    flex-direction: column;
    color: #ffffff;
    background: #0388e5;
    background: -webkit-gradient(
      linear,
      top,
      bottom,
      from(#0388e5),
      to(#07bdf4)
    );
    background: linear-gradient(180deg, #0388e5 0, #07bdf4);
  }

  .body-panel {
    flex-direction: column;
    .content {
      overflow: auto;
      padding: 20px;
      height: calc(100vh - 68px);
    }
  }
}
</style>