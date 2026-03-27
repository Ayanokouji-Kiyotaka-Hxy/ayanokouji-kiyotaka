<template>
  <div class="app-container">
    <header class="header">header</header>
    <div class="container">
      <aside class="aside">aside</aside>
      <main class="main">main</main>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="less">
.app-container {
  display: grid;
  grid-template-rows: auto 1fr;
  height: 100%;

  .header {
    padding: 20px;
  }

  .container {
    display: grid;
    grid-template-columns: 200px 1fr;
    overflow: auto;

    .aside {
      overflow-y: auto;
      padding: 20px;
    }

    .main {
      overflow-y: auto;
      padding: 20px;
    }
  }
}
</style>
