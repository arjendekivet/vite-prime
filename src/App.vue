<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
// import HelloWorld from './components/HelloWorld.vue'
</script>

<template>
  <Button label="Submit" />

  <div class="p-d-flex">
    <div class="p-col-6 p-p-1">
      <div class="box p-shadow-12">Item 1 (6)</div>
    </div>
    <div class="p-col-2 p-p-1">
      <div class="box p-shadow-12">Item 2 (2)</div>
    </div>
    <div class="p-col-4 p-p-1">
      <div class="box p-shadow-12">Item 3 (4)</div>
    </div>
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.box {
  border: solid blue 1px;
}
</style>
