<template>
  <div class="app">
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { provide } from 'vue'
import { RouteLocationRaw } from 'vue-router'
import router from '@/router/routes'
import { setUser } from '@/modules/globalState'
import Utils from '@/modules/utils'
import Constants from '@/modules/constants'

const lUser = Utils.getFromLocalStorage(Constants.LOCALSTORAGEUSERKEY)
if (lUser) {
  setUser(JSON.parse(lUser))
}

provide('pushToRouter', pushToRouter)

function pushToRouter(routerConfig: RouteLocationRaw) {
  router.push(routerConfig)
}

</script>

<style lang="scss">
html,
body {
  margin: 0;
  height: 100%;
  overflow: hidden;
}

.app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin: 0;
}
</style>
