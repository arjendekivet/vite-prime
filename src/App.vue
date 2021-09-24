<template>
  <router-view />
</template>

<style lang="scss">
html,
body {
  margin: 0;
  height: 100%;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin: 0;
  height: 100%;
}

.p-toolbar-group-left {
  .p-button {
    margin-right: 0.5rem;
  }
}

.p-toolbar-group-right {
  .p-button {
    margin-left: 0.5rem;
  }
}
</style>
