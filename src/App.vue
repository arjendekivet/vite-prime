<template>
  <div class="app">
    <Toast />
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { provide } from 'vue'
import router from '@/router/routes'
import EventService from '@/services/ApiService'
// import { setUser } from '@/modules/globalState'
// import Utils from '@/modules/utils'
// import Constants from '@/modules/constants'
import { useStore } from 'vuex'
import Toast from 'primevue/toast'

const store = useStore()

store.dispatch('user/getActiveUser')
// const lUser = Utils.getFromLocalStorage(Constants.LOCALSTORAGEUSERKEY)
// if (lUser) {
//   setUser(JSON.parse(lUser))
// }

provide('router', router)
provide('EventService', EventService)

</script>

<style lang="scss">
html,
body {
  margin: 0;
  height: 100%;
  // overflow: hidden;
}

.app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin: 0;

  .body {
    background-color: azure;
  }
}
</style>
