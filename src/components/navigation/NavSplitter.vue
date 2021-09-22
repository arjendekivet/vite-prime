<template>
  <div class="router-frame">
    <Splitter style="height: 100%;">
      <SplitterPanel class="p-d-flex navigation" :size="20" :class="navVisible ? '' : 'navHide'">
        <NavBar :direction="direction === 'row' ? 'row' : 'column'" />
      </SplitterPanel>
      <SplitterPanel class="p-d-flex body-panel" :size="80">
        <AppTopbar @menu-toggle="menuToggle"></AppTopbar>
        <div class="content">
          <router-view />
        </div>
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
  direction?: 'row' | 'column'
}
const props = withDefaults(defineProps<propTypes>(), {
  direction: 'row'
})

function menuToggle() {
  navVisible.value = !navVisible.value
}
</script>

<style lang="scss">
.router-frame {
  height: 100%;
  overflow: hidden;

  .navHide {
    display: none !important;
  }

  .body-panel,
  .navigation {
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
    }
  }
}
</style>